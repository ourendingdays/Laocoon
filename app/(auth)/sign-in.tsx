import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { AppText as Text } from '../../components/AppText';
import { supabase } from '../../lib/supabase';
import { colors, spacing, styles as themeStyles, typography } from '../../styles/theme';

export default function SignInScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSignIn() {
    setError(null);
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    router.replace('/(tabs)');
  }

  return (
    <View style={styles.screen}>
      <View style={styles.card}>
        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>Sign in to open the scroll.</Text>

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={themeStyles.input}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          autoComplete="email"
          keyboardType="email-address"
          placeholder="you@example.com"
          placeholderTextColor={colors.text.placeholder}
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={themeStyles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
          autoComplete="current-password"
          placeholder="••••••••"
          placeholderTextColor={colors.text.placeholder}
        />

        {error && <Text style={styles.error}>{error}</Text>}

        <TouchableOpacity
          style={[themeStyles.buttonPrimary, loading && styles.buttonDisabled]}
          onPress={handleSignIn}
          disabled={loading}
          activeOpacity={0.7}
        >
          <Text style={styles.primaryLabel}>{loading ? 'Signing in…' : 'Sign in'}</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>No account yet?</Text>
          <Link href="/(auth)/sign-up" style={styles.link}>
            Create one
          </Link>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    ...themeStyles.screen,
    padding: spacing.lg,
    justifyContent: 'center',
  },
  card: {
    ...themeStyles.card,
    gap: spacing.sm,
  },
  title: {
    ...typography.h1,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.bodySmall,
    marginBottom: spacing.md,
  },
  label: {
    ...typography.overline,
    marginTop: spacing.sm,
  },
  error: {
    ...typography.bodySmall,
    color: colors.semantic.error,
    marginTop: spacing.xs,
  },
  primaryLabel: {
    ...typography.label,
    color: colors.text.inverse,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.xs,
    marginTop: spacing.md,
  },
  footerText: {
    ...typography.bodySmall,
  },
  link: {
    ...typography.bodySmall,
    color: colors.gold.bronze,
    fontWeight: '500',
  },
});
