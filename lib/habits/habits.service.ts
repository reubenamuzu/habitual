import { supabase } from '@/lib/supabase';
import type { Habit } from '@/lib/database.types';

export async function getHabits(userId: string): Promise<Habit[]> {
  const { data, error } = await supabase
    .from('habits')
    .select('*')
    .eq('user_id', userId)
    .eq('archived', false)
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return data;
}

export async function getHabitById(id: string): Promise<Habit | null> {
  const { data, error } = await supabase
    .from('habits')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
}

export async function createHabit(
  userId: string,
  input: {
    name: string;
    icon: string;
    color?: string;
    schedule_type?: 'daily' | 'custom';
    schedule_days?: number[];
  }
): Promise<Habit> {
  const { count } = await supabase
    .from('habits')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('archived', false);

  const { data, error } = await supabase
    .from('habits')
    .insert({
      user_id: userId,
      name: input.name,
      icon: input.icon,
      color: input.color ?? '#6366F1',
      sort_order: count ?? 0,
      schedule_type: input.schedule_type ?? 'daily',
      schedule_days: input.schedule_days ?? [0, 1, 2, 3, 4, 5, 6],
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateHabit(
  id: string,
  updates: Partial<Pick<Habit, 'name' | 'icon' | 'color' | 'sort_order' | 'schedule_type' | 'schedule_days'>>
): Promise<Habit> {
  const { data, error } = await supabase
    .from('habits')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function archiveHabit(id: string): Promise<void> {
  const { error } = await supabase
    .from('habits')
    .update({ archived: true, updated_at: new Date().toISOString() })
    .eq('id', id);
  if (error) throw error;
}

export async function reorderHabits(ids: string[]): Promise<void> {
  const updates = ids.map((id, index) =>
    supabase.from('habits').update({ sort_order: index }).eq('id', id)
  );
  await Promise.all(updates);
}
