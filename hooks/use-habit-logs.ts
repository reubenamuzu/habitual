import { useCallback, useEffect, useState } from 'react';
import { getDb } from '@/lib/db/database';
import type { HabitLog } from '@/lib/db/schema';
import * as logsService from '@/lib/habits/habit-logs.service';

export function useHabitLogs(date: string) {
  const [logs, setLogs] = useState<HabitLog[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const db = await getDb();
    const data = await logsService.getLogsForDate(db, date);
    setLogs(data);
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

  return { logs, loading, toggleLog, refresh };
}
