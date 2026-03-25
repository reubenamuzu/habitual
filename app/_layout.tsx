import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';

import { useAuth } from '@/hooks/use-auth';
import { ThemeContext, useAppThemeState } from '@/hooks/use-app-theme';
import { ErrorBoundary } from '@/components/shared/error-boundary';
import { hasCompletedOnboarding } from './(app)/onboarding';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 2, staleTime: 60_000 },
  },
});

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const [onboardingChecked, setOnboardingChecked] = useState(false);
  const [onboardingDone, setOnboardingDone] = useState(false);

  useEffect(() => {
    hasCompletedOnboarding().then((done) => {
      setOnboardingDone(done);
      setOnboardingChecked(true);
    });
  }, []);

  useEffect(() => {
    if (loading || !onboardingChecked) return;
    const segs = segments as string[];
    const inAuth = segs[0] === '(auth)';
    const inOnboarding = segs[1] === 'onboarding';

    if (!session && !inAuth) {
      router.replace('/(auth)/welcome' as any);
    } else if (session && inAuth) {
      if (!onboardingDone && !inOnboarding) {
        router.replace('/(app)/onboarding' as any);
      } else {
        router.replace('/(app)/(tabs)' as any);
      }
    }
  }, [session, loading, segments, router, onboardingChecked, onboardingDone]);

  if (loading || !onboardingChecked) return null;
  return <>{children}</>;
}

function AppProviders({ children }: { children: React.ReactNode }) {
  const themeState = useAppThemeState();
  const navTheme = themeState.colorScheme === 'dark' ? DarkTheme : DefaultTheme;

  return (
    <ThemeContext.Provider value={themeState}>
      <ThemeProvider value={navTheme}>
        {children}
        <StatusBar style={themeState.colorScheme === 'dark' ? 'light' : 'dark'} />
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  if (!fontsLoaded) return null;

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AppProviders>
          <AuthGuard>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(auth)" />
              <Stack.Screen name="(app)" />
            </Stack>
          </AuthGuard>
        </AppProviders>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
