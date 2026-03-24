import { useCallback } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
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
  const { moodLogs, refresh: refreshMood } = useMood();
  const { heatmapData, loading, refresh: refreshHeatmap } = useHeatmapData();

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

        {/* Mood chart */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Mood Score</ThemedText>
          <View style={styles.card}>
            <MoodChart logs={moodLogs} />
          </View>
        </View>

        <Divider style={styles.divider} />

        {/* Heatmaps */}
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
});
