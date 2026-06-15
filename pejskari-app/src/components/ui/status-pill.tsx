import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type PillTone = 'orange' | 'green' | 'amber' | 'neutral';

/** Pastel status pill with an optional leading dot (deck style). */
export function StatusPill({ label, tone = 'neutral', dot }: { label: string; tone?: PillTone; dot?: boolean }) {
  const theme = useTheme();
  const map: Record<PillTone, { bg: string; fg: string }> = {
    orange: { bg: theme.tintSoft, fg: theme.tint },
    green: { bg: theme.successSoft, fg: theme.success },
    amber: { bg: theme.warningSoft, fg: theme.warning },
    neutral: { bg: theme.neutralSoft, fg: theme.textSecondary },
  };
  const c = map[tone];
  return (
    <View style={[styles.pill, { backgroundColor: c.bg }]}>
      {dot ? <View style={[styles.dot, { backgroundColor: c.fg }]} /> : null}
      <ThemedText weight="bold" style={[styles.text, { color: c.fg }]}>
        {label}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    paddingHorizontal: Spacing.two,
    paddingVertical: 4,
    borderRadius: Radius.pill,
    alignSelf: 'flex-start',
  },
  dot: { width: 7, height: 7, borderRadius: 999 },
  text: { fontSize: 12 },
});
