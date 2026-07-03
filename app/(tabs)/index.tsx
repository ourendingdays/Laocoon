import { useRef, useState } from 'react';
import {
  ImageBackground,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { DeleteIcon, NewEntryIcon } from '../../assets/icons';
import { createEntry } from '../../lib/entries';
import { colors, spacing, styles as themeStyles, typography } from '../../styles/theme';

const LINE_HEIGHT = 36;
const LINE_COUNT = 8;

const cardSource = Platform.OS === 'web'
  ? require('../../assets/cards/card-w9-frieze@web.png')
  : require('../../assets/cards/card-w9-frieze.png');

type SaveState =
  | { kind: 'idle' }
  | { kind: 'saving' }
  | { kind: 'saved' }
  | { kind: 'error'; message: string };

export default function Index() {
  const [text, setText] = useState('');
  const [saveState, setSaveState] = useState<SaveState>({ kind: 'idle' });
  const inputRef = useRef<TextInput>(null);

  function handleClear() {
    setText('');
    setSaveState({ kind: 'idle' });
    inputRef.current?.focus();
  }

  async function handleSave() {
    const content = text.trim();
    if (!content) {
      setSaveState({ kind: 'error', message: 'Write something first.' });
      return;
    }
    setSaveState({ kind: 'saving' });
    try {
      await createEntry({ content });
      setText('');
      setSaveState({ kind: 'saved' });
      inputRef.current?.focus();
    } catch (err) {
      setSaveState({
        kind: 'error',
        message: err instanceof Error ? err.message : 'Could not save.',
      });
    }
  }

  return (
    <ImageBackground
      source={cardSource}
      style={styles.background}
      resizeMode="cover"
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={[themeStyles.card, styles.cardOverlay]}>
          <Text style={styles.prompt}>The scroll is opened ...</Text>

          <View style={styles.linedContainer}>
            {Array.from({ length: LINE_COUNT }).map((_, i) => (
              <View
                key={i}
                style={[styles.line, { top: LINE_HEIGHT * (i + 1) - 1 }]}
              />
            ))}
            <TextInput
              ref={inputRef}
              style={styles.input}
              multiline
              placeholder="Start typing..."
              placeholderTextColor={colors.text.placeholder}
              value={text}
              onChangeText={(next) => {
                setText(next);
                if (saveState.kind !== 'idle') setSaveState({ kind: 'idle' });
              }}
              autoFocus
              textAlignVertical="top"
            />
          </View>

          <View style={styles.status}>
            {saveState.kind === 'saved' && (
              <Text style={styles.statusSaved}>Saved.</Text>
            )}
            {saveState.kind === 'error' && (
              <Text style={styles.statusError}>{saveState.message}</Text>
            )}
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[themeStyles.buttonGhost, styles.buttonBase]}
              onPress={handleClear}
              activeOpacity={0.7}
            >
              <DeleteIcon size={18} color={colors.text.secondary} />
              <Text style={styles.buttonLabel}>Clear</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                themeStyles.buttonPrimary,
                styles.buttonBase,
                saveState.kind === 'saving' && styles.buttonDisabled,
              ]}
              onPress={handleSave}
              disabled={saveState.kind === 'saving'}
              activeOpacity={0.7}
            >
              <NewEntryIcon size={18} color={colors.background.app} />
              <Text style={[styles.buttonLabel, styles.buttonLabelSave]}>
                {saveState.kind === 'saving' ? 'Saving…' : 'Save'}
              </Text>
            </TouchableOpacity>
          </View>
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
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  cardOverlay: {
    backgroundColor: 'rgba(19, 16, 9, 0.75)',
  },
  prompt: {
    ...typography.h2,
    marginBottom: spacing.lg,
    fontStyle: 'italic',
    color: colors.gold.bronze,
  },
  linedContainer: {
    position: 'relative',
    height: LINE_HEIGHT * LINE_COUNT,
  },
  line: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 0.5,
    backgroundColor: colors.border.subtle,
  },
  input: {
    ...typography.body,
    lineHeight: LINE_HEIGHT,
    color: colors.text.primary,
    height: LINE_HEIGHT * LINE_COUNT,
    paddingTop: 0,
    paddingHorizontal: 0,
    backgroundColor: 'transparent',
  },
  status: {
    minHeight: 22,
    marginTop: spacing.sm,
  },
  statusSaved: {
    ...typography.bodySmall,
    color: colors.semantic.success,
  },
  statusError: {
    ...typography.bodySmall,
    color: colors.semantic.error,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  buttonBase: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonLabel: {
    ...typography.label,
    color: colors.text.secondary,
  },
  buttonLabelSave: {
    color: colors.background.app,
  },
});
