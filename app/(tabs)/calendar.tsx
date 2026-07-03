import { useFocusEffect } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import {
  ImageBackground,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { listEntries, type Entry } from '../../lib/entries';
import { colors, radius, spacing, styles as themeStyles, typography } from '../../styles/theme';

const cardSource = Platform.OS === 'web'
  ? require('../../assets/cards/card-w11-marble@web.png')
  : require('../../assets/cards/card-w11-marble.png');

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function localDateKey(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function toDateStr(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

type DayCell = { day: number; dateStr: string; isOtherMonth: boolean };

function buildCalendarDays(year: number, month: number): DayCell[] {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const cells: DayCell[] = [];

  for (let i = firstDay - 1; i >= 0; i--) {
    const day = daysInPrevMonth - i;
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    cells.push({ day, dateStr: toDateStr(prevYear, prevMonth, day), isOtherMonth: true });
  }

  for (let day = 1; day <= daysInMonth; day++) {
    cells.push({ day, dateStr: toDateStr(year, month, day), isOtherMonth: false });
  }

  const remaining = 42 - cells.length;
  const nextMonth = month === 11 ? 0 : month + 1;
  const nextYear = month === 11 ? year + 1 : year;
  for (let day = 1; day <= remaining; day++) {
    cells.push({ day, dateStr: toDateStr(nextYear, nextMonth, day), isOtherMonth: true });
  }

  return cells;
}

export default function CalendarScreen() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [selectedEntry, setSelectedEntry] = useState<{ dateStr: string; text: string } | null>(null);
  const [pickerVisible, setPickerVisible] = useState(false);
  const [pickerYear, setPickerYear] = useState(now.getFullYear());
  const [entries, setEntries] = useState<Entry[]>([]);

  useFocusEffect(
    useCallback(() => {
      listEntries()
        .then(setEntries)
        .catch(() => setEntries([]));
    }, []),
  );

  const entriesByDate = useMemo(() => {
    const map: Record<string, Entry[]> = {};
    for (const e of entries) {
      const key = localDateKey(e.created_at);
      (map[key] ||= []).push(e);
    }
    return map;
  }, [entries]);

  function previousMonth() {
    if (month === 0) { setYear(y => y - 1); setMonth(11); }
    else setMonth(m => m - 1);
    setSelectedEntry(null);
  }

  function nextMonth() {
    if (month === 11) { setYear(y => y + 1); setMonth(0); }
    else setMonth(m => m + 1);
    setSelectedEntry(null);
  }

  function openPicker() {
    setPickerYear(year);
    setPickerVisible(true);
  }

  function selectMonth(m: number) {
    setYear(pickerYear);
    setMonth(m);
    setSelectedEntry(null);
    setPickerVisible(false);
  }

  const monthLabel = new Date(year, month).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const days = buildCalendarDays(year, month);

  return (
    <ImageBackground source={cardSource} style={styles.background} resizeMode="cover">
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          {/* Month navigation */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.navButton} onPress={previousMonth} activeOpacity={0.7}>
              <Text style={styles.navButtonText}>← Prev</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={openPicker} activeOpacity={0.7} style={styles.monthYearButton}>
              <Text style={styles.monthYear}>{monthLabel}</Text>
              <Text style={styles.monthYearCaret}>▾</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navButton} onPress={nextMonth} activeOpacity={0.7}>
              <Text style={styles.navButtonText}>Next →</Text>
            </TouchableOpacity>
          </View>

          {/* Weekday headers */}
          <View style={styles.weekdayRow}>
            {WEEKDAYS.map(d => (
              <View key={d} style={styles.weekdayCell}>
                <Text style={styles.weekdayText}>{d}</Text>
              </View>
            ))}
          </View>

          {/* Calendar grid */}
          <View style={styles.grid}>
            {days.map(({ day, dateStr, isOtherMonth }) => {
              const dayEntries = entriesByDate[dateStr];
              const hasEntry = !!dayEntries && dayEntries.length > 0;
              return (
                <TouchableOpacity
                  key={dateStr}
                  style={[
                    styles.dayCell,
                    isOtherMonth ? styles.dayCellOther : styles.dayCellCurrent,
                    hasEntry && styles.dayCellEntry,
                  ]}
                  onPress={() => {
                    if (!hasEntry) return;
                    const preview = dayEntries
                      .map((e) => e.content)
                      .join('\n\n— — —\n\n');
                    setSelectedEntry({ dateStr, text: preview });
                  }}
                  activeOpacity={hasEntry ? 0.7 : 1}
                >
                  <Text
                    style={[
                      styles.dayText,
                      isOtherMonth && styles.dayTextOther,
                      hasEntry && styles.dayTextEntry,
                    ]}
                  >
                    {day}
                  </Text>
                  {hasEntry && (
                    <Text style={styles.entryCount}>Notes : {dayEntries.length}</Text>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Entry preview card */}
          {selectedEntry && (
            <View style={[themeStyles.card, styles.entryCard]}>
              <Text style={styles.entryDate}>
                {new Date(selectedEntry.dateStr + 'T00:00:00').toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </Text>
              <Text style={styles.entryText}>{selectedEntry.text}</Text>
            </View>
          )}
        </View>
      </ScrollView>
      {/* Month/Year picker modal */}
      <Modal
        visible={pickerVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setPickerVisible(false)}
      >
        <Pressable style={styles.modalBackdrop} onPress={() => setPickerVisible(false)}>
          <Pressable style={styles.pickerCard} onPress={() => {}}>
            {/* Year selector */}
            <View style={styles.pickerYearRow}>
              <TouchableOpacity
                onPress={() => setPickerYear(y => y - 1)}
                style={styles.pickerArrow}
                activeOpacity={0.7}
              >
                <Text style={styles.pickerArrowText}>‹</Text>
              </TouchableOpacity>
              <Text style={styles.pickerYearText}>{pickerYear}</Text>
              <TouchableOpacity
                onPress={() => setPickerYear(y => y + 1)}
                style={styles.pickerArrow}
                activeOpacity={0.7}
              >
                <Text style={styles.pickerArrowText}>›</Text>
              </TouchableOpacity>
            </View>

            {/* Month grid */}
            <View style={styles.pickerMonthGrid}>
              {['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].map((label, i) => {
                const isSelected = pickerYear === year && i === month;
                return (
                  <TouchableOpacity
                    key={label}
                    style={[styles.pickerMonthCell, isSelected && styles.pickerMonthCellSelected]}
                    onPress={() => selectMonth(i)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.pickerMonthText, isSelected && styles.pickerMonthTextSelected]}>
                      {label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </Pressable>
        </Pressable>
      </Modal>
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
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  container: {
    backgroundColor: 'rgba(19, 16, 9, 0.75)',
    borderRadius: radius.lg,
    borderWidth: 0.5,
    borderColor: colors.border.subtle,
    padding: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  navButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm + 4,
    borderWidth: 0.5,
    borderColor: colors.border.default,
    borderRadius: radius.md,
  },
  navButtonText: {
    ...typography.label,
    color: colors.text.secondary,
  },
  monthYear: {
    ...typography.h2,
    flex: 1,
    textAlign: 'center',
  },
  weekdayRow: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  weekdayCell: {
    width: '14.285714%',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  weekdayText: {
    ...typography.overline,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.md,
  },
  dayCell: {
    width: '14.285714%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 2,
  },
  dayCellOther: {
    opacity: 0.3,
  },
  dayCellCurrent: {
    // default — no extra style needed
  },
  dayCellEntry: {
    backgroundColor: 'rgba(201, 169, 110, 0.15)',
    borderWidth: 0.5,
    borderColor: colors.border.gold,
    borderRadius: radius.sm,
    opacity: 1,
  },
  dayText: {
    ...typography.bodySmall,
    color: colors.text.secondary,
    lineHeight: undefined,
  },
  dayTextOther: {
    color: colors.text.placeholder,
  },
  dayTextEntry: {
    color: colors.text.primary,
    fontWeight: '600',
  },
  entryCount: {
    position: 'absolute',
    top: 2,
    right: 4,
    ...typography.caption,
    color: colors.gold.bronze,
    fontSize: 15,
    fontWeight: '600',
  },
  entryCard: {
    backgroundColor: 'rgba(28, 23, 16, 0.9)',
    marginTop: spacing.sm,
  },
  entryDate: {
    ...typography.caption,
    marginBottom: spacing.sm,
  },
  entryText: {
    ...typography.body,
  },
  monthYearButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  monthYearCaret: {
    ...typography.label,
    color: colors.text.placeholder,
  },
  // Modal / picker
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  pickerCard: {
    backgroundColor: colors.background.charcoal,
    borderRadius: radius.lg,
    borderWidth: 0.5,
    borderColor: colors.border.default,
    padding: spacing.md,
    width: '100%',
    maxWidth: 320,
  },
  pickerYearRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  pickerArrow: {
    padding: spacing.sm,
  },
  pickerArrowText: {
    fontSize: 24,
    color: colors.text.secondary,
    lineHeight: 28,
  },
  pickerYearText: {
    ...typography.h1,
  },
  pickerMonthGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  pickerMonthCell: {
    width: '25%',
    paddingVertical: spacing.sm + 2,
    alignItems: 'center',
    borderRadius: radius.sm,
  },
  pickerMonthCellSelected: {
    backgroundColor: colors.gold.bronze,
  },
  pickerMonthText: {
    ...typography.label,
    color: colors.text.secondary,
  },
  pickerMonthTextSelected: {
    color: colors.background.app,
  },
});
