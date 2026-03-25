import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from './use-auth';
import { getHabits } from '@/lib/habits/habits.service';
import { getLogsForHabit } from '@/lib/habits/habit-logs.service';
import type { Habit } from '@/lib/database.types';

export interface HeatmapDay {
  date: string; // 'YYYY-MM-DD'
  value: number; // 0 = not completed, 1 = completed
}

export interface HabitHeatmapData {
  habit: Habit;
  days: HeatmapDay[];
  fromDate: string;
  toDate: string;
}

function todayISO() { return new Date().toISOString().slice(0, 10); }
function daysAgoISO(days: number) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10);
}

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

export const HEATMAP_KEY = (userId: string) => ['heatmap', userId] as const;

export function useHeatmapData() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const toDate = todayISO();
  const fromDate = daysAgoISO(89); // 90 days total

  const query = useQuery({
    queryKey: HEATMAP_KEY(user?.id ?? ''),
    queryFn: async (): Promise<HabitHeatmapData[]> => {
      const habits = await getHabits(user!.id);
      return Promise.all(
        habits.map(async (habit) => {
          const logs = await getLogsForHabit(habit.id, fromDate, toDate);
          const logMap = new Map(logs.map((l) => [l.date, l.completed ? 1 : 0]));
          const days: HeatmapDay[] = generateDateRange(fromDate, toDate).map((date) => ({
            date,
            value: logMap.get(date) ?? 0,
          }));
          return { habit, days, fromDate, toDate };
        })
      );
    },
    enabled: !!user,
  });

  return {
    heatmapData: query.data ?? [],
    loading: query.isLoading,
    error: query.error ? String(query.error) : null,
    refresh: () => qc.invalidateQueries({ queryKey: HEATMAP_KEY(user?.id ?? '') }),
  };
}
