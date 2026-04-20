import { Tabs } from 'expo-router';
import {
  AboutIcon,
  HistoryIcon,
  HomeIcon,
  JournalIcon,
  ProfileIcon,
  SettingsIcon,
} from '../../assets/icons';
import { colors } from '../../styles/theme';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.gold.bronze,
        tabBarInactiveTintColor: colors.stone.ash,
        headerStyle: {
          backgroundColor: colors.background.pitch,
        },
        headerShadowVisible: false,
        headerTintColor: colors.text.primary,
        tabBarStyle: {
          backgroundColor: colors.tabBar.background,
          borderTopColor: colors.tabBar.border,
          borderTopWidth: 0.5,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => (
            <HomeIcon
              size={24}
              color={focused ? colors.tabBar.active : colors.tabBar.inactive}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ focused }) => (
            <HistoryIcon
              size={24}
              color={focused ? colors.tabBar.active : colors.tabBar.inactive}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="journal"
        options={{
          title: 'Journal',
          tabBarIcon: ({ focused }) => (
            <JournalIcon
              size={24}
              color={focused ? colors.tabBar.active : colors.tabBar.inactive}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => (
            <ProfileIcon
              size={24}
              color={focused ? colors.tabBar.active : colors.tabBar.inactive}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          title: 'About',
          tabBarIcon: ({ focused }) => (
            <AboutIcon
              size={24}
              color={focused ? colors.tabBar.active : colors.tabBar.inactive}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ focused }) => (
            <SettingsIcon
              size={24}
              color={focused ? colors.tabBar.active : colors.tabBar.inactive}
            />
          ),
        }}
      />
    </Tabs>
  );
}
