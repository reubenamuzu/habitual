import { Platform } from 'react-native';

// ─── Brand Colors ─────────────────────────────────────────────────────────────

export const Brand = {
  primary:      '#6366F1', // indigo-500
  primaryDark:  '#4F46E5', // indigo-600
  primaryLight: '#EEF2FF', // indigo-50
  primaryMuted: '#C7D2FE', // indigo-200
} as const;

// ─── Light Palette ────────────────────────────────────────────────────────────

export const Palette = {
  // Backgrounds
  background:   '#F8FAFC',
  surface:      '#FFFFFF',
  surfaceRaised:'#F1F5F9',

  // Text / Ink
  inkPrimary:   '#0F172A',
  inkSecondary: '#475569',
  inkTertiary:  '#94A3B8',
  inkDisabled:  '#CBD5E1',

  // Borders
  border:       '#E2E8F0',
  borderStrong: '#CBD5E1',

  // Brand
  accent:       Brand.primary,
  accentDark:   Brand.primaryDark,
  accentLight:  Brand.primaryLight,
  accentMuted:  Brand.primaryMuted,

  // Heatmap (5 stops — uses brand color)
  heatmap0:     '#EEF2FF',
  heatmap1:     '#C7D2FE',
  heatmap2:     '#818CF8',
  heatmap3:     '#6366F1',
  heatmap4:     '#4338CA',

  // Semantic
  success:      '#22C55E',
  successLight: '#DCFCE7',
  warning:      '#F59E0B',
  warningLight: '#FEF3C7',
  danger:       '#EF4444',
  dangerLight:  '#FEE2E2',

  // Always white
  white:        '#FFFFFF',
  black:        '#000000',
} as const;

// ─── Dark Palette ─────────────────────────────────────────────────────────────

export const DarkPalette = {
  // Backgrounds
  background:   '#0F172A',
  surface:      '#1E293B',
  surfaceRaised:'#334155',

  // Text / Ink
  inkPrimary:   '#F1F5F9',
  inkSecondary: '#94A3B8',
  inkTertiary:  '#475569',
  inkDisabled:  '#334155',

  // Borders
  border:       '#1E293B',
  borderStrong: '#334155',

  // Brand (same in dark)
  accent:       '#818CF8', // slightly lighter indigo for dark bg
  accentDark:   '#6366F1',
  accentLight:  '#1E1B4B',
  accentMuted:  '#312E81',

  // Heatmap
  heatmap0:     '#1E1B4B',
  heatmap1:     '#312E81',
  heatmap2:     '#4338CA',
  heatmap3:     '#6366F1',
  heatmap4:     '#818CF8',

  // Semantic
  success:      '#4ADE80',
  successLight: '#14532D',
  warning:      '#FCD34D',
  warningLight: '#451A03',
  danger:       '#F87171',
  dangerLight:  '#450A0A',

  // Always white
  white:        '#FFFFFF',
  black:        '#000000',
} as const;

// ─── Legacy Colors (kept for @react-navigation/native theme compat) ───────────

export const Colors = {
  light: {
    text:            Palette.inkPrimary,
    background:      Palette.background,
    tint:            Palette.accent,
    icon:            Palette.inkSecondary,
    tabIconDefault:  Palette.inkTertiary,
    tabIconSelected: Palette.accent,
  },
  dark: {
    text:            DarkPalette.inkPrimary,
    background:      DarkPalette.background,
    tint:            DarkPalette.accent,
    icon:            DarkPalette.inkSecondary,
    tabIconDefault:  DarkPalette.inkTertiary,
    tabIconSelected: DarkPalette.accent,
  },
};

// ─── Typography ───────────────────────────────────────────────────────────────

export const Fonts = Platform.select({
  ios: {
    sans:    'Inter_400Regular',
    sansMed: 'Inter_500Medium',
    sansSB:  'Inter_600SemiBold',
    sansBold:'Inter_700Bold',
  },
  default: {
    sans:    'Inter_400Regular',
    sansMed: 'Inter_500Medium',
    sansSB:  'Inter_600SemiBold',
    sansBold:'Inter_700Bold',
  },
});

export const Typography = {
  // Font sizes
  xs:   11,
  sm:   13,
  base: 15,
  md:   17,
  lg:   19,
  xl:   22,
  xxl:  28,
  hero: 36,
  display: 48,

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

// ─── Spacing ──────────────────────────────────────────────────────────────────

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
  huge: 64,
} as const;

// ─── Border Radius ────────────────────────────────────────────────────────────

export const Radius = {
  xs:   4,
  sm:   8,
  md:   12,
  lg:   16,
  xl:   24,
  xxl:  32,
  full: 9999,
} as const;

// ─── Shadows ──────────────────────────────────────────────────────────────────

export const Shadow = {
  sm: {
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  lg: {
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 24,
    elevation: 10,
  },
} as const;

// ─── Gradient Presets ─────────────────────────────────────────────────────────

export const Gradients = {
  primary:   ['#6366F1', '#8B5CF6'] as const,  // indigo → violet
  primaryBg: ['#EEF2FF', '#F5F3FF'] as const,  // soft indigo bg
  dark:      ['#1E293B', '#0F172A'] as const,  // slate dark
  success:   ['#22C55E', '#16A34A'] as const,
  warm:      ['#F59E0B', '#EF4444'] as const,  // warning → danger
} as const;
