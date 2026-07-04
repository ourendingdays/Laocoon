import { Stack } from 'expo-router';
import { useTheme } from '../../styles/theme';

export default function AuthLayout() {
  const theme = useTheme();
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: theme.colors.background.pitch },
        headerShadowVisible: false,
        headerTintColor: theme.colors.text.primary,
      }}
    >
      <Stack.Screen name="sign-in" options={{ title: 'Sign in' }} />
      <Stack.Screen name="sign-up" options={{ title: 'Create account' }} />
    </Stack>
  );
}
