import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Palette, Typography, Spacing, Radius } from '@/constants/theme';
import { ThemedText } from '@/components/themed-text';
import { IconButton } from './icon-button';

interface ModalSheetProps {
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: React.ReactNode;
}

export function ModalSheet({ title, subtitle, onClose, children }: ModalSheetProps) {
  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        {/* Drag indicator */}
        <View style={styles.dragIndicatorWrapper}>
          <View style={styles.dragIndicator} />
        </View>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerText}>
            <ThemedText style={styles.title}>{title}</ThemedText>
            {subtitle ? <ThemedText style={styles.subtitle}>{subtitle}</ThemedText> : null}
          </View>
          <IconButton name="xmark" onPress={onClose} size={36} backgroundColor={Palette.accentMuted} iconColor={Palette.inkSecondary} />
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Palette.surface,
  },
  flex: {
    flex: 1,
  },
  dragIndicatorWrapper: {
    alignItems: 'center',
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.xs,
  },
  dragIndicator: {
    width: 36,
    height: 4,
    borderRadius: Radius.full,
    backgroundColor: Palette.border,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Palette.border,
  },
  headerText: {
    flex: 1,
    gap: Spacing.xxs,
  },
  title: {
    fontSize: Typography.lg,
    fontWeight: Typography.semibold,
    color: Palette.inkPrimary,
  },
  subtitle: {
    fontSize: Typography.sm,
    color: Palette.inkTertiary,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.base,
    paddingBottom: Spacing.xxxl,
  },
});
