import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Palette, Radius, Spacing, Typography } from '@/constants/theme';
import { ModalSheet } from '@/components/shared/modal-sheet';
import { ThemedText } from '@/components/themed-text';
import { Divider } from '@/components/shared/divider';
import { StatCard } from '@/components/stats/stat-card';
import { getProfile } from '@/lib/profile/profile.service';
import { getFriendActivity } from '@/lib/social/social.service';
import { getHabits } from '@/lib/habits/habits.service';
import { getCurrentStreak } from '@/lib/habits/habit-logs.service';
import type { Profile } from '@/lib/database.types';

function todayISO() { return new Date().toISOString().slice(0, 10); }

interface FriendStats {
  profile: Profile;
  totalHabits: number;
  longestCurrentStreak: number;
  todayCompleted: number;
  todayTotal: number;
}

export default function FriendProfileModal() {
  const router = useRouter();
  const params = useLocalSearchParams<{ userId: string }>();
  const userId = params.userId;
  const [stats, setStats] = useState<FriendStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    const today = todayISO();
    Promise.all([
      getProfile(userId),
      getHabits(userId),
      getFriendActivity([userId], today),
    ])
      .then(async ([profile, habits, activity]) => {
        if (!profile) return;
        const streaks = await Promise.all(
          habits.map((h) => getCurrentStreak(h.id, h.schedule_days ?? [0, 1, 2, 3, 4, 5, 6]))
        );
        const longestCurrentStreak = Math.max(0, ...streaks);
        const act = activity[0];
        setStats({
          profile,
          totalHabits: habits.length,
          longestCurrentStreak,
          todayCompleted: act?.completedCount ?? 0,
          todayTotal: act?.totalHabits ?? 0,
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [userId]);

  return (
    <ModalSheet title="Friend Profile" onClose={() => router.back()}>
      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={Palette.accent} />
        </View>
      ) : !stats ? (
        <ThemedText style={styles.error}>Could not load profile.</ThemedText>
      ) : (
        <View style={styles.content}>
          {/* Avatar + name */}
          <View style={styles.header}>
            <View style={styles.avatar}>
              <ThemedText style={styles.avatarInitial}>
                {(stats.profile.display_name ?? stats.profile.username).charAt(0).toUpperCase()}
              </ThemedText>
            </View>
            <ThemedText style={styles.displayName}>
              {stats.profile.display_name ?? stats.profile.username}
            </ThemedText>
            <ThemedText style={styles.username}>@{stats.profile.username}</ThemedText>
          </View>

          <Divider style={styles.divider} />

          {/* Stats grid */}
          <View style={styles.statsRow}>
            <StatCard value={stats.totalHabits} label="Habits" />
            <StatCard value={stats.longestCurrentStreak} label="Current Streak" unit="d" />
            <StatCard
              value={stats.todayTotal > 0 ? `${stats.todayCompleted}/${stats.todayTotal}` : '—'}
              label="Today"
            />
          </View>
        </View>
      )}
    </ModalSheet>
  );
}

const styles = StyleSheet.create({
  loader: {
    paddingVertical: Spacing.xxxl,
    alignItems: 'center',
  },
  error: {
    fontSize: Typography.md,
    color: Palette.inkTertiary,
    textAlign: 'center',
    paddingVertical: Spacing.xl,
  },
  content: {
    gap: Spacing.base,
  },
  header: {
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.base,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Palette.accentMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    fontSize: 32,
    fontWeight: '700',
    color: Palette.accent,
  },
  displayName: {
    fontSize: Typography.xl,
    fontWeight: '700',
    color: Palette.inkPrimary,
  },
  username: {
    fontSize: Typography.md,
    color: Palette.inkTertiary,
  },
  divider: {
    marginVertical: Spacing.xs,
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
});
