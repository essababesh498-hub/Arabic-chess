import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { TERMS } from '@/lib/glossary';
import { strings } from '@/lib/strings';
import { colors } from '@/lib/theme';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: colors.boardFrame },
        headerTintColor: colors.cream,
        headerTitleStyle: {
          fontFamily: 'IBMPlexSansArabic_700Bold',
          fontSize: 20,
        },
        headerTitleAlign: 'center',
        tabBarActiveTintColor: colors.boardFrame,
        tabBarInactiveTintColor: colors.inkMuted,
        tabBarLabelStyle: {
          fontFamily: 'IBMPlexSansArabic_600SemiBold',
          fontSize: 12,
        },
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          height: 64,
          paddingBottom: 8,
          paddingTop: 6,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: TERMS.home,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" color={color as string} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="learn/index"
        options={{
          title: TERMS.learn,
          headerTitle: strings.learnTitle,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="book-outline" color={color as string} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="play/index"
        options={{
          title: TERMS.play,
          headerTitle: strings.playTitle,
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
        name="settings"
        options={{
          title: TERMS.settings,
          headerTitle: strings.settingsTitle,
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="settings-outline"
              color={color as string}
              size={size}
            />
          ),
        }}
      />
    </Tabs>
  );
}
