import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
} from 'react-native';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import { Chess, type Square } from 'chess.js';
import { BoardStage } from '@/components/board/BoardStage';
import { PrimaryButton } from '@/components/PrimaryButton';
import { StepProgress } from '@/components/StepProgress';
import { GenieLampTutor } from '@/components/tutor/GenieLampTutor';
import { useProgress } from '@/context/ProgressContext';
import { getChapter, isChapterUnlocked, isLastChapter } from '@/lib/curriculum/chapters';
import type {
  DemoStep,
  ExerciseItem,
  ExercisesStep,
  InteractiveStep,
  QuizStep,
} from '@/lib/curriculum/types';
import { exercisePartialLabel, strings } from '@/lib/strings';
import { colors, radii, spacing, typography } from '@/lib/theme';

export default function ChapterPlayerScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const chapterId = typeof id === 'string' ? id : '';
  const chapter = getChapter(chapterId);
  const { progress, ready, completeChapter } = useProgress();
  const [stepIndex, setStepIndex] = useState(0);
  const [trackedChapterId, setTrackedChapterId] = useState(chapterId);
  const [demoSeen, setDemoSeen] = useState(false);
  const [exerciseIdx, setExerciseIdx] = useState(0);
  const [solved, setSolved] = useState<Record<string, boolean>>({});
  const [found, setFound] = useState<Record<string, Square[]>>({});
  const [exerciseMessage, setExerciseMessage] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  if (trackedChapterId !== chapterId) {
    setTrackedChapterId(chapterId);
    setStepIndex(0);
    setDemoSeen(false);
    setExerciseIdx(0);
    setSolved({});
    setFound({});
    setExerciseMessage(null);
    setAnswers({});
    setQuizSubmitted(false);
  }

  if (!chapter) {
    return (
      <View style={styles.center}>
        <Text style={styles.body}>الفصل غير موجود.</Text>
        <PrimaryButton label="رجوع" onPress={() => router.back()} />
      </View>
    );
  }

  if (!ready) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.boardFrame} size="large" />
      </View>
    );
  }

  const unlocked = isChapterUnlocked(chapter.id, progress.completedChapterIds);
  if (!unlocked) {
    return (
      <View style={styles.center}>
        <Stack.Screen options={{ title: chapter.title }} />
        <Text style={styles.body}>{strings.chapterLockedHint}</Text>
        <PrimaryButton label="رجوع" onPress={() => router.back()} />
      </View>
    );
  }

  const step = chapter.steps[stepIndex];

  return (
    <View style={styles.root}>
      <Stack.Screen options={{ title: chapter.title }} />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <StepProgress current={step.kind} />
        <Text style={styles.title}>{step.title}</Text>

        {step.kind === 'explanation' ? (
          <ExplanationView
            body={step.body}
            onNext={() => setStepIndex(1)}
          />
        ) : null}

        {step.kind === 'demo' ? (
          <DemoView
            step={step}
            seen={demoSeen}
            onSeen={() => setDemoSeen(true)}
            onNext={() => setStepIndex(2)}
            onBack={() => setStepIndex(0)}
          />
        ) : null}

        {step.kind === 'interactive' ? (
          <InteractiveView
            step={step}
            onNext={() => setStepIndex(3)}
            onBack={() => setStepIndex(1)}
          />
        ) : null}

        {step.kind === 'exercises' ? (
          <ExercisesView
            step={step}
            idx={exerciseIdx}
            setIdx={setExerciseIdx}
            solved={solved}
            setSolved={setSolved}
            found={found}
            setFound={setFound}
            message={exerciseMessage}
            setMessage={setExerciseMessage}
            onNext={() => setStepIndex(4)}
            onBack={() => setStepIndex(2)}
          />
        ) : null}

        {step.kind === 'quiz' ? (
          <QuizView
            step={step}
            isLast={isLastChapter(chapter.id)}
            chapterContext={chapter.title}
            answers={answers}
            setAnswers={setAnswers}
            submitted={quizSubmitted}
            setSubmitted={setQuizSubmitted}
            onBack={() => setStepIndex(3)}
            onPass={async () => {
              await completeChapter(chapter.id);
              router.replace('/learn');
            }}
          />
        ) : null}
      </ScrollView>
    </View>
  );
}

function ExplanationView({
  body,
  onNext,
}: {
  body: string;
  onNext: () => void;
}) {
  return (
    <View style={styles.block}>
      <Text style={styles.body}>{body}</Text>
      <PrimaryButton label={strings.nextStep} onPress={onNext} />
    </View>
  );
}

function DemoView({
  step,
  seen,
  onSeen,
  onNext,
  onBack,
}: {
  step: DemoStep;
  seen: boolean;
  onSeen: () => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const [fen, setFen] = useState(step.fen);
  const [lastMove, setLastMove] = useState<{ from: Square; to: Square } | null>(
    null,
  );
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    setFen(step.fen);
    setLastMove(null);
  }, [step]);

  async function playDemo() {
    if (playing) return;
    setPlaying(true);
    setFen(step.fen);
    setLastMove(null);
    let game = new Chess(step.fen);
    let finished = true;
    for (const m of step.moves) {
      await wait(650);
      try {
        if (m.fen) {
          game = new Chess(m.fen);
          setFen(game.fen());
          setLastMove(null);
          await wait(700);
        }
        const promotion =
          m.promotion === 'q' ||
          m.promotion === 'r' ||
          m.promotion === 'b' ||
          m.promotion === 'n'
            ? m.promotion
            : undefined;
        const played = game.move({
          from: m.from as Square,
          to: m.to as Square,
          promotion,
        });
        if (!played) {
          finished = false;
          break;
        }
        setFen(game.fen());
        setLastMove({ from: played.from, to: played.to });
      } catch {
        finished = false;
        break;
      }
    }
    setPlaying(false);
    if (finished) onSeen();
  }

  return (
    <View style={styles.block}>
      <Text style={styles.body}>{step.body}</Text>
      <Text style={styles.hint}>{strings.demoHint}</Text>
      <BoardStage fen={fen} lastMove={lastMove} interactive={false} />
      <PrimaryButton
        label={
          playing ? strings.demoPlaying : seen ? strings.demoReplay : strings.demoWatch
        }
        variant="secondary"
        onPress={() => void playDemo()}
        disabled={playing}
      />
      <NavRow onBack={onBack} onNext={onNext} />
    </View>
  );
}

function InteractiveView({
  step,
  onNext,
  onBack,
}: {
  step: InteractiveStep;
  onNext: () => void;
  onBack: () => void;
}) {
  const [fen, setFen] = useState(step.fen);
  const [selected, setSelected] = useState<Square | null>(null);
  const [targets, setTargets] = useState<Square[]>([]);
  const [done, setDone] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    setFen(step.fen);
    setSelected(null);
    setTargets([]);
    setDone(false);
    setMessage(null);
  }, [step]);

  function onSquarePress(square: Square) {
    if (done) return;
    const game = new Chess(fen);
    if (!selected) {
      const piece = game.get(square);
      if (!piece || piece.color !== game.turn()) return;
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
    try {
      const move = game.move({ from: selected, to: square, promotion: 'q' });
      if (!move) {
        setSelected(null);
        setTargets([]);
        return;
      }
      const ok = step.goals.some(
        (g) => g.from === move.from && g.to === move.to,
      );
      setFen(game.fen());
      setSelected(null);
      setTargets([]);
      if (ok) {
        setDone(true);
        setMessage(step.successMessage);
      } else {
        setMessage('حاول مجدداً — هذه ليست النقلة المطلوبة.');
        setTimeout(() => {
          setFen(step.fen);
          setMessage(null);
        }, 900);
      }
    } catch {
      setSelected(null);
      setTargets([]);
    }
  }

  return (
    <View style={styles.block}>
      <Text style={styles.body}>{step.body}</Text>
      <Text style={styles.hint}>{strings.interactiveHint}</Text>
      <BoardStage
        fen={fen}
        selected={selected}
        legalTargets={targets}
        onSquarePress={onSquarePress}
      />
      {message ? (
        <Text style={done ? styles.feedback : styles.feedbackBad}>{message}</Text>
      ) : null}
      <NavRow onBack={onBack} onNext={onNext} nextDisabled={!done} />
    </View>
  );
}

function ExercisesView({
  step,
  idx,
  setIdx,
  solved,
  setSolved,
  found,
  setFound,
  message,
  setMessage,
  onNext,
  onBack,
}: {
  step: ExercisesStep;
  idx: number;
  setIdx: React.Dispatch<React.SetStateAction<number>>;
  solved: Record<string, boolean>;
  setSolved: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  found: Record<string, Square[]>;
  setFound: React.Dispatch<React.SetStateAction<Record<string, Square[]>>>;
  message: string | null;
  setMessage: React.Dispatch<React.SetStateAction<string | null>>;
  onNext: () => void;
  onBack: () => void;
}) {
  const item: ExerciseItem = step.items[idx] ?? step.items[0]!;
  const foundSquares = found[item.id] ?? [];
  const allDone = step.items.every((i) => solved[i.id]);

  function onSquarePress(square: Square) {
    if (solved[item.id]) return;
    if (!item.correctSquares.includes(square)) {
      setMessage(strings.exerciseRetry);
      return;
    }
    if (foundSquares.includes(square)) return;
    const next = [...foundSquares, square];
    setFound((current) => ({ ...current, [item.id]: next }));
    setMessage(null);
    const complete = item.correctSquares.every((target) =>
      next.includes(target as Square),
    );
    if (!complete) return;
    setSolved((current) => ({ ...current, [item.id]: true }));
    if (idx < step.items.length - 1) {
      setTimeout(() => {
        setIdx((n) => n + 1);
        setMessage(null);
      }, 500);
    }
  }

  return (
    <View style={styles.block}>
      <Text style={styles.body}>{step.body}</Text>
      <Text style={styles.hint}>{strings.exerciseHint}</Text>
      <Text style={styles.subtitle}>
        {item.prompt} ({idx + 1}/{step.items.length})
      </Text>
      <BoardStage
        fen={item.fen}
        highlighted={foundSquares}
        onSquarePress={onSquarePress}
      />
      {message ? <Text style={styles.feedbackBad}>{message}</Text> : null}
      {solved[item.id] ? <Text style={styles.feedback}>صحيح!</Text> : null}
      {!solved[item.id] && item.correctSquares.length > 1 ? (
        <Text style={styles.hint}>
          {exercisePartialLabel(foundSquares.length, item.correctSquares.length)}
        </Text>
      ) : null}
      {!solved[item.id] && item.hint ? (
        <Text style={styles.hint}>{item.hint}</Text>
      ) : null}
      <NavRow onBack={onBack} onNext={onNext} nextDisabled={!allDone} />
    </View>
  );
}

function QuizView({
  step,
  isLast,
  chapterContext,
  answers,
  setAnswers,
  submitted,
  setSubmitted,
  onBack,
  onPass,
}: {
  step: QuizStep;
  isLast: boolean;
  chapterContext: string;
  answers: Record<string, number>;
  setAnswers: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  submitted: boolean;
  setSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
  onBack: () => void;
  onPass: () => Promise<void>;
}) {
  const score = useMemo(() => {
    return step.questions.reduce((acc, q) => {
      return acc + (answers[q.id] === q.correctIndex ? 1 : 0);
    }, 0);
  }, [answers, step.questions]);

  const passed = submitted && score >= step.passScore;

  return (
    <View style={styles.block}>
      <Text style={styles.body}>{step.body}</Text>
      <Text style={styles.hint}>
        {isLast ? strings.quizHintFinal : strings.quizHint}
      </Text>
      <Text style={styles.caption}>
        {isLast ? strings.passQuizFinal : strings.passQuiz}
      </Text>

      {step.questions.map((q, qi) => (
        <View key={q.id} style={styles.quizBlock}>
          <Text style={styles.subtitle}>
            {qi + 1}. {q.prompt}
          </Text>
          {q.options.map((opt, oi) => {
            const selected = answers[q.id] === oi;
            const showResult = submitted;
            const correct = oi === q.correctIndex;
            return (
              <Pressable
                key={opt}
                disabled={submitted}
                onPress={() =>
                  setAnswers((a) => ({ ...a, [q.id]: oi }))
                }
                style={[
                  styles.option,
                  selected && styles.optionSelected,
                  showResult && correct && styles.optionCorrect,
                  showResult && selected && !correct && styles.optionWrong,
                ]}
              >
                <Text style={styles.optionText}>{opt}</Text>
              </Pressable>
            );
          })}
        </View>
      ))}

      {!submitted ? (
        <PrimaryButton
          label="تسليم الإجابات"
          onPress={() => setSubmitted(true)}
          disabled={Object.keys(answers).length < step.questions.length}
        />
      ) : (
        <View style={{ gap: 8 }}>
          <Text style={styles.feedback}>
            {passed
              ? `${strings.quizPass} (${score}/${step.questions.length})`
              : `${strings.quizFail} (${score}/${step.questions.length})`}
          </Text>
          {passed ? (
            <PrimaryButton label="إكمال الفصل" onPress={() => void onPass()} />
          ) : (
            <PrimaryButton
              label="إعادة المحاولة"
              variant="secondary"
              onPress={() => {
                setAnswers({});
                setSubmitted(false);
              }}
            />
          )}
        </View>
      )}

      <PrimaryButton label={strings.prevStep} variant="ghost" onPress={onBack} />

      <GenieLampTutor
        fen={step.tutorFen ?? 'k7/8/8/8/8/8/8/4R2K w - - 0 1'}
        chapterContext={chapterContext}
        cannedPrompts={
          step.tutorPrompts ?? ['اشرح حركة الرخ', 'ما الفرق بين الرخ والقلعة؟']
        }
      />
    </View>
  );
}

function NavRow({
  onBack,
  onNext,
  nextDisabled,
}: {
  onBack: () => void;
  onNext: () => void;
  nextDisabled?: boolean;
}) {
  return (
    <View style={styles.navRow}>
      <PrimaryButton
        label={strings.nextStep}
        onPress={onNext}
        disabled={nextDisabled}
        style={{ flex: 1 }}
      />
      <PrimaryButton
        label={strings.prevStep}
        variant="ghost"
        onPress={onBack}
        style={{ flex: 1 }}
      />
    </View>
  );
}

function wait(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.cream },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: 24,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
    gap: spacing.sm,
  },
  block: { gap: spacing.md },
  title: {
    ...typography.title,
    color: colors.ink,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  subtitle: {
    ...typography.subtitle,
    color: colors.ink,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  body: {
    ...typography.body,
    color: colors.ink,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  hint: {
    ...typography.caption,
    color: colors.inkMuted,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  caption: {
    ...typography.caption,
    color: colors.inkMuted,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  feedback: {
    ...typography.subtitle,
    color: colors.success,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  feedbackBad: {
    ...typography.body,
    color: colors.danger,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  navRow: {
    flexDirection: 'row-reverse',
    gap: spacing.sm,
  },
  quizBlock: { gap: spacing.sm, marginBottom: spacing.md },
  option: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    padding: spacing.md,
  },
  optionSelected: {
    borderColor: colors.boardFrame,
    backgroundColor: colors.sandSoft,
  },
  optionCorrect: {
    borderColor: colors.success,
    backgroundColor: 'rgba(42, 107, 79, 0.12)',
  },
  optionWrong: {
    borderColor: colors.danger,
    backgroundColor: 'rgba(166, 61, 61, 0.1)',
  },
  optionText: {
    ...typography.body,
    color: colors.ink,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
});
