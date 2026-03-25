import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, type AppStateStatus } from 'react-native';
import * as authService from '@/lib/auth/local-auth.service';

export interface LocalAuthState {
  isEnabled: boolean;
  isAuthenticated: boolean;
  isChecking: boolean;
  isAvailable: boolean;
  toggleAuth: (enable: boolean) => Promise<void>;
  authenticate: () => Promise<void>;
}

export function useLocalAuth(): LocalAuthState {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [isAvailable, setIsAvailable] = useState(false);
  const appState = useRef<AppStateStatus>(AppState.currentState);

  const runAuth = useCallback(async () => {
    const success = await authService.authenticate();
    if (success) setIsAuthenticated(true);
  }, []);

  useEffect(() => {
    async function init() {
      const [available, enabled] = await Promise.all([
        authService.isAuthAvailable(),
        authService.isAuthEnabled(),
      ]);
      setIsAvailable(available);
      setIsEnabled(enabled);
      if (enabled && available) {
        await runAuth();
      } else {
        setIsAuthenticated(true);
      }
      setIsChecking(false);
    }
    init();
  }, [runAuth]);

  // Re-lock when app comes back to foreground
  useEffect(() => {
    const sub = AppState.addEventListener('change', async (nextState: AppStateStatus) => {
      if (appState.current.match(/inactive|background/) && nextState === 'active') {
        if (isEnabled && isAvailable) {
          setIsAuthenticated(false);
          await runAuth();
        }
      }
      appState.current = nextState;
    });
    return () => sub.remove();
  }, [isEnabled, isAvailable, runAuth]);

  const toggleAuth = useCallback(async (enable: boolean) => {
    if (enable) {
      // Verify once before enabling
      const success = await authService.authenticate();
      if (!success) return;
    }
    await authService.setAuthEnabled(enable);
    setIsEnabled(enable);
  }, []);

  const authenticate = useCallback(async () => {
    await runAuth();
  }, [runAuth]);

  return { isEnabled, isAuthenticated, isChecking, isAvailable, toggleAuth, authenticate };
}
