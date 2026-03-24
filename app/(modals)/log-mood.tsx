import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Palette, Radius, Spacing, Typography } from '@/constants/theme';
import { ModalSheet } from '@/components/shared/modal-sheet';
import { MoodSlider } from '@/components/mood/mood-slider';
import { PressableScale } from '@/components/shared/pressable-scale';
import { ThemedText } from '@/components/themed-text';
import { useMood } from '@/hooks/use-mood';

export default function LogMoodModal() {
  const router = useRouter();
  const params = useLocalSearchParams<{ timeOfDay: 'morning' | 'evening' }>();
  const timeOfDay = params.timeOfDay ?? 'morning';
  const { upsertMood } = useMood();
  const [score, setScore] = useState(5);

  const handleSave = async () => {
    await upsertMood(timeOfDay, score);
    router.back();
  };

  const label = timeOfDay === 'morning' ? '☀️ Morning' : '🌙 Evening';

  return (
    <ModalSheet
      title="How are you feeling?"
      subtitle={label}
      onClose={() => router.back()}
    >
      <View style={styles.container}>
        <MoodSlider value={score} onChange={setScore} />

        <View style={styles.preview}>
          <ThemedText style={styles.previewScore}>{score}</ThemedText>
          <ThemedText style={styles.previewLabel}>out of 10</ThemedText>
        </View>

        <PressableScale style={styles.button} onPress={handleSave}>
          <ThemedText style={styles.buttonText}>Save</ThemedText>
        </PressableScale>
      </View>
    </ModalSheet>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.xl,
  },
  preview: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    gap: Spacing.xs,
  },
  previewScore: {
    fontSize: 72,
    fontWeight: '700',
    color: Palette.inkPrimary,
    lineHeight: 80,
  },
  previewLabel: {
    fontSize: Typography.md,
    color: Palette.inkTertiary,
  },
  button: {
    backgroundColor: Palette.accent,
    borderRadius: Radius.md,
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: Typography.md,
    fontWeight: '600',
    color: Palette.white,
  },
});
