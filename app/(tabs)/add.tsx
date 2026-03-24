import { View } from 'react-native';
import { Palette } from '@/constants/theme';

// This screen is intentionally empty.
// The center FAB (TabBarAddButton) intercepts presses and opens the add-habit modal.
export default function AddScreen() {
  return <View style={{ flex: 1, backgroundColor: Palette.background }} />;
}
