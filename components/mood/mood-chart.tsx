import { StyleSheet, View, useWindowDimensions } from 'react-native';
import Svg, { Path, Circle, Line, Text as SvgText } from 'react-native-svg';
import { Palette, Spacing, Typography } from '@/constants/theme';
import { ThemedText } from '@/components/themed-text';
import type { MoodLog } from '@/lib/db/schema';

interface MoodChartProps {
  logs: MoodLog[];
}

// Collect unique dates and compute morning/evening per date
interface DayMood {
  date: string;
  morning?: number;
  evening?: number;
}

function aggregateByDay(logs: MoodLog[]): DayMood[] {
  const map = new Map<string, DayMood>();
  for (const log of logs) {
    if (!map.has(log.date)) map.set(log.date, { date: log.date });
    const day = map.get(log.date)!;
    if (log.time_of_day === 'morning') day.morning = log.score;
    else day.evening = log.score;
  }
  return Array.from(map.values()).sort((a, b) => a.date.localeCompare(b.date));
}

function buildPath(points: { x: number; y: number }[]): string {
  if (points.length === 0) return '';
  return points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
    .join(' ');
}

const CHART_HEIGHT = 120;
const PADDING = { top: 12, bottom: 28, left: 28, right: 12 };
const MIN_SCORE = 1;
const MAX_SCORE = 10;

export function MoodChart({ logs }: MoodChartProps) {
  const { width } = useWindowDimensions();
  const chartWidth = width - Spacing.base * 2 - 2; // account for card padding and border

  if (logs.length === 0) {
    return (
      <View style={styles.empty}>
        <ThemedText style={styles.emptyText}>Log your mood to see trends here.</ThemedText>
      </View>
    );
  }

  const days = aggregateByDay(logs);
  const innerW = chartWidth - PADDING.left - PADDING.right;
  const innerH = CHART_HEIGHT - PADDING.top - PADDING.bottom;

  const xScale = (i: number) =>
    PADDING.left + (days.length > 1 ? (i / (days.length - 1)) * innerW : innerW / 2);
  const yScale = (score: number) =>
    PADDING.top + innerH - ((score - MIN_SCORE) / (MAX_SCORE - MIN_SCORE)) * innerH;

  const morningPoints = days
    .map((d, i) => (d.morning != null ? { x: xScale(i), y: yScale(d.morning) } : null))
    .filter(Boolean) as { x: number; y: number }[];

  const eveningPoints = days
    .map((d, i) => (d.evening != null ? { x: xScale(i), y: yScale(d.evening) } : null))
    .filter(Boolean) as { x: number; y: number }[];

  // X-axis labels: show a few evenly spaced dates
  const labelIndices = days.length <= 7
    ? days.map((_, i) => i)
    : [0, Math.floor(days.length / 3), Math.floor((2 * days.length) / 3), days.length - 1];

  const shortDate = (date: string) => {
    const d = new Date(date + 'T00:00:00');
    return `${d.getMonth() + 1}/${d.getDate()}`;
  };

  return (
    <View>
      <Svg width={chartWidth} height={CHART_HEIGHT}>
        {/* Y-axis gridlines at 2, 5, 8, 10 */}
        {[2, 5, 8, 10].map((score) => {
          const y = yScale(score);
          return (
            <Line
              key={score}
              x1={PADDING.left}
              y1={y}
              x2={chartWidth - PADDING.right}
              y2={y}
              stroke={Palette.border}
              strokeWidth={1}
            />
          );
        })}

        {/* Y-axis labels */}
        {[2, 5, 8, 10].map((score) => (
          <SvgText
            key={`y-${score}`}
            x={PADDING.left - 4}
            y={yScale(score) + 4}
            fontSize={9}
            fill={Palette.inkTertiary}
            textAnchor="end"
          >
            {score}
          </SvgText>
        ))}

        {/* Evening line (dashed) */}
        {eveningPoints.length > 1 && (
          <Path
            d={buildPath(eveningPoints)}
            fill="none"
            stroke={Palette.inkDisabled}
            strokeWidth={1.5}
            strokeDasharray="4 3"
          />
        )}

        {/* Morning line (solid) */}
        {morningPoints.length > 1 && (
          <Path
            d={buildPath(morningPoints)}
            fill="none"
            stroke={Palette.inkPrimary}
            strokeWidth={2}
          />
        )}

        {/* Morning dots */}
        {morningPoints.map((p, i) => (
          <Circle key={`m-${i}`} cx={p.x} cy={p.y} r={3} fill={Palette.inkPrimary} />
        ))}

        {/* Evening dots */}
        {eveningPoints.map((p, i) => (
          <Circle key={`e-${i}`} cx={p.x} cy={p.y} r={2.5} fill={Palette.inkDisabled} />
        ))}

        {/* X-axis date labels */}
        {labelIndices.map((idx) => (
          <SvgText
            key={`x-${idx}`}
            x={xScale(idx)}
            y={CHART_HEIGHT - 6}
            fontSize={9}
            fill={Palette.inkTertiary}
            textAnchor="middle"
          >
            {shortDate(days[idx].date)}
          </SvgText>
        ))}
      </Svg>

      {/* Legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendLine, { backgroundColor: Palette.inkPrimary }]} />
          <ThemedText style={styles.legendLabel}>Morning</ThemedText>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendLine, { backgroundColor: Palette.inkDisabled }]} />
          <ThemedText style={styles.legendLabel}>Evening</ThemedText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  empty: {
    height: CHART_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: Typography.sm,
    color: Palette.inkTertiary,
  },
  legend: {
    flexDirection: 'row',
    gap: Spacing.base,
    marginTop: Spacing.xs,
    paddingLeft: PADDING.left,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  legendLine: {
    width: 16,
    height: 2,
    borderRadius: 1,
  },
  legendLabel: {
    fontSize: Typography.xs,
    color: Palette.inkTertiary,
  },
});
