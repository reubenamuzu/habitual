import * as SQLite from 'expo-sqlite';
import {
  CREATE_HABITS_TABLE,
  CREATE_HABIT_LOGS_TABLE,
  CREATE_MOOD_LOGS_TABLE,
} from './schema';

let db: SQLite.SQLiteDatabase | null = null;

export async function getDb(): Promise<SQLite.SQLiteDatabase> {
  if (!db) {
    db = await SQLite.openDatabaseAsync('habits.db');
    // Enable WAL mode and foreign keys
    await db.execAsync('PRAGMA journal_mode = WAL;');
    await db.execAsync('PRAGMA foreign_keys = ON;');
  }
  return db;
}

export async function runMigrations(): Promise<void> {
  const database = await getDb();
  await database.execAsync(CREATE_HABITS_TABLE);
  await database.execAsync(CREATE_HABIT_LOGS_TABLE);
  await database.execAsync(CREATE_MOOD_LOGS_TABLE);
  await database.execAsync(
    'CREATE INDEX IF NOT EXISTS idx_habit_logs_habit_date ON habit_logs(habit_id, date);'
  );
  await database.execAsync(
    'CREATE INDEX IF NOT EXISTS idx_habit_logs_date ON habit_logs(date);'
  );
  await database.execAsync(
    'CREATE INDEX IF NOT EXISTS idx_mood_logs_date ON mood_logs(date);'
  );
}
