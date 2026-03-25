import { useCallback } from 'react';
import { Alert, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { Palette, Radius, Shadow, Spacing, Typography } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useAuth } from '@/hooks/use-auth';
import type { ThemePreference } from '@/lib/theme-preference';
import { ThemedText } from '@/components/themed-text';
import { ScreenHeader } from '@/components/shared/screen-header';
import { Divider } from '@/components/shared/divider';
import { EmptyState } from '@/components/shared/empty-state';
import { StatCard } from '@/components/stats/stat-card';
import { StreakBadge } from '@/components/stats/streak-badge';
import { IconButton } from '@/components/shared/icon-button';
import { getHabitEmoji } from '@/components/habits/habit-card';
import { useProfileStats } from '@/hooks/use-profile-stats';
import { signOut } from '@/lib/auth/auth.service';

export default function ProfileScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { stats, loading, error, refresh } = useProfileStats();
  const { preference, setPreference } = useAppTheme();

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          try {
            await signOut();
          } catch {
            Alert.alert('Error', 'Failed to sign out. Please try again.');
          }
        },
      },
    ]);
  };

  const { habitStats, totalHabits, overallLongestStreak, avgMood } = stats;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <ScreenHeader title="Profile" />

        {/* User info */}
        <View style={styles.userCard}>
          <View style={styles.userAvatar}>
            <ThemedText style={styles.userInitial}>
              {(user?.email ?? 'U').charAt(0).toUpperCase()}
            </ThemedText>
          </View>
          <View style={styles.userInfo}>
            <ThemedText style={styles.userEmail} numberOfLines={1}>{user?.email}</ThemedText>
          </View>
        </View>

        {error && (
          <TouchableOpacity style={styles.errorBanner} onPress={refresh} accessibilityRole="button" accessibilityLabel="Failed to load profile stats. Tap to retry.">
            <ThemedText style={styles.errorText}>⚠️ {error} — Tap to retry</ThemedText>
          </TouchableOpacity>
        )}

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
                accessibilityLabel={`Edit ${habit.name}`}
              />
            </View>
          ))}
        </View>

        <Divider style={styles.divider} />

        {/* Settings */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Settings</ThemedText>
          <View style={styles.settingsCard}>
            {/* Theme toggle */}
            <View style={styles.settingsRow}>
              <ThemedText style={styles.settingsLabel}>Appearance</ThemedText>
              <View style={styles.themeToggle}>
                {(['system', 'light', 'dark'] as ThemePreference[]).map((p) => (
                  <TouchableOpacity
                    key={p}
                    style={[styles.themeOption, preference === p && styles.themeOptionActive]}
                    onPress={() => setPreference(p)}
                    accessibilityRole="button"
                    accessibilityLabel={`Set theme to ${p}`}
                    accessibilityState={{ selected: preference === p }}
                  >
                    <ThemedText style={[styles.themeOptionText, preference === p && styles.themeOptionTextActive]}>
                      {p.charAt(0).toUpperCase() + p.slice(1)}
                    </ThemedText>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <Divider />
            <View style={styles.settingsRow}>
              <ThemedText style={styles.settingsLabel}>About</ThemedText>
              <ThemedText style={styles.settingsAction}>v1.0.0</ThemedText>
            </View>
          </View>
        </View>

        <Divider style={styles.divider} />

        {/* Sign Out */}
        <TouchableOpacity
          style={styles.signOutButton}
          onPress={handleSignOut}
          accessibilityRole="button"
          accessibilityLabel="Sign out"
        >
          <ThemedText style={styles.signOutText}>Sign Out</ThemedText>
        </TouchableOpacity>
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
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.surface,
    borderRadius: Radius.md,
    padding: Spacing.md,
    gap: Spacing.md,
    borderWidth: 1,
    borderColor: Palette.border,
    marginBottom: Spacing.base,
    ...Shadow.sm,
  },
  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Palette.accentMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userInitial: {
    fontSize: Typography.xl,
    fontWeight: '700',
    color: Palette.accent,
  },
  userInfo: {
    flex: 1,
  },
  userEmail: {
    fontSize: Typography.md,
    color: Palette.inkPrimary,
    fontWeight: '500',
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
  themeToggle: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  themeOption: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Palette.border,
    minHeight: 32,
    justifyContent: 'center',
  },
  themeOptionActive: {
    backgroundColor: Palette.accent,
    borderColor: Palette.accent,
  },
  themeOptionText: {
    fontSize: Typography.sm,
    color: Palette.inkSecondary,
    fontWeight: Typography.medium,
  },
  themeOptionTextActive: {
    color: Palette.white,
  },
  signOutButton: {
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Palette.danger,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    minHeight: 44,
    justifyContent: 'center',
  },
  signOutText: {
    fontSize: Typography.md,
    fontWeight: '600',
    color: Palette.danger,
  },
  errorBanner: {
    backgroundColor: '#FEF2F2',
    borderRadius: 8,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  errorText: {
    fontSize: Typography.sm,
    color: Palette.danger,
  },
});
