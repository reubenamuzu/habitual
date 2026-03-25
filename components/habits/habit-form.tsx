import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { Palette, Radius, Spacing, Typography } from '@/constants/theme';
import { ThemedText } from '@/components/themed-text';
import { PressableScale } from '@/components/shared/pressable-scale';
import { SchedulePicker } from '@/components/shared/schedule-picker';
import { HabitIconPicker } from './habit-icon-picker';

interface HabitFormProps {
  initialName?: string;
  initialIcon?: string;
  initialScheduleType?: 'daily' | 'custom';
  initialScheduleDays?: number[];
  onSubmit: (name: string, icon: string, scheduleType: 'daily' | 'custom', scheduleDays: number[]) => void;
  submitLabel?: string;
  disabled?: boolean;
}

const ALL_DAYS = [0, 1, 2, 3, 4, 5, 6];

export function HabitForm({
  initialName = '',
  initialIcon = 'circle.fill',
  initialScheduleType = 'daily',
  initialScheduleDays = ALL_DAYS,
  onSubmit,
  submitLabel = 'Create Habit',
  disabled = false,
}: HabitFormProps) {
  const [name, setName] = useState(initialName);
  const [icon, setIcon] = useState(initialIcon);
  const [scheduleDays, setScheduleDays] = useState<number[]>(
    initialScheduleType === 'daily' ? ALL_DAYS : initialScheduleDays
  );

  const canSubmit = name.trim().length > 0 && !disabled;

  const handleSubmit = () => {
    if (!canSubmit) return;
    const isDailySchedule = scheduleDays.length === 7 && ALL_DAYS.every((d) => scheduleDays.includes(d));
    onSubmit(name.trim(), icon, isDailySchedule ? 'daily' : 'custom', scheduleDays);
  };

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

      {/* Schedule picker */}
      <View style={styles.field}>
        <ThemedText style={styles.label}>Schedule</ThemedText>
        <SchedulePicker scheduleDays={scheduleDays} onChange={setScheduleDays} />
      </View>

      {/* Submit */}
      <PressableScale
        style={[styles.button, !canSubmit && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={!canSubmit}
        accessibilityRole="button"
        accessibilityLabel={submitLabel}
        accessibilityState={{ disabled: !canSubmit }}
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
