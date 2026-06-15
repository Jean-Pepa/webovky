import { Pressable, StyleSheet, Text, type StyleProp, type ViewStyle } from 'react-native';

import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { Icon } from '@/components/ui/icon';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';

interface ButtonProps {
  title: string;
  onPress?: () => void;
  variant?: Variant;
  icon?: string;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function Button({ title, onPress, variant = 'primary', icon, disabled, style }: ButtonProps) {
  const theme = useTheme();

  const bg =
    variant === 'primary'
      ? theme.tint
      : variant === 'danger'
        ? theme.danger
        : variant === 'secondary'
          ? theme.backgroundElement
          : 'transparent';
  const fg =
    variant === 'primary' || variant === 'danger'
      ? '#FFFFFF'
      : variant === 'ghost'
        ? theme.tint
        : theme.text;
  const borderColor =
    variant === 'secondary' ? theme.border : variant === 'ghost' ? theme.tint : 'transparent';

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: bg, borderColor, opacity: disabled ? 0.45 : pressed ? 0.85 : 1 },
        style,
      ]}>
      {icon ? <Icon name={icon} size={18} color={fg} /> : null}
      <Text style={[styles.label, { color: fg }]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    paddingVertical: 14,
    paddingHorizontal: Spacing.four,
    borderRadius: Radius.md,
    borderWidth: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
  },
});
