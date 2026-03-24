import { StyleSheet, View } from 'react-native';
import { Palette, Spacing, Typography } from '@/constants/theme';
import { ThemedText } from '@/components/themed-text';
import { HeatmapCell } from './heatmap-cell';

const LEGEND_VALUES = [0, 0.25, 0.5, 0.75, 1];

export function HeatmapLegend() {
  return (
    <View style={styles.container}>
      <ThemedText style={styles.label}>Less</ThemedText>
      {LEGEND_VALUES.map((v) => (
        <HeatmapCell key={v} value={v} size={10} />
      ))}
      <ThemedText style={styles.label}>More</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xxs,
    marginTop: Spacing.xs,
  },
  label: {
    fontSize: Typography.xs,
    color: Palette.inkTertiary,
    marginHorizontal: Spacing.xxs,
  },
});
