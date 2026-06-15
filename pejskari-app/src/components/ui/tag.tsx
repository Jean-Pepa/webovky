import { StyleSheet, Text, View } from 'react-native';

import { Radius, Spacing } from '@/constants/theme';
import { Icon } from '@/components/ui/icon';

/** Malý barevný štítek kategorie. `color` je hlavní barva, podklad je z ní zesvětlený. */
export function Tag({ label, color, icon }: { label: string; color: string; icon?: string }) {
  return (
    <View style={[styles.tag, { backgroundColor: color + '22' }]}>
      {icon ? <Icon name={icon} size={12} color={color} /> : null}
      <Text style={[styles.text, { color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.half,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half,
    borderRadius: Radius.pill,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 12,
    fontWeight: '700',
  },
});
