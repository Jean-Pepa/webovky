# Pejskaři — poznámky pro vývoj

Mobilní aplikace na **Expo SDK 56** (React Native 0.85, React 19), Expo Router,
TypeScript. Expo se hodně mění mezi verzemi — pro jistotu čti verzované docs:
https://docs.expo.dev/versions/v56.0.0/

## Konvence

- Obrazovky jsou v `src/app/` (file-based routing). Skupina `(tabs)` drží spodní
  navigaci, ostatní routy (onboarding, `dog/*`, `lesson/[id]`, `guide/[id]`) jsou
  ve stacku v `src/app/_layout.tsx`.
- Stav a persistence: `src/store/dog-store.tsx` (React Context + AsyncStorage).
  Nová data ke psovi přidávej do typu `Dog` a do `DogForm`.
- Obsah (plemena, lekce, články) je čistá data v `src/data/` — rozšiřuj tam,
  ne v komponentách.
- Logika výcvikového plánu je v `src/lib/plan.ts`.
- Barvy/spacing ber z `src/constants/theme.ts` a používej `useTheme()` +
  `ThemedText`. Ikony přes `@/components/ui/icon` (Ionicons).

## Pozn. k prostředí

- `npx expo install` zde nemusí projít (potřebuje Expo API). Verze ber přímo
  z `node_modules/expo/bundledNativeModules.json` a instaluj přes `npm install`.
- Smoke test bez emulátoru: `npx expo export --platform android` (zbuduje bundle).
