import { supabase } from '@/lib/supabase';
import type { MoodLog } from '@/lib/database.types';

export async function getMoodLogsForRange(
  userId: string,
  fromDate: string,
  toDate: string
): Promise<MoodLog[]> {
  const { data, error } = await supabase
    .from('mood_logs')
    .select('*')
    .eq('user_id', userId)
    .gte('date', fromDate)
    .lte('date', toDate)
    .order('date', { ascending: true })
    .order('time_of_day', { ascending: true });
  if (error) throw error;
  return data;
}

export async function getTodayMoodLogs(
  userId: string,
  date: string
): Promise<{ morning?: MoodLog; evening?: MoodLog }> {
  const { data, error } = await supabase
    .from('mood_logs')
    .select('*')
    .eq('user_id', userId)
    .eq('date', date);
  if (error) throw error;

  const result: { morning?: MoodLog; evening?: MoodLog } = {};
  for (const log of data ?? []) {
    result[log.time_of_day] = log;
  }
  return result;
}

export async function upsertMoodLog(
  userId: string,
  date: string,
  timeOfDay: 'morning' | 'evening',
  score: number
): Promise<void> {
  const { error } = await supabase.from('mood_logs').upsert(
    { user_id: userId, date, time_of_day: timeOfDay, score },
    { onConflict: 'user_id,date,time_of_day' }
  );
  if (error) throw error;
}

export async function getAverageMood(
  userId: string,
  fromDate: string,
  toDate: string
): Promise<number | null> {
  const { data, error } = await supabase
    .from('mood_logs')
    .select('score')
    .eq('user_id', userId)
    .gte('date', fromDate)
    .lte('date', toDate);
  if (error) throw error;
  if (!data || data.length === 0) return null;
  const avg = data.reduce((sum, r) => sum + r.score, 0) / data.length;
  return Math.round(avg * 10) / 10;
}
