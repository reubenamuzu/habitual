import { useCallback } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { Palette, Radius, Shadow, Spacing, Typography } from '@/constants/theme';
import { ThemedText } from '@/components/themed-text';
import { ScreenHeader } from '@/components/shared/screen-header';
import { Divider } from '@/components/shared/divider';
import { EmptyState } from '@/components/shared/empty-state';
import { StatCard } from '@/components/stats/stat-card';
import { StreakBadge } from '@/components/stats/streak-badge';
import { IconButton } from '@/components/shared/icon-button';
import { getHabitEmoji } from '@/components/habits/habit-card';
import { useProfileStats } from '@/hooks/use-profile-stats';

export default function ProfileScreen() {
  const router = useRouter();
  const { stats, loading, refresh } = useProfileStats();

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  const { habitStats, totalHabits, overallLongestStreak, avgMood } = stats;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <ScreenHeader title="Profile" />

        {/* Overview Stats */}
        <View style={styles.statsRow}>
          <StatCard value={totalHabits} label="Habits" />
          <StatCard value={overallLongestStreak} label="Best Streak" unit="d" />
          <StatCard
            value={avgMood != null ? avgMood.toFixed(1) : '—'}
            label="Avg Mood"
            unit={avgMood != null ? '/10' : undefined}
          />
        </View>

        <Divider style={styles.divider} />

        {/* Habits with streaks */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>My Habits</ThemedText>
          {!loading && habitStats.length === 0 && (
            <EmptyState
              icon="checkmark.circle.fill"
              title="No habits yet"
              body="Tap + to add your first habit."
            />
          )}
          {habitStats.map(({ habit, currentStreak, longestStreak }) => (
            <View key={habit.id} style={styles.habitRow}>
              <View style={styles.habitIconWrapper}>
                <ThemedText style={styles.habitEmoji}>{getHabitEmoji(habit.icon)}</ThemedText>
              </View>
              <ThemedText style={styles.habitName} numberOfLines={1}>{habit.name}</ThemedText>
              <StreakBadge current={currentStreak} longest={longestStreak} />
              <IconButton
                name="pencil"
                size={32}
                onPress={() => router.push({ pathname: '/(modals)/edit-habit' as any, params: { id: habit.id } })}
                backgroundColor={Palette.accentMuted}
                iconColor={Palette.inkSecondary}
              />
            </View>
          ))}
        </View>

        <Divider style={styles.divider} />

        {/* Settings placeholder */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Settings</ThemedText>
          <View style={styles.settingsCard}>
            <View style={styles.settingsRow}>
              <ThemedText style={styles.settingsLabel}>Export Data</ThemedText>
              <ThemedText style={styles.settingsAction}>Coming soon</ThemedText>
            </View>
            <Divider />
            <View style={styles.settingsRow}>
              <ThemedText style={styles.settingsLabel}>About</ThemedText>
              <ThemedText style={styles.settingsAction}>v1.0.0</ThemedText>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Palette.background,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.xxxl,
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.base,
  },
  divider: {
    marginVertical: Spacing.base,
  },
  section: {
    gap: Spacing.sm,
  },
  sectionTitle: {
    fontSize: Typography.xs,
    fontWeight: '600',
    color: Palette.inkTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: Spacing.xs,
  },
  habitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.surface,
    borderRadius: Radius.md,
    padding: Spacing.md,
    gap: Spacing.md,
    borderWidth: 1,
    borderColor: Palette.border,
    ...Shadow.sm,
  },
  habitIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: Radius.sm,
    backgroundColor: Palette.accentMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  habitEmoji: {
    fontSize: Typography.lg,
  },
  habitName: {
    flex: 1,
    fontSize: Typography.md,
    fontWeight: '500',
    color: Palette.inkPrimary,
  },
  settingsCard: {
    backgroundColor: Palette.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Palette.border,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.xs,
    ...Shadow.sm,
  },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
  },
  settingsLabel: {
    fontSize: Typography.md,
    color: Palette.inkPrimary,
  },
  settingsAction: {
    fontSize: Typography.base,
    color: Palette.inkTertiary,
  },
});
