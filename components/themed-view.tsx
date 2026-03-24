import { View, type ViewProps } from 'react-native';
import { Palette } from '@/constants/theme';

export type ThemedViewProps = ViewProps & {
  backgroundColor?: string;
};

export function ThemedView({ style, backgroundColor, ...otherProps }: ThemedViewProps) {
  return <View style={[{ backgroundColor: backgroundColor ?? Palette.background }, style]} {...otherProps} />;
}
