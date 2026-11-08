import React, { Suspense, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { Square } from 'chess.js';
import { Board2DFallback } from '@/components/board/Board2DFallback';
import { useBoardPixelSize } from '@/components/board/boardSize';
import { useCopy } from '@/context/LocaleContext';
import { useLocaleLayout } from '@/lib/localeLayout';
import { colors, radii, spacing, typography } from '@/lib/theme';

/**
 * BoardStage — visual host for the chessboard.
 *
 * The tilted 3D scene is the primary view. If it fails to load, the flat board
 * is shown instead. Props stay stable for Learn and Play.
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
  /** Cap the board so the game table fits the phone without scrolling. */
  maxSize?: number;
  /** First-person frame for the game table. Lessons keep the square size. */
  viewport?: { width: number; height: number };
};

const LazyBoard3D = React.lazy(() =>
  import('@/components/board/Board3DScene').then((mod) => ({
    default: mod.Board3DScene,
  })),
);

export function BoardStage(props: BoardStageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <View style={styles.wrap}>
        {props.hideScaffoldBadge ? null : <ScaffoldBadge />}
        <Board2DFallback {...props} />
      </View>
    );
  }

  return (
    <BoardErrorBoundary
      onError={() => setFailed(true)}
      fallback={
        <View style={styles.wrap}>
          {props.hideScaffoldBadge ? null : <ScaffoldBadge />}
          <Board2DFallback {...props} />
        </View>
      }
    >
      <Suspense fallback={<BoardPlaceholder maxSize={props.maxSize} viewport={props.viewport} />}>
        <LazyBoard3D {...props} />
      </Suspense>
    </BoardErrorBoundary>
  );
}

function BoardPlaceholder({
  maxSize,
  viewport,
}: {
  maxSize?: number;
  viewport?: { width: number; height: number };
}) {
  const fitted = useBoardPixelSize(maxSize);
  const width = viewport?.width ?? fitted;
  const height = viewport?.height ?? fitted;
  return <View style={[styles.placeholder, { width, height }]} />;
}

function ScaffoldBadge() {
  const copy = useCopy();
  const layout = useLocaleLayout();
  return (
    <View style={styles.badge} accessibilityLabel={copy.boardBadge}>
      <Text style={[styles.badgeText, layout.block]}>{copy.boardBadge}</Text>
      <Text style={[styles.badgeHint, layout.block]}>{copy.boardBadgeHint}</Text>
    </View>
  );
}

type BoundaryProps = {
  children: React.ReactNode;
  fallback: React.ReactNode;
  onError: () => void;
};

type BoundaryState = { failed: boolean };

class BoardErrorBoundary extends React.Component<BoundaryProps, BoundaryState> {
  state: BoundaryState = { failed: false };

  static getDerivedStateFromError(): BoundaryState {
    return { failed: true };
  }

  componentDidCatch(error: Error) {
    console.warn('3D board failed, showing the flat board.', error);
    this.props.onError();
  }

  render() {
    if (this.state.failed) return this.props.fallback;
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  wrap: {
    gap: spacing.sm,
    alignItems: 'center',
  },
  placeholder: {
    alignSelf: 'center',
    borderRadius: 16,
    backgroundColor: '#14110D',
    borderWidth: 1,
    borderColor: '#8A6428',
  },
  badge: {
    alignSelf: 'stretch',
    backgroundColor: colors.surfaceMuted,
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
