import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

const hall = require('../../assets/hall-background.jpg');

/** Full-screen hall image behind the app. A dark veil keeps Arabic text readable. */
export function AppBackground({ children }: { children: React.ReactNode }) {
  return (
    <View style={styles.fill}>
      <Image
        accessible={false}
        source={hall}
        resizeMode="cover"
        style={styles.image}
      />
      <View pointerEvents="none" style={styles.scrim} />
      <View style={styles.fill}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  image: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  scrim: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(8, 6, 4, 0.55)',
  },
});
