import { StyleSheet, View } from 'react-native';
import { Palette, Spacing, Radius, Shadow, Typography } from '@/constants/theme';
import { ThemedText } from '@/components/themed-text';
import { PressableScale } from '@/components/shared/pressable-scale';
import { HabitCheckButton } from './habit-check-button';
import type { HabitWithCompletion } from '@/hooks/use-today-habits';

// Curated set of icons mapped to emoji for display
const ICON_EMOJIS: Record<string, string> = {
  'heart.fill':         '❤️',
  'bolt.fill':          '⚡',
  'leaf.fill':          '🌿',
  'drop.fill':          '💧',
  'figure.walk':        '🚶',
  'dumbbell.fill':      '💪',
  'book.fill':          '📚',
  'fork.knife':         '🍽️',
  'moon.fill':          '🌙',
  'sun.max.fill':       '☀️',
  'music.note':         '🎵',
  'brain.head.profile': '🧠',
  'pencil.and.outline': '✏️',
  'bed.double.fill':    '🛏️',
  'sparkles':           '✨',
  'flame.fill':         '🔥',
  'circle.fill':        '⚫',
  'star.fill':          '⭐',
};

export function getHabitEmoji(icon: string): string {
  return ICON_EMOJIS[icon] ?? '⚫';
}

interface HabitCardProps {
  habit: HabitWithCompletion;
  onToggle: (id: number) => void;
  onLongPress?: (id: number) => void;
}

export function HabitCard({ habit, onToggle, onLongPress }: HabitCardProps) {
  return (
    <PressableScale
      style={[styles.card, habit.completed && styles.cardCompleted]}
      onLongPress={onLongPress ? () => onLongPress(habit.id) : undefined}
      scaleTo={0.98}
    >
      <View style={styles.iconWrapper}>
        <ThemedText style={styles.emoji}>{getHabitEmoji(habit.icon)}</ThemedText>
      </View>
      <ThemedText
        style={[styles.name, habit.completed && styles.nameCompleted]}
        numberOfLines={1}
      >
        {habit.name}
      </ThemedText>
      <HabitCheckButton
        completed={habit.completed}
        onToggle={() => onToggle(habit.id)}
      />
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.surface,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    gap: Spacing.md,
    ...Shadow.sm,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Palette.border,
  },
  cardCompleted: {
    borderColor: Palette.borderStrong,
    backgroundColor: '#FAFAFA',
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: Radius.sm,
    backgroundColor: Palette.accentMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: Typography.lg,
  },
  name: {
    flex: 1,
    fontSize: Typography.md,
    fontWeight: Typography.medium,
    color: Palette.inkPrimary,
  },
  nameCompleted: {
    color: Palette.inkTertiary,
    textDecorationLine: 'line-through',
  },
});
