// TypeScript interfaces for all database tables

export interface Habit {
  id: number;
  name: string;
  icon: string;
  color: string;
  sort_order: number;
  archived: 0 | 1;
  created_at: string;
}

export interface HabitLog {
  id: number;
  habit_id: number;
  date: string; // 'YYYY-MM-DD'
  completed: 0 | 1;
  logged_at: string;
}

export interface MoodLog {
  id: number;
  date: string; // 'YYYY-MM-DD'
  time_of_day: 'morning' | 'evening';
  score: number;
  logged_at: string;
}

// SQL migration strings

export const CREATE_HABITS_TABLE = `
  CREATE TABLE IF NOT EXISTS habits (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT    NOT NULL,
    icon        TEXT    NOT NULL DEFAULT 'circle',
    color       TEXT    NOT NULL DEFAULT '#1A1A1A',
    sort_order  INTEGER NOT NULL DEFAULT 0,
    archived    INTEGER NOT NULL DEFAULT 0,
    created_at  TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
  );
`;

export const CREATE_HABIT_LOGS_TABLE = `
  CREATE TABLE IF NOT EXISTS habit_logs (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    habit_id    INTEGER NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
    date        TEXT    NOT NULL,
    completed   INTEGER NOT NULL DEFAULT 0,
    logged_at   TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    UNIQUE(habit_id, date)
  );
`;

export const CREATE_MOOD_LOGS_TABLE = `
  CREATE TABLE IF NOT EXISTS mood_logs (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    date         TEXT    NOT NULL,
    time_of_day  TEXT    NOT NULL CHECK (time_of_day IN ('morning', 'evening')),
    score        INTEGER NOT NULL CHECK (score BETWEEN 1 AND 10),
    logged_at    TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    UNIQUE(date, time_of_day)
  );
`;

export const CREATE_INDEXES = `
  CREATE INDEX IF NOT EXISTS idx_habit_logs_habit_date ON habit_logs(habit_id, date);
  CREATE INDEX IF NOT EXISTS idx_habit_logs_date ON habit_logs(date);
  CREATE INDEX IF NOT EXISTS idx_mood_logs_date ON mood_logs(date);
`;
