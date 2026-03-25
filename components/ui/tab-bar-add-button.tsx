import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Palette, Shadow } from '@/constants/theme';
import { PressableScale } from '@/components/shared/pressable-scale';
import * as Haptics from 'expo-haptics';

export function TabBarAddButton() {
  const router = useRouter();

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/(modals)/add-habit' as any);
  };

  return (
    <View style={styles.wrapper}>
      <PressableScale
        style={styles.button}
        onPress={handlePress}
        scaleTo={0.92}
        accessibilityRole="button"
        accessibilityLabel="Add new habit"
      >
        {/* Plus icon drawn with views for crispness */}
        <View style={styles.plusH} />
        <View style={styles.plusV} />
      </PressableScale>
    </View>
  );
}

const BUTTON_SIZE = 52;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 6,
  },
  button: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    backgroundColor: Palette.accent,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.md,
  },
  plusH: {
    position: 'absolute',
    width: 20,
    height: 2.5,
    borderRadius: 2,
    backgroundColor: Palette.white,
  },
  plusV: {
    position: 'absolute',
    width: 2.5,
    height: 20,
    borderRadius: 2,
    backgroundColor: Palette.white,
  },
});
