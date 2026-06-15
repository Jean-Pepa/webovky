import { Stack, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { Screen, SectionTitle } from '@/components/ui/screen';
import { Tag } from '@/components/ui/tag';
import { Radius, Spacing } from '@/constants/theme';
import { LESSON_CATEGORIES } from '@/data/categories';
import { getLesson } from '@/data/lessons';
import { useTheme } from '@/hooks/use-theme';
import { useDogs } from '@/store/dog-store';

export default function LessonDetail() {
  const theme = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const lesson = getLesson(id);
  const { isLessonDone, toggleLesson } = useDogs();

  if (!lesson) {
    return (
      <Screen>
        <Stack.Screen options={{ title: 'Lekce' }} />
        <ThemedText>Lekce nenalezena.</ThemedText>
      </Screen>
    );
  }

  const cat = LESSON_CATEGORIES[lesson.category];
  const done = isLessonDone(lesson.id);

  return (
    <Screen>
      <Stack.Screen options={{ title: cat.label }} />

      <View style={styles.metaRow}>
        <Tag label={cat.label} color={cat.color} icon={cat.icon} />
        <Meta icon="layers-outline" text={`Úroveň ${lesson.level}`} />
        <Meta icon="time-outline" text={`${lesson.durationMin} min`} />
      </View>

      <ThemedText style={styles.h1}>{lesson.title}</ThemedText>
      <ThemedText themeColor="textSecondary" style={styles.summary}>
        {lesson.summary}
      </ThemedText>

      <Card style={{ backgroundColor: theme.tintSoft, borderColor: theme.tint + '33' }}>
        <View style={styles.iconRow}>
          <Icon name="bulb-outline" size={20} color={theme.tint} />
          <ThemedText style={styles.flexText}>{lesson.why}</ThemedText>
        </View>
      </Card>

      <SectionTitle>Postup</SectionTitle>
      {lesson.steps.map((step, i) => (
        <View key={i} style={styles.step}>
          <View style={[styles.stepNum, { backgroundColor: theme.tint }]}>
            <ThemedText style={styles.stepNumText}>{i + 1}</ThemedText>
          </View>
          <ThemedText style={styles.flexText}>{step}</ThemedText>
        </View>
      ))}

      {lesson.tips && lesson.tips.length > 0 ? (
        <>
          <SectionTitle>Tipy</SectionTitle>
          {lesson.tips.map((tip, i) => (
            <View key={i} style={styles.iconRow}>
              <Icon name="checkmark-circle" size={18} color={theme.tint} />
              <ThemedText style={styles.flexText}>{tip}</ThemedText>
            </View>
          ))}
        </>
      ) : null}

      {lesson.gearTip ? (
        <Card style={{ backgroundColor: theme.accentSoft, borderColor: theme.accent + '55' }}>
          <View style={styles.iconRow}>
            <Icon name="bag-handle-outline" size={20} color={theme.accent} />
            <View style={styles.flex}>
              <ThemedText style={styles.gearLabel}>
                Doporučené vybavení: {lesson.gearTip.label}
              </ThemedText>
              <ThemedText themeColor="textSecondary">{lesson.gearTip.note}</ThemedText>
            </View>
          </View>
        </Card>
      ) : null}

      <Button
        title={done ? 'Splněno — zrušit' : 'Označit jako splněno'}
        icon={done ? 'checkmark-done' : 'checkmark'}
        variant={done ? 'secondary' : 'primary'}
        onPress={() => toggleLesson(lesson.id)}
      />
    </Screen>
  );
}

function Meta({ icon, text }: { icon: string; text: string }) {
  const theme = useTheme();
  return (
    <View style={styles.meta}>
      <Icon name={icon} size={14} color={theme.textSecondary} />
      <ThemedText themeColor="textSecondary" style={styles.metaText}>
        {text}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  metaRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: Spacing.two },
  meta: { flexDirection: 'row', alignItems: 'center', gap: Spacing.half },
  metaText: { fontSize: 13, fontWeight: '600' },
  h1: { fontSize: 26, fontWeight: '800', lineHeight: 32 },
  summary: { fontSize: 16, lineHeight: 23 },
  iconRow: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.two },
  flex: { flex: 1 },
  flexText: { flex: 1, fontSize: 15, lineHeight: 22 },
  step: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.three },
  stepNum: {
    width: 28,
    height: 28,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumText: { color: '#FFFFFF', fontWeight: '800' },
  gearLabel: { fontSize: 15, fontWeight: '700' },
});
