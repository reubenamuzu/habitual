import { StyleSheet, View } from 'react-native';
import { Palette, Typography } from '@/constants/theme';
import { ThemedText } from '@/components/themed-text';

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                     'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

interface HeatmapMonthLabelsProps {
  weeks: string[][]; // weeks[w][d] = 'YYYY-MM-DD' | ''
  cellSize: number;
  gap: number;
}

export function HeatmapMonthLabels({ weeks, cellSize, gap }: HeatmapMonthLabelsProps) {
  const labels: { month: string; weekIndex: number }[] = [];
  let lastMonth = -1;

  for (let w = 0; w < weeks.length; w++) {
    for (const date of weeks[w]) {
      if (!date) continue;
      const month = new Date(date).getMonth();
      if (month !== lastMonth) {
        labels.push({ month: MONTH_NAMES[month], weekIndex: w });
        lastMonth = month;
      }
      break;
    }
  }

  const cellWithGap = cellSize + gap * 2;

  return (
    <View style={styles.container}>
      {labels.map(({ month, weekIndex }) => (
        <View
          key={`${month}-${weekIndex}`}
          style={[styles.label, { left: weekIndex * cellWithGap }]}
        >
          <ThemedText style={styles.text}>{month}</ThemedText>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    height: 16,
    marginBottom: 2,
  },
  label: {
    position: 'absolute',
  },
  text: {
    fontSize: Typography.xs,
    color: Palette.inkTertiary,
  },
});
