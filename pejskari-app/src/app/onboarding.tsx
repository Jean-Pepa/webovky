import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { DogForm } from '@/components/dog-form';
import { ThemedText } from '@/components/themed-text';
import { Icon } from '@/components/ui/icon';
import { Screen, SectionTitle } from '@/components/ui/screen';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useDogs } from '@/store/dog-store';

const VALUES = [
  { icon: 'paw', text: 'Osobní výcvikový plán podle plemene a věku' },
  { icon: 'book', text: 'Průvodce péčí, zdravím a výživou' },
  { icon: 'trending-up', text: 'Sledování pokroku, které vás vrací zpět' },
];

export default function Onboarding() {
  const router = useRouter();
  const theme = useTheme();
  const { addDog } = useDogs();

  return (
    <Screen>
      <View style={styles.hero}>
        <View style={[styles.logo, { backgroundColor: theme.tintSoft }]}>
          <ThemedText style={styles.logoEmoji}>🐶</ThemedText>
        </View>
        <ThemedText style={styles.appName}>Pejskaři</ThemedText>
        <ThemedText themeColor="textSecondary" style={styles.tagline}>
          Osobní trenér a průvodce pro vašeho psa
        </ThemedText>
      </View>

      <View style={styles.values}>
        {VALUES.map((v) => (
          <View key={v.text} style={styles.valueRow}>
            <Icon name={v.icon} size={20} color={theme.tint} />
            <ThemedText style={styles.valueText}>{v.text}</ThemedText>
          </View>
        ))}
      </View>

      <SectionTitle>Začněme profilem pejska</SectionTitle>
      <DogForm
        submitLabel="Vytvořit profil"
        onSubmit={(data) => {
          addDog(data);
          router.replace('/');
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { alignItems: 'center', gap: Spacing.two, paddingTop: Spacing.four },
  logo: {
    width: 96,
    height: 96,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoEmoji: { fontSize: 52 },
  appName: { fontSize: 34, fontWeight: '800' },
  tagline: { fontSize: 16, textAlign: 'center' },
  values: { gap: Spacing.two, paddingVertical: Spacing.two },
  valueRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  valueText: { fontSize: 15, flex: 1 },
});
