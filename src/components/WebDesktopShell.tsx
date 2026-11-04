import React, { useEffect } from 'react';
import { Platform, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { brand } from '@/lib/brand';
import { useLocale } from '@/context/LocaleContext';
import { colors, spacing, typography } from '@/lib/theme';

const PHONE_WIDTH = 420;
const PHONE_MAX_HEIGHT = 860;

/**
 * On wide web viewports, centers a phone-ish frame so the RTL mobile UI
 * stays usable as a desktop simulator. Native / narrow web: passthrough.
 */
export function WebDesktopShell({ children }: { children: React.ReactNode }) {
  const { width, height } = useWindowDimensions();
  const { copy, locale } = useLocale();

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof document === 'undefined') return;
    document.documentElement.lang = locale;
    document.documentElement.dir = 'rtl';
    document.body.style.backgroundColor = colors.background;
  }, [locale]);

  if (Platform.OS !== 'web' || width < 720) {
    return <View style={styles.fill}>{children}</View>;
  }

  const frameHeight = Math.min(height - 48, PHONE_MAX_HEIGHT);

  return (
    <View style={styles.desktopBackdrop} accessibilityLabel="محاكي سطح المكتب">
      <Text style={styles.hint}>
        {copy.desktopHint} · {brand.name}
      </Text>
      <View
        style={[
          styles.phoneFrame,
          { width: Math.min(PHONE_WIDTH, width - 48), height: frameHeight },
        ]}
      >
        <View style={styles.phoneNotch} />
        <View style={styles.phoneScreen}>{children}</View>
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
});
