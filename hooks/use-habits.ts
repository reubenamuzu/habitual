import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from './use-auth';
import * as habitsService from '@/lib/habits/habits.service';
import type { Habit } from '@/lib/database.types';

export const HABITS_KEY = (userId: string) => ['habits', userId] as const;

export function useHabits() {
  const { user } = useAuth();
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: HABITS_KEY(user?.id ?? ''),
    queryFn: () => habitsService.getHabits(user!.id),
    enabled: !!user,
  });

  const invalidate = () => qc.invalidateQueries({ queryKey: HABITS_KEY(user?.id ?? '') });

  const createMutation = useMutation({
    mutationFn: (data: { name: string; icon: string; color?: string; schedule_type?: 'daily' | 'custom'; schedule_days?: number[] }) =>
      habitsService.createHabit(user!.id, data),
    onSuccess: invalidate,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Parameters<typeof habitsService.updateHabit>[1] }) =>
      habitsService.updateHabit(id, updates),
    onSuccess: invalidate,
  });

  const archiveMutation = useMutation({
    mutationFn: (id: string) => habitsService.archiveHabit(id),
    onSuccess: invalidate,
  });

  return {
    habits: query.data ?? [] as Habit[],
    loading: query.isLoading,
    error: query.error ? String(query.error) : null,
    refresh: invalidate,
    create: createMutation.mutateAsync,
    update: (id: string, updates: Parameters<typeof habitsService.updateHabit>[1]) =>
      updateMutation.mutateAsync({ id, updates }),
    archive: archiveMutation.mutateAsync,
  };
}
