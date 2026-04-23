import { useRef, useState } from 'react';
import {
  Alert,
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
import { colors, spacing, styles as themeStyles, typography } from '../../styles/theme';

const LINE_HEIGHT = 36;
const LINE_COUNT = 8;

const cardSource = Platform.OS === 'web'
  ? require('../../assets/cards/card-w9-frieze@web.png')
  : require('../../assets/cards/card-w9-frieze.png');

export default function Index() {
  const [text, setText] = useState('');
  const inputRef = useRef<TextInput>(null);

  function handleClear() {
    setText('');
    inputRef.current?.focus();
  }

  function handleSave() {
    if (text.trim()) {
      Alert.alert('Saved', text);
    } else {
      Alert.alert('Nothing to save', 'Write something first.');
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
          <Text style={styles.prompt}>What do you want to write?</Text>

          {/* Lined text area — absolute line Views behind the TextInput */}
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
              onChangeText={setText}
              autoFocus
              textAlignVertical="top"
            />
          </View>

          {/* Buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity style={[themeStyles.buttonGhost, styles.buttonBase]} onPress={handleClear} activeOpacity={0.7}>
              <DeleteIcon size={18} color={colors.text.secondary} />
              <Text style={styles.buttonLabel}>Clear</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[themeStyles.buttonPrimary, styles.buttonBase]} onPress={handleSave} activeOpacity={0.7}>
              <NewEntryIcon size={18} color={colors.background.app} />
              <Text style={[styles.buttonLabel, styles.buttonLabelSave]}>Save</Text>
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
  // Semi-transparent override — themeStyles.card uses opaque background.pitch,
  // but here we need transparency over the ImageBackground.
  cardOverlay: {
    backgroundColor: 'rgba(19, 16, 9, 0.75)',
  },
  prompt: {
    ...typography.h2,
    marginBottom: spacing.lg,
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
  buttonRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  // Extends themeStyles.buttonGhost / buttonPrimary with row layout for icon+label
  buttonBase: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  buttonLabel: {
    ...typography.label,
    color: colors.text.secondary,
  },
  buttonLabelSave: {
    color: colors.background.app,
  },
  preview: {
    ...typography.body,
    color: colors.text.secondary,
    marginTop: spacing.md,
  },
});
