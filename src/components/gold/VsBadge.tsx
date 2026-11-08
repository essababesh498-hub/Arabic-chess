import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { gold } from '@/lib/goldTheme';

/** Small gold medallion between the two players. */
export function VsBadge() {
  return (
    <View style={styles.wrap} accessibilityLabel="ضد">
      <View style={styles.badge}>
        <Text style={styles.label}>VS</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 22,
  },
  badge: {
    minWidth: 36,
    height: 22,
    paddingHorizontal: 8,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: gold.gold,
    backgroundColor: gold.black,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: gold.gold,
    shadowOpacity: 0.7,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
  },
  label: {
    color: gold.goldBright,
    fontFamily: 'IBMPlexSansArabic_700Bold',
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 0.5,
  },
});
