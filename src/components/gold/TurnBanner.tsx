import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { GoldPanel } from '@/components/gold/GoldPanel';
import { gold } from '@/lib/goldTheme';
import { useLocaleLayout } from '@/lib/localeLayout';

type Props = {
  label: string;
  detail?: string | null;
  active?: boolean;
};

/** Slim banner that sits just above the bottom player bar. */
export function TurnBanner({ label, detail, active }: Props) {
  const layout = useLocaleLayout();
  return (
    <GoldPanel active={active} style={styles.banner} contentStyle={styles.content}>
      <Text numberOfLines={1} style={[styles.label, layout.center]}>
        {label}
      </Text>
      {detail ? (
        <Text numberOfLines={1} style={[styles.detail, layout.center]}>
          {detail}
        </Text>
      ) : null}
    </GoldPanel>
  );
}

const styles = StyleSheet.create({
  banner: {
    alignSelf: 'center',
    minWidth: 140,
  },
  content: {
    paddingVertical: 3,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 26,
  },
  label: {
    color: gold.goldBright,
    fontFamily: 'IBMPlexSansArabic_700Bold',
    fontSize: 14,
    lineHeight: 18,
    textAlign: 'center',
    writingDirection: 'rtl',
  },
  detail: {
    color: gold.danger,
    fontFamily: 'IBMPlexSansArabic_600SemiBold',
    fontSize: 12,
    lineHeight: 16,
    textAlign: 'center',
    writingDirection: 'rtl',
  },
});
