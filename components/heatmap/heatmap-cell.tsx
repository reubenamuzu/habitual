import { StyleSheet, View } from 'react-native';
import { Palette } from '@/constants/theme';

const HEAT_STOPS = [
  Palette.heatmap0,
  Palette.heatmap1,
  Palette.heatmap2,
  Palette.heatmap3,
  Palette.heatmap4,
];

function valueToColor(value: number): string {
  if (value <= 0) return HEAT_STOPS[0];
  if (value >= 1) return HEAT_STOPS[4];
  const idx = Math.min(Math.floor(value * 4), 3);
  return HEAT_STOPS[idx + 1] ?? HEAT_STOPS[4];
}

interface HeatmapCellProps {
  value: number; // 0 = empty, 1 = completed
  size?: number;
}

export function HeatmapCell({ value, size = 12 }: HeatmapCellProps) {
  return (
    <View
      style={[
        styles.cell,
        {
          width: size,
          height: size,
          borderRadius: size * 0.2,
          backgroundColor: valueToColor(value),
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  cell: {
    margin: 1,
  },
});
