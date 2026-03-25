import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from './use-auth';
import { getHabits } from '@/lib/habits/habits.service';
import { getCurrentStreak, getLongestStreak } from '@/lib/habits/habit-logs.service';
import { getAverageMood } from '@/lib/mood/mood.service';
import type { Habit } from '@/lib/database.types';

export interface HabitStat {
  habit: Habit;
  currentStreak: number;
  longestStreak: number;
}

export interface ProfileStats {
  habitStats: HabitStat[];
  totalHabits: number;
  overallLongestStreak: number;
  avgMood: number | null;
}

function todayISO() { return new Date().toISOString().slice(0, 10); }
function daysAgoISO(days: number) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10);
}

export const PROFILE_STATS_KEY = (userId: string) => ['profile-stats', userId] as const;

export function useProfileStats() {
  const { user } = useAuth();
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: PROFILE_STATS_KEY(user?.id ?? ''),
    queryFn: async (): Promise<ProfileStats> => {
      const today = todayISO();
      const sevenDaysAgo = daysAgoISO(7);
      const habits = await getHabits(user!.id);

      const habitStats = await Promise.all(
        habits.map(async (habit): Promise<HabitStat> => {
          const scheduleDays = habit.schedule_days ?? [0, 1, 2, 3, 4, 5, 6];
          const [currentStreak, longestStreak] = await Promise.all([
            getCurrentStreak(habit.id, scheduleDays),
            getLongestStreak(habit.id, scheduleDays),
          ]);
          return { habit, currentStreak, longestStreak };
        })
      );

      const overallLongestStreak = habitStats.reduce(
        (max, s) => Math.max(max, s.longestStreak),
        0
      );
      const avgMood = await getAverageMood(user!.id, sevenDaysAgo, today);

      return { habitStats, totalHabits: habits.length, overallLongestStreak, avgMood };
    },
    enabled: !!user,
  });

  return {
    stats: query.data ?? {
      habitStats: [],
      totalHabits: 0,
      overallLongestStreak: 0,
      avgMood: null,
    },
    loading: query.isLoading,
    error: query.error ? String(query.error) : null,
    refresh: () => qc.invalidateQueries({ queryKey: PROFILE_STATS_KEY(user?.id ?? '') }),
  };
}
