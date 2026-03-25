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
import { getHabitById } from '@/lib/habits/habits.service';
import type { Habit } from '@/lib/database.types';

export default function EditHabitModal() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string }>();
  const habitId = params.id;
  const { update, archive } = useHabits();
  const [habit, setHabit] = useState<Habit | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!habitId) return;
    getHabitById(habitId)
      .then(setHabit)
      .catch(() => Alert.alert('Error', 'Could not load habit details.'));
  }, [habitId]);

  const handleSubmit = async (name: string, icon: string, scheduleType: 'daily' | 'custom', scheduleDays: number[]) => {
    if (saving || !habitId) return;
    try {
      setSaving(true);
      await update(habitId, { name, icon, schedule_type: scheduleType, schedule_days: scheduleDays });
      router.back();
    } catch (e) {
      Alert.alert('Error', e instanceof Error ? e.message : 'Failed to save changes. Please try again.');
    } finally {
      setSaving(false);
    }
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
            if (!habitId) return;
            try {
              await archive(habitId);
              router.back();
            } catch (e) {
              Alert.alert('Error', e instanceof Error ? e.message : 'Failed to archive habit.');
            }
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
        initialScheduleType={habit.schedule_type}
        initialScheduleDays={habit.schedule_days}
        onSubmit={handleSubmit}
        submitLabel={saving ? 'Saving…' : 'Save Changes'}
        disabled={saving}
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
