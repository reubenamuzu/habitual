import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from './use-auth';
import { getHabits } from '@/lib/habits/habits.service';
import { getLogsForDate, toggleHabitLog } from '@/lib/habits/habit-logs.service';
import type { Habit, HabitLog } from '@/lib/database.types';

export type HabitWithCompletion = Habit & { completed: boolean };

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

function isScheduledToday(habit: Habit): boolean {
  const dayOfWeek = new Date().getDay(); // 0=Sun
  return habit.schedule_type === 'daily' || habit.schedule_days.includes(dayOfWeek);
}

export const TODAY_HABITS_KEY = (userId: string, date: string) =>
  ['today-habits', userId, date] as const;

export function useTodayHabits() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const date = todayISO();

  const query = useQuery({
    queryKey: TODAY_HABITS_KEY(user?.id ?? '', date),
    queryFn: async () => {
      const [habits, logs] = await Promise.all([
        getHabits(user!.id),
        getLogsForDate(user!.id, date),
      ]);
      const logMap = new Map(logs.map((l: HabitLog) => [l.habit_id, l.completed]));
      return habits
        .filter(isScheduledToday)
        .map((h): HabitWithCompletion => ({
          ...h,
          completed: logMap.get(h.id) ?? false,
        }));
    },
    enabled: !!user,
  });

  const toggleMutation = useMutation({
    mutationFn: (habitId: string) => toggleHabitLog(user!.id, habitId, date),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: TODAY_HABITS_KEY(user?.id ?? '', date) }),
  });

  const todayHabits = query.data ?? [];
  const completedCount = todayHabits.filter((h) => h.completed).length;
  const totalCount = todayHabits.length;

  return {
    todayHabits,
    loading: query.isLoading,
    error: query.error ? String(query.error) : null,
    toggleLog: toggleMutation.mutateAsync,
    refresh: () => qc.invalidateQueries({ queryKey: TODAY_HABITS_KEY(user?.id ?? '', date) }),
    completedCount,
    totalCount,
    date,
  };
}
