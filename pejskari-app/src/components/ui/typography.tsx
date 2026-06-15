import { StyleSheet, View, type StyleProp, type TextStyle } from 'react-native';
import type { ReactNode } from 'react';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

/** Big rounded-black heading with an optional orange accent word (deck style). */
export function Heading({
  children,
  accent,
  size = 28,
  style,
}: {
  children?: ReactNode;
  accent?: string;
  size?: number;
  style?: StyleProp<TextStyle>;
}) {
  const lineHeight = Math.round(size * 1.12);
  return (
    <ThemedText weight="black" size={size} style={[{ lineHeight }, style]}>
      {children}
      {accent ? (
        <ThemedText weight="black" size={size} themeColor="tint" style={{ lineHeight }}>
          {accent}
        </ThemedText>
      ) : null}
    </ThemedText>
  );
}

/** Small uppercase orange label on a soft-orange pill. */
export function Eyebrow({ children }: { children: string }) {
  const theme = useTheme();
  return (
    <View style={[styles.eyebrow, { backgroundColor: theme.tintSoft }]}>
      <ThemedText weight="extrabold" themeColor="tint" style={styles.eyebrowText}>
        {children.toUpperCase()}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  eyebrow: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.three,
    paddingVertical: 6,
    borderRadius: Radius.pill,
  },
  eyebrowText: {
    fontSize: 12,
    letterSpacing: 0.8,
  },
});
