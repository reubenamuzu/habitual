import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Palette, Spacing, Typography } from '@/constants/theme';
import { ThemedText } from '@/components/themed-text';

interface AuthGateProps {
  onAuthenticate: () => void;
}

export function AuthGate({ onAuthenticate }: AuthGateProps) {
  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.content}>
        <ThemedText style={styles.icon}>🔒</ThemedText>
        <ThemedText style={styles.title}>Habit Tracker</ThemedText>
        <ThemedText style={styles.subtitle}>Authenticate to continue</ThemedText>

        <TouchableOpacity
          style={styles.button}
          onPress={onAuthenticate}
          accessibilityRole="button"
          accessibilityLabel="Unlock with Face ID or passcode"
        >
          <ThemedText style={styles.buttonText}>Unlock</ThemedText>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Palette.background,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
    padding: Spacing.xxl,
  },
  icon: {
    fontSize: 64,
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: Typography.xxl,
    fontWeight: Typography.bold,
    color: Palette.inkPrimary,
  },
  subtitle: {
    fontSize: Typography.md,
    color: Palette.inkSecondary,
    marginBottom: Spacing.xl,
  },
  button: {
    backgroundColor: Palette.accent,
    borderRadius: Spacing.xxxl,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xxl,
    minHeight: 44,
    justifyContent: 'center',
  },
  buttonText: {
    color: Palette.white,
    fontSize: Typography.md,
    fontWeight: Typography.semibold,
  },
});
