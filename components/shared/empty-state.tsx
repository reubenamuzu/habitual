import { StyleSheet, View } from 'react-native';
import { Palette, Typography, Spacing } from '@/constants/theme';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol, type IconSymbolName } from '@/components/ui/icon-symbol';

interface EmptyStateProps {
  icon: IconSymbolName;
  title: string;
  body?: string;
}

export function EmptyState({ icon, title, body }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconWrapper}>
        <IconSymbol name={icon} size={40} color={Palette.inkDisabled} />
      </View>
      <ThemedText style={styles.title}>{title}</ThemedText>
      {body ? <ThemedText style={styles.body}>{body}</ThemedText> : null}
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
});
