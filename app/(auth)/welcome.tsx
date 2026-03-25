import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/themed-text';
import { Gradients, Palette, Radius, Spacing, Typography } from '@/constants/theme';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <LinearGradient colors={Gradients.primary} style={styles.gradient}>
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        {/* Hero */}
        <View style={styles.hero}>
          <ThemedText style={styles.emoji}>✦</ThemedText>
          <ThemedText style={styles.appName}>Habitual</ThemedText>
          <ThemedText style={styles.tagline}>
            Build habits that stick.{'\n'}Track, share, and celebrate progress.
          </ThemedText>
        </View>

        {/* Feature pills */}
        <View style={styles.features}>
          {['📅 Smart scheduling', '👥 Accountability friends', '📊 Deep insights'].map((f) => (
            <View key={f} style={styles.featurePill}>
              <ThemedText style={styles.featureText}>{f}</ThemedText>
            </View>
          ))}
        </View>

        {/* CTAs */}
        <View style={styles.ctas}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => router.push('/(auth)/sign-up' as any)}
            accessibilityRole="button"
            accessibilityLabel="Create account"
          >
            <ThemedText style={styles.primaryButtonText}>Get Started — it's free</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => router.push('/(auth)/sign-in' as any)}
            accessibilityRole="button"
            accessibilityLabel="Sign in to existing account"
          >
            <ThemedText style={styles.secondaryButtonText}>I already have an account</ThemedText>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  safe: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    justifyContent: 'space-between',
    paddingBottom: Spacing.xl,
  },
  hero: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
  },
  emoji: {
    fontSize: 56,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: Spacing.sm,
  },
  appName: {
    fontSize: Typography.display,
    fontWeight: Typography.bold,
    color: Palette.white,
    letterSpacing: -1,
  },
  tagline: {
    fontSize: Typography.md,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    lineHeight: Typography.md * Typography.loose,
    marginTop: Spacing.xs,
  },
  features: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.xxl,
  },
  featurePill: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  featureText: {
    color: Palette.white,
    fontSize: Typography.sm,
    fontWeight: Typography.medium,
  },
  ctas: {
    gap: Spacing.md,
  },
  primaryButton: {
    backgroundColor: Palette.white,
    borderRadius: Radius.xl,
    paddingVertical: Spacing.base,
    alignItems: 'center',
    minHeight: 52,
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: Palette.accent,
    fontSize: Typography.md,
    fontWeight: Typography.bold,
  },
  secondaryButton: {
    borderRadius: Radius.xl,
    paddingVertical: Spacing.base,
    alignItems: 'center',
    minHeight: 52,
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  secondaryButtonText: {
    color: Palette.white,
    fontSize: Typography.base,
    fontWeight: Typography.medium,
  },
});
