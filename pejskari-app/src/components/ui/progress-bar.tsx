import { StyleSheet, View } from 'react-native';

import { Radius } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export function ProgressBar({ value, height = 10 }: { value: number; height?: number }) {
  const theme = useTheme();
  const pct = Math.round(Math.max(0, Math.min(1, value)) * 100);
  return (
    <View
      style={[styles.track, { backgroundColor: theme.backgroundSelected, height, borderRadius: height / 2 }]}>
      <View
        style={[
          styles.fill,
          { width: `${pct}%`, backgroundColor: theme.tint, borderRadius: height / 2 },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: '100%',
    overflow: 'hidden',
    borderRadius: Radius.pill,
  },
  fill: {
    height: '100%',
  },
});
