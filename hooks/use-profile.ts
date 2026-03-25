import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from './use-auth';
import { getProfile, updateProfile, uploadAvatar } from '@/lib/profile/profile.service';
import type { Profile } from '@/lib/database.types';

export const PROFILE_KEY = (userId: string) => ['profile', userId] as const;

export function useProfile() {
  const { user } = useAuth();
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: PROFILE_KEY(user?.id ?? ''),
    queryFn: () => getProfile(user!.id),
    enabled: !!user,
  });

  const invalidate = () => qc.invalidateQueries({ queryKey: PROFILE_KEY(user?.id ?? '') });

  const updateMutation = useMutation({
    mutationFn: (updates: Parameters<typeof updateProfile>[1]) =>
      updateProfile(user!.id, updates),
    onSuccess: invalidate,
  });

  const avatarMutation = useMutation({
    mutationFn: async (uri: string) => {
      const url = await uploadAvatar(user!.id, uri);
      await updateProfile(user!.id, { avatar_url: url });
      return url;
    },
    onSuccess: invalidate,
  });

  return {
    profile: query.data ?? null,
    loading: query.isLoading,
    error: query.error ? String(query.error) : null,
    update: (updates: Parameters<typeof updateProfile>[1]) =>
      updateMutation.mutateAsync(updates),
    uploadAvatar: (uri: string) => avatarMutation.mutateAsync(uri),
    isUploadingAvatar: avatarMutation.isPending,
    refresh: invalidate,
  };
}
