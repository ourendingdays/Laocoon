import { useMemo } from 'react';
import { ImageBackground, ScrollView, StyleSheet, View } from 'react-native';
import { AppText as Text } from '../components/AppText';
import { PRIVACY_POLICY_EFFECTIVE_DATE, PRIVACY_POLICY_VERSION } from '../lib/legal';
import { getCardSource, useTheme, type Theme } from '../styles/theme';

const CONTACT_EMAIL = 'profducky@gmail.com';

function formatEffectiveDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
}

export default function PrivacyScreen() {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const cardSource = getCardSource('cracked', theme.mode);

  return (
    <ImageBackground source={cardSource} style={styles.background} resizeMode="cover">
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.overline}>PRIVACY POLICY</Text>
          <Text style={styles.title}>Your data belongs to you.</Text>
          <Text style={styles.effective}>
            Effective {formatEffectiveDate(PRIVACY_POLICY_EFFECTIVE_DATE)}
          </Text>
        </View>

        <View style={theme.styles.divider} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What we store</Text>
          <Text style={styles.body}>
            When you create an account we store your email address, a hashed password (Supabase never sees your password in plain text), the date you accepted this policy, and its version. When you write an entry we store the title, the content, and its timestamps. Nothing else. We do not track your device, IP address, or usage analytics.
          </Text>
        </View>

        <View style={theme.styles.divider} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Where it lives</Text>
          <Text style={styles.body}>
            Your account and entries live in a Supabase project hosted in the European Union. Data at rest is encrypted by the database. Data in transit is protected by TLS. Your theme, font size, and default view are stored only on your device (browser localStorage or, on mobile, secure app storage) — they never leave your machine.
          </Text>
        </View>

        <View style={theme.styles.divider} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Who can read your entries</Text>
          <Text style={styles.body}>
            You. Only you. Row-level security policies in the database enforce that every read, write, update, and delete against the entries table requires an authenticated session belonging to the row's owner. We do not run analytics on your journal. We do not train models on your journal. We do not sell, share, or license your entries.
          </Text>
        </View>

        <View style={theme.styles.divider} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Exporting your data</Text>
          <Text style={styles.body}>
            Open Profile → Export my data (JSON). You'll receive every entry we hold for you, plus timestamps, in a portable JSON file. There's no waiting period and no need to ask.
          </Text>
        </View>

        <View style={theme.styles.divider} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Deleting your data</Text>
          <Text style={styles.body}>
            Open Profile → Delete my account. This permanently removes every entry we have for you and signs you out. Your authentication record (email address and hashed password) is flagged for deletion and removed within 30 days. Deletion is irreversible — export first if you want a copy.
          </Text>
        </View>

        <View style={theme.styles.divider} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cookies and tracking</Text>
          <Text style={styles.body}>
            On the web, we use browser storage (localStorage) to keep your session and preferences on your device. We do not set analytics cookies, ad cookies, or third-party trackers. There is no cookie banner because there is nothing to consent to beyond the essentials required to keep you signed in.
          </Text>
        </View>

        <View style={theme.styles.divider} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Changes to this policy</Text>
          <Text style={styles.body}>
            If we change this policy in a way that affects how your data is handled, we will require you to accept the new version before continuing to use the app. The version and the date you accepted it are recorded with your account.
          </Text>
        </View>

        <View style={theme.styles.divider} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact</Text>
          <Text style={styles.body}>
            Questions, corrections, or data requests: <Text style={styles.contact}>{CONTACT_EMAIL}</Text>.
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Policy version {PRIVACY_POLICY_VERSION}</Text>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

function makeStyles({ colors, spacing, typography }: Theme) {
  return StyleSheet.create({
    background: {
      flex: 1,
      width: '100%',
      height: '100%',
    },
    scroll: {
      padding: spacing.lg,
      paddingBottom: spacing.xxxl,
    },
    header: {
      paddingBottom: spacing.lg,
      gap: spacing.xs,
    },
    overline: {
      ...typography.overline,
      color: colors.gold.bronze,
      letterSpacing: 4,
    },
    title: {
      ...typography.h1,
      color: colors.text.primary,
      marginTop: spacing.xs,
    },
    effective: {
      ...typography.caption,
      color: colors.text.placeholder,
      marginTop: spacing.xs,
    },
    section: {
      paddingVertical: spacing.lg,
      gap: spacing.sm,
    },
    sectionTitle: {
      ...typography.h2,
      color: colors.gold.bronze,
      marginBottom: spacing.xs,
    },
    body: {
      ...typography.body,
      color: colors.text.secondary,
      lineHeight: 26,
    },
    contact: {
      color: colors.gold.bronze,
      fontWeight: '500',
    },
    footer: {
      marginTop: spacing.lg,
      paddingTop: spacing.lg,
      borderTopWidth: 0.5,
      borderTopColor: colors.border.subtle,
      alignItems: 'center',
    },
    footerText: {
      ...typography.caption,
      color: colors.gold.patina,
      fontStyle: 'italic',
      letterSpacing: 1,
    },
  });
}
