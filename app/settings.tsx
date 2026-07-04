import Constants from 'expo-constants';
import { useMemo, useState } from 'react';
import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  ChevronRightIcon,
  FontIcon,
  HistoryIcon,
  LanguageIcon,
  MoonIcon,
} from '../assets/icons';
import { AppText } from '../components/AppText';
import {
  usePreferences,
  type DefaultDayView,
  type FontSizePref,
  type ThemePref,
} from '../lib/preferences';
import { getCardOverlayColor, getCardSource, useTheme, type Theme } from '../styles/theme';

const THEME_OPTIONS: { value: ThemePref; label: string }[] = [
  { value: 'dark', label: 'Dark' },
  { value: 'light', label: 'Light' },
  { value: 'system', label: 'System' },
];

const FONT_OPTIONS: { value: FontSizePref; label: string }[] = [
  { value: 'small', label: 'Small' },
  { value: 'default', label: 'Default' },
  { value: 'large', label: 'Large' },
];

const DAY_VIEW_OPTIONS: { value: DefaultDayView; label: string }[] = [
  { value: 'onthisday', label: 'On this day' },
  { value: 'calendar', label: 'Calendar' },
];

const APP_VERSION = Constants.expoConfig?.version ?? '1.0.0';

export default function SettingsScreen() {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const cardSource = getCardSource('papyrus', theme.mode);
  const { preferences, setPreference } = usePreferences();
  const [langHint, setLangHint] = useState(false);

  return (
    <ImageBackground source={cardSource} style={styles.background} resizeMode="cover">
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* APPEARANCE */}
        <AppText style={styles.sectionHeader}>APPEARANCE</AppText>
        <View style={[theme.styles.card, styles.card]}>
          {/* Theme */}
          <View style={styles.rowStack}>
            <View style={styles.rowHeader}>
              <MoonIcon size={20} color={theme.colors.gold.bronze} />
              <AppText style={styles.rowTitle}>Theme</AppText>
            </View>
            <View style={styles.pillRow}>
              {THEME_OPTIONS.map((opt) => {
                const isSelected = preferences.theme === opt.value;
                return (
                  <TouchableOpacity
                    key={opt.value}
                    style={[styles.pill, isSelected && styles.pillActive]}
                    onPress={() => setPreference('theme', opt.value)}
                    activeOpacity={0.7}
                  >
                    <AppText style={[styles.pillText, isSelected && styles.pillTextActive]}>
                      {opt.label}
                    </AppText>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View style={styles.divider} />

          {/* Font size */}
          <View style={styles.rowStack}>
            <View style={styles.rowHeader}>
              <FontIcon size={20} color={theme.colors.gold.bronze} />
              <AppText style={styles.rowTitle}>Font size</AppText>
            </View>
            <View style={styles.pillRow}>
              {FONT_OPTIONS.map((opt) => {
                const isSelected = preferences.fontSize === opt.value;
                return (
                  <TouchableOpacity
                    key={opt.value}
                    style={[styles.pill, isSelected && styles.pillActive]}
                    onPress={() => setPreference('fontSize', opt.value)}
                    activeOpacity={0.7}
                  >
                    <AppText style={[styles.pillText, isSelected && styles.pillTextActive]}>
                      {opt.label}
                    </AppText>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View style={styles.divider} />

          {/* Language (disabled) */}
          <TouchableOpacity
            style={styles.navRow}
            onPress={() => setLangHint(true)}
            activeOpacity={0.7}
          >
            <View style={styles.rowHeader}>
              <LanguageIcon size={20} color={theme.colors.gold.bronze} />
              <AppText style={styles.rowTitle}>Language</AppText>
            </View>
            <View style={styles.navRowRight}>
              <AppText style={styles.navRowValue}>English</AppText>
              <ChevronRightIcon size={16} color={theme.colors.text.placeholder} />
            </View>
          </TouchableOpacity>
          {langHint && (
            <AppText style={styles.rowFootnote}>Coming soon.</AppText>
          )}
        </View>

        {/* JOURNALING */}
        <AppText style={styles.sectionHeader}>JOURNALING</AppText>
        <View style={[theme.styles.card, styles.card]}>
          <View style={styles.rowStack}>
            <View style={styles.rowHeader}>
              <HistoryIcon size={20} color={theme.colors.gold.bronze} />
              <AppText style={styles.rowTitle}>Default day view</AppText>
            </View>
            <View style={styles.pillRow}>
              {DAY_VIEW_OPTIONS.map((opt) => {
                const isSelected = preferences.defaultDayView === opt.value;
                return (
                  <TouchableOpacity
                    key={opt.value}
                    style={[styles.pill, isSelected && styles.pillActive]}
                    onPress={() => setPreference('defaultDayView', opt.value)}
                    activeOpacity={0.7}
                  >
                    <AppText style={[styles.pillText, isSelected && styles.pillTextActive]}>
                      {opt.label}
                    </AppText>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>

        {/* Version footer */}
        <View style={styles.versionRow}>
          <AppText style={styles.versionLabel}>App version</AppText>
          <AppText style={styles.versionValue}>{APP_VERSION}</AppText>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

function makeStyles({ mode, colors, spacing, radius, typography }: Theme) {
  const pillActiveTint = mode === 'light' ? 'rgba(138, 106, 53, 0.12)' : 'rgba(201, 169, 110, 0.15)';
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
    sectionHeader: {
      ...typography.overline,
      color: colors.gold.bronze,
      marginTop: spacing.md,
      marginBottom: spacing.xs,
      marginLeft: spacing.xs,
    },
    card: {
      backgroundColor: getCardOverlayColor(mode),
      gap: spacing.md,
    },
    rowStack: {
      gap: spacing.sm,
    },
    rowHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
    },
    rowTitle: {
      ...typography.body,
      fontWeight: '500',
    },
    rowFootnote: {
      ...typography.caption,
      color: colors.text.placeholder,
      fontStyle: 'italic',
    },
    divider: {
      height: 0.5,
      backgroundColor: colors.border.subtle,
    },
    pillRow: {
      flexDirection: 'row',
      borderWidth: 0.5,
      borderColor: colors.border.default,
      borderRadius: radius.full,
      padding: 3,
      gap: 3,
    },
    pill: {
      flex: 1,
      paddingVertical: spacing.sm,
      alignItems: 'center',
      borderRadius: radius.full,
    },
    pillActive: {
      backgroundColor: pillActiveTint,
      borderWidth: 0.5,
      borderColor: colors.border.gold,
    },
    pillText: {
      ...typography.label,
      color: colors.text.secondary,
    },
    pillTextActive: {
      color: colors.gold.bronze,
      fontWeight: '600',
    },
    navRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: spacing.xs,
    },
    navRowRight: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
    },
    navRowValue: {
      ...typography.body,
      color: colors.text.placeholder,
    },
    versionRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.md,
      marginTop: spacing.md,
      borderTopWidth: 0.5,
      borderTopColor: colors.border.subtle,
    },
    versionLabel: {
      ...typography.bodySmall,
      color: colors.text.placeholder,
    },
    versionValue: {
      ...typography.bodySmall,
      color: colors.text.secondary,
    },
  });
}
