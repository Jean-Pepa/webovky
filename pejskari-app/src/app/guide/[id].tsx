import { Stack, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { Screen } from '@/components/ui/screen';
import { Tag } from '@/components/ui/tag';
import { Spacing } from '@/constants/theme';
import { GUIDE_CATEGORIES } from '@/data/categories';
import { getArticle } from '@/data/guide';
import { useTheme } from '@/hooks/use-theme';

export default function GuideDetail() {
  const theme = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const article = getArticle(id);

  if (!article) {
    return (
      <Screen>
        <Stack.Screen options={{ title: 'Průvodce' }} />
        <ThemedText>Článek nenalezen.</ThemedText>
      </Screen>
    );
  }

  const cat = GUIDE_CATEGORIES[article.category];
  const paragraphs = article.body.split('\n\n');

  return (
    <Screen>
      <Stack.Screen options={{ title: cat.label }} />

      <View style={styles.metaRow}>
        <Tag label={cat.label} color={cat.color} icon={cat.icon} />
        <ThemedText themeColor="textSecondary" style={styles.meta}>
          {article.readMin} min čtení
        </ThemedText>
      </View>

      <ThemedText style={styles.h1}>{article.title}</ThemedText>

      {paragraphs.map((p, i) =>
        p.startsWith('• ') ? (
          <View key={i} style={styles.bulletRow}>
            <ThemedText style={{ color: theme.tint }}>•</ThemedText>
            <ThemedText style={styles.flexText}>{p.replace(/^•\s*/, '')}</ThemedText>
          </View>
        ) : (
          <ThemedText key={i} style={styles.paragraph}>
            {p}
          </ThemedText>
        ),
      )}

      {article.vetNote ? (
        <Card style={{ backgroundColor: theme.backgroundElement }}>
          <View style={styles.iconRow}>
            <Icon name="medkit-outline" size={18} color={theme.danger} />
            <ThemedText themeColor="textSecondary" style={styles.flexText}>
              Tento článek je orientační. U zdravotních otázek se vždy poraďte se svým veterinářem.
            </ThemedText>
          </View>
        </Card>
      ) : null}

      {article.affiliate ? (
        <Card style={{ backgroundColor: theme.accentSoft, borderColor: theme.accent + '55' }}>
          <View style={styles.iconRow}>
            <Icon name="pricetag-outline" size={18} color={theme.accent} />
            <View style={styles.flex}>
              <ThemedText style={styles.affLabel}>{article.affiliate.label}</ThemedText>
              <ThemedText themeColor="textSecondary">{article.affiliate.note}</ThemedText>
            </View>
          </View>
        </Card>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  meta: { fontSize: 13 },
  h1: { fontSize: 26, fontWeight: '800', lineHeight: 32 },
  paragraph: { fontSize: 16, lineHeight: 24 },
  bulletRow: { flexDirection: 'row', gap: Spacing.two, paddingLeft: Spacing.one },
  iconRow: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.two },
  flex: { flex: 1 },
  flexText: { flex: 1, fontSize: 15, lineHeight: 22 },
  affLabel: { fontSize: 15, fontWeight: '700' },
});
