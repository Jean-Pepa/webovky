import { Image } from 'expo-image';
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { Icon } from '@/components/ui/icon';
import { MaxContentWidth, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { loadBreeds, searchBreeds, type BreedOption } from '@/lib/breeds-api';

interface BreedPickerModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (breed: BreedOption) => void;
  selectedId?: string;
}

export function BreedPickerModal({ visible, onClose, onSelect, selectedId }: BreedPickerModalProps) {
  const theme = useTheme();
  const [all, setAll] = useState<BreedOption[] | null>(null);
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (visible && all === null) {
      loadBreeds().then(setAll).catch(() => setAll([]));
    }
  }, [visible, all]);

  const results = useMemo(() => (all ? searchBreeds(all, query) : []), [all, query]);

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose} presentationStyle="pageSheet">
      <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]} edges={['top']}>
        <View style={styles.inner}>
          <View style={styles.header}>
            <ThemedText weight="black" size={22}>
              Vyber plemeno
            </ThemedText>
            <Pressable onPress={onClose} hitSlop={10}>
              <Icon name="close" size={28} color={theme.text} />
            </Pressable>
          </View>

          <View style={[styles.searchBox, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
            <Icon name="search" size={18} color={theme.textSecondary} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Hledat ze všech plemen…"
              placeholderTextColor={theme.textSecondary}
              style={[styles.input, { color: theme.text }]}
              autoFocus
            />
            {query ? (
              <Pressable onPress={() => setQuery('')} hitSlop={8}>
                <Icon name="close-circle" size={18} color={theme.textSecondary} />
              </Pressable>
            ) : null}
          </View>

          {all === null ? (
            <View style={styles.center}>
              <ActivityIndicator color={theme.tint} />
              <ThemedText themeColor="textSecondary" style={styles.centerText}>
                Načítám plemena…
              </ThemedText>
            </View>
          ) : (
            <FlatList
              data={results}
              keyExtractor={(b) => b.id}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={styles.list}
              ItemSeparatorComponent={() => <View style={styles.sep} />}
              renderItem={({ item }) => {
                const selected = item.id === selectedId;
                return (
                  <Pressable
                    onPress={() => {
                      onSelect(item);
                      onClose();
                    }}
                    style={[
                      styles.row,
                      { backgroundColor: theme.card, borderColor: selected ? theme.tint : theme.border },
                    ]}>
                    {item.photoUrl ? (
                      <Image source={{ uri: item.photoUrl }} style={styles.photo} contentFit="cover" transition={150} />
                    ) : (
                      <View style={[styles.photo, styles.photoPh, { backgroundColor: theme.tintSoft }]}>
                        <ThemedText size={24}>🐶</ThemedText>
                      </View>
                    )}
                    <View style={styles.rowBody}>
                      <ThemedText weight="extrabold" size={16}>
                        {item.name}
                      </ThemedText>
                      <ThemedText themeColor="textSecondary" size={13}>
                        {item.group}
                      </ThemedText>
                    </View>
                    {selected ? <Icon name="checkmark-circle" size={24} color={theme.tint} /> : null}
                  </Pressable>
                );
              }}
              ListEmptyComponent={
                <View style={styles.center}>
                  <ThemedText themeColor="textSecondary">Nic nenalezeno — zkus jiný název.</ThemedText>
                </View>
              }
            />
          )}
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  inner: { flex: 1, width: '100%', maxWidth: MaxContentWidth, alignSelf: 'center' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    marginHorizontal: Spacing.three,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.pill,
    borderWidth: 1.5,
  },
  input: { flex: 1, paddingVertical: 12, fontSize: 16, fontFamily: 'Nunito_600SemiBold' },
  center: { alignItems: 'center', justifyContent: 'center', paddingTop: Spacing.six },
  centerText: { marginTop: Spacing.two },
  list: { padding: Spacing.three, gap: Spacing.two },
  sep: { height: Spacing.two },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    padding: Spacing.two,
    borderRadius: Radius.lg,
    borderWidth: 1.5,
  },
  photo: { width: 56, height: 56, borderRadius: Radius.md },
  photoPh: { alignItems: 'center', justifyContent: 'center' },
  rowBody: { flex: 1, gap: 2 },
});
