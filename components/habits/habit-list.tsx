import { FlatList, StyleSheet } from 'react-native';
import { Spacing } from '@/constants/theme';
import { EmptyState } from '@/components/shared/empty-state';
import { HabitCard } from './habit-card';
import type { HabitWithCompletion } from '@/hooks/use-today-habits';

interface HabitListProps {
  habits: HabitWithCompletion[];
  onToggle: (id: number) => void;
  onLongPress?: (id: number) => void;
}

export function HabitList({ habits, onToggle, onLongPress }: HabitListProps) {
  if (habits.length === 0) {
    return (
      <EmptyState
        icon="plus.circle.fill"
        title="No habits yet"
        body="Tap the + button to add your first habit."
      />
    );
  }

  return (
    <FlatList
      data={habits}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => (
        <HabitCard habit={item} onToggle={onToggle} onLongPress={onLongPress} />
      )}
      scrollEnabled={false}
      contentContainerStyle={styles.list}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    gap: Spacing.xs,
  },
});
