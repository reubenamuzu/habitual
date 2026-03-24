import { useCallback, useEffect, useState } from 'react';
import { getDb } from '@/lib/db/database';
import type { Habit } from '@/lib/db/schema';
import * as habitsService from '@/lib/habits/habits.service';
import * as logsService from '@/lib/habits/habit-logs.service';

export type HabitWithCompletion = Habit & { completed: boolean };

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export function useTodayHabits() {
  const [todayHabits, setTodayHabits] = useState<HabitWithCompletion[]>([]);
  const [loading, setLoading] = useState(true);
  const date = todayISO();

  const refresh = useCallback(async () => {
    const db = await getDb();
    const [habits, logs] = await Promise.all([
      habitsService.getAllHabits(db),
      logsService.getLogsForDate(db, date),
    ]);

    const logMap = new Map(logs.map((l) => [l.habit_id, l.completed === 1]));
    const merged: HabitWithCompletion[] = habits.map((h) => ({
      ...h,
      completed: logMap.get(h.id) ?? false,
    }));

    setTodayHabits(merged);
    setLoading(false);
  }, [date]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const toggleLog = useCallback(
    async (habitId: number) => {
      const db = await getDb();
      await logsService.toggleHabitLog(db, habitId, date);
      await refresh();
    },
    [date, refresh]
  );

  const completedCount = todayHabits.filter((h) => h.completed).length;
  const totalCount = todayHabits.length;

  return { todayHabits, loading, toggleLog, refresh, completedCount, totalCount, date };
}
