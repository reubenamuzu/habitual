import { useCallback, useEffect, useState } from 'react';
import { getDb } from '@/lib/db/database';
import type { Habit } from '@/lib/db/schema';
import * as habitsService from '@/lib/habits/habits.service';

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const db = await getDb();
    const data = await habitsService.getAllHabits(db);
    setHabits(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const create = useCallback(
    async (data: { name: string; icon: string; color?: string }) => {
      const db = await getDb();
      await habitsService.createHabit(db, data);
      await refresh();
    },
    [refresh]
  );

  const update = useCallback(
    async (id: number, data: Partial<{ name: string; icon: string; color: string }>) => {
      const db = await getDb();
      await habitsService.updateHabit(db, id, data);
      await refresh();
    },
    [refresh]
  );

  const archive = useCallback(
    async (id: number) => {
      const db = await getDb();
      await habitsService.archiveHabit(db, id);
      await refresh();
    },
    [refresh]
  );

  return { habits, loading, create, update, archive, refresh };
}
