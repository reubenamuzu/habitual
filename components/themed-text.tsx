import { StyleSheet, Text, type TextProps } from 'react-native';
import { Palette, Typography } from '@/constants/theme';

export type ThemedTextProps = TextProps & {
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
  color?: string;
};

export function ThemedText({ style, type = 'default', color, ...rest }: ThemedTextProps) {
  return (
    <Text
      style={[
        { color: color ?? Palette.inkPrimary },
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' ? styles.link : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: Typography.md,
    lineHeight: Typography.md * Typography.normal,
  },
  defaultSemiBold: {
    fontSize: Typography.md,
    lineHeight: Typography.md * Typography.normal,
    fontWeight: Typography.semibold,
  },
  title: {
    fontSize: Typography.xxl,
    fontWeight: Typography.bold,
    lineHeight: Typography.xxl * Typography.tight,
  },
  subtitle: {
    fontSize: Typography.xl,
    fontWeight: Typography.semibold,
    lineHeight: Typography.xl * Typography.normal,
  },
  link: {
    fontSize: Typography.md,
    lineHeight: Typography.md * Typography.normal,
    color: Palette.accent,
    textDecorationLine: 'underline',
  },
});
