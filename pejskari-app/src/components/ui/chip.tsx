import { Pressable, StyleSheet } from 'react-native';
import type { ReactNode } from 'react';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  left?: ReactNode;
}

export function Chip({ label, selected, onPress, left }: ChipProps) {
  const theme = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.chip,
        {
          backgroundColor: selected ? theme.tint : theme.backgroundElement,
          borderColor: selected ? theme.tint : theme.border,
        },
      ]}>
      {left}
      <ThemedText weight="bold" style={[styles.label, { color: selected ? theme.onTint : theme.text }]}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    paddingHorizontal: Spacing.three,
    paddingVertical: 10,
    borderRadius: Radius.pill,
    borderWidth: 1.5,
  },
  label: { fontSize: 14 },
});
