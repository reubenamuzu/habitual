import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemePreference = 'system' | 'light' | 'dark';

const KEY = 'theme_preference';

export async function getThemePreference(): Promise<ThemePreference> {
  try {
    const value = await AsyncStorage.getItem(KEY);
    if (value === 'light' || value === 'dark' || value === 'system') return value;
  } catch {
    // fall through to default
  }
  return 'system';
}

export async function setThemePreference(pref: ThemePreference): Promise<void> {
  await AsyncStorage.setItem(KEY, pref);
}
