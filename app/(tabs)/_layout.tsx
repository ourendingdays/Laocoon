import { Tabs } from 'expo-router';
import { Image } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#ffd33d',
        headerStyle: {
          backgroundColor: '#25292e',
        },
        headerShadowVisible: false,
        headerTintColor: '#fff',
        tabBarStyle: {
          backgroundColor: '#25292e',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused, size }) => (
            <Image
              source={require('../../assets/nav-icons/nav-home-24.png')}
              style={{ width: size, height: size, opacity: focused ? 1 : 0.5 }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ focused, size }) => (
            <Image
              source={require('../../assets/nav-icons/nav-history-24.png')}
              style={{ width: size, height: size, opacity: focused ? 1 : 0.5 }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="journal"
        options={{
          title: 'Journal',
          tabBarIcon: ({ focused, size }) => (
            <Image
              source={require('../../assets/nav-icons/nav-journal-24.png')}
              style={{ width: size, height: size, opacity: focused ? 1 : 0.5 }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused, size }) => (
            <Image
              source={require('../../assets/nav-icons/nav-profile-24.png')}
              style={{ width: size, height: size, opacity: focused ? 1 : 0.5 }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          title: 'About',
          tabBarIcon: ({ focused, size }) => (
            <Image
              source={require('../../assets/nav-icons/nav-about-24.png')}
              style={{ width: size, height: size, opacity: focused ? 1 : 0.5 }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ focused, size }) => (
            <Image
              source={require('../../assets/nav-icons/nav-settings-24.png')}
              style={{ width: size, height: size, opacity: focused ? 1 : 0.5 }}
            />
          ),
        }}
      />
    </Tabs>
  );
}
