import { StyleSheet, View, type ViewProps } from 'react-native';
import { Palette, Spacing } from '@/constants/theme';

interface DividerProps extends ViewProps {
  indent?: number;
}

export function Divider({ indent = 0, style, ...props }: DividerProps) {
  return (
    <View
      style={[styles.line, { marginLeft: indent }, style]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  line: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Palette.border,
    marginVertical: Spacing.xs,
  },
});
