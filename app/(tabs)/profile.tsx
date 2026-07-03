import { useState } from 'react';
import {
  ImageBackground,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { listEntries } from '../../lib/entries';
import { useSession } from '../../lib/session';
import { supabase } from '../../lib/supabase';
import { colors, radius, spacing, styles as themeStyles, typography } from '../../styles/theme';

const cardSource = Platform.OS === 'web'
  ? require('../../assets/cards/card-w7-starchart@web.png')
  : require('../../assets/cards/card-w7-starchart.png');

function downloadWebFile(filename: string, contents: string) {
  const blob = new Blob([contents], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function ProfileScreen() {
  const { user } = useSession();
  const [busy, setBusy] = useState<null | 'export' | 'delete' | 'signout'>(null);
  const [message, setMessage] = useState<{ kind: 'info' | 'error'; text: string } | null>(null);

  async function handleExport() {
    setBusy('export');
    setMessage(null);
    try {
      const entries = await listEntries();
      const payload = JSON.stringify(
        {
          exported_at: new Date().toISOString(),
          user_email: user?.email ?? null,
          entries,
        },
        null,
        2,
      );
      const filename = `laocoon-export-${new Date().toISOString().slice(0, 10)}.json`;

      if (Platform.OS === 'web') {
        downloadWebFile(filename, payload);
        setMessage({ kind: 'info', text: 'Export downloaded.' });
      } else {
        setMessage({
          kind: 'info',
          text: `Native export not implemented yet. ${entries.length} entries ready.`,
        });
      }
    } catch (err) {
      setMessage({
        kind: 'error',
        text: err instanceof Error ? err.message : 'Export failed.',
      });
    } finally {
      setBusy(null);
    }
  }

  async function handleDelete() {
    const ok =
      Platform.OS === 'web'
        ? window.confirm(
            'Delete your account and all entries? This cannot be undone.',
          )
        : true;
    if (!ok) return;

    setBusy('delete');
    setMessage(null);
    try {
      if (user) {
        await supabase
          .from('user_profiles')
          .upsert({ id: user.id, deletion_requested_at: new Date().toISOString() });
      }
      await supabase.from('entries').delete().neq('entry_id', '00000000-0000-0000-0000-000000000000');
      await supabase.auth.signOut();
      setMessage({
        kind: 'info',
        text: 'Entries wiped and signed out. Contact support to erase your auth record.',
      });
    } catch (err) {
      setMessage({
        kind: 'error',
        text: err instanceof Error ? err.message : 'Delete failed.',
      });
    } finally {
      setBusy(null);
    }
  }

  async function handleSignOut() {
    setBusy('signout');
    await supabase.auth.signOut();
    setBusy(null);
  }

  return (
    <ImageBackground source={cardSource} style={styles.background} resizeMode="cover">
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <Text style={styles.header}>Your profile</Text>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Email</Text>
            <Text style={styles.fieldValue}>{user?.email ?? '—'}</Text>
          </View>

          {message && (
            <Text style={message.kind === 'error' ? styles.error : styles.info}>
              {message.text}
            </Text>
          )}

          <TouchableOpacity
            style={[themeStyles.buttonPrimary, busy && styles.disabled]}
            onPress={handleSignOut}
            disabled={!!busy}
            activeOpacity={0.7}
          >
            <Text style={styles.primaryLabel}>
              {busy === 'signout' ? 'Signing out…' : 'Sign out'}
            </Text>
          </TouchableOpacity>

          <View style={styles.divider} />
          <Text style={styles.sectionTitle}>Your data</Text>

          <TouchableOpacity
            style={[themeStyles.buttonGhost, busy && styles.disabled]}
            onPress={handleExport}
            disabled={!!busy}
            activeOpacity={0.7}
          >
            <Text style={styles.ghostLabel}>
              {busy === 'export' ? 'Preparing…' : 'Export my data (JSON)'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.danger, busy && styles.disabled]}
            onPress={handleDelete}
            disabled={!!busy}
            activeOpacity={0.7}
          >
            <Text style={styles.dangerLabel}>
              {busy === 'delete' ? 'Deleting…' : 'Delete my account'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  scroll: {
    padding: spacing.lg,
    paddingBottom: spacing.xxxl,
  },
  container: {
    backgroundColor: 'rgba(19, 16, 9, 0.75)',
    borderRadius: radius.lg,
    borderWidth: 0.5,
    borderColor: colors.border.subtle,
    padding: spacing.md,
    gap: spacing.md,
  },
  header: {
    ...typography.h1,
  },
  field: {
    gap: spacing.xs,
  },
  fieldLabel: {
    ...typography.overline,
  },
  fieldValue: {
    ...typography.body,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.gold.bronze,
  },
  divider: {
    ...themeStyles.divider,
    marginVertical: spacing.sm,
  },
  primaryLabel: {
    ...typography.label,
    color: colors.text.inverse,
  },
  ghostLabel: {
    ...typography.label,
    color: colors.gold.bronze,
  },
  danger: {
    backgroundColor: 'transparent',
    borderRadius: radius.md,
    borderWidth: 0.5,
    borderColor: colors.semantic.error,
    paddingVertical: spacing.sm + 4,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
  },
  dangerLabel: {
    ...typography.label,
    color: colors.semantic.error,
  },
  disabled: {
    opacity: 0.6,
  },
  info: {
    ...typography.bodySmall,
    color: colors.semantic.success,
  },
  error: {
    ...typography.bodySmall,
    color: colors.semantic.error,
  },
});
