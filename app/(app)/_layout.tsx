import { Stack } from 'expo-router';

export default function AppLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen
        name="(modals)/add-habit"
        options={{ presentation: 'modal', headerShown: false }}
      />
      <Stack.Screen
        name="(modals)/edit-habit"
        options={{ presentation: 'modal', headerShown: false }}
      />
      <Stack.Screen
        name="(modals)/log-mood"
        options={{ presentation: 'modal', headerShown: false }}
      />
      <Stack.Screen
        name="(modals)/friend-search"
        options={{ presentation: 'modal', headerShown: false }}
      />
      <Stack.Screen
        name="(modals)/friend-profile"
        options={{ presentation: 'modal', headerShown: false }}
      />
    </Stack>
  );
}
