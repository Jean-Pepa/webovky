import { Stack, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { Screen } from '@/components/ui/screen';
import { Eyebrow, Heading } from '@/components/ui/typography';
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

      <View style={styles.headerBlock}>
        <Eyebrow>{`${cat.label} · ${article.readMin} min čtení`}</Eyebrow>
        <Heading size={28}>{article.title}</Heading>
      </View>

      {paragraphs.map((p, i) =>
        p.startsWith('• ') ? (
          <View key={i} style={styles.bulletRow}>
            <ThemedText weight="extrabold" style={{ color: theme.tint }}>
              •
            </ThemedText>
            <ThemedText weight="regular" style={styles.flexText}>
              {p.replace(/^•\s*/, '')}
            </ThemedText>
          </View>
        ) : (
          <ThemedText key={i} weight="regular" style={styles.paragraph}>
            {p}
          </ThemedText>
        ),
      )}

      {article.vetNote ? (
        <Card style={{ backgroundColor: theme.dangerSoft, borderColor: theme.danger + '33' }}>
          <View style={styles.iconRow}>
            <Icon name="medkit-outline" size={18} color={theme.danger} />
            <ThemedText weight="regular" themeColor="textSecondary" style={styles.flexText}>
              Tento článek je orientační. U zdravotních otázek se vždy poraď se svým veterinářem.
            </ThemedText>
          </View>
        </Card>
      ) : null}

      {article.affiliate ? (
        <Card style={{ backgroundColor: theme.accentSoft, borderColor: theme.tint + '33' }}>
          <View style={styles.iconRow}>
            <Icon name="pricetag-outline" size={18} color={theme.tint} />
            <View style={styles.flex}>
              <ThemedText weight="extrabold" size={15}>
                {article.affiliate.label}
              </ThemedText>
              <ThemedText weight="regular" themeColor="textSecondary">
                {article.affiliate.note}
              </ThemedText>
            </View>
          </View>
        </Card>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerBlock: { gap: Spacing.two },
  paragraph: { fontSize: 16, lineHeight: 24 },
  bulletRow: { flexDirection: 'row', gap: Spacing.two, paddingLeft: Spacing.one },
  iconRow: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.two },
  flex: { flex: 1 },
  flexText: { flex: 1, fontSize: 15, lineHeight: 22 },
});
