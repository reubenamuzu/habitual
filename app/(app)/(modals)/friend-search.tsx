import { useState } from 'react';
import { Alert, StyleSheet, TextInput, View, ActivityIndicator, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { Palette, Radius, Spacing, Typography } from '@/constants/theme';
import { ModalSheet } from '@/components/shared/modal-sheet';
import { ThemedText } from '@/components/themed-text';
import { PressableScale } from '@/components/shared/pressable-scale';
import { useUserSearch, useSocial } from '@/hooks/use-social';

export default function FriendSearchModal() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const { sendRequest } = useSocial();
  const { data: results, isLoading } = useUserSearch(query);
  const [sentIds, setSentIds] = useState<Set<string>>(new Set());

  const handleSendRequest = async (userId: string, username: string) => {
    try {
      await sendRequest(userId);
      setSentIds((prev) => new Set(prev).add(userId));
    } catch (e) {
      Alert.alert('Error', e instanceof Error ? e.message : `Failed to send request to @${username}.`);
    }
  };

  return (
    <ModalSheet title="Find Friends" onClose={() => router.back()}>
      <View style={styles.searchRow}>
        <TextInput
          style={styles.input}
          placeholder="Search by username…"
          placeholderTextColor={Palette.inkTertiary}
          value={query}
          onChangeText={setQuery}
          autoCapitalize="none"
          autoCorrect={false}
          autoFocus
          accessibilityLabel="Search by username"
        />
        {isLoading && <ActivityIndicator size="small" color={Palette.accent} style={styles.spinner} />}
      </View>

      {query.length >= 2 && !isLoading && results?.length === 0 && (
        <ThemedText style={styles.empty}>No users found for "{query}"</ThemedText>
      )}

      <FlatList
        data={results ?? []}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const sent = sentIds.has(item.id);
          return (
            <View style={styles.resultRow}>
              <View style={styles.avatar}>
                <ThemedText style={styles.avatarInitial}>
                  {(item.display_name ?? item.username).charAt(0).toUpperCase()}
                </ThemedText>
              </View>
              <View style={styles.info}>
                <ThemedText style={styles.displayName} numberOfLines={1}>
                  {item.display_name ?? item.username}
                </ThemedText>
                <ThemedText style={styles.username}>@{item.username}</ThemedText>
              </View>
              <PressableScale
                style={[styles.addBtn, sent && styles.addBtnSent]}
                onPress={() => !sent && handleSendRequest(item.id, item.username)}
                disabled={sent}
                accessibilityLabel={sent ? 'Request sent' : `Send friend request to @${item.username}`}
              >
                <ThemedText style={[styles.addBtnText, sent && styles.addBtnTextSent]}>
                  {sent ? 'Sent' : 'Add'}
                </ThemedText>
              </PressableScale>
            </View>
          );
        }}
      />
    </ModalSheet>
  );
}

const styles = StyleSheet.create({
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Palette.border,
    borderRadius: Radius.md,
    backgroundColor: Palette.surface,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.base,
    height: 48,
  },
  input: {
    flex: 1,
    fontSize: Typography.md,
    color: Palette.inkPrimary,
    height: '100%',
  },
  spinner: {
    marginLeft: Spacing.sm,
  },
  empty: {
    fontSize: Typography.base,
    color: Palette.inkTertiary,
    textAlign: 'center',
    paddingVertical: Spacing.xl,
  },
  list: {
    gap: Spacing.sm,
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.surface,
    borderRadius: Radius.md,
    padding: Spacing.md,
    gap: Spacing.md,
    borderWidth: 1,
    borderColor: Palette.border,
  },
  avatar: {
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
  info: {
    flex: 1,
    gap: 2,
  },
  displayName: {
    fontSize: Typography.md,
    fontWeight: '600',
    color: Palette.inkPrimary,
  },
  username: {
    fontSize: Typography.sm,
    color: Palette.inkTertiary,
  },
  addBtn: {
    backgroundColor: Palette.accent,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    minHeight: 32,
    justifyContent: 'center',
  },
  addBtnSent: {
    backgroundColor: Palette.border,
  },
  addBtnText: {
    fontSize: Typography.sm,
    fontWeight: '600',
    color: Palette.white,
  },
  addBtnTextSent: {
    color: Palette.inkTertiary,
  },
});
