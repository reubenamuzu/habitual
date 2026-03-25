import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';

const AUTH_ENABLED_KEY = 'auth_enabled';

export async function isAuthAvailable(): Promise<boolean> {
  const hasHardware = await LocalAuthentication.hasHardwareAsync();
  if (!hasHardware) return false;
  const isEnrolled = await LocalAuthentication.isEnrolledAsync();
  return isEnrolled;
}

export async function authenticate(): Promise<boolean> {
  const result = await LocalAuthentication.authenticateAsync({
    promptMessage: 'Unlock Habit Tracker',
    fallbackLabel: 'Use Passcode',
    cancelLabel: 'Cancel',
    disableDeviceFallback: false,
  });
  return result.success;
}

export async function isAuthEnabled(): Promise<boolean> {
  try {
    const value = await SecureStore.getItemAsync(AUTH_ENABLED_KEY);
    return value === 'true';
  } catch {
    return false;
  }
}

export async function setAuthEnabled(enabled: boolean): Promise<void> {
  await SecureStore.setItemAsync(AUTH_ENABLED_KEY, enabled ? 'true' : 'false');
}
