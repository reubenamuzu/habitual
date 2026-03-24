import type { SQLiteDatabase } from 'expo-sqlite';
import type { Habit } from '../db/schema';

export async function getAllHabits(db: SQLiteDatabase): Promise<Habit[]> {
  return db.getAllAsync<Habit>(
    'SELECT * FROM habits WHERE archived = 0 ORDER BY sort_order ASC, id ASC'
  );
}

export async function getHabitById(db: SQLiteDatabase, id: number): Promise<Habit | null> {
  return db.getFirstAsync<Habit>('SELECT * FROM habits WHERE id = ?', [id]);
}

export async function createHabit(
  db: SQLiteDatabase,
  data: { name: string; icon: string; color?: string }
): Promise<number> {
  const maxOrder = await db.getFirstAsync<{ max_order: number | null }>(
    'SELECT MAX(sort_order) as max_order FROM habits WHERE archived = 0'
  );
  const nextOrder = (maxOrder?.max_order ?? -1) + 1;
  const result = await db.runAsync(
    'INSERT INTO habits (name, icon, color, sort_order) VALUES (?, ?, ?, ?)',
    [data.name, data.icon, data.color ?? '#1A1A1A', nextOrder]
  );
  return result.lastInsertRowId;
}

export async function updateHabit(
  db: SQLiteDatabase,
  id: number,
  data: Partial<{ name: string; icon: string; color: string }>
): Promise<void> {
  const fields = Object.keys(data) as (keyof typeof data)[];
  if (fields.length === 0) return;
  const setClause = fields.map((f) => `${f} = ?`).join(', ');
  const values = fields.map((f) => data[f] as string);
  await db.runAsync(`UPDATE habits SET ${setClause} WHERE id = ?`, [...values, id]);
}

export async function archiveHabit(db: SQLiteDatabase, id: number): Promise<void> {
  await db.runAsync('UPDATE habits SET archived = 1 WHERE id = ?', [id]);
}

export async function reorderHabits(db: SQLiteDatabase, ids: number[]): Promise<void> {
  await db.withTransactionAsync(async () => {
    for (let i = 0; i < ids.length; i++) {
      await db.runAsync('UPDATE habits SET sort_order = ? WHERE id = ?', [i, ids[i]]);
    }
  });
}
