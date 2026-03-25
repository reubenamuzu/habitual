import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from './use-auth';
import { getLogsForDate, toggleHabitLog } from '@/lib/habits/habit-logs.service';

export function useHabitLogs(date: string) {
  const { user } = useAuth();
  const qc = useQueryClient();
  const key = ['habit-logs', user?.id, date] as const;

  const query = useQuery({
    queryKey: key,
    queryFn: () => getLogsForDate(user!.id, date),
    enabled: !!user,
  });

  const toggleMutation = useMutation({
    mutationFn: (habitId: string) => toggleHabitLog(user!.id, habitId, date),
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
  });

  return {
    logs: query.data ?? [],
    loading: query.isLoading,
    error: query.error ? String(query.error) : null,
    toggleLog: toggleMutation.mutateAsync,
    refresh: () => qc.invalidateQueries({ queryKey: key }),
  };
}
