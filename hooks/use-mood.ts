import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from './use-auth';
import { getMoodLogsForRange, getTodayMoodLogs, upsertMoodLog } from '@/lib/mood/mood.service';

function todayISO() { return new Date().toISOString().slice(0, 10); }
function daysAgoISO(days: number) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10);
}

export const MOOD_KEY = (userId: string) => ['mood', userId] as const;
export const TODAY_MOOD_KEY = (userId: string, date: string) => ['mood-today', userId, date] as const;

export function useMood() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const today = todayISO();
  const from = daysAgoISO(30);

  const logsQuery = useQuery({
    queryKey: MOOD_KEY(user?.id ?? ''),
    queryFn: () => getMoodLogsForRange(user!.id, from, today),
    enabled: !!user,
  });

  const todayQuery = useQuery({
    queryKey: TODAY_MOOD_KEY(user?.id ?? '', today),
    queryFn: () => getTodayMoodLogs(user!.id, today),
    enabled: !!user,
  });

  const upsertMutation = useMutation({
    mutationFn: ({ timeOfDay, score }: { timeOfDay: 'morning' | 'evening'; score: number }) =>
      upsertMoodLog(user!.id, today, timeOfDay, score),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: MOOD_KEY(user?.id ?? '') });
      qc.invalidateQueries({ queryKey: TODAY_MOOD_KEY(user?.id ?? '', today) });
    },
  });

  return {
    moodLogs: logsQuery.data ?? [],
    todayMood: todayQuery.data ?? {},
    loading: logsQuery.isLoading || todayQuery.isLoading,
    error: logsQuery.error ? String(logsQuery.error) : null,
    upsertMood: (timeOfDay: 'morning' | 'evening', score: number) =>
      upsertMutation.mutateAsync({ timeOfDay, score }),
    refresh: () => {
      qc.invalidateQueries({ queryKey: MOOD_KEY(user?.id ?? '') });
      qc.invalidateQueries({ queryKey: TODAY_MOOD_KEY(user?.id ?? '', today) });
    },
  };
}
