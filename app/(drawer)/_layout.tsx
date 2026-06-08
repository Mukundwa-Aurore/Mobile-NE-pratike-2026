import { Drawer } from 'expo-router/drawer';

import { CustomDrawerContent } from '@/components/drawer/CustomDrawerContent';
import { LexiconColors } from '@/constants/lexicon-theme';

export default function DrawerLayout() {
  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerType: 'front',
        drawerStyle: {
          width: '85%',
          backgroundColor: LexiconColors.background,
        },
        overlayColor: 'rgba(17, 28, 45, 0.4)',
      }}>
      <Drawer.Screen
        name="(tabs)"
        options={{
          title: 'LexiTech',
          drawerItemStyle: { display: 'none' },
        }}
      />
    </Drawer>
  );
}
