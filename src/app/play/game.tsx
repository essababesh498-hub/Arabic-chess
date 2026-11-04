import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import { Chess, type Square } from 'chess.js';
import { BoardStage } from '@/components/board/BoardStage';
import { PrimaryButton } from '@/components/PrimaryButton';
import { GenieLampTutor } from '@/components/tutor/GenieLampTutor';
import { useProgress } from '@/context/ProgressContext';
import { applyMove, chooseAiMove, type AiStrength } from '@/lib/chess/ai';
import { TERMS } from '@/lib/glossary';
import { strings } from '@/lib/strings';
import { colors, spacing, typography } from '@/lib/theme';

const START_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

export default function GameScreen() {
  const params = useLocalSearchParams<{
    color?: string;
    strength?: string;
  }>();
  const playerColor = params.color === 'black' ? 'black' : 'white';
  const strength = (params.strength as AiStrength) || 'easy';
  const { recordGame } = useProgress();

  const [fen, setFen] = useState(START_FEN);
  const [selected, setSelected] = useState<Square | null>(null);
  const [targets, setTargets] = useState<Square[]>([]);
  const [lastMove, setLastMove] = useState<{ from: Square; to: Square } | null>(
    null,
  );
  const [status, setStatus] = useState<string | null>(null);
  const recordedRef = useRef(false);

  const game = useMemo(() => new Chess(fen), [fen]);
  const turn = game.turn();
  const playerIsWhite = playerColor === 'white';
  const isPlayerTurn =
    (playerIsWhite && turn === 'w') || (!playerIsWhite && turn === 'b');

  const orientation = playerColor;

  const finishIfNeeded = useCallback(
    async (g: Chess) => {
      if (g.isCheckmate()) {
        const playerWon =
          (g.turn() === 'b' && playerIsWhite) ||
          (g.turn() === 'w' && !playerIsWhite);
        setStatus(playerWon ? strings.youWin : strings.youLose);
        if (!recordedRef.current) {
          recordedRef.current = true;
          await recordGame();
        }
      } else if (g.isDraw() || g.isStalemate()) {
        setStatus(
          g.isStalemate() ? `${strings.draw} (${TERMS.stalemate})` : strings.draw,
        );
        if (!recordedRef.current) {
          recordedRef.current = true;
          await recordGame();
        }
      } else if (g.isCheck()) {
        setStatus(TERMS.check);
      } else {
        setStatus(null);
      }
    },
    [playerIsWhite, recordGame],
  );

  // AI move when it's the computer's turn
  useEffect(() => {
    if (status === strings.youWin || status === strings.youLose) return;
    if (isPlayerTurn) return;
    if (game.isGameOver()) return;

    const timer = setTimeout(() => {
      const move = chooseAiMove(fen, strength);
      if (!move) return;
      const promotion =
        move.promotion === 'q' ||
        move.promotion === 'r' ||
        move.promotion === 'b' ||
        move.promotion === 'n'
          ? move.promotion
          : undefined;
      const next = applyMove(
        fen,
        move.from as Square,
        move.to as Square,
        promotion,
      );
      if (!next) return;
      setFen(next.fen);
      setLastMove({ from: next.move.from as Square, to: next.move.to as Square });
      void finishIfNeeded(new Chess(next.fen));
    }, 450);

    return () => clearTimeout(timer);
  }, [fen, isPlayerTurn, strength, status, game, finishIfNeeded]);

  function onSquarePress(square: Square) {
    if (!isPlayerTurn || game.isGameOver()) return;

    if (!selected) {
      const piece = game.get(square);
      if (!piece) return;
      const expected = playerIsWhite ? 'w' : 'b';
      if (piece.color !== expected) return;
      const legal = game
        .moves({ square, verbose: true })
        .map((m) => m.to as Square);
      setSelected(square);
      setTargets(legal);
      return;
    }

    if (selected === square) {
      setSelected(null);
      setTargets([]);
      return;
    }

    const result = applyMove(fen, selected, square);
    setSelected(null);
    setTargets([]);
    if (!result) {
      const piece = game.get(square);
      if (piece && piece.color === (playerIsWhite ? 'w' : 'b')) {
        const legal = game
          .moves({ square, verbose: true })
          .map((m) => m.to as Square);
        setSelected(square);
        setTargets(legal);
      }
      return;
    }
    setFen(result.fen);
    setLastMove({ from: result.move.from as Square, to: result.move.to as Square });
    void finishIfNeeded(new Chess(result.fen));
  }

  function resetGame() {
    recordedRef.current = false;
    setFen(START_FEN);
    setSelected(null);
    setTargets([]);
    setLastMove(null);
    setStatus(null);
  }

  const turnLabel = isPlayerTurn ? TERMS.yourTurn : TERMS.aiTurn;

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Stack.Screen
        options={{
          title: `ضد الكمبيوتر · ${
            strength === 'easy'
              ? TERMS.easy
              : strength === 'medium'
                ? TERMS.medium
                : TERMS.hard
          }`,
        }}
      />

      <View style={styles.meta}>
        <Text style={styles.metaText}>{turnLabel}</Text>
        {status ? <Text style={styles.status}>{status}</Text> : null}
      </View>

      <BoardStage
        fen={fen}
        orientation={orientation}
        selected={selected}
        legalTargets={targets}
        lastMove={lastMove}
        onSquarePress={onSquarePress}
        interactive={!game.isGameOver()}
      />

      <View style={styles.actions}>
        <PrimaryButton
          label={strings.newGame}
          variant="secondary"
          onPress={resetGame}
          style={{ flex: 1 }}
        />
        <PrimaryButton
          label={strings.resign}
          variant="ghost"
          onPress={() => {
            setStatus(strings.youLose);
            if (!recordedRef.current) {
              recordedRef.current = true;
              void recordGame();
            }
          }}
          style={{ flex: 1 }}
        />
      </View>

      <PrimaryButton
        label="إعدادات المباراة"
        variant="ghost"
        onPress={() => router.replace('/play')}
      />

      <GenieLampTutor fen={fen} chapterContext="مباراة ضد الكمبيوتر" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: colors.cream },
  content: {
    padding: spacing.lg,
    gap: spacing.md,
    paddingBottom: spacing.xxl,
  },
  meta: {
    alignItems: 'flex-end',
    gap: 4,
  },
  metaText: {
    ...typography.subtitle,
    color: colors.ink,
    writingDirection: 'rtl',
  },
  status: {
    ...typography.body,
    color: colors.danger,
    writingDirection: 'rtl',
  },
  actions: {
    flexDirection: 'row-reverse',
    gap: spacing.sm,
  },
});
