import { StyleSheet, View } from 'react-native';
import { Palette, Typography, Spacing, Radius } from '@/constants/theme';
import { ThemedText } from '@/components/themed-text';

type PillVariant = 'default' | 'success' | 'muted' | 'danger';

interface PillBadgeProps {
  label: string;
  variant?: PillVariant;
}

const variantStyles: Record<PillVariant, { bg: string; text: string }> = {
  default:  { bg: Palette.accentMuted,     text: Palette.inkPrimary },
  success:  { bg: '#E8F5E9',               text: Palette.success },
  muted:    { bg: Palette.border,          text: Palette.inkTertiary },
  danger:   { bg: '#FDECEA',               text: Palette.danger },
};

export function PillBadge({ label, variant = 'default' }: PillBadgeProps) {
  const { bg, text } = variantStyles[variant];
  return (
    <View style={[styles.pill, { backgroundColor: bg }]}>
      <ThemedText style={[styles.label, { color: text }]}>{label}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xxs,
    borderRadius: Radius.full,
    alignSelf: 'flex-start',
  },
  label: {
    fontSize: Typography.xs,
    fontWeight: Typography.semibold,
  },
});
