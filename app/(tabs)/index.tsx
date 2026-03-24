import { useCallback } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { Palette, Spacing, Typography } from '@/constants/theme';
import { ThemedText } from '@/components/themed-text';
import { ScreenHeader } from '@/components/shared/screen-header';
import { Divider } from '@/components/shared/divider';
import { HabitList } from '@/components/habits/habit-list';
import { CompletionRing } from '@/components/stats/completion-ring';
import { PressableScale } from '@/components/shared/pressable-scale';
import { useTodayHabits } from '@/hooks/use-today-habits';
import { useMood } from '@/hooks/use-mood';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
}

interface MoodButtonProps {
  timeOfDay: 'morning' | 'evening';
  score?: number;
  onPress: () => void;
}

function MoodButton({ timeOfDay, score, onPress }: MoodButtonProps) {
  const label = timeOfDay === 'morning' ? '☀️ Morning' : '🌙 Evening';
  return (
    <PressableScale style={moodStyles.button} onPress={onPress}>
      <ThemedText style={moodStyles.timeLabel}>{label}</ThemedText>
      {score != null ? (
        <ThemedText style={moodStyles.score}>{score}<ThemedText style={moodStyles.scoreOf}>/10</ThemedText></ThemedText>
      ) : (
        <ThemedText style={moodStyles.tapToLog}>Tap to log →</ThemedText>
      )}
    </PressableScale>
  );
}

const moodStyles = StyleSheet.create({
  button: {
    flex: 1,
    backgroundColor: Palette.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Palette.border,
    padding: Spacing.md,
    gap: Spacing.xs,
  },
  timeLabel: {
    fontSize: Typography.sm,
    color: Palette.inkSecondary,
    fontWeight: '500',
  },
  score: {
    fontSize: Typography.xl,
    fontWeight: '700',
    color: Palette.inkPrimary,
  },
  scoreOf: {
    fontSize: Typography.base,
    fontWeight: '400',
    color: Palette.inkTertiary,
  },
  tapToLog: {
    fontSize: Typography.base,
    color: Palette.inkTertiary,
  },
});

export default function HomeScreen() {
  const router = useRouter();
  const { todayHabits, loading, toggleLog, refresh, completedCount, totalCount } = useTodayHabits();
  const { todayMood, refresh: refreshMood } = useMood();

  useFocusEffect(
    useCallback(() => {
      refresh();
      refreshMood();
    }, [refresh, refreshMood])
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <ScreenHeader
          title={getGreeting()}
          subtitle={formatDate(new Date())}
        />

        {/* Progress ring */}
        {!loading && totalCount > 0 && (
          <View style={styles.ringCard}>
            <CompletionRing completed={completedCount} total={totalCount} size={88} />
            <View style={styles.ringText}>
              <ThemedText style={styles.ringTitle}>
                {completedCount === totalCount
                  ? 'All done! 🎉'
                  : `${totalCount - completedCount} remaining`}
              </ThemedText>
              <ThemedText style={styles.ringSubtitle}>Today's habits</ThemedText>
            </View>
          </View>
        )}

        <Divider style={styles.divider} />

        {/* Habits */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Today's Habits</ThemedText>
          {!loading && <HabitList habits={todayHabits} onToggle={toggleLog} />}
        </View>

        <Divider style={styles.divider} />

        {/* Mood */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Mood</ThemedText>
          <View style={styles.moodRow}>
            <MoodButton
              timeOfDay="morning"
              score={todayMood.morning?.score}
              onPress={() => router.push({ pathname: '/(modals)/log-mood' as any, params: { timeOfDay: 'morning' } })}
            />
            <MoodButton
              timeOfDay="evening"
              score={todayMood.evening?.score}
              onPress={() => router.push({ pathname: '/(modals)/log-mood' as any, params: { timeOfDay: 'evening' } })}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Palette.background,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.xxxl,
  },
  ringCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xl,
    padding: Spacing.lg,
    backgroundColor: Palette.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Palette.border,
    marginBottom: Spacing.base,
  },
  ringText: {
    flex: 1,
    gap: Spacing.xs,
  },
  ringTitle: {
    fontSize: Typography.lg,
    fontWeight: '700',
    color: Palette.inkPrimary,
  },
  ringSubtitle: {
    fontSize: Typography.base,
    color: Palette.inkTertiary,
  },
  divider: {
    marginVertical: Spacing.base,
  },
  section: {
    gap: Spacing.md,
  },
  sectionTitle: {
    fontSize: Typography.xs,
    fontWeight: '600',
    color: Palette.inkTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  moodRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
});
