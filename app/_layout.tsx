import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { PreferencesProvider } from '../lib/preferences';
import { SessionProvider, useSession } from '../lib/session';
import { colors, styles as themeStyles } from '../styles/theme';

function AuthGate({ children }: { children: React.ReactNode }) {
  const { session, loading } = useSession();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    const inAuthGroup = segments[0] === '(auth)';
    if (!session && !inAuthGroup) {
      router.replace('/(auth)/sign-in');
    } else if (session && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [session, loading, segments, router]);

  if (loading) {
    return (
      <View style={[themeStyles.screen, themeStyles.screenCentered]}>
        <ActivityIndicator color={colors.gold.bronze} />
      </View>
    );
  }

  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <PreferencesProvider>
      <SessionProvider>
        <AuthGate>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="(auth)" />
          </Stack>
        </AuthGate>
      </SessionProvider>
    </PreferencesProvider>
  );
}
