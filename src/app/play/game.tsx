import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Modal, Pressable, StyleSheet, View, useWindowDimensions } from 'react-native';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Chess, type Square } from 'chess.js';
import { BoardStage } from '@/components/board/BoardStage';
import { overheadFrame } from '@/components/board/boardSize';
import { GameMenu } from '@/components/gold/GameMenu';
import { GoldButton } from '@/components/gold/GoldButton';
import { PlayerBar } from '@/components/gold/PlayerBar';
import { VsBadge } from '@/components/gold/VsBadge';
import { GenieLampTutor } from '@/components/tutor/GenieLampTutor';
import { useLocale } from '@/context/LocaleContext';
import { useLocaleLayout } from '@/lib/localeLayout';
import { useProgress } from '@/context/ProgressContext';
import { applyMove, chooseAiMove, type AiStrength } from '@/lib/chess/ai';
import { TERMS } from '@/lib/glossary';
import { catalogs } from '@/lib/i18n';

const START_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
const CLOCK_START = 10 * 60;
const CLOCK_INCREMENT = 30;
const INCREMENT_LABEL = '+0:30';

function isDecidedResult(status: string | null): boolean {
  if (!status) return false;
  return (
    status === catalogs.ar.youWin ||
    status === catalogs.ar.youLose ||
    status === catalogs.en.youWin ||
    status === catalogs.en.youLose
  );
}

export default function GameScreen() {
  const { copy, locale } = useLocale();
  const layout = useLocaleLayout();
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
  const [whiteTime, setWhiteTime] = useState(CLOCK_START);
  const [blackTime, setBlackTime] = useState(CLOCK_START);
  const [helpOpen, setHelpOpen] = useState(false);
  const [boardSlot, setBoardSlot] = useState<{ width: number; height: number } | null>(null);
  const [, setNotice] = useState<string | null>(null);
  const recordedRef = useRef(false);
  const skipClock = useRef(true);

  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

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
        setStatus(playerWon ? copy.youWin : copy.youLose);
        if (!recordedRef.current) {
          recordedRef.current = true;
          await recordGame();
        }
      } else if (g.isDraw() || g.isStalemate()) {
        setStatus(
          g.isStalemate() ? `${copy.draw} (${TERMS.stalemate})` : copy.draw,
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
    [copy, playerIsWhite, recordGame],
  );

  // AI move when it's the computer's turn
  useEffect(() => {
    if (isDecidedResult(status)) return;
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
    setWhiteTime(CLOCK_START);
    setBlackTime(CLOCK_START);
    setFen((current) => {
      if (current !== START_FEN) skipClock.current = true;
      return START_FEN;
    });
    setSelected(null);
    setTargets([]);
    setLastMove(null);
    setStatus(null);
    setNotice(null);
  }

  const lastClockFen = useRef(fen);
  useEffect(() => {
    if (lastClockFen.current === fen) return;
    lastClockFen.current = fen;
    if (skipClock.current) {
      skipClock.current = false;
      return;
    }
    const mover = game.turn() === 'w' ? 'b' : 'w';
    if (mover === 'w') setWhiteTime((time) => time + CLOCK_INCREMENT);
    else setBlackTime((time) => time + CLOCK_INCREMENT);
  }, [fen, game]);

  useEffect(() => {
    if (game.isGameOver() || isDecidedResult(status)) {
      return;
    }
    const timer = setInterval(() => {
      if (game.turn() === 'w') setWhiteTime((time) => Math.max(0, time - 1));
      else setBlackTime((time) => Math.max(0, time - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [fen, game, status]);

  const showVs = height >= 720;
  const compact = height < 700;
  const aiRating = strength === 'easy' ? 800 : strength === 'medium' ? 1400 : 2000;
  const strengthLabel =
    strength === 'easy'
      ? copy.strengthEasy
      : strength === 'medium'
        ? copy.strengthMedium
        : copy.strengthHard;
  const opponentName =
    locale === 'en' ? `Computer · ${strengthLabel}` : `الكمبيوتر · ${strengthLabel}`;
  const playerName = locale === 'en' ? 'You' : 'أنت';
  const opponentTime = playerIsWhite ? blackTime : whiteTime;
  const playerTime = playerIsWhite ? whiteTime : blackTime;
  const frame = boardSlot ? overheadFrame(boardSlot.width, boardSlot.height) : undefined;
  const helpContext = locale === 'en' ? 'Game against the computer' : 'مباراة ضد الكمبيوتر';
  const closeLabel = locale === 'en' ? 'Close' : 'إغلاق';
  const soonLabel = locale === 'en' ? 'Leaderboard coming soon' : 'المتصدرين قريباً';

  return (
    <View style={styles.screen}>
      <Stack.Screen options={{ headerShown: false }} />

      <View
        style={styles.boardLayer}
        onLayout={(event) => {
          const { width: slotWidth, height: slotHeight } = event.nativeEvent.layout;
          const next = {
            width: Math.floor(slotWidth),
            height: Math.floor(slotHeight),
          };
          setBoardSlot((current) =>
            current && current.width === next.width && current.height === next.height
              ? current
              : next,
          );
        }}
      >
        <BoardStage
          fen={fen}
          orientation={orientation}
          selected={selected}
          legalTargets={targets}
          lastMove={lastMove}
          onSquarePress={onSquarePress}
          interactive={!game.isGameOver()}
          hideScaffoldBadge
          maxSize={frame ? Math.min(frame.width, frame.height) : undefined}
          viewport={frame}
        />
      </View>

      <View
        pointerEvents="box-none"
        style={[
          styles.chrome,
          {
            paddingTop: Math.max(insets.top, 6),
            paddingBottom: Math.max(insets.bottom, 6),
          },
        ]}
      >
      <View style={[styles.menuRow, { justifyContent: layout.pinLeft }]} pointerEvents="box-none">
        <GameMenu
          topInset={Math.max(insets.top, 6)}
          onNewGame={resetGame}
          onResign={() => {
            setStatus(copy.youLose);
            if (!recordedRef.current) {
              recordedRef.current = true;
              void recordGame();
            }
          }}
          onSettings={() => router.push('/profile')}
          onLeaderboard={() => setNotice(soonLabel)}
          onHelp={() => setHelpOpen(true)}
          onExit={() => router.replace('/')}
        />
      </View>

      <PlayerBar
        split
        compact={compact}
        name={opponentName}
        rating={aiRating}
        seconds={opponentTime}
        incrementLabel={INCREMENT_LABEL}
        active={!isPlayerTurn && !game.isGameOver()}
        avatarLabel={locale === 'en' ? 'C' : 'ك'}
      />

      {showVs ? <VsBadge /> : null}

      <View style={styles.boardGap} pointerEvents="none" />

      <PlayerBar
        split
        compact={compact}
        name={playerName}
        rating={1200}
        seconds={playerTime}
        incrementLabel={INCREMENT_LABEL}
        active={isPlayerTurn && !game.isGameOver()}
        avatarLabel={locale === 'en' ? 'Y' : 'أ'}
      />
      </View>

      <Modal
        visible={helpOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setHelpOpen(false)}
      >
        <Pressable style={styles.modalBackdrop} onPress={() => setHelpOpen(false)}>
          <View style={styles.modalCard}>
            <GenieLampTutor fen={fen} chapterContext={helpContext} />
            <GoldButton label={closeLabel} onPress={() => setHelpOpen(false)} />
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  boardLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  chrome: {
    flex: 1,
    paddingHorizontal: 8,
    gap: 4,
    zIndex: 2,
  },
  menuRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    zIndex: 20,
  },
  boardGap: {
    flex: 1,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.62)',
    justifyContent: 'flex-end',
    padding: 12,
  },
  modalCard: {
    gap: 8,
  },
});
