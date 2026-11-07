/**
 * Flat 2D board — temporary scaffold only.
 * Prefer importing via BoardStage; do not treat this as final visuals.
 */
import React, { useMemo } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import type { Square } from 'chess.js';
import { loadPosition } from '@/lib/chess/position';
import { pieceGlyph } from '@/lib/chess/unicode';
import { pieceName } from '@/lib/glossary';
import { boardPixelSize } from '@/components/board/boardSize';
import { colors, typography } from '@/lib/theme';

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] as const;
const RANKS = [8, 7, 6, 5, 4, 3, 2, 1] as const;

type Props = {
  fen: string;
  /** Flip board so black is at bottom */
  orientation?: 'white' | 'black';
  selected?: Square | null;
  legalTargets?: Square[];
  lastMove?: { from: Square; to: Square } | null;
  highlighted?: Square[];
  interactive?: boolean;
  onSquarePress?: (square: Square) => void;
  showCoordinates?: boolean;
  /** Cap the board so it fits the space left by the game chrome. */
  maxSize?: number;
};

export function ChessBoard({
  fen,
  orientation = 'white',
  selected = null,
  legalTargets = [],
  lastMove = null,
  highlighted = [],
  interactive = true,
  onSquarePress,
  showCoordinates = true,
  maxSize,
}: Props) {
  const { width } = useWindowDimensions();
  const boardSize = boardPixelSize(width, maxSize);
  const squareSize = boardSize / 8;

  const board = useMemo(() => {
    const game = loadPosition(fen);
    return game.board();
  }, [fen]);

  const files = orientation === 'white' ? [...FILES] : [...FILES].reverse();
  const ranks = orientation === 'white' ? [...RANKS] : [...RANKS].reverse();

  const targetSet = useMemo(() => new Set(legalTargets), [legalTargets]);
  const highlightSet = useMemo(() => new Set(highlighted), [highlighted]);

  return (
    <View
      style={[styles.frame, { width: boardSize + 8, height: boardSize + 8 }]}
      accessibilityLabel="لوحة الشطرنج"
    >
      <View style={{ width: boardSize, height: boardSize }}>
        {ranks.map((rank, rowIdx) => (
          <View key={rank} style={styles.row}>
            {files.map((file, colIdx) => {
              const square = `${file}${rank}` as Square;
              const isLight = (rowIdx + colIdx) % 2 === 1;
              // chess.js board() is always from white's perspective: rank 8 at index 0
              const boardRow = 8 - rank;
              const boardCol = FILES.indexOf(file);
              const piece = board[boardRow]?.[boardCol] ?? null;
              const isSelected = selected === square;
              const isTarget = targetSet.has(square);
              const isLast =
                lastMove?.from === square || lastMove?.to === square;
              const isHi = highlightSet.has(square);

              return (
                <Pressable
                  key={square}
                  disabled={!interactive}
                  onPress={() => onSquarePress?.(square)}
                  accessibilityRole="button"
                  accessibilityLabel={
                    piece
                      ? `${pieceName(piece.type, piece.color)} على ${square}`
                      : `مربع ${square}`
                  }
                  style={{
                    width: squareSize,
                    height: squareSize,
                    backgroundColor: isLight
                      ? colors.boardLight
                      : colors.boardDark,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {isLast ? <View style={styles.lastOverlay} /> : null}
                  {isHi ? <View style={styles.hiOverlay} /> : null}
                  {isSelected ? <View style={styles.selectedOverlay} /> : null}
                  {isTarget && !piece ? <View style={styles.dot} /> : null}
                  {isTarget && piece ? <View style={styles.captureRing} /> : null}
                  {piece ? (
                    <Text
                      style={[
                        styles.piece,
                        {
                          fontSize: squareSize * 0.68,
                          lineHeight: squareSize * 0.78,
                        },
                      ]}
                    >
                      {pieceGlyph(piece.type, piece.color)}
                    </Text>
                  ) : null}
                  {showCoordinates && colIdx === 0 ? (
                    <Text
                      style={[
                        styles.coord,
                        styles.rankCoord,
                        { color: isLight ? colors.boardDark : colors.boardLight },
                      ]}
                    >
                      {rank}
                    </Text>
                  ) : null}
                  {showCoordinates && rowIdx === 7 ? (
                    <Text
                      style={[
                        styles.coord,
                        styles.fileCoord,
                        { color: isLight ? colors.boardDark : colors.boardLight },
                      ]}
                    >
                      {file}
                    </Text>
                  ) : null}
                </Pressable>
              );
            })}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    backgroundColor: colors.boardFrame,
    borderRadius: 12,
    padding: 4,
    alignSelf: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  piece: {
    textAlign: 'center',
    ...typography.title,
    fontFamily: undefined,
  },
  lastOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: colors.lastMove,
  },
  hiOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: colors.highlight,
  },
  selectedOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: colors.highlight,
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: 'rgba(15, 31, 24, 0.35)',
  },
  captureRing: {
    ...StyleSheet.absoluteFill,
    borderWidth: 3,
    borderColor: 'rgba(15, 31, 24, 0.45)',
    borderRadius: 4,
  },
  coord: {
    position: 'absolute',
    fontSize: 10,
    fontFamily: 'IBMPlexSansArabic_400Regular',
  },
  rankCoord: {
    top: 2,
    start: 3,
  },
  fileCoord: {
    bottom: 1,
    end: 3,
  },
});
