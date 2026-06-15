/**
 * Design tokens for Pejskaři — "rouglie" inspired: warm cream background, white
 * rounded cards, vivid orange accent, near-black rounded-bold headings, pastel
 * status pills. Themed components read the `Colors` map via `useTheme()`.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#1E1A17',
    textSecondary: '#736E68',
    background: '#F4F1EC',
    backgroundElement: '#FFFFFF',
    backgroundSelected: '#FCE9DF',
    card: '#FFFFFF',
    border: '#ECE6DD',
    tint: '#F05A28',
    onTint: '#FFFFFF',
    tintSoft: '#FCE4D8',
    accent: '#F05A28',
    accentSoft: '#FCE4D8',
    success: '#1B8E50',
    successSoft: '#DDF3E4',
    warning: '#9A6B00',
    warningSoft: '#FBEFCB',
    danger: '#E5484D',
    dangerSoft: '#FBE3E3',
    neutralSoft: '#EEEBE4',
  },
  dark: {
    text: '#F5EFE9',
    textSecondary: '#A8A199',
    background: '#16130F',
    backgroundElement: '#211D18',
    backgroundSelected: '#3A2418',
    card: '#211D18',
    border: '#322C25',
    tint: '#FB6E3C',
    onTint: '#FFFFFF',
    tintSoft: '#3A2418',
    accent: '#FB6E3C',
    accentSoft: '#3A2418',
    success: '#3DD183',
    successSoft: '#163522',
    warning: '#E8B84B',
    warningSoft: '#332912',
    danger: '#FF6369',
    dangerSoft: '#3A1D1E',
    neutralSoft: '#2A2520',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

/** Nunito (rounded, friendly) per-weight families from @expo-google-fonts/nunito. */
export const Font = {
  regular: 'Nunito_400Regular',
  medium: 'Nunito_600SemiBold',
  bold: 'Nunito_700Bold',
  extrabold: 'Nunito_800ExtraBold',
  black: 'Nunito_900Black',
} as const;

export type FontWeightToken = keyof typeof Font;

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
  sm: 12,
  md: 16,
  lg: 22,
  xl: 28,
  pill: 999,
} as const;

/** Soft elevation for cards (maps to box-shadow on web, elevation on Android). */
export const Shadow = {
  soft: {
    shadowColor: '#1E1A17',
    shadowOpacity: 0.06,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 720;
