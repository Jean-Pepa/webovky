import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { LessonCard } from '@/components/lesson-card';
import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { ProgressBar } from '@/components/ui/progress-bar';
import { Screen } from '@/components/ui/screen';
import { StatusPill } from '@/components/ui/status-pill';
import { Eyebrow, Heading } from '@/components/ui/typography';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { buildPlan, groupByLevel, levelUnlocked, planStats } from '@/lib/plan';
import { useDogs } from '@/store/dog-store';

export default function TrainingScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { activeDog, completedFor, isLessonDone } = useDogs();

  if (!activeDog) return null;

  const plan = buildPlan(activeDog);
  const levels = groupByLevel(plan);
  const completed = completedFor();
  const stats = planStats(plan, completed);

  return (
    <Screen>
      <View>
        <Eyebrow>Plán na míru</Eyebrow>
        <Heading accent="plán" size={30} style={styles.heading}>
          Výcvikový{' '}
        </Heading>
        <ThemedText themeColor="textSecondary" style={styles.sub}>
          Sestavený pro {activeDog.name} podle plemene a věku
        </ThemedText>
      </View>

      <Card>
        <View style={styles.statsRow}>
          <ThemedText weight="black" size={40} themeColor="tint">
            {Math.round(stats.pct * 100)} %
          </ThemedText>
          <View style={styles.flex}>
            <ThemedText weight="extrabold" size={17}>
              Celkový pokrok
            </ThemedText>
            <ThemedText themeColor="textSecondary">
              {stats.completed} z {stats.total} lekcí splněno
            </ThemedText>
          </View>
        </View>
        <ProgressBar value={stats.pct} />
      </Card>

      {levels.length === 0 ? (
        <Card>
          <ThemedText themeColor="textSecondary">
            Pro toho nejmenšího zatím nemáme lekce. Vrať se, až trochu povyroste 🐾
          </ThemedText>
        </Card>
      ) : null}

      {levels.map((lvl, index) => {
        const unlocked = levelUnlocked(levels, index, completed);
        const levelDone = lvl.lessons.filter((l) => isLessonDone(l.id)).length;
        const allDone = levelDone === lvl.lessons.length;
        return (
          <View key={lvl.level} style={styles.level}>
            <View style={styles.levelHead}>
              <View style={styles.levelTitleRow}>
                <Icon
                  name={!unlocked ? 'lock-closed' : allDone ? 'checkmark-circle' : 'ellipse-outline'}
                  size={18}
                  color={!unlocked ? theme.textSecondary : allDone ? theme.success : theme.tint}
                />
                <ThemedText weight="extrabold" size={19}>
                  Úroveň {lvl.level}
                </ThemedText>
              </View>
              {unlocked ? (
                <StatusPill
                  label={`${levelDone}/${lvl.lessons.length}`}
                  tone={allDone ? 'green' : 'orange'}
                />
              ) : (
                <StatusPill label={`Dokonči úroveň ${lvl.level - 1}`} tone="neutral" />
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
  heading: { marginTop: Spacing.one },
  sub: { fontSize: 15, marginTop: 2 },
  flex: { flex: 1 },
  statsRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three, marginBottom: Spacing.three },
  level: { gap: Spacing.two },
  levelHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.two,
  },
  levelTitleRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
});
