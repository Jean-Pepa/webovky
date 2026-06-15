import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Alert, Pressable, StyleSheet, View } from 'react-native';

import { DogAvatar } from '@/components/dog-avatar';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { Screen, SectionTitle } from '@/components/ui/screen';
import { Eyebrow, Heading } from '@/components/ui/typography';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { dogBreedName } from '@/lib/dog';
import { ageInMonths, formatAgeMonths } from '@/lib/format';
import { buildPlan, planStats } from '@/lib/plan';
import { useDogs } from '@/store/dog-store';

export default function ProfileScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { activeDog, dogs, setActiveDog, completedFor, resetProgress } = useDogs();

  if (!activeDog) return null;

  const completed = completedFor();
  const stats = planStats(buildPlan(activeDog), completed);

  function confirmReset() {
    Alert.alert('Resetovat pokrok?', `Smaže se postup ve výcviku pro psa ${activeDog!.name}.`, [
      { text: 'Zrušit', style: 'cancel' },
      { text: 'Resetovat', style: 'destructive', onPress: () => resetProgress() },
    ]);
  }

  return (
    <Screen>
      <View>
        <Eyebrow>Můj parťák</Eyebrow>
        <Heading size={30} style={styles.heading}>
          Profil
        </Heading>
      </View>

      <Card padded={false} style={styles.heroCard}>
        {activeDog.breedPhotoUrl ? (
          <Image source={{ uri: activeDog.breedPhotoUrl }} style={styles.banner} contentFit="cover" transition={200} />
        ) : null}
        <View style={styles.heroBody}>
          <View style={styles.dogHead}>
            <DogAvatar dog={activeDog} size={64} />
            <View style={styles.flex}>
              <ThemedText weight="black" size={24}>
                {activeDog.name}
              </ThemedText>
              <ThemedText themeColor="textSecondary">{dogBreedName(activeDog)}</ThemedText>
            </View>
          </View>

          <View style={styles.infoGrid}>
            <Info icon="calendar-outline" label="Věk" value={formatAgeMonths(ageInMonths(activeDog.birthMonth))} />
            <Info icon="male-female-outline" label="Pohlaví" value={activeDog.sex === 'male' ? 'Pes' : 'Fena'} />
            {activeDog.weightKg ? <Info icon="barbell-outline" label="Váha" value={`${activeDog.weightKg} kg`} /> : null}
            <Info icon="trophy-outline" label="Splněno" value={`${completed.length} lekcí`} />
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
            <Button title="Přidat" variant="secondary" icon="add" style={styles.flex} onPress={() => router.push('/dog/new')} />
          </View>
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
                    <ThemedText weight="extrabold" size={16}>
                      {dog.name}
                    </ThemedText>
                    <ThemedText themeColor="textSecondary" size={13}>
                      {dogBreedName(dog)}
                    </ThemedText>
                  </View>
                  {active ? <Icon name="checkmark-circle" size={24} color={theme.tint} /> : null}
                </View>
              </Card>
            );
          })}
        </>
      ) : null}

      <SectionTitle>Nastavení</SectionTitle>
      <Card>
        <Pressable onPress={confirmReset} style={styles.settingRow}>
          <Icon name="refresh-outline" size={20} color={theme.danger} />
          <ThemedText weight="bold" size={16} style={{ color: theme.danger }}>
            Resetovat pokrok ve výcviku
          </ThemedText>
        </Pressable>
      </Card>

      <ThemedText themeColor="textSecondary" style={styles.footer}>
        Pejskaři · verze 0.2{'\n'}Vytvořeno s láskou k pejskům 🐾
      </ThemedText>
    </Screen>
  );
}

function Info({ icon, label, value }: { icon: string; label: string; value: string }) {
  const theme = useTheme();
  return (
    <View style={[styles.info, { backgroundColor: theme.background, borderColor: theme.border }]}>
      <View style={styles.infoTop}>
        <Icon name={icon} size={14} color={theme.tint} />
        <ThemedText weight="extrabold" themeColor="textSecondary" style={styles.infoLabel}>
          {label.toUpperCase()}
        </ThemedText>
      </View>
      <ThemedText weight="extrabold" size={16}>
        {value}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  heading: { marginTop: Spacing.one },
  flex: { flex: 1 },
  heroCard: { overflow: 'hidden' },
  banner: { width: '100%', height: 130 },
  heroBody: { padding: Spacing.three, gap: Spacing.three },
  dogHead: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three },
  infoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  info: {
    borderWidth: 1,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    minWidth: 104,
    flexGrow: 1,
    gap: 2,
  },
  infoTop: { flexDirection: 'row', alignItems: 'center', gap: Spacing.one },
  infoLabel: { fontSize: 11, letterSpacing: 0.4 },
  actions: { flexDirection: 'row', gap: Spacing.two },
  dogRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three },
  settingRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two, paddingVertical: Spacing.one },
  footer: { textAlign: 'center', marginTop: Spacing.four, lineHeight: 20 },
});
