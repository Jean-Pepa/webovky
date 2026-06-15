import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ArticleCard } from '@/components/article-card';
import { Chip } from '@/components/ui/chip';
import { Screen, ScreenHeader } from '@/components/ui/screen';
import { Spacing } from '@/constants/theme';
import { GUIDE_CATEGORIES } from '@/data/categories';
import { GUIDE_ARTICLES } from '@/data/guide';
import type { GuideCategory } from '@/types';

type Filter = GuideCategory | 'all';

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'Vše' },
  ...(Object.keys(GUIDE_CATEGORIES) as GuideCategory[]).map((id) => ({
    id,
    label: GUIDE_CATEGORIES[id].label,
  })),
];

export default function GuideScreen() {
  const router = useRouter();
  const [filter, setFilter] = useState<Filter>('all');

  const articles =
    filter === 'all' ? GUIDE_ARTICLES : GUIDE_ARTICLES.filter((a) => a.category === filter);

  return (
    <Screen>
      <ScreenHeader title="Průvodce" subtitle="Péče, zdraví, výživa i cestování" />

      <View style={styles.filters}>
        {FILTERS.map((f) => (
          <Chip
            key={f.id}
            label={f.label}
            selected={filter === f.id}
            onPress={() => setFilter(f.id)}
          />
        ))}
      </View>

      {articles.map((article) => (
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
  filters: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
});
