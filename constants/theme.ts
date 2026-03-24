import { Platform } from 'react-native';

// Legacy Colors kept for backward compat with existing components
export const Colors = {
  light: {
    text: '#111111',
    background: '#F9F9F9',
    tint: '#1A1A1A',
    icon: '#555555',
    tabIconDefault: '#999999',
    tabIconSelected: '#1A1A1A',
  },
  dark: {
    text: '#111111',
    background: '#F9F9F9',
    tint: '#1A1A1A',
    icon: '#555555',
    tabIconDefault: '#999999',
    tabIconSelected: '#1A1A1A',
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

// ─── Design Tokens ────────────────────────────────────────────────────────────

export const Palette = {
  // Backgrounds
  background:   '#F9F9F9',
  surface:      '#FFFFFF',

  // Text / Ink
  inkPrimary:   '#111111',
  inkSecondary: '#555555',
  inkTertiary:  '#999999',
  inkDisabled:  '#C8C8C8',

  // Borders
  border:       '#E5E5E5',
  borderStrong: '#CCCCCC',

  // Accent (single monochrome accent)
  accent:       '#1A1A1A',
  accentMuted:  '#F0F0F0',

  // Heatmap gray scale (5 stops: none → full)
  heatmap0:     '#F0F0F0',
  heatmap1:     '#C8C8C8',
  heatmap2:     '#9A9A9A',
  heatmap3:     '#5A5A5A',
  heatmap4:     '#1A1A1A',

  // Semantic
  danger:       '#C0392B',
  success:      '#2D6A4F',
  white:        '#FFFFFF',
} as const;

export const Typography = {
  // Font sizes
  xs:   10,
  sm:   12,
  base: 14,
  md:   16,
  lg:   18,
  xl:   22,
  xxl:  28,
  hero: 36,

  // Font weights
  regular:  '400' as const,
  medium:   '500' as const,
  semibold: '600' as const,
  bold:     '700' as const,

  // Line height multipliers
  tight:  1.2,
  normal: 1.5,
  loose:  1.8,
} as const;

export const Spacing = {
  xxs:  2,
  xs:   4,
  sm:   8,
  md:   12,
  base: 16,
  lg:   20,
  xl:   24,
  xxl:  32,
  xxxl: 48,
} as const;

export const Radius = {
  xs:   4,
  sm:   8,
  md:   12,
  lg:   16,
  xl:   24,
  full: 9999,
} as const;

export const Shadow = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
  },
} as const;
