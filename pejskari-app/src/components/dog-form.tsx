import { Image } from 'expo-image';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { BreedPickerModal } from '@/components/breed-picker';
import { DogAvatar } from '@/components/dog-avatar';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Chip } from '@/components/ui/chip';
import { Icon } from '@/components/ui/icon';
import { Stepper } from '@/components/ui/stepper';
import { Font, Radius, Spacing } from '@/constants/theme';
import { getBreed } from '@/data/breeds';
import { useTheme } from '@/hooks/use-theme';
import { ageInMonths, birthMonthFrom, splitMonths } from '@/lib/format';
import { dogBreedName } from '@/lib/dog';
import type { BreedOption } from '@/lib/breeds-api';
import type { Dog, DogSex } from '@/types';

const AVATARS = ['🐶', '🐕', '🦮', '🐕‍🦺', '🐩', '🐾', '🦴', '🐺'];
const COLORS = ['#FCD34D', '#FDBA74', '#FCA5A5', '#A7F3D0', '#93C5FD', '#C4B5FD', '#F9A8D4', '#86EFAC'];

type DogInput = Omit<Dog, 'id' | 'createdAt'>;

interface DogFormProps {
  initial?: Dog;
  submitLabel: string;
  onSubmit: (data: DogInput) => void;
  onDelete?: () => void;
}

function breedFromDog(dog: Dog): BreedOption {
  const local = getBreed(dog.breedId);
  return {
    id: dog.breedId,
    name: dogBreedName(dog),
    group: local?.group ?? '',
    photoUrl: dog.breedPhotoUrl,
    energy: dog.breedEnergy ?? local?.energy ?? 3,
    trainability: dog.breedTrainability ?? local?.trainability ?? 3,
  };
}

export function DogForm({ initial, submitLabel, onSubmit, onDelete }: DogFormProps) {
  const theme = useTheme();
  const initialAge = initial ? splitMonths(ageInMonths(initial.birthMonth)) : { years: 0, months: 3 };

  const [name, setName] = useState(initial?.name ?? '');
  const [breed, setBreed] = useState<BreedOption | null>(initial ? breedFromDog(initial) : null);
  const [sex, setSex] = useState<DogSex>(initial?.sex ?? 'male');
  const [years, setYears] = useState(initialAge.years);
  const [months, setMonths] = useState(initialAge.months);
  const [weight, setWeight] = useState(initial?.weightKg ? String(initial.weightKg) : '');
  const [avatar, setAvatar] = useState(initial?.avatar ?? AVATARS[0]);
  const [color, setColor] = useState(initial?.color ?? COLORS[0]);
  const [pickerOpen, setPickerOpen] = useState(false);

  const canSubmit = name.trim().length > 0 && breed !== null;

  function handleSubmit() {
    if (!canSubmit || !breed) return;
    const parsedWeight = parseFloat(weight.replace(',', '.'));
    onSubmit({
      name: name.trim(),
      breedId: breed.id,
      breedName: breed.name,
      breedPhotoUrl: breed.photoUrl,
      breedEnergy: breed.energy,
      breedTrainability: breed.trainability,
      sex,
      birthMonth: birthMonthFrom(years, months),
      weightKg: Number.isFinite(parsedWeight) && parsedWeight > 0 ? parsedWeight : undefined,
      avatar,
      color,
    });
  }

  const inputStyle = [
    styles.input,
    { backgroundColor: theme.backgroundElement, borderColor: theme.border, color: theme.text },
  ];

  return (
    <View style={styles.form}>
      <View style={styles.preview}>
        <DogAvatar dog={{ avatar, color }} size={84} />
        <ThemedText weight="extrabold" size={20}>
          {name.trim() || 'Váš pejsek'}
        </ThemedText>
      </View>

      <View style={styles.field}>
        <FieldLabel>Avatar</FieldLabel>
        <View style={styles.wrap}>
          {AVATARS.map((emoji) => (
            <Pressable
              key={emoji}
              onPress={() => setAvatar(emoji)}
              style={[
                styles.emoji,
                {
                  borderColor: avatar === emoji ? theme.tint : theme.border,
                  backgroundColor: avatar === emoji ? theme.tintSoft : theme.backgroundElement,
                },
              ]}>
              <Text style={styles.emojiText}>{emoji}</Text>
            </Pressable>
          ))}
        </View>
        <View style={styles.wrap}>
          {COLORS.map((c) => (
            <Pressable
              key={c}
              onPress={() => setColor(c)}
              style={[styles.swatch, { backgroundColor: c, borderColor: color === c ? theme.text : 'transparent' }]}
            />
          ))}
        </View>
      </View>

      <View style={styles.field}>
        <FieldLabel>Jméno</FieldLabel>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Např. Rex"
          placeholderTextColor={theme.textSecondary}
          style={inputStyle}
          returnKeyType="done"
        />
      </View>

      <View style={styles.field}>
        <FieldLabel>Plemeno</FieldLabel>
        <Pressable
          onPress={() => setPickerOpen(true)}
          style={[styles.breedBtn, { backgroundColor: theme.backgroundElement, borderColor: breed ? theme.tint : theme.border }]}>
          {breed?.photoUrl ? (
            <Image source={{ uri: breed.photoUrl }} style={styles.breedPhoto} contentFit="cover" transition={150} />
          ) : (
            <View style={[styles.breedPhoto, styles.breedPh, { backgroundColor: theme.tintSoft }]}>
              <Icon name="paw" size={22} color={theme.tint} />
            </View>
          )}
          <View style={styles.flex}>
            <ThemedText weight="extrabold" size={16}>
              {breed ? breed.name : 'Vybrat plemeno'}
            </ThemedText>
            <ThemedText themeColor="textSecondary" size={13}>
              {breed ? breed.group || 'Reálná fotka i info' : 'Vyhledej ze všech plemen'}
            </ThemedText>
          </View>
          <Icon name="search" size={20} color={theme.textSecondary} />
        </Pressable>
      </View>

      <View style={styles.field}>
        <FieldLabel>Pohlaví</FieldLabel>
        <View style={styles.wrap}>
          <Chip label="Pes" selected={sex === 'male'} onPress={() => setSex('male')} />
          <Chip label="Fena" selected={sex === 'female'} onPress={() => setSex('female')} />
        </View>
      </View>

      <View style={styles.field}>
        <FieldLabel>Věk</FieldLabel>
        <Stepper label="Roky" value={years} onChange={setYears} min={0} max={25} />
        <Stepper label="Měsíce" value={months} onChange={setMonths} min={0} max={11} />
      </View>

      <View style={styles.field}>
        <FieldLabel>Váha (kg) — nepovinné</FieldLabel>
        <TextInput
          value={weight}
          onChangeText={setWeight}
          placeholder="Např. 12"
          placeholderTextColor={theme.textSecondary}
          keyboardType="numeric"
          style={inputStyle}
        />
      </View>

      <Button title={submitLabel} icon="paw" onPress={handleSubmit} disabled={!canSubmit} />
      {onDelete ? (
        <Button title="Odebrat pejska" variant="danger" icon="trash-outline" onPress={onDelete} />
      ) : null}

      <BreedPickerModal
        visible={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={setBreed}
        selectedId={breed?.id}
      />
    </View>
  );
}

function FieldLabel({ children }: { children: string }) {
  return (
    <ThemedText weight="extrabold" themeColor="textSecondary" style={styles.fieldLabel}>
      {children.toUpperCase()}
    </ThemedText>
  );
}

const styles = StyleSheet.create({
  form: { gap: Spacing.four },
  preview: { alignItems: 'center', gap: Spacing.two },
  flex: { flex: 1 },
  field: { gap: Spacing.two },
  fieldLabel: { fontSize: 12, letterSpacing: 0.6 },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  input: {
    borderWidth: 1.5,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.three,
    paddingVertical: 13,
    fontSize: 16,
    fontFamily: Font.medium,
  },
  breedBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    padding: Spacing.two,
    borderWidth: 1.5,
    borderRadius: Radius.lg,
  },
  breedPhoto: { width: 52, height: 52, borderRadius: Radius.md },
  breedPh: { alignItems: 'center', justifyContent: 'center' },
  emoji: {
    width: 48,
    height: 48,
    borderRadius: Radius.md,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emojiText: { fontSize: 24 },
  swatch: { width: 36, height: 36, borderRadius: Radius.pill, borderWidth: 3 },
});
