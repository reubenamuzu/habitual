import { useCallback } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { Palette, Radius, Shadow, Spacing, Typography } from '@/constants/theme';
import { ThemedText } from '@/components/themed-text';
import { ScreenHeader } from '@/components/shared/screen-header';
import { Divider } from '@/components/shared/divider';
import { EmptyState } from '@/components/shared/empty-state';
import { PressableScale } from '@/components/shared/pressable-scale';
import { IconButton } from '@/components/shared/icon-button';
import { useSocial } from '@/hooks/use-social';
import type { FriendWithProfile } from '@/lib/social/social.service';
import type { FriendActivity } from '@/lib/social/social.service';

function FriendRequestCard({ item, onAccept, onDecline }: {
  item: FriendWithProfile;
  onAccept: () => void;
  onDecline: () => void;
}) {
  return (
    <View style={styles.requestCard}>
      <View style={styles.requestAvatar}>
        <ThemedText style={styles.avatarInitial}>
          {(item.friend.display_name ?? item.friend.username).charAt(0).toUpperCase()}
        </ThemedText>
      </View>
      <View style={styles.requestInfo}>
        <ThemedText style={styles.requestName} numberOfLines={1}>
          {item.friend.display_name ?? item.friend.username}
        </ThemedText>
        <ThemedText style={styles.requestUsername}>@{item.friend.username}</ThemedText>
      </View>
      <TouchableOpacity
        style={styles.acceptBtn}
        onPress={onAccept}
        accessibilityLabel={`Accept friend request from ${item.friend.username}`}
      >
        <ThemedText style={styles.acceptText}>Accept</ThemedText>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.declineBtn}
        onPress={onDecline}
        accessibilityLabel={`Decline friend request from ${item.friend.username}`}
      >
        <ThemedText style={styles.declineText}>Decline</ThemedText>
      </TouchableOpacity>
    </View>
  );
}

function ActivityCard({ item, onPress }: { item: FriendActivity; onPress: () => void }) {
  const name = item.friend.display_name ?? item.friend.username;
  const initial = name.charAt(0).toUpperCase();
  return (
    <PressableScale style={styles.activityCard} onPress={onPress}>
      <View style={styles.activityAvatar}>
        <ThemedText style={styles.avatarInitial}>{initial}</ThemedText>
      </View>
      <View style={styles.activityInfo}>
        <ThemedText style={styles.activityName}>{name}</ThemedText>
        {item.completedCount > 0 ? (
          <ThemedText style={styles.activitySub} numberOfLines={2}>
            Completed {item.completedCount} habit{item.completedCount !== 1 ? 's' : ''} today
            {item.completedHabits.length > 0 ? `: ${item.completedHabits.slice(0, 2).join(', ')}${item.completedHabits.length > 2 ? '…' : ''}` : ''}
          </ThemedText>
        ) : (
          <ThemedText style={styles.activitySub}>No habits completed yet today</ThemedText>
        )}
      </View>
      <View style={[styles.badge, item.completedCount > 0 && styles.badgeActive]}>
        <ThemedText style={[styles.badgeText, item.completedCount > 0 && styles.badgeTextActive]}>
          {item.completedCount}/{item.totalHabits}
        </ThemedText>
      </View>
    </PressableScale>
  );
}

export default function SocialScreen() {
  const router = useRouter();
  const { friends, pendingRequests, activity, loading, error, respond, refresh } = useSocial();

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <ScreenHeader
          title="Social"
          rightAction={
            <IconButton
              name="person.badge.plus"
              size={36}
              onPress={() => router.push('/(modals)/friend-search' as any)}
              backgroundColor={Palette.accentMuted}
              iconColor={Palette.accent}
              accessibilityLabel="Find friends"
            />
          }
        />

        {error && (
          <TouchableOpacity style={styles.errorBanner} onPress={refresh} accessibilityRole="button" accessibilityLabel="Failed to load social data. Tap to retry.">
            <ThemedText style={styles.errorText}>⚠️ {error} — Tap to retry</ThemedText>
          </TouchableOpacity>
        )}

        {/* Friend Requests */}
        {pendingRequests.length > 0 && (
          <>
            <View style={styles.section}>
              <ThemedText style={styles.sectionTitle}>
                Friend Requests ({pendingRequests.length})
              </ThemedText>
              {pendingRequests.map((req) => (
                <FriendRequestCard
                  key={req.id}
                  item={req}
                  onAccept={() => respond(req.id, true)}
                  onDecline={() => respond(req.id, false)}
                />
              ))}
            </View>
            <Divider style={styles.divider} />
          </>
        )}

        {/* Activity Feed */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Today's Activity</ThemedText>
          {!loading && friends.length === 0 ? (
            <EmptyState
              icon="person.2.fill"
              title="No friends yet"
              body="Search for friends by username to see their activity here."
              action={{ label: 'Find Friends', onPress: () => router.push('/(modals)/friend-search' as any) }}
            />
          ) : !loading && activity.length === 0 ? (
            <EmptyState
              icon="person.2.fill"
              title="No activity yet"
              body="Your friends haven't logged any habits today."
            />
          ) : (
            activity.map((item) => (
              <ActivityCard
                key={item.friend.id}
                item={item}
                onPress={() => router.push({ pathname: '/(modals)/friend-profile' as any, params: { userId: item.friend.id } })}
              />
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Palette.background,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.xxxl,
  },
  section: {
    gap: Spacing.sm,
  },
  sectionTitle: {
    fontSize: Typography.xs,
    fontWeight: '600',
    color: Palette.inkTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: Spacing.xs,
  },
  divider: {
    marginVertical: Spacing.base,
  },
  // Friend request cards
  requestCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.surface,
    borderRadius: Radius.md,
    padding: Spacing.md,
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: Palette.border,
    ...Shadow.sm,
  },
  requestAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Palette.accentMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    fontSize: Typography.md,
    fontWeight: '700',
    color: Palette.accent,
  },
  requestInfo: {
    flex: 1,
    gap: 2,
  },
  requestName: {
    fontSize: Typography.md,
    fontWeight: '600',
    color: Palette.inkPrimary,
  },
  requestUsername: {
    fontSize: Typography.sm,
    color: Palette.inkTertiary,
  },
  acceptBtn: {
    backgroundColor: Palette.accent,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    minHeight: 32,
    justifyContent: 'center',
  },
  acceptText: {
    fontSize: Typography.sm,
    fontWeight: '600',
    color: Palette.white,
  },
  declineBtn: {
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    minHeight: 32,
    justifyContent: 'center',
  },
  declineText: {
    fontSize: Typography.sm,
    color: Palette.inkTertiary,
  },
  // Activity cards
  activityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.surface,
    borderRadius: Radius.md,
    padding: Spacing.md,
    gap: Spacing.md,
    borderWidth: 1,
    borderColor: Palette.border,
    ...Shadow.sm,
  },
  activityAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Palette.accentMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityInfo: {
    flex: 1,
    gap: 3,
  },
  activityName: {
    fontSize: Typography.md,
    fontWeight: '600',
    color: Palette.inkPrimary,
  },
  activitySub: {
    fontSize: Typography.sm,
    color: Palette.inkSecondary,
  },
  badge: {
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    backgroundColor: Palette.border,
  },
  badgeActive: {
    backgroundColor: Palette.successLight,
  },
  badgeText: {
    fontSize: Typography.xs,
    fontWeight: '600',
    color: Palette.inkTertiary,
  },
  badgeTextActive: {
    color: Palette.success,
  },
  errorBanner: {
    backgroundColor: '#FEF2F2',
    borderRadius: 8,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  errorText: {
    fontSize: Typography.sm,
    color: Palette.danger,
  },
});
