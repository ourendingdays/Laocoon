import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { AppText as Text } from '../components/AppText';
import { supabase } from '../lib/supabase';
import { useTheme, type Theme } from '../styles/theme';

export default function UpdatePasswordScreen() {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function handleUpdate() {
    setError(null);
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    const { error: err } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (err) {
      setError(err.message);
      return;
    }
    setDone(true);
    setTimeout(() => router.replace('/(tabs)'), 800);
  }

  return (
    <View style={styles.screen}>
      <View style={styles.card}>
        <Text style={styles.title}>Choose a new password</Text>
        <Text style={styles.subtitle}>
          You landed here from the reset email. Pick a new password below.
        </Text>

        <Text style={styles.label}>New password</Text>
        <TextInput
          style={theme.styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
          autoComplete="new-password"
          placeholder="At least 6 characters"
          placeholderTextColor={theme.colors.text.placeholder}
        />

        <Text style={styles.label}>Confirm</Text>
        <TextInput
          style={theme.styles.input}
          value={confirm}
          onChangeText={setConfirm}
          secureTextEntry
          autoCapitalize="none"
          autoComplete="new-password"
          placeholder="Re-enter the password"
          placeholderTextColor={theme.colors.text.placeholder}
        />

        {error && <Text style={styles.error}>{error}</Text>}
        {done && <Text style={styles.notice}>Password updated. Signing you in…</Text>}

        <TouchableOpacity
          style={[theme.styles.buttonPrimary, (loading || done) && styles.buttonDisabled]}
          onPress={handleUpdate}
          disabled={loading || done}
          activeOpacity={0.7}
        >
          <Text style={styles.primaryLabel}>
            {loading ? 'Updating…' : done ? 'Done' : 'Update password'}
          </Text>
        </TouchableOpacity>
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
  });
}
