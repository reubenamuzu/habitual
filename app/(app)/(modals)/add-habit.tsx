import { useState } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ModalSheet } from '@/components/shared/modal-sheet';
import { HabitForm } from '@/components/habits/habit-form';
import { useHabits } from '@/hooks/use-habits';

export default function AddHabitModal() {
  const router = useRouter();
  const { create } = useHabits();
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (name: string, icon: string, scheduleType: 'daily' | 'custom', scheduleDays: number[]) => {
    if (saving) return;
    try {
      setSaving(true);
      await create({ name, icon, schedule_type: scheduleType, schedule_days: scheduleDays });
      router.back();
    } catch (e) {
      Alert.alert('Error', e instanceof Error ? e.message : 'Failed to create habit. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ModalSheet title="New Habit" onClose={() => router.back()}>
      <HabitForm onSubmit={handleSubmit} submitLabel={saving ? 'Creating…' : 'Create Habit'} disabled={saving} />
    </ModalSheet>
  );
}
