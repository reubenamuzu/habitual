import { StyleSheet, View } from 'react-native';
import { Palette } from '@/constants/theme';
import { IconSymbol, type IconSymbolName } from '@/components/ui/icon-symbol';
import { PressableScale } from './pressable-scale';

interface IconButtonProps {
  name: IconSymbolName;
  onPress: () => void;
  accessibilityLabel: string;
  size?: number;
  backgroundColor?: string;
  iconColor?: string;
}

export function IconButton({
  name,
  onPress,
  accessibilityLabel,
  size = 40,
  backgroundColor = Palette.accentMuted,
  iconColor = Palette.inkPrimary,
}: IconButtonProps) {
  const buttonSize = Math.max(size, 44);
  return (
    <PressableScale
      onPress={onPress}
      style={[styles.button, { width: buttonSize, height: buttonSize, borderRadius: buttonSize / 2, backgroundColor }]}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
    >
      <View style={styles.inner}>
        <IconSymbol name={name} size={size * 0.5} color={iconColor} />
      </View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  inner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
