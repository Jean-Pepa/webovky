import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { GUIDE_CATEGORIES } from '@/data/categories';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { GuideArticle } from '@/types';

export function ArticleCard({ article, onPress }: { article: GuideArticle; onPress?: () => void }) {
  const theme = useTheme();
  const cat = GUIDE_CATEGORIES[article.category];
  return (
    <Card onPress={onPress}>
      <View style={styles.row}>
        <View style={[styles.iconBox, { backgroundColor: cat.color + '22' }]}>
          <Icon name={cat.icon} size={24} color={cat.color} />
        </View>
        <View style={styles.body}>
          <ThemedText weight="bold" size={12} style={{ color: cat.color }}>
            {cat.label.toUpperCase()}
          </ThemedText>
          <ThemedText weight="extrabold" size={17}>
            {article.title}
          </ThemedText>
          <ThemedText themeColor="textSecondary" size={14}>
            {article.excerpt}
          </ThemedText>
          <ThemedText themeColor="textSecondary" size={13}>
            {article.readMin} min čtení
          </ThemedText>
        </View>
        <Icon name="chevron-forward" size={20} color={theme.textSecondary} />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three },
  iconBox: {
    width: 52,
    height: 52,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: { flex: 1, gap: 2 },
});
