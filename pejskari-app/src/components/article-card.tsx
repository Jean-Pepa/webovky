import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/ui/card';
import { Tag } from '@/components/ui/tag';
import { GUIDE_CATEGORIES } from '@/data/categories';
import { Spacing } from '@/constants/theme';
import type { GuideArticle } from '@/types';

export function ArticleCard({ article, onPress }: { article: GuideArticle; onPress?: () => void }) {
  const cat = GUIDE_CATEGORIES[article.category];
  return (
    <Card onPress={onPress}>
      <View style={styles.body}>
        <Tag label={cat.label} color={cat.color} icon={cat.icon} />
        <ThemedText style={styles.title}>{article.title}</ThemedText>
        <ThemedText themeColor="textSecondary">{article.excerpt}</ThemedText>
        <ThemedText themeColor="textSecondary" style={styles.meta}>
          {article.readMin} min čtení
        </ThemedText>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  body: { gap: Spacing.two },
  title: { fontSize: 17, fontWeight: '700' },
  meta: { fontSize: 13 },
});
