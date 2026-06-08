import { Tabs } from 'expo-router';

import { ModernTabBar } from '@/components/navigation/ModernTabBar';

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <ModernTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarStyle: { position: 'absolute' },
      }}>
      <Tabs.Screen name="search" options={{ title: 'Home' }} />
      <Tabs.Screen name="history" options={{ href: null }} />
      <Tabs.Screen name="saved" options={{ title: 'Saved' }} />
      <Tabs.Screen name="settings" options={{ title: 'Settings' }} />
    </Tabs>
  );
}
