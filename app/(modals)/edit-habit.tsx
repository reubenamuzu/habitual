import { useEffect, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Palette, Radius, Spacing, Typography } from '@/constants/theme';
import { ModalSheet } from '@/components/shared/modal-sheet';
import { HabitForm } from '@/components/habits/habit-form';
import { PressableScale } from '@/components/shared/pressable-scale';
import { ThemedText } from '@/components/themed-text';
import { Divider } from '@/components/shared/divider';
import { useHabits } from '@/hooks/use-habits';
import { getDb } from '@/lib/db/database';
import { getHabitById } from '@/lib/habits/habits.service';
import type { Habit } from '@/lib/db/schema';

export default function EditHabitModal() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string }>();
  const habitId = Number(params.id);
  const { update, archive } = useHabits();
  const [habit, setHabit] = useState<Habit | null>(null);

  useEffect(() => {
    if (!habitId) return;
    getDb().then((db) => getHabitById(db, habitId)).then(setHabit);
  }, [habitId]);

  const handleSubmit = async (name: string, icon: string) => {
    await update(habitId, { name, icon });
    router.back();
  };

  const handleArchive = () => {
    Alert.alert(
      'Archive Habit',
      `Archive "${habit?.name}"? It will be hidden from your list but your logs will be kept.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Archive',
          style: 'destructive',
          onPress: async () => {
            await archive(habitId);
            router.back();
          },
        },
      ]
    );
  };

  if (!habit) return null;

  return (
    <ModalSheet title="Edit Habit" onClose={() => router.back()}>
      <HabitForm
        initialName={habit.name}
        initialIcon={habit.icon}
        onSubmit={handleSubmit}
        submitLabel="Save Changes"
      />

      <View style={styles.dangerZone}>
        <Divider style={styles.divider} />
        <ThemedText style={styles.dangerLabel}>Danger Zone</ThemedText>
        <PressableScale style={styles.archiveButton} onPress={handleArchive}>
          <ThemedText style={styles.archiveText}>Archive Habit</ThemedText>
        </PressableScale>
      </View>
    </ModalSheet>
  );
}

const styles = StyleSheet.create({
  dangerZone: {
    marginTop: Spacing.xl,
    gap: Spacing.md,
  },
  divider: {
    marginVertical: 0,
  },
  dangerLabel: {
    fontSize: Typography.xs,
    fontWeight: '600',
    color: Palette.inkTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  archiveButton: {
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Palette.danger,
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  archiveText: {
    fontSize: Typography.md,
    fontWeight: '600',
    color: Palette.danger,
  },
});
