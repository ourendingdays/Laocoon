import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { supabase } from '../../lib/supabase';
import { PRIVACY_POLICY_VERSION } from '../../lib/legal';
import { colors, spacing, styles as themeStyles, typography } from '../../styles/theme';

export default function SignUpScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  async function handleSignUp() {
    setError(null);
    setNotice(null);

    if (!consent) {
      setError('Please accept the Privacy Policy to continue.');
      return;
    }

    setLoading(true);
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
    });

    if (signUpError) {
      setLoading(false);
      setError(signUpError.message);
      return;
    }

    if (data.user) {
      const { error: profileError } = await supabase.from('user_profiles').insert({
        id: data.user.id,
        consent_given_at: new Date().toISOString(),
        privacy_policy_version: PRIVACY_POLICY_VERSION,
      });
      if (profileError) {
        setLoading(false);
        setError(profileError.message);
        return;
      }
    }

    setLoading(false);

    if (data.session) {
      router.replace('/(tabs)');
    } else {
      setNotice('Check your inbox to confirm your email, then sign in.');
    }
  }

  return (
    <View style={styles.screen}>
      <View style={styles.card}>
        <Text style={styles.title}>Create your account</Text>
        <Text style={styles.subtitle}>A private page for your thoughts.</Text>

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
          autoComplete="new-password"
          placeholder="At least 6 characters"
          placeholderTextColor={colors.text.placeholder}
        />

        <TouchableOpacity
          style={styles.consentRow}
          onPress={() => setConsent(v => !v)}
          activeOpacity={0.7}
        >
          <View style={[styles.checkbox, consent && styles.checkboxChecked]}>
            {consent && <Text style={styles.checkmark}>✓</Text>}
          </View>
          <Text style={styles.consentText}>
            I agree to the{' '}
            <Link href="/(tabs)/about" style={styles.link}>
              Privacy Policy
            </Link>{' '}
            and consent to storing my diary entries.
          </Text>
        </TouchableOpacity>

        {error && <Text style={styles.error}>{error}</Text>}
        {notice && <Text style={styles.notice}>{notice}</Text>}

        <TouchableOpacity
          style={[themeStyles.buttonPrimary, loading && styles.buttonDisabled]}
          onPress={handleSignUp}
          disabled={loading}
          activeOpacity={0.7}
        >
          <Text style={styles.primaryLabel}>{loading ? 'Creating…' : 'Create account'}</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <Link href="/(auth)/sign-in" style={styles.link}>
            Sign in
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
  consentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.border.default,
    backgroundColor: colors.background.charcoal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: colors.gold.bronze,
    borderColor: colors.gold.bronze,
  },
  checkmark: {
    color: colors.text.inverse,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 16,
  },
  consentText: {
    ...typography.bodySmall,
    flex: 1,
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
