import { useCallback, useEffect, useState } from 'react';
import { getDb } from '@/lib/db/database';
import type { MoodLog } from '@/lib/db/schema';
import * as moodService from '@/lib/mood/mood.service';

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

function daysAgoISO(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10);
}

export function useMood() {
  const [moodLogs, setMoodLogs] = useState<MoodLog[]>([]);
  const [todayMood, setTodayMood] = useState<{ morning?: MoodLog; evening?: MoodLog }>({});
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const db = await getDb();
    const today = todayISO();
    const from = daysAgoISO(30);
    const [logs, today_] = await Promise.all([
      moodService.getMoodLogsForRange(db, from, today),
      moodService.getTodayMoodLogs(db, today),
    ]);
    setMoodLogs(logs);
    setTodayMood(today_);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const upsertMood = useCallback(
    async (timeOfDay: 'morning' | 'evening', score: number) => {
      const db = await getDb();
      await moodService.upsertMoodLog(db, todayISO(), timeOfDay, score);
      await refresh();
    },
    [refresh]
  );

  return { moodLogs, todayMood, loading, upsertMood, refresh };
}
