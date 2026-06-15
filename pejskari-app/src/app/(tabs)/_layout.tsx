import { Redirect, Tabs } from 'expo-router';

import { Icon } from '@/components/ui/icon';
import { useTheme } from '@/hooks/use-theme';
import { useDogs } from '@/store/dog-store';

export default function TabsLayout() {
  const theme = useTheme();
  const { dogs, isLoading } = useDogs();

  if (isLoading) return null;
  // Bez profilu psa pošleme uživatele do onboardingu.
  if (dogs.length === 0) return <Redirect href="/onboarding" />;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.tint,
        tabBarInactiveTintColor: theme.textSecondary,
        tabBarStyle: { backgroundColor: theme.card, borderTopColor: theme.border },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Domů',
          tabBarIcon: ({ color, focused, size }) => (
            <Icon name={focused ? 'home' : 'home-outline'} color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="training"
        options={{
          title: 'Výcvik',
          tabBarIcon: ({ color, focused, size }) => (
            <Icon name={focused ? 'paw' : 'paw-outline'} color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="guide"
        options={{
          title: 'Průvodce',
          tabBarIcon: ({ color, focused, size }) => (
            <Icon name={focused ? 'book' : 'book-outline'} color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color, focused, size }) => (
            <Icon name={focused ? 'person' : 'person-outline'} color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
