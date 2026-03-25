import { useCallback } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import { Palette, Spacing, Typography } from '@/constants/theme';
import { ThemedText } from '@/components/themed-text';
import { ScreenHeader } from '@/components/shared/screen-header';
import { Divider } from '@/components/shared/divider';
import { EmptyState } from '@/components/shared/empty-state';
import { MoodChart } from '@/components/mood/mood-chart';
import { HabitHeatmapCard } from '@/components/heatmap/habit-heatmap-card';
import { useMood } from '@/hooks/use-mood';
import { useHeatmapData } from '@/hooks/use-heatmap-data';

export default function DashboardScreen() {
  const { moodLogs, error: moodError, refresh: refreshMood } = useMood();
  const { heatmapData, loading, error: heatmapError, refresh: refreshHeatmap } = useHeatmapData();

  useFocusEffect(
    useCallback(() => {
      refreshMood();
      refreshHeatmap();
    }, [refreshMood, refreshHeatmap])
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <ScreenHeader title="Dashboard" />

        {moodError && (
          <TouchableOpacity style={styles.errorBanner} onPress={refreshMood} accessibilityRole="button" accessibilityLabel="Failed to load mood data. Tap to retry.">
            <ThemedText style={styles.errorText}>⚠️ {moodError} — Tap to retry</ThemedText>
          </TouchableOpacity>
        )}
        {heatmapError && (
          <TouchableOpacity style={styles.errorBanner} onPress={refreshHeatmap} accessibilityRole="button" accessibilityLabel="Failed to load heatmap data. Tap to retry.">
            <ThemedText style={styles.errorText}>⚠️ {heatmapError} — Tap to retry</ThemedText>
          </TouchableOpacity>
        )}

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Mood Score</ThemedText>
          <View style={styles.card}>
            <MoodChart logs={moodLogs} />
          </View>
        </View>

        <Divider style={styles.divider} />

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Habit Consistency</ThemedText>
          {!loading && heatmapData.length === 0 ? (
            <EmptyState
              icon="chart.bar.fill"
              title="No habits yet"
              body="Add habits from the Home tab to see your consistency here."
            />
          ) : (
            heatmapData.map((data) => (
              <HabitHeatmapCard key={data.habit.id} data={data} />
            ))
          )}
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
  card: {
    backgroundColor: Palette.surface,
    borderRadius: 12,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: Palette.border,
  },
  divider: {
    marginVertical: Spacing.base,
  },
  errorBanner: {
    backgroundColor: '#FEF2F2',
    borderRadius: 8,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  errorText: {
    fontSize: Typography.sm,
    color: Palette.danger,
  },
});
