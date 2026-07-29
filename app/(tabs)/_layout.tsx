import { Tabs } from 'expo-router';
import { CustomTabBar } from '../../src/components/CustomTabBar';
import React from 'react';

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
        }}
      />
      <Tabs.Screen
        name="favorite"
        options={{
          title: 'Favorite',
        }}
      />
      <Tabs.Screen
        name="setting"
        options={{
          title: 'Setting',
        }}
      />
    </Tabs>
  );
}
