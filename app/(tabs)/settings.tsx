import Constants from 'expo-constants';
import { useState } from 'react';
import {
  ImageBackground,
  Platform,
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
} from '../../assets/icons';
import { AppText } from '../../components/AppText';
import {
  usePreferences,
  type DefaultDayView,
  type FontSizePref,
  type ThemePref,
} from '../../lib/preferences';
import { colors, radius, spacing, styles as themeStyles, typography } from '../../styles/theme';

const cardSource = Platform.OS === 'web'
  ? require('../../assets/cards/card-w4-papyrus@web.png')
  : require('../../assets/cards/card-w4-papyrus.png');

const THEME_OPTIONS: { value: ThemePref; label: string; active: boolean }[] = [
  { value: 'dark', label: 'Dark', active: true },
  { value: 'light', label: 'Light', active: false },
  { value: 'system', label: 'System', active: false },
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
  const { preferences, setPreference } = usePreferences();
  const [langHint, setLangHint] = useState(false);

  return (
    <ImageBackground source={cardSource} style={styles.background} resizeMode="cover">
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* APPEARANCE */}
        <AppText style={styles.sectionHeader}>APPEARANCE</AppText>
        <View style={[themeStyles.card, styles.card]}>
          {/* Theme */}
          <View style={styles.rowStack}>
            <View style={styles.rowHeader}>
              <MoonIcon size={20} color={colors.gold.bronze} />
              <AppText style={styles.rowTitle}>Theme</AppText>
            </View>
            <View style={styles.pillRow}>
              {THEME_OPTIONS.map((opt) => {
                const isSelected = preferences.theme === opt.value;
                return (
                  <TouchableOpacity
                    key={opt.value}
                    style={[
                      styles.pill,
                      isSelected && opt.active && styles.pillActive,
                      !opt.active && styles.pillMuted,
                    ]}
                    onPress={() => setPreference('theme', opt.value)}
                    activeOpacity={0.7}
                  >
                    <AppText
                      style={[
                        styles.pillText,
                        isSelected && opt.active && styles.pillTextActive,
                        !opt.active && styles.pillTextMuted,
                      ]}
                    >
                      {opt.label}
                    </AppText>
                  </TouchableOpacity>
                );
              })}
            </View>
            <AppText style={styles.rowFootnote}>Light and System coming soon.</AppText>
          </View>

          <View style={styles.divider} />

          {/* Font size */}
          <View style={styles.rowStack}>
            <View style={styles.rowHeader}>
              <FontIcon size={20} color={colors.gold.bronze} />
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
              <LanguageIcon size={20} color={colors.gold.bronze} />
              <AppText style={styles.rowTitle}>Language</AppText>
            </View>
            <View style={styles.navRowRight}>
              <AppText style={styles.navRowValue}>English</AppText>
              <ChevronRightIcon size={16} color={colors.text.placeholder} />
            </View>
          </TouchableOpacity>
          {langHint && (
            <AppText style={styles.rowFootnote}>Coming soon.</AppText>
          )}
        </View>

        {/* JOURNALING */}
        <AppText style={styles.sectionHeader}>JOURNALING</AppText>
        <View style={[themeStyles.card, styles.card]}>
          <View style={styles.rowStack}>
            <View style={styles.rowHeader}>
              <HistoryIcon size={20} color={colors.gold.bronze} />
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

const styles = StyleSheet.create({
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
    backgroundColor: 'rgba(19, 16, 9, 0.75)',
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
    backgroundColor: 'rgba(201, 169, 110, 0.15)',
    borderWidth: 0.5,
    borderColor: colors.border.gold,
  },
  pillMuted: {
    opacity: 0.55,
  },
  pillText: {
    ...typography.label,
    color: colors.text.secondary,
  },
  pillTextActive: {
    color: colors.gold.bronze,
    fontWeight: '600',
  },
  pillTextMuted: {
    color: colors.text.placeholder,
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
