import { View, type ViewProps } from 'react-native';
import { Palette, DarkPalette } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';

export type ThemedViewProps = ViewProps & {
  backgroundColor?: string;
};

export function ThemedView({ style, backgroundColor, ...otherProps }: ThemedViewProps) {
  const { colorScheme } = useAppTheme();
  const palette = colorScheme === 'dark' ? DarkPalette : Palette;

  return (
    <View
      style={[{ backgroundColor: backgroundColor ?? palette.background }, style]}
      {...otherProps}
    />
  );
}
