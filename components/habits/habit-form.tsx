import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { Palette, Radius, Spacing, Typography } from '@/constants/theme';
import { ThemedText } from '@/components/themed-text';
import { PressableScale } from '@/components/shared/pressable-scale';
import { HabitIconPicker } from './habit-icon-picker';

interface HabitFormProps {
  initialName?: string;
  initialIcon?: string;
  onSubmit: (name: string, icon: string) => void;
  submitLabel?: string;
}

export function HabitForm({ initialName = '', initialIcon = 'circle.fill', onSubmit, submitLabel = 'Create Habit' }: HabitFormProps) {
  const [name, setName] = useState(initialName);
  const [icon, setIcon] = useState(initialIcon);

  const canSubmit = name.trim().length > 0;

  return (
    <View style={styles.container}>
      {/* Name field */}
      <View style={styles.field}>
        <ThemedText style={styles.label}>Habit name</ThemedText>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="e.g. Morning run, Read 20 pages…"
          placeholderTextColor={Palette.inkDisabled}
          autoFocus
          returnKeyType="done"
          maxLength={60}
        />
      </View>

      {/* Icon picker */}
      <View style={styles.field}>
        <ThemedText style={styles.label}>Choose an icon</ThemedText>
        <HabitIconPicker selected={icon} onSelect={setIcon} />
      </View>

      {/* Submit */}
      <PressableScale
        style={[styles.button, !canSubmit && styles.buttonDisabled]}
        onPress={() => canSubmit && onSubmit(name.trim(), icon)}
        disabled={!canSubmit}
      >
        <ThemedText style={styles.buttonText}>{submitLabel}</ThemedText>
      </PressableScale>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.xl,
  },
  field: {
    gap: Spacing.sm,
  },
  label: {
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
    color: Palette.inkSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  input: {
    backgroundColor: Palette.surface,
    borderWidth: 1.5,
    borderColor: Palette.border,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    fontSize: Typography.md,
    color: Palette.inkPrimary,
  },
  button: {
    backgroundColor: Palette.accent,
    borderRadius: Radius.md,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  buttonDisabled: {
    backgroundColor: Palette.inkDisabled,
  },
  buttonText: {
    fontSize: Typography.md,
    fontWeight: Typography.semibold,
    color: Palette.white,
  },
});
