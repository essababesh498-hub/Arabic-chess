import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useCopy } from '@/context/LocaleContext';
import { useLocaleLayout } from '@/lib/localeLayout';
import { colors, spacing, typography } from '@/lib/theme';
import type { ChapterStepKind } from '@/lib/curriculum/types';

const ORDER: ChapterStepKind[] = [
  'explanation',
  'demo',
  'interactive',
  'exercises',
  'quiz',
];

type Props = {
  current: ChapterStepKind;
};

export function StepProgress({ current }: Props) {
  const copy = useCopy();
  const layout = useLocaleLayout();
  const labels: Record<ChapterStepKind, string> = {
    explanation: copy.stepExplanation,
    demo: copy.stepDemo,
    interactive: copy.stepInteractive,
    exercises: copy.stepExercises,
    quiz: copy.stepQuiz,
  };
  const currentIdx = ORDER.indexOf(current);
  return (
    <View style={[styles.row, { flexDirection: layout.mirrorRow }]} accessibilityRole="summary">
      {ORDER.map((kind, idx) => {
        const active = idx === currentIdx;
        const done = idx < currentIdx;
        return (
          <View key={kind} style={styles.item}>
            <View
              style={[
                styles.dot,
                done && styles.dotDone,
                active && styles.dotActive,
              ]}
            />
            <Text
              style={[
                styles.label,
                layout.center,
                (active || done) && styles.labelActive,
              ]}
              numberOfLines={1}
            >
              {labels[kind]}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.border,
  },
  dotDone: {
    backgroundColor: colors.success,
  },
  dotActive: {
    backgroundColor: colors.accent,
    transform: [{ scale: 1.25 }],
  },
  label: {
    ...typography.caption,
    fontSize: 11,
    color: colors.inkMuted,
    textAlign: 'center',
    writingDirection: 'rtl',
  },
  labelActive: {
    color: colors.ink,
    fontFamily: 'IBMPlexSansArabic_600SemiBold',
  },
});
