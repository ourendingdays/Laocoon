import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { PreferencesProvider } from '../lib/preferences';
import { SessionProvider, useSession } from '../lib/session';
import { useTheme } from '../styles/theme';

function AuthGate({ children }: { children: React.ReactNode }) {
  const theme = useTheme();
  const { session, loading } = useSession();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    const inAuthGroup = segments[0] === '(auth)';
    const isPublicRoute =
      segments[0] === 'privacy' || segments[0] === 'update-password';
    const isPublic = inAuthGroup || isPublicRoute;
    if (!session && !isPublic) {
      router.replace('/(auth)/sign-in');
    } else if (session && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [session, loading, segments, router]);

  if (loading) {
    return (
      <View style={[theme.styles.screen, theme.styles.screenCentered]}>
        <ActivityIndicator color={theme.colors.gold.bronze} />
      </View>
    );
  }

  return <>{children}</>;
}

function RootStack() {
  const theme = useTheme();
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="update-password" />
      <Stack.Screen
        name="settings"
        options={{
          headerShown: true,
          title: 'Settings',
          headerBackTitle: 'Back',
          headerStyle: { backgroundColor: theme.colors.background.pitch },
          headerTintColor: theme.colors.text.primary,
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="about"
        options={{
          headerShown: true,
          title: 'About',
          headerBackTitle: 'Back',
          headerStyle: { backgroundColor: theme.colors.background.pitch },
          headerTintColor: theme.colors.text.primary,
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="privacy"
        options={{
          headerShown: true,
          title: 'Privacy',
          headerBackTitle: 'Back',
          headerStyle: { backgroundColor: theme.colors.background.pitch },
          headerTintColor: theme.colors.text.primary,
          headerShadowVisible: false,
        }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <PreferencesProvider>
      <SessionProvider>
        <AuthGate>
          <RootStack />
        </AuthGate>
      </SessionProvider>
    </PreferencesProvider>
  );
}
