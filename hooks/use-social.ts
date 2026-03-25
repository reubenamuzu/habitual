import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from './use-auth';
import {
  getFriends,
  getPendingRequests,
  getFriendActivity,
  sendFriendRequest,
  respondToRequest,
  removeFriend,
  searchUsers,
} from '@/lib/social/social.service';
import type { Profile } from '@/lib/database.types';

function todayISO() { return new Date().toISOString().slice(0, 10); }

export const FRIENDS_KEY = (userId: string) => ['friends', userId] as const;
export const PENDING_KEY = (userId: string) => ['friend-requests', userId] as const;
export const ACTIVITY_KEY = (userId: string, date: string) => ['friend-activity', userId, date] as const;

export function useSocial() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const today = todayISO();

  const friendsQuery = useQuery({
    queryKey: FRIENDS_KEY(user?.id ?? ''),
    queryFn: () => getFriends(user!.id),
    enabled: !!user,
  });

  const pendingQuery = useQuery({
    queryKey: PENDING_KEY(user?.id ?? ''),
    queryFn: () => getPendingRequests(user!.id),
    enabled: !!user,
  });

  const friends = friendsQuery.data ?? [];
  const friendIds = friends.map((f) => f.friend.id);

  const activityQuery = useQuery({
    queryKey: ACTIVITY_KEY(user?.id ?? '', today),
    queryFn: () => getFriendActivity(friendIds, today),
    enabled: !!user && friendIds.length > 0,
  });

  const invalidateAll = () => {
    qc.invalidateQueries({ queryKey: FRIENDS_KEY(user?.id ?? '') });
    qc.invalidateQueries({ queryKey: PENDING_KEY(user?.id ?? '') });
    qc.invalidateQueries({ queryKey: ACTIVITY_KEY(user?.id ?? '', today) });
  };

  const sendRequestMutation = useMutation({
    mutationFn: (addresseeId: string) => sendFriendRequest(user!.id, addresseeId),
    onSuccess: invalidateAll,
  });

  const respondMutation = useMutation({
    mutationFn: ({ friendshipId, accept }: { friendshipId: string; accept: boolean }) =>
      respondToRequest(friendshipId, accept),
    onSuccess: invalidateAll,
  });

  const removeMutation = useMutation({
    mutationFn: (friendshipId: string) => removeFriend(friendshipId),
    onSuccess: invalidateAll,
  });

  return {
    friends,
    pendingRequests: pendingQuery.data ?? [],
    activity: activityQuery.data ?? [],
    loading: friendsQuery.isLoading || pendingQuery.isLoading,
    error: friendsQuery.error ? String(friendsQuery.error) : null,
    sendRequest: (addresseeId: string) => sendRequestMutation.mutateAsync(addresseeId),
    respond: (friendshipId: string, accept: boolean) =>
      respondMutation.mutateAsync({ friendshipId, accept }),
    removeFriend: (friendshipId: string) => removeMutation.mutateAsync(friendshipId),
    refresh: invalidateAll,
  };
}

export function useUserSearch(query: string) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['user-search', query],
    queryFn: () => searchUsers(query, user!.id),
    enabled: !!user && query.length >= 2,
    staleTime: 30_000,
  });
}
