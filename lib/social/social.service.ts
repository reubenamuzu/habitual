import { supabase } from '@/lib/supabase';
import type { Friendship, Profile } from '@/lib/database.types';

export interface FriendWithProfile extends Friendship {
  friend: Profile;
}

export interface FriendActivity {
  friend: Profile;
  completedHabits: string[]; // habit names
  completedCount: number;
  totalHabits: number;
  date: string;
}

export async function getFriends(userId: string): Promise<FriendWithProfile[]> {
  // Get accepted friendships where user is either requester or addressee
  const { data, error } = await supabase
    .from('friendships')
    .select(`
      *,
      requester:profiles!friendships_requester_id_fkey(*),
      addressee:profiles!friendships_addressee_id_fkey(*)
    `)
    .eq('status', 'accepted')
    .or(`requester_id.eq.${userId},addressee_id.eq.${userId}`);
  if (error) throw error;

  return (data ?? []).map((f: any) => ({
    ...f,
    friend: f.requester_id === userId ? f.addressee : f.requester,
  }));
}

export async function getPendingRequests(userId: string): Promise<FriendWithProfile[]> {
  const { data, error } = await supabase
    .from('friendships')
    .select(`
      *,
      requester:profiles!friendships_requester_id_fkey(*)
    `)
    .eq('addressee_id', userId)
    .eq('status', 'pending');
  if (error) throw error;

  return (data ?? []).map((f: any) => ({
    ...f,
    friend: f.requester,
  }));
}

export async function sendFriendRequest(requesterId: string, addresseeId: string): Promise<void> {
  const { error } = await supabase.from('friendships').insert({
    requester_id: requesterId,
    addressee_id: addresseeId,
    status: 'pending',
  });
  if (error) throw error;
}

export async function respondToRequest(
  friendshipId: string,
  accept: boolean
): Promise<void> {
  const { error } = await supabase
    .from('friendships')
    .update({ status: accept ? 'accepted' : 'blocked' })
    .eq('id', friendshipId);
  if (error) throw error;
}

export async function removeFriend(friendshipId: string): Promise<void> {
  const { error } = await supabase
    .from('friendships')
    .delete()
    .eq('id', friendshipId);
  if (error) throw error;
}

export async function searchUsers(query: string, currentUserId: string): Promise<Profile[]> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .ilike('username', `%${query}%`)
    .neq('id', currentUserId)
    .limit(20);
  if (error) throw error;
  return data ?? [];
}

export async function getFriendActivity(friendIds: string[], date: string): Promise<FriendActivity[]> {
  if (friendIds.length === 0) return [];

  // Get friends' profiles
  const { data: profiles } = await supabase
    .from('profiles')
    .select('*')
    .in('id', friendIds);

  // Get friends' habit logs for today (habit names via join)
  const { data: logs } = await supabase
    .from('habit_logs')
    .select('user_id, completed, habits(name)')
    .in('user_id', friendIds)
    .eq('date', date);

  const profileMap = new Map((profiles ?? []).map((p) => [p.id, p]));

  const activityMap = new Map<string, { completed: string[]; total: number }>();
  for (const log of logs ?? []) {
    const entry = activityMap.get(log.user_id) ?? { completed: [], total: 0 };
    entry.total++;
    if (log.completed) {
      entry.completed.push((log as any).habits?.name ?? 'Habit');
    }
    activityMap.set(log.user_id, entry);
  }

  return friendIds
    .filter((id) => profileMap.has(id))
    .map((id) => {
      const activity = activityMap.get(id) ?? { completed: [], total: 0 };
      return {
        friend: profileMap.get(id)!,
        completedHabits: activity.completed,
        completedCount: activity.completed.length,
        totalHabits: activity.total,
        date,
      } as FriendActivity;
    });
}
