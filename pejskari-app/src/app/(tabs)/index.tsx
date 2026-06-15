import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { ArticleCard } from '@/components/article-card';
import { DogAvatar } from '@/components/dog-avatar';
import { LessonCard } from '@/components/lesson-card';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { ProgressBar } from '@/components/ui/progress-bar';
import { Screen, SectionTitle } from '@/components/ui/screen';
import { Eyebrow, Heading } from '@/components/ui/typography';
import { Radius, Spacing } from '@/constants/theme';
import { GUIDE_ARTICLES } from '@/data/guide';
import { useTheme } from '@/hooks/use-theme';
import { dogBreedName } from '@/lib/dog';
import { ageInMonths, formatAgeMonths } from '@/lib/format';
import { buildPlan, planStats } from '@/lib/plan';
import { useDogs } from '@/store/dog-store';

const TIPS = [
  'Krátké tréninky (5–10 minut) několikrát denně fungují líp než jeden dlouhý.',
  'Odměňuj do dvou vteřin po správném chování — pes si spojí čin s odměnou.',
  'Trénuj před krmením, kdy je pes motivovaný a soustředěný.',
  'Vždy konči v dobrém, dokud pes ještě chce. Posílíš tím chuť cvičit.',
  'Měň prostředí. Co umí doma, neznamená, že zvládne i v parku — nauč to znovu.',
  'Jméno a přivolání nikdy nespojuj s něčím nepříjemným. Ať zůstanou pozitivní.',
];

export default function HomeScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { activeDog, completedFor } = useDogs();

  if (!activeDog) return null;

  const plan = buildPlan(activeDog);
  const stats = planStats(plan, completedFor());
  const ageText = formatAgeMonths(ageInMonths(activeDog.birthMonth));
  const breedName = dogBreedName(activeDog);
  const tip = TIPS[new Date().getDate() % TIPS.length];

  return (
    <Screen>
      <View style={styles.headerRow}>
        <View style={styles.flex}>
          <Eyebrow>Dnes</Eyebrow>
          <Heading accent={`${activeDog.name}!`} size={30} style={styles.heading}>
            Ahoj,{' '}
          </Heading>
        </View>
        <DogAvatar dog={activeDog} size={56} />
      </View>

      {activeDog.breedPhotoUrl ? (
        <View style={styles.hero}>
          <Image source={{ uri: activeDog.breedPhotoUrl }} style={styles.heroImg} contentFit="cover" transition={200} />
          <View style={styles.heroOverlay}>
            <ThemedText weight="black" size={20} style={styles.heroText}>
              {breedName}
            </ThemedText>
            <ThemedText weight="bold" size={13} style={styles.heroMeta}>
              {[ageText, activeDog.sex === 'male' ? 'pes' : 'fena'].filter(Boolean).join(' · ')}
            </ThemedText>
          </View>
        </View>
      ) : null}

      <Card>
        <View style={styles.cardHead}>
          <Icon name="paw" size={20} color={theme.tint} />
          <ThemedText weight="extrabold" size={18}>
            Výcvikový plán
          </ThemedText>
        </View>
        <View style={styles.progressBlock}>
          <ProgressBar value={stats.pct} />
          <View style={styles.progressRow}>
            <ThemedText themeColor="textSecondary">
              {stats.completed} z {stats.total} lekcí
            </ThemedText>
            <ThemedText weight="black" themeColor="tint">
              {Math.round(stats.pct * 100)} %
            </ThemedText>
          </View>
        </View>
        <Button
          title={stats.next ? 'Pokračovat ve výcviku' : 'Zopakovat lekce 🎉'}
          icon={stats.next ? 'play' : 'refresh'}
          onPress={() =>
            stats.next
              ? router.push({ pathname: '/lesson/[id]', params: { id: stats.next.id } })
              : router.navigate('/training')
          }
        />
      </Card>

      {stats.next ? (
        <>
          <SectionTitle>Další lekce</SectionTitle>
          <LessonCard
            lesson={stats.next}
            onPress={() => router.push({ pathname: '/lesson/[id]', params: { id: stats.next!.id } })}
          />
        </>
      ) : null}

      <SectionTitle>Tip dne</SectionTitle>
      <Card style={{ backgroundColor: theme.accentSoft, borderColor: theme.tint + '33' }}>
        <View style={styles.tipRow}>
          <Icon name="bulb" size={22} color={theme.tint} />
          <ThemedText style={styles.tipText}>{tip}</ThemedText>
        </View>
      </Card>

      <View style={styles.guideHead}>
        <SectionTitle>Z průvodce</SectionTitle>
        <ThemedText weight="bold" themeColor="tint" onPress={() => router.navigate('/guide')}>
          Vše →
        </ThemedText>
      </View>
      {GUIDE_ARTICLES.slice(0, 2).map((article) => (
        <ArticleCard
          key={article.id}
          article={article}
          onPress={() => router.push({ pathname: '/guide/[id]', params: { id: article.id } })}
        />
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three },
  flex: { flex: 1, gap: Spacing.one, alignItems: 'flex-start' },
  heading: { marginTop: 2 },
  hero: { borderRadius: Radius.lg, overflow: 'hidden', height: 170 },
  heroImg: { width: '100%', height: '100%' },
  heroOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    backgroundColor: 'rgba(0,0,0,0.42)',
  },
  heroText: { color: '#FFFFFF' },
  heroMeta: { color: 'rgba(255,255,255,0.85)' },
  cardHead: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two, marginBottom: Spacing.three },
  progressBlock: { gap: Spacing.two, marginBottom: Spacing.three },
  progressRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  tipRow: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.two },
  tipText: { flex: 1, fontSize: 15, lineHeight: 22 },
  guideHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
});
