import { Stack } from 'expo-router';
import { colors } from '../../styles/theme';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.background.pitch },
        headerShadowVisible: false,
        headerTintColor: colors.text.primary,
      }}
    >
      <Stack.Screen name="sign-in" options={{ title: 'Sign in' }} />
      <Stack.Screen name="sign-up" options={{ title: 'Create account' }} />
    </Stack>
  );
}
