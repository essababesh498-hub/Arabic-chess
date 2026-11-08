import React from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { gold, goldRadii } from '@/lib/goldTheme';

type Props = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  /** Brighter rim when this panel is the active clock or banner. */
  active?: boolean;
  contentStyle?: StyleProp<ViewStyle>;
};

/** Glossy black plate with a gold rim, a soft glow, and small corner marks. */
export function GoldPanel({ children, style, active, contentStyle }: Props) {
  return (
    <View style={[styles.glow, active && styles.glowActive, style]}>
      <View style={[styles.rim, active && styles.rimActive]}>
        <View style={styles.edge}>
          <View style={styles.body}>
            <View pointerEvents="none" style={styles.gloss} />
            <Corner style={styles.cornerTL} edges={styles.edgeTL} />
            <Corner style={styles.cornerTR} edges={styles.edgeTR} />
            <Corner style={styles.cornerBL} edges={styles.edgeBL} />
            <Corner style={styles.cornerBR} edges={styles.edgeBR} />
            <View style={[styles.content, contentStyle]}>{children}</View>
          </View>
        </View>
      </View>
    </View>
  );
}

function Corner({
  style,
  edges,
}: {
  style: StyleProp<ViewStyle>;
  edges: StyleProp<ViewStyle>;
}) {
  return <View pointerEvents="none" style={[styles.corner, style, edges]} />;
}

const styles = StyleSheet.create({
  glow: {
    shadowColor: gold.gold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.45,
    shadowRadius: 8,
    elevation: 6,
  },
  glowActive: {
    shadowOpacity: 0.9,
    shadowRadius: 12,
  },
  rim: {
    borderRadius: goldRadii.panel,
    padding: 1,
    backgroundColor: gold.goldDeep,
  },
  rimActive: {
    backgroundColor: gold.goldBright,
  },
  edge: {
    borderRadius: goldRadii.panel - 1,
    padding: 1,
    backgroundColor: gold.gold,
  },
  body: {
    borderRadius: goldRadii.panel - 2,
    backgroundColor: gold.panel,
    overflow: 'hidden',
  },
  gloss: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '46%',
    backgroundColor: gold.gloss,
  },
  content: {
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  corner: {
    position: 'absolute',
    width: 9,
    height: 9,
    borderColor: gold.goldBright,
  },
  cornerTL: { top: 3, left: 3 },
  cornerTR: { top: 3, right: 3 },
  cornerBL: { bottom: 3, left: 3 },
  cornerBR: { bottom: 3, right: 3 },
  edgeTL: { borderTopWidth: 1.5, borderLeftWidth: 1.5 },
  edgeTR: { borderTopWidth: 1.5, borderRightWidth: 1.5 },
  edgeBL: { borderBottomWidth: 1.5, borderLeftWidth: 1.5 },
  edgeBR: { borderBottomWidth: 1.5, borderRightWidth: 1.5 },
});
