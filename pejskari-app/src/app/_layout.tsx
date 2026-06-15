import {
  Nunito_400Regular,
  Nunito_600SemiBold,
  Nunito_700Bold,
  Nunito_800ExtraBold,
  Nunito_900Black,
  useFonts,
} from '@expo-google-fonts/nunito';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';

import { Colors } from '@/constants/theme';
import { DogProvider } from '@/store/dog-store';

export default function RootLayout() {
  const scheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const palette = Colors[scheme];
  const [fontsLoaded] = useFonts({
    Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
    Nunito_900Black,
  });

  const base = scheme === 'dark' ? DarkTheme : DefaultTheme;
  const navTheme = {
    ...base,
    colors: {
      ...base.colors,
      primary: palette.tint,
      background: palette.background,
      card: palette.card,
      text: palette.text,
      border: palette.border,
    },
  };

  if (!fontsLoaded) return null;

  return (
    <DogProvider>
      <ThemeProvider value={navTheme}>
        <Stack
          screenOptions={{
            headerShadowVisible: false,
            headerStyle: { backgroundColor: palette.background },
            headerTitleStyle: { fontFamily: 'Nunito_800ExtraBold', color: palette.text },
            contentStyle: { backgroundColor: palette.background },
          }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="onboarding" options={{ headerShown: false, gestureEnabled: false }} />
          <Stack.Screen name="dog/new" options={{ presentation: 'modal', title: 'Nový pejsek' }} />
          <Stack.Screen
            name="dog/[id]/edit"
            options={{ presentation: 'modal', title: 'Upravit pejska' }}
          />
          <Stack.Screen name="lesson/[id]" options={{ title: 'Lekce' }} />
          <Stack.Screen name="guide/[id]" options={{ title: 'Průvodce' }} />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </DogProvider>
  );
}
