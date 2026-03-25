import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Palette, Radius, Typography, Spacing } from '@/constants/theme';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol, type IconSymbolName } from '@/components/ui/icon-symbol';

interface EmptyStateProps {
  icon: IconSymbolName;
  title: string;
  body?: string;
  action?: { label: string; onPress: () => void };
}

export function EmptyState({ icon, title, body, action }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconWrapper}>
        <IconSymbol name={icon} size={40} color={Palette.inkDisabled} />
      </View>
      <ThemedText style={styles.title}>{title}</ThemedText>
      {body ? <ThemedText style={styles.body}>{body}</ThemedText> : null}
      {action ? (
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={action.onPress}
          accessibilityRole="button"
          accessibilityLabel={action.label}
        >
          <ThemedText style={styles.actionText}>{action.label}</ThemedText>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxxl,
    gap: Spacing.sm,
  },
  iconWrapper: {
    marginBottom: Spacing.sm,
  },
  title: {
    fontSize: Typography.md,
    fontWeight: Typography.semibold,
    color: Palette.inkSecondary,
    textAlign: 'center',
  },
  body: {
    fontSize: Typography.base,
    color: Palette.inkTertiary,
    textAlign: 'center',
    maxWidth: 240,
    lineHeight: Typography.base * Typography.normal,
  },
  actionBtn: {
    marginTop: Spacing.sm,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.sm,
    backgroundColor: Palette.accent,
    borderRadius: Radius.full,
    minHeight: 40,
    justifyContent: 'center',
  },
  actionText: {
    fontSize: Typography.sm,
    fontWeight: '600',
    color: Palette.white,
  },
});
