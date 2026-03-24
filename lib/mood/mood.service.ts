import type { SQLiteDatabase } from 'expo-sqlite';
import type { MoodLog } from '../db/schema';

export async function getMoodLogsForRange(
  db: SQLiteDatabase,
  fromDate: string,
  toDate: string
): Promise<MoodLog[]> {
  return db.getAllAsync<MoodLog>(
    'SELECT * FROM mood_logs WHERE date >= ? AND date <= ? ORDER BY date ASC, time_of_day ASC',
    [fromDate, toDate]
  );
}

export async function getTodayMoodLogs(
  db: SQLiteDatabase,
  date: string
): Promise<{ morning?: MoodLog; evening?: MoodLog }> {
  const logs = await db.getAllAsync<MoodLog>(
    'SELECT * FROM mood_logs WHERE date = ?',
    [date]
  );
  const result: { morning?: MoodLog; evening?: MoodLog } = {};
  for (const log of logs) {
    result[log.time_of_day] = log;
  }
  return result;
}

export async function upsertMoodLog(
  db: SQLiteDatabase,
  date: string,
  timeOfDay: 'morning' | 'evening',
  score: number
): Promise<void> {
  await db.runAsync(
    'INSERT OR REPLACE INTO mood_logs (date, time_of_day, score) VALUES (?, ?, ?)',
    [date, timeOfDay, score]
  );
}

export async function getAverageMood(
  db: SQLiteDatabase,
  fromDate: string,
  toDate: string
): Promise<number | null> {
  const result = await db.getFirstAsync<{ avg: number | null }>(
    'SELECT AVG(score) as avg FROM mood_logs WHERE date >= ? AND date <= ?',
    [fromDate, toDate]
  );
  return result?.avg ?? null;
}
