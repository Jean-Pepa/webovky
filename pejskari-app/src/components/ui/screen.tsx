import { ScrollView, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { ReactNode } from 'react';

import { ThemedText } from '@/components/themed-text';
import { Heading } from '@/components/ui/typography';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

interface ScreenProps {
  children: ReactNode;
  scroll?: boolean;
  contentStyle?: StyleProp<ViewStyle>;
}

export function Screen({ children, scroll = true, contentStyle }: ScreenProps) {
  const theme = useTheme();
  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: theme.background }]}
      edges={['top', 'left', 'right']}>
      {scroll ? (
        <ScrollView
          contentContainerStyle={[styles.content, contentStyle]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.flex, styles.content, contentStyle]}>{children}</View>
      )}
    </SafeAreaView>
  );
}

export function ScreenHeader({
  eyebrow,
  title,
  accent,
  subtitle,
  right,
}: {
  eyebrow?: ReactNode;
  title: string;
  accent?: string;
  subtitle?: string;
  right?: ReactNode;
}) {
  return (
    <View style={styles.headerRow}>
      <View style={styles.flex}>
        {eyebrow}
        <Heading accent={accent} size={30} style={styles.heading}>
          {title}
        </Heading>
        {subtitle ? (
          <ThemedText themeColor="textSecondary" style={styles.subtitle}>
            {subtitle}
          </ThemedText>
        ) : null}
      </View>
      {right}
    </View>
  );
}

export function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <ThemedText weight="extrabold" style={styles.sectionTitle}>
      {children}
    </ThemedText>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  flex: { flex: 1 },
  content: {
    padding: Spacing.three,
    gap: Spacing.three,
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    paddingBottom: Spacing.six,
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three },
  heading: { marginTop: Spacing.one },
  subtitle: { fontSize: 15, marginTop: 2 },
  sectionTitle: { fontSize: 20, marginTop: Spacing.one },
});
