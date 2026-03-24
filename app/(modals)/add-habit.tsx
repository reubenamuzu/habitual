import { useRouter } from 'expo-router';
import { ModalSheet } from '@/components/shared/modal-sheet';
import { HabitForm } from '@/components/habits/habit-form';
import { useHabits } from '@/hooks/use-habits';

export default function AddHabitModal() {
  const router = useRouter();
  const { create } = useHabits();

  const handleSubmit = async (name: string, icon: string) => {
    await create({ name, icon });
    router.back();
  };

  return (
    <ModalSheet title="New Habit" onClose={() => router.back()}>
      <HabitForm onSubmit={handleSubmit} submitLabel="Create Habit" />
    </ModalSheet>
  );
}
