import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { LessonCard } from '@/components/lesson-card';
import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { ProgressBar } from '@/components/ui/progress-bar';
import { Screen, ScreenHeader } from '@/components/ui/screen';
import { Spacing } from '@/constants/theme';
import { getBreed } from '@/data/breeds';
import { useTheme } from '@/hooks/use-theme';
import { buildPlan, groupByLevel, levelUnlocked, planStats } from '@/lib/plan';
import { useDogs } from '@/store/dog-store';

export default function TrainingScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { activeDog, completedFor, isLessonDone } = useDogs();

  if (!activeDog) return null;

  const breed = getBreed(activeDog.breedId);
  const plan = buildPlan(activeDog, breed);
  const levels = groupByLevel(plan);
  const completed = completedFor();
  const stats = planStats(plan, completed);

  return (
    <Screen>
      <ScreenHeader title="Výcvikový plán" subtitle={`Na míru pro ${activeDog.name}`} />

      <Card>
        <View style={styles.statsRow}>
          <ThemedText style={styles.bigPct}>{Math.round(stats.pct * 100)} %</ThemedText>
          <View style={styles.statsText}>
            <ThemedText style={styles.statsTitle}>Celkový pokrok</ThemedText>
            <ThemedText themeColor="textSecondary">
              {stats.completed} z {stats.total} lekcí
            </ThemedText>
          </View>
        </View>
        <ProgressBar value={stats.pct} />
      </Card>

      {levels.length === 0 ? (
        <Card>
          <ThemedText themeColor="textSecondary">
            Pro toho nejmenšího zatím nemáme lekce. Vraťte se, až trochu povyroste 🐾
          </ThemedText>
        </Card>
      ) : null}

      {levels.map((lvl, index) => {
        const unlocked = levelUnlocked(levels, index, completed);
        const levelDone = lvl.lessons.filter((l) => isLessonDone(l.id)).length;
        return (
          <View key={lvl.level} style={styles.level}>
            <View style={styles.levelHead}>
              <ThemedText style={styles.levelTitle}>Úroveň {lvl.level}</ThemedText>
              {unlocked ? (
                <ThemedText themeColor="textSecondary" style={styles.levelCount}>
                  {levelDone}/{lvl.lessons.length}
                </ThemedText>
              ) : (
                <View style={styles.lockRow}>
                  <Icon name="lock-closed" size={13} color={theme.textSecondary} />
                  <ThemedText themeColor="textSecondary" style={styles.levelCount}>
                    Dokončete úroveň {lvl.level - 1}
                  </ThemedText>
                </View>
              )}
            </View>
            {lvl.lessons.map((lesson) => (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
                done={isLessonDone(lesson.id)}
                locked={!unlocked}
                onPress={() => router.push({ pathname: '/lesson/[id]', params: { id: lesson.id } })}
              />
            ))}
          </View>
        );
      })}
    </Screen>
  );
}

const styles = StyleSheet.create({
  statsRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three, marginBottom: Spacing.three },
  bigPct: { fontSize: 38, fontWeight: '800' },
  statsText: { flex: 1 },
  statsTitle: { fontSize: 17, fontWeight: '700' },
  level: { gap: Spacing.two },
  levelHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.two,
  },
  levelTitle: { fontSize: 19, fontWeight: '700' },
  levelCount: { fontSize: 14 },
  lockRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.one },
});
