import { StyleSheet, View } from 'react-native';
import { Palette, Radius, Spacing, Typography } from '@/constants/theme';
import { ThemedText } from '@/components/themed-text';
import { PressableScale } from '@/components/shared/pressable-scale';
import * as Haptics from 'expo-haptics';

interface MoodSliderProps {
  value: number; // 1-10
  onChange: (score: number) => void;
}

const SCORES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export function MoodSlider({ value, onChange }: MoodSliderProps) {
  const handleSelect = (score: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onChange(score);
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {SCORES.map((score) => {
          const isSelected = score === value;
          return (
            <PressableScale
              key={score}
              style={[styles.cell, isSelected && styles.cellSelected]}
              onPress={() => handleSelect(score)}
              scaleTo={0.9}
            >
              <ThemedText style={[styles.scoreText, isSelected && styles.scoreTextSelected]}>
                {score}
              </ThemedText>
            </PressableScale>
          );
        })}
      </View>
      <View style={styles.labelRow}>
        <ThemedText style={styles.labelText}>Low</ThemedText>
        <ThemedText style={styles.labelText}>High</ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.xs,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  cell: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: Radius.sm,
    borderWidth: 1.5,
    borderColor: Palette.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Palette.surface,
    maxWidth: 44,
  },
  cellSelected: {
    backgroundColor: Palette.accent,
    borderColor: Palette.accent,
  },
  scoreText: {
    fontSize: Typography.sm,
    fontWeight: '600',
    color: Palette.inkSecondary,
  },
  scoreTextSelected: {
    color: Palette.white,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
  },
  labelText: {
    fontSize: Typography.xs,
    color: Palette.inkTertiary,
  },
});
