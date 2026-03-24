import { StyleSheet, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Palette, Typography, Spacing } from '@/constants/theme';
import { ThemedText } from '@/components/themed-text';

interface CompletionRingProps {
  completed: number;
  total: number;
  size?: number;
  strokeWidth?: number;
}

export function CompletionRing({ completed, total, size = 90, strokeWidth = 7 }: CompletionRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = total > 0 ? completed / total : 0;
  const strokeDashoffset = circumference * (1 - progress);

  const percentage = total > 0 ? Math.round(progress * 100) : 0;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
        {/* Background track */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={Palette.border}
          strokeWidth={strokeWidth}
        />
        {/* Progress arc */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={Palette.accent}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
      <View style={styles.labelContainer}>
        <ThemedText style={styles.percentage}>{percentage}%</ThemedText>
        <ThemedText style={styles.sub}>{completed}/{total}</ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelContainer: {
    alignItems: 'center',
    gap: Spacing.xxs,
  },
  percentage: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
    color: Palette.inkPrimary,
  },
  sub: {
    fontSize: Typography.xs,
    color: Palette.inkTertiary,
  },
});
