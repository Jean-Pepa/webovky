import { Text, type TextProps } from 'react-native';

import { Font, type FontWeightToken, type ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type ThemedTextProps = TextProps & {
  weight?: FontWeightToken;
  themeColor?: ThemeColor;
  size?: number;
};

/** Text using the Nunito family. Pick boldness via `weight` (not fontWeight). */
export function ThemedText({ style, weight = 'medium', themeColor, size, ...rest }: ThemedTextProps) {
  const theme = useTheme();
  return (
    <Text
      style={[
        { color: theme[themeColor ?? 'text'], fontFamily: Font[weight] },
        size != null ? { fontSize: size } : null,
        style,
      ]}
      {...rest}
    />
  );
}
