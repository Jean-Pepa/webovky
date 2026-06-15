import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
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

  return (
    <Card onPress={locked ? undefined : onPress} style={locked ? styles.locked : undefined}>
      <View style={styles.row}>
        <View
          style={[
            styles.status,
            {
              backgroundColor: done ? theme.tint : theme.backgroundSelected,
              borderColor: done ? theme.tint : theme.border,
            },
          ]}>
          {locked ? (
            <Icon name="lock-closed" size={16} color={theme.textSecondary} />
          ) : done ? (
            <Icon name="checkmark" size={18} color={theme.onTint} />
          ) : (
            <ThemedText themeColor="textSecondary" style={styles.level}>
              {lesson.level}
            </ThemedText>
          )}
        </View>

        <View style={styles.body}>
          <ThemedText style={styles.title}>{lesson.title}</ThemedText>
          <View style={styles.meta}>
            <Tag label={cat.label} color={cat.color} icon={cat.icon} />
            <ThemedText themeColor="textSecondary" style={styles.duration}>
              {lesson.durationMin} min
            </ThemedText>
          </View>
        </View>

        {!locked ? <Icon name="chevron-forward" size={18} color={theme.textSecondary} /> : null}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  locked: { opacity: 0.55 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  status: {
    width: 36,
    height: 36,
    borderRadius: Radius.pill,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  level: { fontSize: 15, fontWeight: '700' },
  body: { flex: 1, gap: Spacing.one },
  title: { fontSize: 16, fontWeight: '700' },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  duration: { fontSize: 13 },
});
