import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { Square } from 'chess.js';
import { Board2DFallback } from '@/components/board/Board2DFallback';
import { colors, radii, spacing, typography } from '@/lib/theme';

/**
 * BoardStage — visual host for the chessboard.
 *
 * Design direction (Essa): tilted top-down **3D board + 3D pieces**
 * (not flat Chess.com chrome). IA stays Chess.com-like (learn / play / tips).
 *
 * TODO(3d-board): Replace Board2DFallback with a WebGL/Three (or Expo GL)
 * tilted board scene + 3D piece meshes. Keep this component's props stable so
 * Learn / Play / chapter demos do not need rewiring.
 */
export type BoardStageProps = {
  fen: string;
  orientation?: 'white' | 'black';
  selected?: Square | null;
  legalTargets?: Square[];
  lastMove?: { from: Square; to: Square } | null;
  highlighted?: Square[];
  interactive?: boolean;
  onSquarePress?: (square: Square) => void;
  showCoordinates?: boolean;
  /** Hide the temporary 2D badge (e.g. in tight lesson layouts). */
  hideScaffoldBadge?: boolean;
};

export function BoardStage(props: BoardStageProps) {
  return (
    <View style={styles.wrap}>
      {!props.hideScaffoldBadge ? (
        <View style={styles.badge} accessibilityLabel="لوحة مؤقتة ثنائية الأبعاد">
          <Text style={styles.badgeText}>لوحة ٢ب مؤقتة</Text>
          <Text style={styles.badgeHint}>قريباً: لوحة ثلاثية الأبعاد مائلة + قطع ٣ب</Text>
        </View>
      ) : null}
      {/* TODO(3d-board): <Board3DScene {...props} /> */}
      <Board2DFallback {...props} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: spacing.sm,
    alignItems: 'center',
  },
  badge: {
    alignSelf: 'stretch',
    backgroundColor: colors.sandSoft,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: 2,
  },
  badgeText: {
    ...typography.caption,
    fontFamily: 'IBMPlexSansArabic_600SemiBold',
    color: colors.ink,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  badgeHint: {
    ...typography.caption,
    color: colors.inkMuted,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
});
