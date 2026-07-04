import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import {
  ImageBackground,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  AboutIcon,
  ChevronRightIcon,
  DeleteIcon,
  ExportIcon,
  SettingsIcon,
  ShieldIcon,
} from '../../assets/icons';
import { AppText as Text } from '../../components/AppText';
import { listEntries, type Entry } from '../../lib/entries';
import { useSession } from '../../lib/session';
import { supabase } from '../../lib/supabase';
import { getCardOverlayColor, getCardSource, useTheme, type Theme } from '../../styles/theme';

function downloadWebFile(filename: string, contents: string) {
  const blob = new Blob([contents], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function initialsFromEmail(email: string | undefined): string {
  if (!email) return '—';
  const local = (email.split('@')[0] ?? '').toLowerCase();

  const parts = local
    .split(/[._\-+]+/)
    .map((p) => p.replace(/[^a-z]/g, ''))
    .filter(Boolean);

  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }

  if (parts.length === 1) {
    const p = parts[0];
    if (p.length >= 6) {
      const mid = (p.length - 1) >> 1;
      return (p[0] + p[mid]).toUpperCase();
    }
    return p[0].toUpperCase();
  }

  return email[0]?.toUpperCase() ?? '—';
}

function writingSince(createdAt: string | undefined): string | null {
  if (!createdAt) return null;
  const d = new Date(createdAt);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

function uniqueDayCount(entries: Entry[]): number {
  const set = new Set<string>();
  for (const e of entries) {
    const d = new Date(e.created_at);
    set.add(`${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`);
  }
  return set.size;
}

export default function ProfileScreen() {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const cardSource = getCardSource('starchart', theme.mode);
  const router = useRouter();
  const { user } = useSession();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [busy, setBusy] = useState<null | 'export' | 'delete' | 'signout'>(null);
  const [message, setMessage] = useState<{ kind: 'info' | 'error'; text: string } | null>(null);

  useFocusEffect(
    useCallback(() => {
      listEntries()
        .then(setEntries)
        .catch(() => setEntries([]));
    }, []),
  );

  const totalEntries = entries.length;
  const totalDays = useMemo(() => uniqueDayCount(entries), [entries]);
  const initials = initialsFromEmail(user?.email);
  const since = writingSince(user?.created_at);

  async function handleExport() {
    setBusy('export');
    setMessage(null);
    try {
      const list = await listEntries();
      const payload = JSON.stringify(
        {
          exported_at: new Date().toISOString(),
          user_email: user?.email ?? null,
          entries: list,
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
          text: `Native export not implemented yet. ${list.length} entries ready.`,
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

    if (!user) return;

    setBusy('delete');
    setMessage(null);
    try {
      await supabase
        .from('user_profiles')
        .upsert({ id: user.id, deletion_requested_at: new Date().toISOString() });
      await supabase.from('entries').delete().eq('user_id', user.id);
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
        <Text style={styles.header}>Profile</Text>

        {/* User strip */}
        <View style={styles.userStrip}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <View style={styles.userMeta}>
            <Text style={styles.email} numberOfLines={1}>
              {user?.email ?? '—'}
            </Text>
            {since && <Text style={styles.since}>Writing since {since}</Text>}
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{totalEntries}</Text>
            <Text style={styles.statLabel}>Entries</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{totalDays}</Text>
            <Text style={styles.statLabel}>Days</Text>
          </View>
        </View>

        {/* GENERAL */}
        <Text style={styles.sectionHeader}>GENERAL</Text>
        <View style={styles.card}>
          <TouchableOpacity
            style={styles.navRow}
            onPress={() => router.push('/settings')}
            activeOpacity={0.7}
          >
            <View style={styles.navRowLeft}>
              <SettingsIcon size={20} color={theme.colors.gold.bronze} />
              <Text style={styles.navRowLabel}>Settings</Text>
            </View>
            <ChevronRightIcon size={16} color={theme.colors.text.placeholder} />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.navRow}
            onPress={() => router.push('/about')}
            activeOpacity={0.7}
          >
            <View style={styles.navRowLeft}>
              <AboutIcon size={20} color={theme.colors.gold.bronze} />
              <Text style={styles.navRowLabel}>About Laocoon</Text>
            </View>
            <ChevronRightIcon size={16} color={theme.colors.text.placeholder} />
          </TouchableOpacity>
        </View>

        {/* YOUR DATA */}
        <Text style={styles.sectionHeader}>YOUR DATA</Text>
        <View style={styles.card}>
          <TouchableOpacity
            style={styles.navRow}
            onPress={() => router.push('/privacy')}
            activeOpacity={0.7}
          >
            <View style={styles.navRowLeft}>
              <ShieldIcon size={20} color={theme.colors.gold.bronze} />
              <Text style={styles.navRowLabel}>Privacy Policy</Text>
            </View>
            <ChevronRightIcon size={16} color={theme.colors.text.placeholder} />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.navRow}
            onPress={handleExport}
            disabled={!!busy}
            activeOpacity={0.7}
          >
            <View style={styles.navRowLeft}>
              <ExportIcon size={20} color={theme.colors.gold.bronze} />
              <Text style={styles.navRowLabel}>
                {busy === 'export' ? 'Preparing…' : 'Export my data (JSON)'}
              </Text>
            </View>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.navRow}
            onPress={handleDelete}
            disabled={!!busy}
            activeOpacity={0.7}
          >
            <View style={styles.navRowLeft}>
              <DeleteIcon size={20} color={theme.colors.semantic.error} />
              <Text style={[styles.navRowLabel, styles.danger]}>
                {busy === 'delete' ? 'Deleting…' : 'Delete my account'}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {message && (
          <Text style={message.kind === 'error' ? styles.error : styles.info}>
            {message.text}
          </Text>
        )}

        {/* Sign out */}
        <TouchableOpacity
          style={[theme.styles.buttonPrimary, styles.signOut, busy && styles.disabled]}
          onPress={handleSignOut}
          disabled={!!busy}
          activeOpacity={0.7}
        >
          <Text style={styles.signOutLabel}>
            {busy === 'signout' ? 'Signing out…' : 'Sign out'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </ImageBackground>
  );
}

function makeStyles({ mode, colors, spacing, radius, typography }: Theme) {
  return StyleSheet.create({
    background: {
      flex: 1,
      width: '100%',
      height: '100%',
    },
    scroll: {
      padding: spacing.lg,
      paddingBottom: spacing.xxxl,
      gap: spacing.md,
    },
    header: {
      ...typography.h1,
      marginBottom: spacing.xs,
    },
    userStrip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      paddingVertical: spacing.sm,
    },
    avatar: {
      width: 64,
      height: 64,
      borderRadius: radius.full,
      backgroundColor: mode === 'light' ? colors.gold.ember : colors.background.charcoal,
      borderWidth: 0.5,
      borderColor: colors.border.gold,
      alignItems: 'center',
      justifyContent: 'center',
    },
    avatarText: {
      ...typography.h2,
      color: colors.gold.bronze,
      fontWeight: '600',
      letterSpacing: 1,
    },
    userMeta: {
      flex: 1,
      gap: spacing.xs,
    },
    email: {
      ...typography.body,
      color: colors.text.primary,
    },
    since: {
      ...typography.bodySmall,
      color: colors.text.placeholder,
    },
    statsRow: {
      flexDirection: 'row',
      gap: spacing.sm,
      marginTop: spacing.xs,
    },
    statCard: {
      flex: 1,
      backgroundColor: getCardOverlayColor(mode),
      borderRadius: radius.lg,
      borderWidth: 0.5,
      borderColor: colors.border.subtle,
      paddingVertical: spacing.md,
      alignItems: 'center',
      gap: spacing.xs,
    },
    statNumber: {
      ...typography.h1,
      color: colors.gold.bronze,
      fontSize: 32,
      fontWeight: '500',
    },
    statLabel: {
      ...typography.caption,
      color: colors.text.placeholder,
    },
    sectionHeader: {
      ...typography.overline,
      color: colors.gold.bronze,
      marginTop: spacing.md,
      marginLeft: spacing.xs,
    },
    card: {
      backgroundColor: getCardOverlayColor(mode),
      borderRadius: radius.lg,
      borderWidth: 0.5,
      borderColor: colors.border.subtle,
      paddingHorizontal: spacing.md,
    },
    navRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: spacing.md,
    },
    navRowLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      flex: 1,
    },
    navRowLabel: {
      ...typography.body,
      color: colors.text.primary,
    },
    danger: {
      color: colors.semantic.error,
    },
    divider: {
      height: 0.5,
      backgroundColor: colors.border.subtle,
    },
    signOut: {
      marginTop: spacing.lg,
    },
    signOutLabel: {
      ...typography.label,
      color: colors.text.inverse,
    },
    disabled: {
      opacity: 0.6,
    },
    info: {
      ...typography.bodySmall,
      color: colors.semantic.success,
      marginTop: spacing.sm,
    },
    error: {
      ...typography.bodySmall,
      color: colors.semantic.error,
      marginTop: spacing.sm,
    },
  });
}
