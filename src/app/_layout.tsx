import React, { useEffect } from 'react';
import { I18nManager, View, ActivityIndicator, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
  useFonts,
  IBMPlexSansArabic_400Regular,
  IBMPlexSansArabic_600SemiBold,
  IBMPlexSansArabic_700Bold,
} from '@expo-google-fonts/ibm-plex-sans-arabic';
import { WebDesktopShell } from '@/components/WebDesktopShell';
import { LocaleProvider } from '@/context/LocaleContext';
import { ProgressProvider } from '@/context/ProgressContext';
import { colors } from '@/lib/theme';

// Force RTL for Arabic-first MVP (may require reload on first launch on some devices).
if (!I18nManager.isRTL) {
  I18nManager.allowRTL(true);
  I18nManager.forceRTL(true);
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    IBMPlexSansArabic_400Regular,
    IBMPlexSansArabic_600SemiBold,
    IBMPlexSansArabic_700Bold,
  });

  useEffect(() => {
    I18nManager.allowRTL(true);
    I18nManager.forceRTL(true);
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={styles.boot}>
        <ActivityIndicator color={colors.ivory} size="large" />
      </View>
    );
  }

  return (
    <LocaleProvider>
      <ProgressProvider>
        <StatusBar style="light" />
        <WebDesktopShell>
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: colors.background, flex: 1 },
              animation: 'fade',
            }}
          >
            <Stack.Screen name="(tabs)" />
            <Stack.Screen
              name="learn/[id]"
              options={{
                headerShown: true,
                headerTitle: 'فصل',
                headerBackTitle: 'رجوع',
                headerStyle: { backgroundColor: colors.backgroundRaised },
                headerTintColor: colors.ivory,
                headerShadowVisible: false,
                headerTitleStyle: {
                  fontFamily: 'IBMPlexSansArabic_600SemiBold',
                },
              }}
            />
            <Stack.Screen
              name="play/game"
              options={{
                headerShown: true,
                headerTitle: 'مباراة',
                headerBackTitle: 'رجوع',
                headerStyle: { backgroundColor: colors.backgroundRaised },
                headerTintColor: colors.ivory,
                headerShadowVisible: false,
                headerTitleStyle: {
                  fontFamily: 'IBMPlexSansArabic_600SemiBold',
                },
              }}
            />
          </Stack>
        </WebDesktopShell>
      </ProgressProvider>
    </LocaleProvider>
  );
}

const styles = StyleSheet.create({
  boot: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
