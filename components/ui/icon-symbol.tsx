// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolWeight, SymbolViewProps } from 'expo-symbols';
import { ComponentProps } from 'react';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

type IconMapping = Record<SymbolViewProps['name'], ComponentProps<typeof MaterialIcons>['name']>;
type IconSymbolName = keyof typeof MAPPING;

/**
 * SF Symbols → Material Icons mapping.
 * See: https://icons.expo.fyi
 */
const MAPPING = {
  // Navigation
  'house.fill':                           'home',
  'paperplane.fill':                      'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right':                        'chevron-right',
  'chevron.left':                         'chevron-left',
  'xmark':                                'close',

  // Habits / Actions
  'checkmark.circle.fill':                'check-circle',
  'checkmark.circle':                     'radio-button-unchecked',
  'plus':                                 'add',
  'plus.circle.fill':                     'add-circle',
  'pencil':                               'edit',
  'trash':                                'delete',
  'square.and.pencil':                    'edit-note',
  'arrow.up.arrow.down':                  'swap-vert',

  // Dashboard / Stats
  'chart.bar.fill':                       'bar-chart',
  'flame.fill':                           'local-fire-department',
  'calendar':                             'calendar-today',
  'clock':                                'access-time',
  'star.fill':                            'star',

  // Mood
  'face.smiling':                         'sentiment-satisfied-alt',
  'face.smiling.fill':                    'sentiment-satisfied',
  'sun.max.fill':                         'wb-sunny',
  'moon.fill':                            'nightlight',

  // Profile / Settings
  'person.fill':                          'person',
  'person.circle':                        'account-circle',
  'gearshape.fill':                       'settings',
  'info.circle':                          'info',
  'square.and.arrow.up':                  'ios-share',

  // General UI
  'circle.fill':                          'circle',
  'circle':                               'radio-button-unchecked',
  'sparkles':                             'auto-awesome',
  'leaf.fill':                            'eco',
  'bolt.fill':                            'bolt',
  'book.fill':                            'menu-book',
  'drop.fill':                            'water-drop',
  'figure.walk':                          'directions-walk',
  'bed.double.fill':                      'hotel',
  'fork.knife':                           'restaurant',
  'dumbbell.fill':                        'fitness-center',
  'heart.fill':                           'favorite',
  'brain.head.profile':                   'psychology',
  'music.note':                           'music-note',
  'pencil.and.outline':                   'draw',
} as const satisfies Partial<IconMapping>;

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}

export type { IconSymbolName };
