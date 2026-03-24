import { useCallback, useEffect, useState } from 'react';
import { getDb } from '@/lib/db/database';
import type { Habit } from '@/lib/db/schema';
import * as habitsService from '@/lib/habits/habits.service';
import * as logsService from '@/lib/habits/habit-logs.service';

export interface HeatmapDay {
  date: string; // 'YYYY-MM-DD'
  value: number; // 0 = no log, 1 = completed
}

export interface HabitHeatmapData {
  habit: Habit;
  days: HeatmapDay[];
  fromDate: string;
  toDate: string;
}

function daysAgoISO(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10);
}

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Generates all dates (YYYY-MM-DD) between fromDate and toDate inclusive */
function generateDateRange(fromDate: string, toDate: string): string[] {
  const dates: string[] = [];
  const current = new Date(fromDate);
  const end = new Date(toDate);
  while (current <= end) {
    dates.push(current.toISOString().slice(0, 10));
    current.setDate(current.getDate() + 1);
  }
  return dates;
}

export function useHeatmapData() {
  const [heatmapData, setHeatmapData] = useState<HabitHeatmapData[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const db = await getDb();
    const toDate = todayISO();
    const fromDate = daysAgoISO(89); // 90 days total

    const habits = await habitsService.getAllHabits(db);

    const results: HabitHeatmapData[] = await Promise.all(
      habits.map(async (habit) => {
        const logs = await logsService.getLogsForHabit(db, habit.id, fromDate, toDate);
        const logMap = new Map(logs.map((l) => [l.date, l.completed === 1 ? 1 : 0]));

        const allDates = generateDateRange(fromDate, toDate);
        const days: HeatmapDay[] = allDates.map((date) => ({
          date,
          value: logMap.get(date) ?? 0,
        }));

        return { habit, days, fromDate, toDate };
      })
    );

    setHeatmapData(results);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { heatmapData, loading, refresh };
}
