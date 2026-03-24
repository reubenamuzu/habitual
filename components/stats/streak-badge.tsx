import { StyleSheet, View } from 'react-native';
import { Palette, Radius, Spacing, Typography } from '@/constants/theme';
import { ThemedText } from '@/components/themed-text';

interface StreakBadgeProps {
  current: number;
  longest?: number;
}

export function StreakBadge({ current, longest }: StreakBadgeProps) {
  return (
    <View style={styles.container}>
      <View style={styles.badge}>
        <ThemedText style={styles.flame}>🔥</ThemedText>
        <ThemedText style={styles.count}>{current}</ThemedText>
      </View>
      {longest != null && longest > 0 && (
        <ThemedText style={styles.best}>Best: {longest}</ThemedText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-end',
    gap: 2,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xxs,
    gap: 2,
  },
  flame: {
    fontSize: Typography.sm,
  },
  count: {
    fontSize: Typography.sm,
    fontWeight: '700',
    color: '#E65100',
  },
  best: {
    fontSize: Typography.xs,
    color: Palette.inkTertiary,
  },
});
