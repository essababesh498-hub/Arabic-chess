import React from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { colors } from '@/lib/theme';

/** Dark header band with a restrained gold glow. */
export function LinearGradientFallback({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View style={[styles.base, style]}>
      <View style={styles.glowGold} />
      <View style={styles.glowSilver} />
      <View style={styles.rule} />
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.backgroundRaised,
    overflow: 'hidden',
    position: 'relative',
  },
  glowGold: {
    position: 'absolute',
    top: -90,
    end: -50,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(198, 161, 91, 0.16)',
  },
  glowSilver: {
    position: 'absolute',
    bottom: -70,
    start: -40,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(197, 204, 214, 0.06)',
  },
  rule: {
    position: 'absolute',
    start: 24,
    end: 24,
    bottom: 0,
    height: 1,
    backgroundColor: 'rgba(198, 161, 91, 0.45)',
  },
  content: {
    zIndex: 1,
  },
});
