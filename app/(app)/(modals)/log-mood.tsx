import { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
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
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (saving) return;
    try {
      setSaving(true);
      await upsertMood(timeOfDay, score);
      router.back();
    } catch (e) {
      Alert.alert('Error', e instanceof Error ? e.message : 'Failed to save mood. Please try again.');
    } finally {
      setSaving(false);
    }
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

        <PressableScale
          style={[styles.button, saving && styles.buttonDisabled]}
          onPress={handleSave}
          disabled={saving}
          accessibilityRole="button"
          accessibilityLabel={saving ? 'Saving mood' : 'Save mood'}
        >
          <ThemedText style={styles.buttonText}>{saving ? 'Saving…' : 'Save'}</ThemedText>
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
    minHeight: 44,
    justifyContent: 'center',
  },
  buttonDisabled: {
    backgroundColor: Palette.inkDisabled,
  },
  buttonText: {
    fontSize: Typography.md,
    fontWeight: '600',
    color: Palette.white,
  },
});
