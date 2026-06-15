import { Stack, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { Screen, SectionTitle } from '@/components/ui/screen';
import { StatusPill } from '@/components/ui/status-pill';
import { Eyebrow, Heading } from '@/components/ui/typography';
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

      <View style={styles.headerBlock}>
        <Eyebrow>{cat.label}</Eyebrow>
        <Heading size={28}>{lesson.title}</Heading>
        <ThemedText themeColor="textSecondary" style={styles.summary}>
          {lesson.summary}
        </ThemedText>
        <View style={styles.pills}>
          <StatusPill label={`Úroveň ${lesson.level}`} tone="orange" />
          <StatusPill label={`${lesson.durationMin} min`} tone="neutral" />
        </View>
      </View>

      <Card style={{ backgroundColor: theme.tintSoft, borderColor: theme.tint + '33' }}>
        <View style={styles.iconRow}>
          <Icon name="bulb" size={20} color={theme.tint} />
          <ThemedText style={styles.flexText}>{lesson.why}</ThemedText>
        </View>
      </Card>

      <SectionTitle>Postup</SectionTitle>
      {lesson.steps.map((step, i) => (
        <View key={i} style={styles.step}>
          <View style={[styles.stepNum, { backgroundColor: theme.tint }]}>
            <ThemedText weight="black" style={styles.stepNumText}>
              {i + 1}
            </ThemedText>
          </View>
          <ThemedText style={styles.flexText}>{step}</ThemedText>
        </View>
      ))}

      {lesson.tips && lesson.tips.length > 0 ? (
        <>
          <SectionTitle>Tipy</SectionTitle>
          {lesson.tips.map((tip, i) => (
            <View key={i} style={styles.iconRow}>
              <Icon name="checkmark-circle" size={18} color={theme.success} />
              <ThemedText style={styles.flexText}>{tip}</ThemedText>
            </View>
          ))}
        </>
      ) : null}

      {lesson.gearTip ? (
        <Card style={{ backgroundColor: theme.accentSoft, borderColor: theme.tint + '33' }}>
          <View style={styles.iconRow}>
            <Icon name="bag-handle-outline" size={20} color={theme.tint} />
            <View style={styles.flex}>
              <ThemedText weight="extrabold" size={15}>
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

const styles = StyleSheet.create({
  headerBlock: { gap: Spacing.two },
  summary: { fontSize: 16, lineHeight: 23 },
  pills: { flexDirection: 'row', gap: Spacing.two, marginTop: Spacing.one },
  iconRow: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.two },
  flex: { flex: 1 },
  flexText: { flex: 1, fontSize: 15, lineHeight: 22 },
  step: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.three },
  stepNum: {
    width: 30,
    height: 30,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumText: { color: '#FFFFFF', fontSize: 15 },
});
