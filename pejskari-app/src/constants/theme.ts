/**
 * Design tokens for the Pejskaři app — colors (light/dark), spacing, radii and fonts.
 * The themed components (`ThemedText`, `ThemedView`, `useTheme`) read the `Colors` map.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#11181C',
    textSecondary: '#5B6470',
    background: '#F4F5F7',
    backgroundElement: '#FFFFFF',
    backgroundSelected: '#E6E8EB',
    card: '#FFFFFF',
    border: '#E6E8EB',
    tint: '#1E9E5A',
    onTint: '#FFFFFF',
    tintSoft: '#E4F5EC',
    accent: '#F2992E',
    accentSoft: '#FCEFD9',
    danger: '#E5484D',
    success: '#1E9E5A',
  },
  dark: {
    text: '#ECEDEE',
    textSecondary: '#9BA1A6',
    background: '#0E0F11',
    backgroundElement: '#1A1C1E',
    backgroundSelected: '#26292C',
    card: '#1A1C1E',
    border: '#2A2D30',
    tint: '#3DD183',
    onTint: '#062314',
    tintSoft: '#10271A',
    accent: '#F2A94E',
    accentSoft: '#2A2113',
    danger: '#FF6369',
    success: '#3DD183',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const Radius = {
  sm: 10,
  md: 14,
  lg: 20,
  xl: 28,
  pill: 999,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 720;
