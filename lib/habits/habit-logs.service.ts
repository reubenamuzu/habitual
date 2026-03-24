import type { SQLiteDatabase } from 'expo-sqlite';
import type { HabitLog } from '../db/schema';

export async function getLogsForDate(db: SQLiteDatabase, date: string): Promise<HabitLog[]> {
  return db.getAllAsync<HabitLog>('SELECT * FROM habit_logs WHERE date = ?', [date]);
}

export async function getLogsForHabit(
  db: SQLiteDatabase,
  habitId: number,
  fromDate: string,
  toDate: string
): Promise<HabitLog[]> {
  return db.getAllAsync<HabitLog>(
    'SELECT * FROM habit_logs WHERE habit_id = ? AND date >= ? AND date <= ? ORDER BY date ASC',
    [habitId, fromDate, toDate]
  );
}

export async function toggleHabitLog(
  db: SQLiteDatabase,
  habitId: number,
  date: string
): Promise<void> {
  // Get current state, defaulting to 0 if no row exists
  const existing = await db.getFirstAsync<{ completed: number }>(
    'SELECT completed FROM habit_logs WHERE habit_id = ? AND date = ?',
    [habitId, date]
  );
  const newCompleted = existing ? (existing.completed === 1 ? 0 : 1) : 1;
  await db.runAsync(
    'INSERT OR REPLACE INTO habit_logs (habit_id, date, completed) VALUES (?, ?, ?)',
    [habitId, date, newCompleted]
  );
}

export async function getCompletionRateForRange(
  db: SQLiteDatabase,
  habitId: number,
  fromDate: string,
  toDate: string
): Promise<number> {
  // Count days in range
  const result = await db.getFirstAsync<{ completed_days: number; total_days: number }>(
    `SELECT
      COUNT(CASE WHEN completed = 1 THEN 1 END) as completed_days,
      COUNT(*) as total_days
     FROM habit_logs
     WHERE habit_id = ? AND date >= ? AND date <= ?`,
    [habitId, fromDate, toDate]
  );
  if (!result || result.total_days === 0) return 0;
  return result.completed_days / result.total_days;
}

export async function getCurrentStreak(db: SQLiteDatabase, habitId: number): Promise<number> {
  const today = new Date().toISOString().slice(0, 10);
  const logs = await db.getAllAsync<{ date: string; completed: number }>(
    'SELECT date, completed FROM habit_logs WHERE habit_id = ? AND date <= ? ORDER BY date DESC',
    [habitId, today]
  );

  let streak = 0;
  let checkDate = new Date(today);

  for (const log of logs) {
    const logDate = log.date;
    const expected = checkDate.toISOString().slice(0, 10);
    if (logDate !== expected) break;
    if (log.completed !== 1) break;
    streak++;
    checkDate.setDate(checkDate.getDate() - 1);
  }
  return streak;
}

export async function getLongestStreak(db: SQLiteDatabase, habitId: number): Promise<number> {
  const logs = await db.getAllAsync<{ date: string; completed: number }>(
    'SELECT date, completed FROM habit_logs WHERE habit_id = ? AND completed = 1 ORDER BY date ASC',
    [habitId]
  );

  let longest = 0;
  let current = 0;
  let prevDate: Date | null = null;

  for (const log of logs) {
    const logDate = new Date(log.date);
    if (prevDate) {
      const diff = (logDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24);
      if (diff === 1) {
        current++;
      } else {
        current = 1;
      }
    } else {
      current = 1;
    }
    if (current > longest) longest = current;
    prevDate = logDate;
  }
  return longest;
}
