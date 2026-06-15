import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { StatusPill } from '@/components/ui/status-pill';
import { Tag } from '@/components/ui/tag';
import { LESSON_CATEGORIES } from '@/data/categories';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { Lesson } from '@/types';

interface LessonCardProps {
  lesson: Lesson;
  done?: boolean;
  locked?: boolean;
  onPress?: () => void;
}

export function LessonCard({ lesson, done, locked, onPress }: LessonCardProps) {
  const theme = useTheme();
  const cat = LESSON_CATEGORIES[lesson.category];

  const statusBg = done ? theme.success : locked ? theme.neutralSoft : theme.tintSoft;

  return (
    <Card onPress={locked ? undefined : onPress} style={locked ? styles.locked : undefined}>
      <View style={styles.row}>
        <View style={[styles.status, { backgroundColor: statusBg }]}>
          {locked ? (
            <Icon name="lock-closed" size={16} color={theme.textSecondary} />
          ) : done ? (
            <Icon name="checkmark" size={20} color="#FFFFFF" />
          ) : (
            <ThemedText weight="black" size={16} themeColor="tint">
              {lesson.level}
            </ThemedText>
          )}
        </View>

        <View style={styles.body}>
          <ThemedText weight="extrabold" size={16}>
            {lesson.title}
          </ThemedText>
          <View style={styles.meta}>
            <Tag label={cat.label} color={cat.color} icon={cat.icon} />
            <ThemedText themeColor="textSecondary" size={13}>
              {lesson.durationMin} min
            </ThemedText>
          </View>
        </View>

        {done ? (
          <StatusPill label="Hotovo" tone="green" dot />
        ) : locked ? (
          <StatusPill label="Zamčeno" tone="neutral" />
        ) : (
          <Icon name="chevron-forward" size={20} color={theme.textSecondary} />
        )}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  locked: { opacity: 0.6 },
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three },
  status: {
    width: 40,
    height: 40,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: { flex: 1, gap: Spacing.one },
  meta: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
});
