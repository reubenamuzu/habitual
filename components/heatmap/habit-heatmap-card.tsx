import { StyleSheet, View } from 'react-native';
import { Palette, Radius, Shadow, Spacing, Typography } from '@/constants/theme';
import { ThemedText } from '@/components/themed-text';
import { HeatmapGrid } from './heatmap-grid';
import { HeatmapLegend } from './heatmap-legend';
import { getHabitEmoji } from '@/components/habits/habit-card';
import type { HabitHeatmapData } from '@/hooks/use-heatmap-data';

interface HabitHeatmapCardProps {
  data: HabitHeatmapData;
}

export function HabitHeatmapCard({ data }: HabitHeatmapCardProps) {
  const { habit, days } = data;
  const completedDays = days.filter((d) => d.value === 1).length;
  const totalDays = days.filter((d) => {
    // Only count days up to today
    return new Date(d.date) <= new Date();
  }).length;
  const rate = totalDays > 0 ? Math.round((completedDays / totalDays) * 100) : 0;

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.iconWrapper}>
          <ThemedText style={styles.emoji}>{getHabitEmoji(habit.icon)}</ThemedText>
        </View>
        <View style={styles.titleGroup}>
          <ThemedText style={styles.habitName}>{habit.name}</ThemedText>
          <ThemedText style={styles.rate}>{rate}% consistency</ThemedText>
        </View>
        <ThemedText style={styles.days}>{completedDays}d</ThemedText>
      </View>

      {/* Heatmap */}
      <HeatmapGrid days={days} />
      <HeatmapLegend />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Palette.surface,
    borderRadius: Radius.md,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: Palette.border,
    ...Shadow.sm,
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: Radius.sm,
    backgroundColor: Palette.accentMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: Typography.lg,
  },
  titleGroup: {
    flex: 1,
    gap: 2,
  },
  habitName: {
    fontSize: Typography.md,
    fontWeight: '600',
    color: Palette.inkPrimary,
  },
  rate: {
    fontSize: Typography.sm,
    color: Palette.inkTertiary,
  },
  days: {
    fontSize: Typography.sm,
    fontWeight: '600',
    color: Palette.inkSecondary,
  },
});
