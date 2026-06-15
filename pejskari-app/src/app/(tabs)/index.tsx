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
import { Screen, ScreenHeader, SectionTitle } from '@/components/ui/screen';
import { Spacing } from '@/constants/theme';
import { getBreed } from '@/data/breeds';
import { GUIDE_ARTICLES } from '@/data/guide';
import { useTheme } from '@/hooks/use-theme';
import { ageInMonths, formatAgeMonths } from '@/lib/format';
import { buildPlan, planStats } from '@/lib/plan';
import { useDogs } from '@/store/dog-store';

const TIPS = [
  'Krátké tréninky (5–10 minut) několikrát denně fungují líp než jeden dlouhý.',
  'Odměňujte do dvou vteřin po správném chování — pes si pak spojí čin s odměnou.',
  'Trénujte před krmením, kdy je pes motivovaný a soustředěný.',
  'Vždy končete tréninkem v dobrém, dokud pes ještě chce. Posílíte tím chuť cvičit.',
  'Měňte prostředí. Co umí doma, neznamená, že zvládne i v parku — naučte to znovu.',
  'Jméno a přivolání nikdy nespojujte s něčím nepříjemným. Ať zůstanou pozitivní.',
];

export default function HomeScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { activeDog, completedFor } = useDogs();

  if (!activeDog) return null;

  const breed = getBreed(activeDog.breedId);
  const plan = buildPlan(activeDog, breed);
  const stats = planStats(plan, completedFor());
  const ageText = formatAgeMonths(ageInMonths(activeDog.birthMonth));
  const tip = TIPS[new Date().getDate() % TIPS.length];

  return (
    <Screen>
      <ScreenHeader
        title={`Ahoj, ${activeDog.name}!`}
        subtitle={[breed?.name, ageText].filter(Boolean).join(' · ')}
        right={<DogAvatar dog={activeDog} size={52} />}
      />

      <Card>
        <View style={styles.cardHead}>
          <Icon name="paw" size={20} color={theme.tint} />
          <ThemedText style={styles.cardTitle}>Výcvikový plán</ThemedText>
        </View>
        <View style={styles.progressBlock}>
          <ProgressBar value={stats.pct} />
          <ThemedText themeColor="textSecondary">
            {stats.completed} z {stats.total} lekcí splněno
          </ThemedText>
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
            onPress={() =>
              router.push({ pathname: '/lesson/[id]', params: { id: stats.next!.id } })
            }
          />
        </>
      ) : null}

      <SectionTitle>Tip dne</SectionTitle>
      <Card style={{ backgroundColor: theme.accentSoft, borderColor: theme.accent + '55' }}>
        <View style={styles.tipRow}>
          <Icon name="bulb-outline" size={22} color={theme.accent} />
          <ThemedText style={styles.tipText}>{tip}</ThemedText>
        </View>
      </Card>

      <View style={styles.guideHead}>
        <SectionTitle>Z průvodce</SectionTitle>
        <ThemedText themeColor="tint" style={styles.link} onPress={() => router.navigate('/guide')}>
          Zobrazit vše
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
  cardHead: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two, marginBottom: Spacing.three },
  cardTitle: { fontSize: 18, fontWeight: '700' },
  progressBlock: { gap: Spacing.two, marginBottom: Spacing.three },
  tipRow: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.two },
  tipText: { flex: 1, fontSize: 15, lineHeight: 22 },
  guideHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  link: { fontWeight: '700' },
});
