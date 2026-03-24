import { ScrollView, StyleSheet, View } from 'react-native';
import { HeatmapCell } from './heatmap-cell';
import { HeatmapMonthLabels } from './heatmap-month-labels';
import type { HeatmapDay } from '@/hooks/use-heatmap-data';

const CELL_SIZE = 12;
const CELL_GAP = 1;
const DAYS_IN_WEEK = 7;

/**
 * Organizes a flat day array into a 2D grid: weeks[col][row],
 * padded to start on Sunday.
 */
function buildWeekGrid(days: HeatmapDay[]): (HeatmapDay | null)[][] {
  if (days.length === 0) return [];

  // Find what day-of-week the first day lands on (0=Sun)
  const firstDow = new Date(days[0].date + 'T00:00:00').getDay();
  const padded: (HeatmapDay | null)[] = [
    ...Array(firstDow).fill(null),
    ...days,
  ];

  const weeks: (HeatmapDay | null)[][] = [];
  for (let i = 0; i < padded.length; i += DAYS_IN_WEEK) {
    weeks.push(padded.slice(i, i + DAYS_IN_WEEK));
  }
  return weeks;
}

interface HeatmapGridProps {
  days: HeatmapDay[];
}

export function HeatmapGrid({ days }: HeatmapGridProps) {
  const weeks = buildWeekGrid(days);

  // Build the string[][] needed by month labels
  const weekStrings: string[][] = weeks.map((week) =>
    week.map((d) => d?.date ?? '')
  );

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View>
        <HeatmapMonthLabels
          weeks={weekStrings}
          cellSize={CELL_SIZE}
          gap={CELL_GAP}
        />
        <View style={styles.grid}>
          {weeks.map((week, wIdx) => (
            <View key={wIdx} style={styles.week}>
              {Array.from({ length: DAYS_IN_WEEK }).map((_, dIdx) => {
                const day = week[dIdx];
                return (
                  <HeatmapCell
                    key={dIdx}
                    value={day ? day.value : 0}
                    size={CELL_SIZE}
                  />
                );
              })}
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
  },
  week: {
    flexDirection: 'column',
  },
});
