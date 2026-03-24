import { StyleSheet, View } from 'react-native';
import { Palette, Radius, Shadow, Spacing, Typography } from '@/constants/theme';
import { ThemedText } from '@/components/themed-text';

interface StatCardProps {
  value: string | number;
  label: string;
  unit?: string;
}

export function StatCard({ value, label, unit }: StatCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.valueRow}>
        <ThemedText style={styles.value}>{value}</ThemedText>
        {unit ? <ThemedText style={styles.unit}>{unit}</ThemedText> : null}
      </View>
      <ThemedText style={styles.label}>{label}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: Palette.surface,
    borderRadius: Radius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Palette.border,
    ...Shadow.sm,
    gap: Spacing.xxs,
    alignItems: 'center',
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 2,
  },
  value: {
    fontSize: Typography.xxl,
    fontWeight: '700',
    color: Palette.inkPrimary,
    lineHeight: Typography.xxl * 1.1,
  },
  unit: {
    fontSize: Typography.sm,
    color: Palette.inkTertiary,
    marginBottom: 3,
  },
  label: {
    fontSize: Typography.xs,
    color: Palette.inkTertiary,
    textAlign: 'center',
  },
});
