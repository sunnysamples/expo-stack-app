import { Tabs } from 'expo-router';

import { MatCommunityIcons } from '@/components/Icons';
import { TabBarIcon } from '@/components/TabBarIcon';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: 'black',
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Tab One1',
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
        }}
      />
      <Tabs.Screen
        name="emi-calculator"
        options={{
          title: 'EMI Calculator',
          tabBarIcon: ({ color }) => (
            <MatCommunityIcons
              name="calculator-variant-outline"
              size={28}
              className="color-foreground/60"
            />
          ),
        }}
      />
    </Tabs>
  );
}
