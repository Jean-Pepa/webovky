import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Icon } from '@/components/ui/icon';
import { Radius, Spacing } from '@/constants/theme';

/** Small colored category label (soft tinted background). */
export function Tag({ label, color, icon }: { label: string; color: string; icon?: string }) {
  return (
    <View style={[styles.tag, { backgroundColor: color + '22' }]}>
      {icon ? <Icon name={icon} size={12} color={color} /> : null}
      <ThemedText weight="extrabold" style={[styles.text, { color }]}>
        {label}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.half,
    paddingHorizontal: Spacing.two,
    paddingVertical: 4,
    borderRadius: Radius.pill,
    alignSelf: 'flex-start',
  },
  text: { fontSize: 12 },
});
