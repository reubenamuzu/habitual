import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Palette, Radius, Spacing, Typography } from '@/constants/theme';
import { ThemedText } from '@/components/themed-text';

const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'] as const;
const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;
const ALL_DAYS = [0, 1, 2, 3, 4, 5, 6];
const WEEKDAYS = [1, 2, 3, 4, 5];
const WEEKENDS = [0, 6];

type Preset = 'daily' | 'weekdays' | 'weekends' | 'custom';

function detectPreset(days: number[]): Preset {
  const sorted = [...days].sort((a, b) => a - b);
  if (sorted.join(',') === ALL_DAYS.join(',')) return 'daily';
  if (sorted.join(',') === WEEKDAYS.join(',')) return 'weekdays';
  if (sorted.join(',') === WEEKENDS.join(',')) return 'weekends';
  return 'custom';
}

interface SchedulePickerProps {
  scheduleDays: number[];
  onChange: (days: number[]) => void;
}

export function SchedulePicker({ scheduleDays, onChange }: SchedulePickerProps) {
  const preset = detectPreset(scheduleDays);

  const applyPreset = (p: Preset) => {
    if (p === 'daily') onChange(ALL_DAYS);
    else if (p === 'weekdays') onChange(WEEKDAYS);
    else if (p === 'weekends') onChange(WEEKENDS);
    // 'custom' — user toggles days directly
  };

  const toggleDay = (day: number) => {
    const next = scheduleDays.includes(day)
      ? scheduleDays.filter((d) => d !== day)
      : [...scheduleDays, day].sort((a, b) => a - b);
    // Must keep at least 1 day
    if (next.length === 0) return;
    onChange(next);
  };

  return (
    <View style={styles.container}>
      {/* Preset chips */}
      <View style={styles.presets}>
        {(['daily', 'weekdays', 'weekends', 'custom'] as Preset[]).map((p) => (
          <TouchableOpacity
            key={p}
            style={[styles.preset, preset === p && styles.presetActive]}
            onPress={() => applyPreset(p)}
            accessibilityRole="button"
            accessibilityLabel={`Schedule: ${p}`}
            accessibilityState={{ selected: preset === p }}
          >
            <ThemedText style={[styles.presetText, preset === p && styles.presetTextActive]}>
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </View>

      {/* Day toggles */}
      <View style={styles.days}>
        {DAYS.map((label, day) => {
          const active = scheduleDays.includes(day);
          return (
            <TouchableOpacity
              key={day}
              style={[styles.day, active && styles.dayActive]}
              onPress={() => toggleDay(day)}
              accessibilityRole="checkbox"
              accessibilityLabel={DAY_LABELS[day]}
              accessibilityState={{ checked: active }}
            >
              <ThemedText style={[styles.dayText, active && styles.dayTextActive]}>
                {label}
              </ThemedText>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const DAY_SIZE = 36;

const styles = StyleSheet.create({
  container: {
    gap: Spacing.md,
  },
  presets: {
    flexDirection: 'row',
    gap: Spacing.xs,
    flexWrap: 'wrap',
  },
  preset: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Palette.border,
    minHeight: 32,
    justifyContent: 'center',
  },
  presetActive: {
    backgroundColor: Palette.accent,
    borderColor: Palette.accent,
  },
  presetText: {
    fontSize: Typography.sm,
    color: Palette.inkSecondary,
    fontWeight: '500',
  },
  presetTextActive: {
    color: Palette.white,
    fontWeight: '600',
  },
  days: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  day: {
    width: DAY_SIZE,
    height: DAY_SIZE,
    borderRadius: DAY_SIZE / 2,
    borderWidth: 1.5,
    borderColor: Palette.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Palette.surface,
  },
  dayActive: {
    backgroundColor: Palette.accent,
    borderColor: Palette.accent,
  },
  dayText: {
    fontSize: Typography.sm,
    fontWeight: '600',
    color: Palette.inkTertiary,
  },
  dayTextActive: {
    color: Palette.white,
  },
});
