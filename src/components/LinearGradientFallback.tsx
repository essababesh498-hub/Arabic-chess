import React from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { colors } from '@/lib/theme';

/** Soft layered green backdrop without extra native gradient deps. */
export function LinearGradientFallback({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View style={[styles.base, style]}>
      <View style={styles.glowTop} />
      <View style={styles.glowBottom} />
      <View style={styles.pattern} />
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.boardFrame,
    overflow: 'hidden',
    position: 'relative',
  },
  glowTop: {
    position: 'absolute',
    top: -80,
    end: -40,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(212, 160, 23, 0.18)',
  },
  glowBottom: {
    position: 'absolute',
    bottom: -60,
    start: -30,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(47, 93, 74, 0.55)',
  },
  pattern: {
    position: 'absolute',
    inset: 0,
    opacity: 0.12,
    backgroundColor: 'transparent',
    borderWidth: 24,
    borderColor: colors.boardDark,
  },
  content: {
    zIndex: 1,
  },
});
