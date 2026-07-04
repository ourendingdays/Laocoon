import { useFocusEffect } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  ImageBackground,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { DeleteIcon, EditIcon } from '../../assets/icons';
import { AppText as Text } from '../../components/AppText';
import { deleteEntry, listEntries, updateEntry, type Entry } from '../../lib/entries';
import { getCardOverlayColor, getCardOverlayColorStrong, getCardSource, useTheme, type Theme } from '../../styles/theme';

export default function JournalScreen() {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const cardSource = getCardSource('embers', theme.mode);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<Entry | null>(null);
  const [draftTitle, setDraftTitle] = useState('');
  const [draftContent, setDraftContent] = useState('');
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const rows = await listEntries();
      setEntries(rows);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load entries.');
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  function openEditor(entry: Entry) {
    setEditing(entry);
    setDraftTitle(entry.title ?? '');
    setDraftContent(entry.content);
  }

  function closeEditor() {
    setEditing(null);
    setDraftTitle('');
    setDraftContent('');
  }

  async function saveEdit() {
    if (!editing) return;
    const content = draftContent.trim();
    if (!content) return;
    const trimmedTitle = draftTitle.trim();
    setSaving(true);
    try {
      const updated = await updateEntry(editing.entry_id, {
        content,
        title: trimmedTitle.length > 0 ? trimmedTitle : null,
      });
      setEntries((prev) => prev.map((e) => (e.entry_id === updated.entry_id ? updated : e)));
      closeEditor();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(entry: Entry) {
    try {
      await deleteEntry(entry.entry_id);
      setEntries((prev) => prev.filter((e) => e.entry_id !== entry.entry_id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete.');
    }
  }

  return (
    <ImageBackground source={cardSource} style={styles.background} resizeMode="cover">
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <Text style={styles.header}>Your journal</Text>

          {loading && (
            <View style={styles.centered}>
              <ActivityIndicator color={theme.colors.gold.bronze} />
            </View>
          )}

          {!loading && error && <Text style={styles.error}>{error}</Text>}

          {!loading && !error && entries.length === 0 && (
            <Text style={styles.empty}>
              Nothing yet. Open the Home tab and write your first entry.
            </Text>
          )}

          {!loading &&
            entries.map((entry) => (
              <View key={entry.entry_id} style={[theme.styles.card, styles.entryCard]}>
                <Text style={styles.entryDate}>
                  {new Date(entry.created_at).toLocaleString(undefined, {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Text>
                {entry.title && <Text style={styles.entryTitle}>{entry.title}</Text>}
                <Text style={styles.entryContent} numberOfLines={6}>
                  {entry.content}
                </Text>
                <View style={styles.actions}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => openEditor(entry)}
                    activeOpacity={0.7}
                  >
                    <EditIcon size={16} color={theme.colors.text.secondary} />
                    <Text style={styles.actionLabel}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleDelete(entry)}
                    activeOpacity={0.7}
                  >
                    <DeleteIcon size={16} color={theme.colors.semantic.error} />
                    <Text style={[styles.actionLabel, { color: theme.colors.semantic.error }]}>
                      Delete
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
        </View>
      </ScrollView>

      <Modal visible={!!editing} transparent animationType="fade" onRequestClose={closeEditor}>
        <Pressable style={styles.modalBackdrop} onPress={closeEditor}>
          <Pressable style={styles.editorCard} onPress={() => {}}>
            <Text style={styles.editorTitle}>Edit entry</Text>
            <TextInput
              style={styles.editorTitleInput}
              value={draftTitle}
              onChangeText={setDraftTitle}
              placeholder="Title (optional)"
              placeholderTextColor={theme.colors.text.placeholder}
            />
            <TextInput
              style={styles.editorInput}
              multiline
              value={draftContent}
              onChangeText={setDraftContent}
              placeholderTextColor={theme.colors.text.placeholder}
            />
            <View style={styles.editorButtons}>
              <TouchableOpacity
                style={[theme.styles.buttonGhost, styles.editorButton]}
                onPress={closeEditor}
                activeOpacity={0.7}
              >
                <Text style={styles.editorButtonGhostLabel}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[theme.styles.buttonPrimary, styles.editorButton, saving && { opacity: 0.6 }]}
                onPress={saveEdit}
                disabled={saving}
                activeOpacity={0.7}
              >
                <Text style={styles.editorButtonPrimaryLabel}>{saving ? 'Saving…' : 'Save'}</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
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
    },
    container: {
      backgroundColor: getCardOverlayColor(mode),
      borderRadius: radius.lg,
      borderWidth: 0.5,
      borderColor: colors.border.subtle,
      padding: spacing.md,
      gap: spacing.md,
    },
    header: {
      ...typography.h1,
      marginBottom: spacing.xs,
    },
    centered: {
      alignItems: 'center',
      paddingVertical: spacing.lg,
    },
    error: {
      ...typography.bodySmall,
      color: colors.semantic.error,
    },
    empty: {
      ...typography.bodySmall,
      fontStyle: 'italic',
    },
    entryCard: {
      backgroundColor: getCardOverlayColorStrong(mode),
      gap: spacing.sm,
    },
    entryDate: {
      ...typography.caption,
    },
    entryTitle: {
      ...typography.h3,
      color: colors.gold.bronze,
    },
    entryContent: {
      ...typography.body,
    },
    actions: {
      flexDirection: 'row',
      gap: spacing.md,
      marginTop: spacing.xs,
    },
    actionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      paddingVertical: spacing.xs,
    },
    actionLabel: {
      ...typography.label,
      color: colors.text.secondary,
    },
    modalBackdrop: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.7)',
      justifyContent: 'center',
      padding: spacing.lg,
    },
    editorCard: {
      backgroundColor: colors.background.charcoal,
      borderRadius: radius.lg,
      borderWidth: 0.5,
      borderColor: colors.border.default,
      padding: spacing.md,
      gap: spacing.sm,
    },
    editorTitle: {
      ...typography.h2,
    },
    editorTitleInput: {
      ...typography.h3,
      backgroundColor: colors.background.pitch,
      borderRadius: radius.md,
      padding: spacing.sm,
      color: colors.text.primary,
    },
    editorInput: {
      ...typography.body,
      minHeight: 180,
      textAlignVertical: 'top',
      backgroundColor: colors.background.pitch,
      borderRadius: radius.md,
      padding: spacing.sm,
      color: colors.text.primary,
    },
    editorButtons: {
      flexDirection: 'row',
      gap: spacing.sm,
      marginTop: spacing.xs,
    },
    editorButton: {
      flex: 1,
    },
    editorButtonGhostLabel: {
      ...typography.label,
      color: colors.text.secondary,
    },
    editorButtonPrimaryLabel: {
      ...typography.label,
      color: colors.text.inverse,
    },
  });
}
