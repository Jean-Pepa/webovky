import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { DogForm } from '@/components/dog-form';
import { ThemedText } from '@/components/themed-text';
import { Icon } from '@/components/ui/icon';
import { Screen, SectionTitle } from '@/components/ui/screen';
import { Heading } from '@/components/ui/typography';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useDogs } from '@/store/dog-store';

const VALUES = [
  { icon: 'paw', text: 'Osobní výcvikový plán podle plemene a věku' },
  { icon: 'search', text: 'Vyhledávač všech plemen s reálnými fotkami' },
  { icon: 'book', text: 'Průvodce péčí, zdravím a výživou' },
];

export default function Onboarding() {
  const router = useRouter();
  const theme = useTheme();
  const { addDog } = useDogs();

  return (
    <Screen>
      <View style={styles.hero}>
        <View style={[styles.logo, { backgroundColor: theme.tint }]}>
          <Icon name="paw" size={44} color="#FFFFFF" />
        </View>
        <Heading accent="kaři" size={40}>
          Pejs
        </Heading>
        <ThemedText themeColor="textSecondary" style={styles.tagline}>
          Osobní trenér a průvodce pro tvého psa
        </ThemedText>
      </View>

      <View style={styles.values}>
        {VALUES.map((v) => (
          <View key={v.text} style={styles.valueRow}>
            <View style={[styles.valueIcon, { backgroundColor: theme.tintSoft }]}>
              <Icon name={v.icon} size={18} color={theme.tint} />
            </View>
            <ThemedText weight="medium" style={styles.valueText}>
              {v.text}
            </ThemedText>
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
    width: 92,
    height: 92,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagline: { fontSize: 16, textAlign: 'center' },
  values: { gap: Spacing.three, paddingVertical: Spacing.two },
  valueRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three },
  valueIcon: {
    width: 40,
    height: 40,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  valueText: { fontSize: 15, flex: 1 },
});
