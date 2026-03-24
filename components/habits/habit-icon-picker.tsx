import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Palette, Radius, Spacing, Typography } from '@/constants/theme';
import { ThemedText } from '@/components/themed-text';

export const ICON_OPTIONS = [
  { key: 'heart.fill',          emoji: '❤️',  label: 'Heart' },
  { key: 'bolt.fill',           emoji: '⚡',  label: 'Energy' },
  { key: 'leaf.fill',           emoji: '🌿',  label: 'Nature' },
  { key: 'drop.fill',           emoji: '💧',  label: 'Water' },
  { key: 'figure.walk',         emoji: '🚶',  label: 'Walk' },
  { key: 'dumbbell.fill',       emoji: '💪',  label: 'Workout' },
  { key: 'book.fill',           emoji: '📚',  label: 'Read' },
  { key: 'fork.knife',          emoji: '🍽️',  label: 'Eat' },
  { key: 'moon.fill',           emoji: '🌙',  label: 'Sleep' },
  { key: 'sun.max.fill',        emoji: '☀️',  label: 'Morning' },
  { key: 'music.note',          emoji: '🎵',  label: 'Music' },
  { key: 'brain.head.profile',  emoji: '🧠',  label: 'Focus' },
  { key: 'pencil.and.outline',  emoji: '✏️',  label: 'Write' },
  { key: 'bed.double.fill',     emoji: '🛏️',  label: 'Rest' },
  { key: 'sparkles',            emoji: '✨',  label: 'Mindful' },
  { key: 'flame.fill',          emoji: '🔥',  label: 'Streak' },
  { key: 'star.fill',           emoji: '⭐',  label: 'Goal' },
  { key: 'circle.fill',         emoji: '⚫',  label: 'Default' },
] as const;

export type HabitIconKey = typeof ICON_OPTIONS[number]['key'];

interface HabitIconPickerProps {
  selected: string;
  onSelect: (key: string) => void;
}

const NUM_COLUMNS = 5;

export function HabitIconPicker({ selected, onSelect }: HabitIconPickerProps) {
  return (
    <FlatList
      data={[...ICON_OPTIONS]}
      keyExtractor={(item) => item.key}
      numColumns={NUM_COLUMNS}
      scrollEnabled={false}
      renderItem={({ item }) => {
        const isSelected = item.key === selected;
        return (
          <TouchableOpacity
            style={[styles.cell, isSelected && styles.cellSelected]}
            onPress={() => onSelect(item.key)}
            activeOpacity={0.7}
          >
            <ThemedText style={styles.emoji}>{item.emoji}</ThemedText>
            <ThemedText style={[styles.label, isSelected && styles.labelSelected]}>
              {item.label}
            </ThemedText>
          </TouchableOpacity>
        );
      }}
      contentContainerStyle={styles.grid}
    />
  );
}

const styles = StyleSheet.create({
  grid: {
    gap: Spacing.xs,
  },
  cell: {
    flex: 1,
    margin: Spacing.xxs,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.xs,
    borderRadius: Radius.sm,
    borderWidth: 1.5,
    borderColor: Palette.border,
    alignItems: 'center',
    gap: Spacing.xxs,
    backgroundColor: Palette.surface,
  },
  cellSelected: {
    borderColor: Palette.accent,
    backgroundColor: Palette.accentMuted,
  },
  emoji: {
    fontSize: Typography.xl,
  },
  label: {
    fontSize: Typography.xs,
    color: Palette.inkTertiary,
    textAlign: 'center',
  },
  labelSelected: {
    color: Palette.inkPrimary,
    fontWeight: '600',
  },
});
