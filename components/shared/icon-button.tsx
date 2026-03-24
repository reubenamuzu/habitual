import { StyleSheet, View } from 'react-native';
import { Palette } from '@/constants/theme';
import { IconSymbol, type IconSymbolName } from '@/components/ui/icon-symbol';
import { PressableScale } from './pressable-scale';

interface IconButtonProps {
  name: IconSymbolName;
  onPress: () => void;
  size?: number;
  backgroundColor?: string;
  iconColor?: string;
}

export function IconButton({
  name,
  onPress,
  size = 40,
  backgroundColor = Palette.accentMuted,
  iconColor = Palette.inkPrimary,
}: IconButtonProps) {
  return (
    <PressableScale onPress={onPress} style={[styles.button, { width: size, height: size, borderRadius: size / 2, backgroundColor }]}>
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
