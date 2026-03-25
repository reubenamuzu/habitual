import { useRef, useState } from 'react';
import { Dimensions, FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { Palette, Gradients, Radius, Spacing, Typography } from '@/constants/theme';
import { ThemedText } from '@/components/themed-text';
import { PressableScale } from '@/components/shared/pressable-scale';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const ONBOARDING_KEY = 'onboarding_complete';

const SLIDES = [
  {
    emoji: '🌱',
    title: 'Build Better Habits',
    body: 'Track daily and custom-scheduled habits with a beautiful, distraction-free experience.',
    gradient: Gradients.primary,
  },
  {
    emoji: '📊',
    title: 'See Your Progress',
    body: 'Visualise streaks, heatmaps, and mood trends to stay motivated and understand yourself better.',
    gradient: ['#8B5CF6', '#EC4899'] as const,
  },
  {
    emoji: '👫',
    title: 'Stay Accountable',
    body: "Connect with friends, share your check-ins, and celebrate each other's wins together.",
    gradient: Gradients.success,
  },
] as const;

export async function markOnboardingComplete() {
  await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
}

export async function hasCompletedOnboarding(): Promise<boolean> {
  const val = await AsyncStorage.getItem(ONBOARDING_KEY);
  return val === 'true';
}

export default function OnboardingScreen() {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const listRef = useRef<FlatList>(null);
  const isLast = current === SLIDES.length - 1;

  const goNext = () => {
    if (isLast) {
      handleDone();
    } else {
      const next = current + 1;
      listRef.current?.scrollToIndex({ index: next, animated: true });
      setCurrent(next);
    }
  };

  const handleDone = async () => {
    await markOnboardingComplete();
    router.replace('/(app)/(tabs)' as any);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <FlatList
        ref={listRef}
        data={SLIDES}
        keyExtractor={(_, i) => String(i)}
        horizontal
        pagingEnabled
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          setCurrent(Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH));
        }}
        renderItem={({ item }) => (
          <LinearGradient
            colors={item.gradient as unknown as readonly [string, string]}
            style={styles.slide}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.slideContent}>
              <ThemedText style={styles.emoji}>{item.emoji}</ThemedText>
              <ThemedText style={styles.title}>{item.title}</ThemedText>
              <ThemedText style={styles.body}>{item.body}</ThemedText>
            </View>
          </LinearGradient>
        )}
      />

      {/* Bottom controls */}
      <View style={styles.footer}>
        {/* Dots */}
        <View style={styles.dots}>
          {SLIDES.map((_, i) => (
            <View key={i} style={[styles.dot, i === current && styles.dotActive]} />
          ))}
        </View>

        {/* Next / Get Started */}
        <PressableScale
          style={styles.button}
          onPress={goNext}
          accessibilityRole="button"
          accessibilityLabel={isLast ? 'Get started' : 'Next slide'}
        >
          <ThemedText style={styles.buttonText}>
            {isLast ? 'Get Started' : 'Next'}
          </ThemedText>
        </PressableScale>

        {/* Skip */}
        {!isLast && (
          <TouchableOpacity
            style={styles.skip}
            onPress={handleDone}
            accessibilityRole="button"
            accessibilityLabel="Skip onboarding"
          >
            <ThemedText style={styles.skipText}>Skip</ThemedText>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Palette.background,
  },
  slide: {
    width: SCREEN_WIDTH,
    flex: 1,
  },
  slideContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xxxl,
    gap: Spacing.xl,
  },
  emoji: {
    fontSize: 80,
    lineHeight: 96,
  },
  title: {
    fontSize: Typography.xxl,
    fontWeight: '700',
    color: Palette.white,
    textAlign: 'center',
    lineHeight: Typography.xxl * 1.2,
  },
  body: {
    fontSize: Typography.md,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
    lineHeight: Typography.md * 1.6,
  },
  footer: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xl,
    gap: Spacing.base,
    alignItems: 'center',
  },
  dots: {
    flexDirection: 'row',
    gap: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Palette.border,
  },
  dotActive: {
    width: 24,
    backgroundColor: Palette.accent,
  },
  button: {
    width: '100%',
    backgroundColor: Palette.accent,
    borderRadius: Radius.md,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    minHeight: 52,
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: Typography.md,
    fontWeight: '700',
    color: Palette.white,
  },
  skip: {
    paddingVertical: Spacing.sm,
    minHeight: 44,
    justifyContent: 'center',
  },
  skipText: {
    fontSize: Typography.base,
    color: Palette.inkTertiary,
  },
});
