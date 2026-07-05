import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { DailyLogIcon, HistoryIcon, MoodIcon, ShieldIcon } from '../assets/icons';
import { AppText as Text } from '../components/AppText';
import { useTheme, type Theme } from '../styles/theme';

const HERO_GLYPH = require('../assets/app-icons/app-icon-B-flame-scroll-192.png');

type Feature = {
  Icon: (props: { size?: number; color?: string }) => React.ReactElement;
  title: string;
  body: string;
};

const FEATURES: Feature[] = [
  {
    Icon: DailyLogIcon,
    title: 'Daily entries',
    body: 'Capture thoughts, moods, and moments. Every word preserved like ink on papyrus.',
  },
  {
    Icon: HistoryIcon,
    title: 'Calendar view',
    body: 'Navigate your past like an ancient star chart — every day a constellation of memory.',
  },
  {
    Icon: MoodIcon,
    title: 'Mood tracking',
    body: 'Mark the tenor of each day. Over time, patterns emerge from the embers.',
  },
  {
    Icon: ShieldIcon,
    title: 'Private by design',
    body: 'Your words remain yours. Encrypted at rest, protected by row-level security.',
  },
];

export default function WelcomeScreen() {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const router = useRouter();

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Header bar */}
        <View style={styles.headerBar}>
          <Text style={styles.wordmark}>LAOCOON</Text>
        </View>

        {/* Hero */}
        <View style={styles.hero}>
          <Image source={HERO_GLYPH} style={styles.heroGlyph} resizeMode="contain" />

          <Text style={styles.overline}>A personal journal</Text>
          <Text style={styles.h1}>Laocoon</Text>
          <Text style={styles.subtitle}>Write what the gods cannot silence</Text>

          <View style={styles.divider} />

          <Text style={styles.heroBody}>
            A private space for thought, memory, and reflection — built with the weight of ancient stone and the quiet of a lamp at night.
          </Text>

          <View style={styles.ctaGroup}>
            <TouchableOpacity
              style={styles.btnPrimary}
              onPress={() => router.push('/(auth)/sign-up')}
              activeOpacity={0.7}
            >
              <Text style={styles.btnPrimaryLabel}>Get started</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.btnGhost}
              onPress={() => router.push('/(auth)/sign-in')}
              activeOpacity={0.7}
            >
              <Text style={styles.btnGhostLabel}>Sign in</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Feature cards */}
        <View style={styles.cardsGrid}>
          {FEATURES.map(({ Icon, title, body }) => (
            <View key={title} style={styles.featureCard}>
              <View style={styles.cardIconWrap}>
                <Icon size={28} color={theme.colors.gold.bronze} />
              </View>
              <Text style={styles.cardTitle}>{title}</Text>
              <Text style={styles.cardBody}>{body}</Text>
            </View>
          ))}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            LAOCOON · BUILT FOR QUIET REFLECTION
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

function makeStyles({ colors, spacing, radius, typography }: Theme) {
  return StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.background.app,
    },
    scroll: {
      alignItems: 'center',
      paddingBottom: spacing.xxl,
    },
    headerBar: {
      width: '100%',
      maxWidth: 840,
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.xl,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    wordmark: {
      ...typography.overline,
      fontSize: 13,
      letterSpacing: 2.4,
      color: colors.gold.bronze,
    },
    hero: {
      width: '100%',
      maxWidth: 840,
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.xxl + spacing.xxl,
      paddingBottom: spacing.xxl,
      alignItems: 'center',
    },
    heroGlyph: {
      width: 64,
      height: 64,
      marginBottom: spacing.xl,
      opacity: 0.9,
    },
    overline: {
      ...typography.overline,
      color: colors.text.placeholder,
      letterSpacing: 2,
      marginBottom: spacing.lg,
    },
    h1: {
      ...typography.display,
      fontSize: 56,
      letterSpacing: 4,
      lineHeight: 64,
      textAlign: 'center',
      color: colors.text.primary,
      marginBottom: spacing.xs,
    },
    subtitle: {
      ...typography.caption,
      fontSize: 14,
      letterSpacing: 3,
      textTransform: 'uppercase',
      color: colors.gold.bronze,
      textAlign: 'center',
      marginBottom: spacing.xl,
    },
    divider: {
      width: 48,
      height: 0.5,
      backgroundColor: colors.border.default,
      marginBottom: spacing.xl,
    },
    heroBody: {
      ...typography.body,
      color: colors.text.secondary,
      textAlign: 'center',
      maxWidth: 480,
      lineHeight: 28,
      marginBottom: spacing.xl + spacing.md,
    },
    ctaGroup: {
      flexDirection: 'row',
      gap: spacing.sm + 4,
      flexWrap: 'wrap',
      justifyContent: 'center',
    },
    btnPrimary: {
      backgroundColor: colors.gold.bronze,
      borderRadius: radius.md,
      paddingVertical: spacing.sm + 4,
      paddingHorizontal: spacing.lg + spacing.xs,
    },
    btnPrimaryLabel: {
      ...typography.label,
      fontSize: 13,
      letterSpacing: 1.2,
      textTransform: 'uppercase',
      color: colors.text.inverse,
      fontWeight: '500',
    },
    btnGhost: {
      backgroundColor: 'transparent',
      borderWidth: 0.5,
      borderColor: colors.gold.bronze,
      borderRadius: radius.md,
      paddingVertical: spacing.sm + 4,
      paddingHorizontal: spacing.lg + spacing.xs,
    },
    btnGhostLabel: {
      ...typography.label,
      fontSize: 13,
      letterSpacing: 1.2,
      textTransform: 'uppercase',
      color: colors.gold.bronze,
      fontWeight: '500',
    },
    cardsGrid: {
      width: '100%',
      maxWidth: 840,
      paddingHorizontal: spacing.lg,
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.sm + 4,
      justifyContent: 'center',
    },
    featureCard: {
      flexBasis: 220,
      flexGrow: 1,
      maxWidth: 400,
      backgroundColor: colors.background.pitch,
      borderWidth: 0.5,
      borderColor: colors.border.subtle,
      borderRadius: radius.lg,
      padding: spacing.lg,
    },
    cardIconWrap: {
      marginBottom: spacing.md,
      opacity: 0.9,
    },
    cardTitle: {
      ...typography.h3,
      color: colors.text.primary,
      marginBottom: spacing.xs,
    },
    cardBody: {
      ...typography.bodySmall,
      color: colors.text.placeholder,
      lineHeight: 21,
    },
    footer: {
      width: '100%',
      marginTop: spacing.xxl,
      paddingTop: spacing.lg,
      paddingHorizontal: spacing.lg,
      borderTopWidth: 0.5,
      borderTopColor: colors.border.subtle,
      alignItems: 'center',
    },
    footerText: {
      ...typography.overline,
      color: colors.text.placeholder,
      letterSpacing: 1,
    },
  });
}
