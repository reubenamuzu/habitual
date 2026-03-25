import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import { type ThemePreference, getThemePreference, setThemePreference } from '@/lib/theme-preference';

export interface AppThemeContext {
  colorScheme: 'light' | 'dark';
  preference: ThemePreference;
  setPreference: (pref: ThemePreference) => void;
}

export const ThemeContext = createContext<AppThemeContext>({
  colorScheme: 'light',
  preference: 'system',
  setPreference: () => {},
});

export function useAppTheme(): AppThemeContext {
  return useContext(ThemeContext);
}

export function useAppThemeState(): AppThemeContext {
  const systemScheme = useColorScheme() ?? 'light';
  const [preference, setPreferenceState] = useState<ThemePreference>('system');

  useEffect(() => {
    getThemePreference().then(setPreferenceState);
  }, []);

  const setPreference = useCallback((pref: ThemePreference) => {
    setPreferenceState(pref);
    setThemePreference(pref);
  }, []);

  const colorScheme: 'light' | 'dark' =
    preference === 'system' ? systemScheme : preference;

  return { colorScheme, preference, setPreference };
}
