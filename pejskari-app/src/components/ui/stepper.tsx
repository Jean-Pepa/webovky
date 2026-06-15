import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Icon } from '@/components/ui/icon';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

interface StepperProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

/** Jednoduchý +/- volič čísla (např. věk). */
export function Stepper({ label, value, onChange, min = 0, max = 99 }: StepperProps) {
  const theme = useTheme();
  return (
    <View style={styles.row}>
      <ThemedText style={styles.label}>{label}</ThemedText>
      <View style={[styles.controls, { borderColor: theme.border }]}>
        <Pressable
          accessibilityRole="button"
          onPress={() => onChange(Math.max(min, value - 1))}
          style={styles.btn}>
          <Icon name="remove" size={20} color={theme.text} />
        </Pressable>
        <ThemedText style={styles.value}>{value}</ThemedText>
        <Pressable
          accessibilityRole="button"
          onPress={() => onChange(Math.min(max, value + 1))}
          style={styles.btn}>
          <Icon name="add" size={20} color={theme.text} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: { fontSize: 16 },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: Radius.pill,
  },
  btn: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  value: {
    minWidth: 28,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '700',
  },
});
