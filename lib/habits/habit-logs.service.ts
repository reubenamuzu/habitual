import { supabase } from '@/lib/supabase';
import type { HabitLog } from '@/lib/database.types';

export async function getLogsForDate(userId: string, date: string): Promise<HabitLog[]> {
  const { data, error } = await supabase
    .from('habit_logs')
    .select('*')
    .eq('user_id', userId)
    .eq('date', date);
  if (error) throw error;
  return data;
}

export async function getLogsForHabit(
  habitId: string,
  fromDate: string,
  toDate: string
): Promise<HabitLog[]> {
  const { data, error } = await supabase
    .from('habit_logs')
    .select('*')
    .eq('habit_id', habitId)
    .gte('date', fromDate)
    .lte('date', toDate)
    .order('date', { ascending: true });
  if (error) throw error;
  return data;
}

export async function toggleHabitLog(
  userId: string,
  habitId: string,
  date: string
): Promise<void> {
  // Check if a log already exists
  const { data: existing } = await supabase
    .from('habit_logs')
    .select('id, completed')
    .eq('habit_id', habitId)
    .eq('date', date)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from('habit_logs')
      .update({ completed: !existing.completed })
      .eq('id', existing.id);
    if (error) throw error;
  } else {
    const { error } = await supabase.from('habit_logs').insert({
      user_id: userId,
      habit_id: habitId,
      date,
      completed: true,
    });
    if (error) throw error;
  }
}

export async function getCurrentStreak(habitId: string, scheduleDays: number[]): Promise<number> {
  const { data, error } = await supabase
    .from('habit_logs')
    .select('date, completed')
    .eq('habit_id', habitId)
    .eq('completed', true)
    .order('date', { ascending: false })
    .limit(365);
  if (error) throw error;

  const completedDates = new Set((data ?? []).map((l) => l.date));
  let streak = 0;
  const today = new Date();

  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dayOfWeek = d.getDay(); // 0=Sun
    const dateStr = d.toISOString().slice(0, 10);

    // Skip days the habit is not scheduled
    if (!scheduleDays.includes(dayOfWeek)) continue;

    if (completedDates.has(dateStr)) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

export async function getLongestStreak(habitId: string, scheduleDays: number[]): Promise<number> {
  const { data, error } = await supabase
    .from('habit_logs')
    .select('date')
    .eq('habit_id', habitId)
    .eq('completed', true)
    .order('date', { ascending: true });
  if (error) throw error;

  const completedDates = (data ?? []).map((l) => l.date);
  let longest = 0;
  let current = 0;
  let prevDate: Date | null = null;

  for (const dateStr of completedDates) {
    const d = new Date(dateStr);
    if (prevDate) {
      const diff = (d.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24);
      // Count gap only over scheduled days
      const scheduledInGap = Array.from({ length: diff - 1 }, (_, i) => {
        const g = new Date(prevDate!);
        g.setDate(prevDate!.getDate() + i + 1);
        return scheduleDays.includes(g.getDay());
      }).some(Boolean);

      if (diff === 1 || !scheduledInGap) {
        current++;
      } else {
        current = 1;
      }
    } else {
      current = 1;
    }
    if (current > longest) longest = current;
    prevDate = d;
  }
  return longest;
}
