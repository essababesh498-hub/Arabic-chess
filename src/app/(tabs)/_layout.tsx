import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useCopy } from '@/context/LocaleContext';
import { useLocaleLayout } from '@/lib/localeLayout';
import { colors } from '@/lib/theme';

export default function TabsLayout() {
  const copy = useCopy();
  const layout = useLocaleLayout();

  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: colors.backgroundRaised },
        headerTintColor: colors.ivory,
        headerTitleStyle: {
          fontFamily: 'IBMPlexSansArabic_700Bold',
          fontSize: 20,
        },
        headerShadowVisible: false,
        headerTitleAlign: 'center',
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.inkMuted,
        tabBarLabelStyle: {
          fontFamily: 'IBMPlexSansArabic_600SemiBold',
          fontSize: 11,
        },
        // Web does not detach inactive tabs. A transparent scene would leave
        // the previous screen visible underneath, so fade them out instantly.
        animation: 'fade',
        transitionSpec: {
          animation: 'timing',
          config: { duration: 0 },
        },
        tabBarStyle: {
          backgroundColor: colors.backgroundRaised,
          borderTopColor: colors.border,
          height: 68,
          paddingBottom: 8,
          paddingTop: 6,
          direction: layout.direction,
        },
        sceneStyle: { backgroundColor: colors.background, direction: layout.direction },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: copy.navHome,
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" color={color as string} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="learn/index"
        options={{
          title: copy.navLearn,
          headerTitle: copy.learnTitle,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="book-outline" color={color as string} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="play/index"
        options={{
          title: copy.navPlay,
          headerTitle: copy.playTitle,
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="game-controller-outline"
              color={color as string}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="store"
        options={{
          title: copy.navStore,
          headerTitle: copy.storeTitle,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="diamond-outline" color={color as string} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: copy.navProfile,
          headerTitle: copy.profileTitle,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" color={color as string} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
