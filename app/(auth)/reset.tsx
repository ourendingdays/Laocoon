import { Link } from 'expo-router';
import { useMemo, useState } from 'react';
import { Platform, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { AppText as Text } from '../../components/AppText';
import { supabase } from '../../lib/supabase';
import { useTheme, type Theme } from '../../styles/theme';

function getRedirectTo(): string | undefined {
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    return `${window.location.origin}/update-password`;
  }
  return undefined;
}

export default function ResetPasswordScreen() {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  async function handleReset() {
    setError(null);
    setLoading(true);
    const { error: err } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: getRedirectTo(),
    });
    setLoading(false);
    if (err) {
      setError(err.message);
      return;
    }
    setSent(true);
  }

  return (
    <View style={styles.screen}>
      <View style={styles.card}>
        <Text style={styles.title}>Reset your password</Text>
        <Text style={styles.subtitle}>
          Enter your email and we'll send you a link to set a new one.
        </Text>

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={theme.styles.input}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          autoComplete="email"
          keyboardType="email-address"
          placeholder="you@example.com"
          placeholderTextColor={theme.colors.text.placeholder}
        />

        {error && <Text style={styles.error}>{error}</Text>}
        {sent && (
          <Text style={styles.notice}>
            Check your inbox. The link will take you back here to choose a new password.
          </Text>
        )}

        <TouchableOpacity
          style={[theme.styles.buttonPrimary, (loading || sent) && styles.buttonDisabled]}
          onPress={handleReset}
          disabled={loading || sent}
          activeOpacity={0.7}
        >
          <Text style={styles.primaryLabel}>
            {loading ? 'Sending…' : sent ? 'Sent' : 'Send reset link'}
          </Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Remembered it?</Text>
          <Link href="/(auth)/sign-in" style={styles.link}>
            Sign in
          </Link>
        </View>
      </View>
    </View>
  );
}

function makeStyles({ colors, spacing, typography, styles: themeStyles }: Theme) {
  return StyleSheet.create({
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
    notice: {
      ...typography.bodySmall,
      color: colors.semantic.success,
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
}
