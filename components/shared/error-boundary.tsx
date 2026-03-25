import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Palette, Spacing, Typography } from '@/constants/theme';
import { ThemedText } from '@/components/themed-text';

interface State {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends React.Component<React.PropsWithChildren, State> {
  state: State = { hasError: false, message: '' };

  static getDerivedStateFromError(error: unknown): State {
    return {
      hasError: true,
      message: error instanceof Error ? error.message : 'An unexpected error occurred',
    };
  }

  handleReset = () => {
    this.setState({ hasError: false, message: '' });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <ThemedText style={styles.emoji}>⚠️</ThemedText>
          <ThemedText style={styles.title}>Something went wrong</ThemedText>
          <ThemedText style={styles.message}>{this.state.message}</ThemedText>
          <TouchableOpacity
            style={styles.button}
            onPress={this.handleReset}
            accessibilityRole="button"
            accessibilityLabel="Try again"
          >
            <ThemedText style={styles.buttonText}>Try Again</ThemedText>
          </TouchableOpacity>
        </View>
      );
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xxl,
    backgroundColor: Palette.background,
    gap: Spacing.md,
  },
  emoji: {
    fontSize: 48,
    marginBottom: Spacing.sm,
  },
  title: {
    fontSize: Typography.lg,
    fontWeight: Typography.semibold,
    color: Palette.inkPrimary,
    textAlign: 'center',
  },
  message: {
    fontSize: Typography.base,
    color: Palette.inkSecondary,
    textAlign: 'center',
    maxWidth: 280,
    lineHeight: Typography.base * Typography.normal,
  },
  button: {
    marginTop: Spacing.md,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.xl,
    backgroundColor: Palette.accent,
    borderRadius: 999,
    minHeight: 44,
    justifyContent: 'center',
  },
  buttonText: {
    color: Palette.white,
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
  },
});
