import { Pressable, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { Palette } from '@/constants/theme';
import * as Haptics from 'expo-haptics';

interface HabitCheckButtonProps {
  completed: boolean;
  onToggle: () => void;
  size?: number;
}

export function HabitCheckButton({ completed, onToggle, size = 28 }: HabitCheckButtonProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    scale.value = withSpring(0.8, { damping: 12, stiffness: 500 }, () => {
      scale.value = withSpring(1, { damping: 12, stiffness: 300 });
    });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onToggle();
  };

  return (
    <Pressable
      onPress={handlePress}
      hitSlop={8}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: completed }}
      accessibilityLabel={completed ? 'Mark as incomplete' : 'Mark as complete'}
    >
      <Animated.View
        style={[
          styles.circle,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: completed ? Palette.accent : 'transparent',
            borderColor: completed ? Palette.accent : Palette.borderStrong,
          },
          animatedStyle,
        ]}
      >
        {completed && (
          <Animated.View style={styles.checkmark} />
        )}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  circle: {
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    width: 10,
    height: 6,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    borderColor: Palette.white,
    transform: [{ rotate: '-45deg' }, { translateY: -1 }],
  },
});
