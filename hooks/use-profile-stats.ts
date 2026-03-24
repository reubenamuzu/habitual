import { useCallback, useEffect, useState } from 'react';
import { getDb } from '@/lib/db/database';
import type { Habit } from '@/lib/db/schema';
import * as habitsService from '@/lib/habits/habits.service';
import * as logsService from '@/lib/habits/habit-logs.service';
import * as moodService from '@/lib/mood/mood.service';

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

function daysAgoISO(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10);
}

export function useProfileStats() {
  const [stats, setStats] = useState<ProfileStats>({
    habitStats: [],
    totalHabits: 0,
    overallLongestStreak: 0,
    avgMood: null,
  });
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const db = await getDb();
    const today = new Date().toISOString().slice(0, 10);
    const sevenDaysAgo = daysAgoISO(7);

    const habits = await habitsService.getAllHabits(db);

    const habitStats = await Promise.all(
      habits.map(async (habit): Promise<HabitStat> => {
        const [currentStreak, longestStreak] = await Promise.all([
          logsService.getCurrentStreak(db, habit.id),
          logsService.getLongestStreak(db, habit.id),
        ]);
        return { habit, currentStreak, longestStreak };
      })
    );

    const overallLongestStreak = habitStats.reduce(
      (max, s) => Math.max(max, s.longestStreak),
      0
    );

    const avgMood = await moodService.getAverageMood(db, sevenDaysAgo, today);

    setStats({ habitStats, totalHabits: habits.length, overallLongestStreak, avgMood });
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { stats, loading, refresh };
}
