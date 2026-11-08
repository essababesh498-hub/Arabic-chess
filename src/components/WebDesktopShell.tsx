import React, { useEffect } from 'react';
import { Platform, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { usePathname } from 'expo-router';
import { brand } from '@/lib/brand';
import { useLocale } from '@/context/LocaleContext';
import { useLocaleLayout } from '@/lib/localeLayout';
import { colors, spacing, typography } from '@/lib/theme';

const PHONE_WIDTH = 420;
const PHONE_MAX_HEIGHT = 860;
/** Wide enough for the authored 3D camera to keep all eight files on screen. */
const WIDE_GAME_ASPECT = 1.2;
const LANDSCAPE_GAME_ASPECT = 1.45;

function isPlayGame(pathname: string) {
  const path = pathname.split('?')[0].replace(/\/+$/, '');
  return path === '/play/game';
}

/**
 * On wide web viewports, centers a phone-sized frame so the RTL mobile UI
 * stays usable. The computer game instead uses a landscape table so the
 * whole board stays visible. Native and narrow web pass the screen through,
 * which keeps a phone in landscape full-bleed.
 */
export function WebDesktopShell({ children }: { children: React.ReactNode }) {
  const { width, height } = useWindowDimensions();
  const pathname = usePathname();
  const { copy, locale } = useLocale();
  const layout = useLocaleLayout();
  const game = isPlayGame(pathname);

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof document === 'undefined') return;
    document.documentElement.lang = locale;
    document.documentElement.dir = layout.direction;
    document.body.style.backgroundColor = colors.background;
  }, [layout.direction, locale]);

  if (Platform.OS !== 'web' || width < 720) {
    return <View style={[styles.fill, { direction: layout.direction }]}>{children}</View>;
  }

  const frameHeight = Math.min(height - 48, PHONE_MAX_HEIGHT);
  const windowAspect = width / Math.max(height, 1);
  const gameFillsWindow = windowAspect >= WIDE_GAME_ASPECT;
  const letterboxHeight = Math.min(height, Math.round(width / LANDSCAPE_GAME_ASPECT));

  return (
    <View
      style={[
        styles.desktopBackdrop,
        { direction: layout.direction },
        game && styles.gameBackdrop,
      ]}
      accessibilityLabel={game ? undefined : 'محاكي سطح المكتب'}
    >
      <Text style={[styles.hint, layout.center, game && styles.hidden]}>
        {copy.desktopHint} · {brand.name}
      </Text>
      <View
        style={[
          game ? styles.gameFrame : styles.phoneFrame,
          game && !gameFillsWindow ? styles.gameLetterbox : null,
          game
            ? gameFillsWindow
              ? styles.gameFill
              : { width: '100%', height: letterboxHeight }
            : { width: Math.min(PHONE_WIDTH, width - 48), height: frameHeight },
        ]}
      >
        <View style={[styles.phoneNotch, game && styles.hidden]} />
        <View style={game ? styles.gameScreen : styles.phoneScreen}>{children}</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  desktopBackdrop: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.lg,
    gap: spacing.sm,
  },
  hint: {
    ...typography.caption,
    color: colors.silver,
    textAlign: 'center',
    writingDirection: 'rtl',
  },
  phoneFrame: {
    backgroundColor: '#14161C',
    borderRadius: 28,
    padding: 10,
    borderWidth: 1,
    borderColor: '#3A4150',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.45,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
  },
  phoneNotch: {
    alignSelf: 'center',
    width: 96,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#2A2620',
    marginBottom: 6,
  },
  phoneScreen: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: 18,
    overflow: 'hidden',
  },
  gameBackdrop: {
    paddingVertical: 0,
    paddingHorizontal: 0,
    gap: 0,
  },
  gameFrame: {
    padding: 0,
    borderWidth: 0,
    borderRadius: 0,
    backgroundColor: colors.background,
    overflow: 'hidden',
  },
  gameLetterbox: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#3A4150',
  },
  gameFill: {
    flex: 1,
    alignSelf: 'stretch',
    width: '100%',
  },
  gameScreen: {
    flex: 1,
    backgroundColor: colors.background,
    overflow: 'hidden',
  },
  hidden: {
    display: 'none',
  },
});
