import { StyleSheet, View, type ViewProps } from 'react-native';
import { Palette, Typography, Spacing } from '@/constants/theme';
import { ThemedText } from '@/components/themed-text';

interface ScreenHeaderProps extends ViewProps {
  title: string;
  subtitle?: string;
  rightAction?: React.ReactNode;
}

export function ScreenHeader({ title, subtitle, rightAction, style, ...props }: ScreenHeaderProps) {
  return (
    <View style={[styles.container, style]} {...props}>
      <View style={styles.textGroup}>
        <ThemedText style={styles.title}>{title}</ThemedText>
        {subtitle ? <ThemedText style={styles.subtitle}>{subtitle}</ThemedText> : null}
      </View>
      {rightAction ? <View style={styles.rightAction}>{rightAction}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingVertical: Spacing.lg,
  },
  textGroup: {
    flex: 1,
    gap: Spacing.xs,
  },
  title: {
    fontSize: Typography.xxl,
    fontWeight: Typography.bold,
    color: Palette.inkPrimary,
    lineHeight: Typography.xxl * Typography.tight,
  },
  subtitle: {
    fontSize: Typography.base,
    color: Palette.inkTertiary,
    fontWeight: Typography.regular,
  },
  rightAction: {
    paddingLeft: Spacing.md,
  },
});
