import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { DogAvatar } from '@/components/dog-avatar';
import { Button } from '@/components/ui/button';
import { Chip } from '@/components/ui/chip';
import { Stepper } from '@/components/ui/stepper';
import { BREEDS } from '@/data/breeds';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { ageInMonths, birthMonthFrom, splitMonths } from '@/lib/format';
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

function norm(s: string): string {
  try {
    return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  } catch {
    return s.toLowerCase();
  }
}

export function DogForm({ initial, submitLabel, onSubmit, onDelete }: DogFormProps) {
  const theme = useTheme();
  const initialAge = initial ? splitMonths(ageInMonths(initial.birthMonth)) : { years: 0, months: 3 };

  const [name, setName] = useState(initial?.name ?? '');
  const [breedId, setBreedId] = useState(initial?.breedId ?? '');
  const [sex, setSex] = useState<DogSex>(initial?.sex ?? 'male');
  const [years, setYears] = useState(initialAge.years);
  const [months, setMonths] = useState(initialAge.months);
  const [weight, setWeight] = useState(initial?.weightKg ? String(initial.weightKg) : '');
  const [avatar, setAvatar] = useState(initial?.avatar ?? AVATARS[0]);
  const [color, setColor] = useState(initial?.color ?? COLORS[0]);
  const [breedQuery, setBreedQuery] = useState('');

  const filteredBreeds = useMemo(() => {
    const q = norm(breedQuery.trim());
    if (!q) return BREEDS;
    return BREEDS.filter((b) => norm(b.name).includes(q) || b.id === breedId);
  }, [breedQuery, breedId]);

  const canSubmit = name.trim().length > 0 && breedId.length > 0;

  function handleSubmit() {
    if (!canSubmit) return;
    const parsedWeight = parseFloat(weight.replace(',', '.'));
    onSubmit({
      name: name.trim(),
      breedId,
      sex,
      birthMonth: birthMonthFrom(years, months),
      weightKg: Number.isFinite(parsedWeight) && parsedWeight > 0 ? parsedWeight : undefined,
      avatar,
      color,
    });
  }

  const inputStyle = [styles.input, { backgroundColor: theme.backgroundElement, borderColor: theme.border, color: theme.text }];

  return (
    <View style={styles.form}>
      <View style={styles.preview}>
        <DogAvatar dog={{ avatar, color }} size={84} />
        <ThemedText style={styles.previewName}>{name.trim() || 'Váš pejsek'}</ThemedText>
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
              style={[
                styles.swatch,
                { backgroundColor: c, borderColor: color === c ? theme.text : 'transparent' },
              ]}
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
        <FieldLabel>Plemeno</FieldLabel>
        <TextInput
          value={breedQuery}
          onChangeText={setBreedQuery}
          placeholder="Hledat plemeno…"
          placeholderTextColor={theme.textSecondary}
          style={inputStyle}
        />
        <View style={styles.wrap}>
          {filteredBreeds.map((b) => (
            <Chip
              key={b.id}
              label={b.name}
              selected={breedId === b.id}
              onPress={() => setBreedId(b.id)}
            />
          ))}
          {filteredBreeds.length === 0 ? (
            <ThemedText themeColor="textSecondary">Nic nenalezeno — zkuste „Kříženec“.</ThemedText>
          ) : null}
        </View>
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
    </View>
  );
}

function FieldLabel({ children }: { children: string }) {
  return (
    <ThemedText themeColor="textSecondary" style={styles.fieldLabel}>
      {children}
    </ThemedText>
  );
}

const styles = StyleSheet.create({
  form: { gap: Spacing.four },
  preview: { alignItems: 'center', gap: Spacing.two },
  previewName: { fontSize: 20, fontWeight: '700' },
  field: { gap: Spacing.two },
  fieldLabel: { fontSize: 13, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  input: {
    borderWidth: 1,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.three,
    paddingVertical: 12,
    fontSize: 16,
  },
  emoji: {
    width: 48,
    height: 48,
    borderRadius: Radius.md,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emojiText: { fontSize: 24 },
  swatch: {
    width: 36,
    height: 36,
    borderRadius: Radius.pill,
    borderWidth: 3,
  },
});
