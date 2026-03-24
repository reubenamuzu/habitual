import { StyleSheet, View } from 'react-native';
import { Palette, Radius, Spacing, Typography } from '@/constants/theme';
import { ThemedText } from '@/components/themed-text';
import { PressableScale } from '@/components/shared/pressable-scale';

interface MoodLogButtonProps {
  timeOfDay: 'morning' | 'evening';
  score?: number;
  onPress: () => void;
}

export function MoodLogButton({ timeOfDay, score, onPress }: MoodLogButtonProps) {
  const label = timeOfDay === 'morning' ? '☀️ Morning' : '🌙 Evening';
  const logged = score != null;

  return (
    <PressableScale style={[styles.button, logged && styles.buttonLogged]} onPress={onPress}>
      <ThemedText style={styles.timeLabel}>{label}</ThemedText>
      {logged ? (
        <ThemedText style={styles.score}>
          {score}<ThemedText style={styles.outOf}>/10</ThemedText>
        </ThemedText>
      ) : (
        <ThemedText style={styles.logPrompt}>Tap to log</ThemedText>
      )}
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Palette.border,
    backgroundColor: Palette.surface,
    padding: Spacing.md,
    gap: Spacing.xs,
  },
  buttonLogged: {
    borderColor: Palette.borderStrong,
  },
  timeLabel: {
    fontSize: Typography.sm,
    color: Palette.inkSecondary,
    fontWeight: '500',
  },
  score: {
    fontSize: Typography.xl,
    fontWeight: '700',
    color: Palette.inkPrimary,
  },
  outOf: {
    fontSize: Typography.base,
    fontWeight: '400',
    color: Palette.inkTertiary,
  },
  logPrompt: {
    fontSize: Typography.base,
    color: Palette.inkTertiary,
  },
});
