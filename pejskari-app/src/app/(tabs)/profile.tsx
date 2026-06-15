import { useRouter } from 'expo-router';
import { Alert, Pressable, StyleSheet, View } from 'react-native';

import { DogAvatar } from '@/components/dog-avatar';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { Screen, ScreenHeader, SectionTitle } from '@/components/ui/screen';
import { Radius, Spacing } from '@/constants/theme';
import { getBreed } from '@/data/breeds';
import { useTheme } from '@/hooks/use-theme';
import { ageInMonths, formatAgeMonths } from '@/lib/format';
import { buildPlan, planStats } from '@/lib/plan';
import { useDogs } from '@/store/dog-store';

export default function ProfileScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { activeDog, dogs, setActiveDog, completedFor, resetProgress } = useDogs();

  if (!activeDog) return null;

  const breed = getBreed(activeDog.breedId);
  const completed = completedFor();
  const stats = planStats(buildPlan(activeDog, breed), completed);

  function confirmReset() {
    Alert.alert('Resetovat pokrok?', `Smaže se postup ve výcviku pro psa ${activeDog!.name}.`, [
      { text: 'Zrušit', style: 'cancel' },
      { text: 'Resetovat', style: 'destructive', onPress: () => resetProgress() },
    ]);
  }

  return (
    <Screen>
      <ScreenHeader title="Profil" />

      <Card>
        <View style={styles.dogHead}>
          <DogAvatar dog={activeDog} size={72} />
          <View style={styles.dogHeadText}>
            <ThemedText style={styles.dogName}>{activeDog.name}</ThemedText>
            <ThemedText themeColor="textSecondary">{breed?.name}</ThemedText>
          </View>
        </View>

        <View style={styles.infoGrid}>
          <Info icon="calendar-outline" label="Věk" value={formatAgeMonths(ageInMonths(activeDog.birthMonth))} />
          <Info icon="male-female-outline" label="Pohlaví" value={activeDog.sex === 'male' ? 'Pes' : 'Fena'} />
          {activeDog.weightKg ? (
            <Info icon="barbell-outline" label="Váha" value={`${activeDog.weightKg} kg`} />
          ) : null}
          <Info icon="trophy-outline" label="Splněno lekcí" value={String(completed.length)} />
          <Info icon="flag-outline" label="Aktuálně" value={stats.next ? `Úroveň ${stats.next.level}` : 'Vše hotovo'} />
        </View>

        <View style={styles.actions}>
          <Button
            title="Upravit"
            variant="secondary"
            icon="create-outline"
            style={styles.flex}
            onPress={() => router.push({ pathname: '/dog/[id]/edit', params: { id: activeDog.id } })}
          />
          <Button
            title="Přidat pejska"
            variant="secondary"
            icon="add"
            style={styles.flex}
            onPress={() => router.push('/dog/new')}
          />
        </View>
      </Card>

      {dogs.length > 1 ? (
        <>
          <SectionTitle>Moji psi</SectionTitle>
          {dogs.map((dog) => {
            const active = dog.id === activeDog.id;
            return (
              <Card
                key={dog.id}
                onPress={() => setActiveDog(dog.id)}
                style={active ? { borderColor: theme.tint, borderWidth: 2 } : undefined}>
                <View style={styles.dogRow}>
                  <DogAvatar dog={dog} size={44} />
                  <View style={styles.flex}>
                    <ThemedText style={styles.dogRowName}>{dog.name}</ThemedText>
                    <ThemedText themeColor="textSecondary">{getBreed(dog.breedId)?.name}</ThemedText>
                  </View>
                  {active ? <Icon name="checkmark-circle" size={22} color={theme.tint} /> : null}
                </View>
              </Card>
            );
          })}
        </>
      ) : null}

      <SectionTitle>Nastavení</SectionTitle>
      <Card>
        <SettingRow icon="refresh-outline" label="Resetovat pokrok ve výcviku" color={theme.danger} onPress={confirmReset} />
      </Card>

      <ThemedText themeColor="textSecondary" style={styles.footer}>
        Pejskaři · verze 0.1{'\n'}Vytvořeno s láskou k pejskům 🐾
      </ThemedText>
    </Screen>
  );
}

function Info({ icon, label, value }: { icon: string; label: string; value: string }) {
  const theme = useTheme();
  return (
    <View style={[styles.info, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
      <Icon name={icon} size={16} color={theme.textSecondary} />
      <ThemedText themeColor="textSecondary" style={styles.infoLabel}>
        {label}
      </ThemedText>
      <ThemedText style={styles.infoValue}>{value}</ThemedText>
    </View>
  );
}

function SettingRow({
  icon,
  label,
  color,
  onPress,
}: {
  icon: string;
  label: string;
  color?: string;
  onPress: () => void;
}) {
  const theme = useTheme();
  return (
    <Pressable onPress={onPress} style={styles.settingRow}>
      <Icon name={icon} size={18} color={color ?? theme.text} />
      <ThemedText style={[styles.settingLabel, { color: color ?? theme.text }]}>{label}</ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  dogHead: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three, marginBottom: Spacing.three },
  dogHeadText: { flex: 1 },
  dogName: { fontSize: 24, fontWeight: '800' },
  infoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two, marginBottom: Spacing.three },
  info: {
    borderWidth: 1,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    minWidth: 100,
    flexGrow: 1,
    gap: 2,
  },
  infoLabel: { fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.4 },
  infoValue: { fontSize: 16, fontWeight: '700' },
  actions: { flexDirection: 'row', gap: Spacing.two },
  flex: { flex: 1 },
  dogRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three },
  dogRowName: { fontSize: 17, fontWeight: '700' },
  settingRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two, paddingVertical: Spacing.one },
  settingLabel: { fontSize: 16, fontWeight: '600' },
  footer: { textAlign: 'center', marginTop: Spacing.four, lineHeight: 20 },
});
