import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ActionCard } from '@/components/ui/ActionCard';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { useCopy } from '@/context/LocaleContext';
import { useProgress } from '@/context/ProgressContext';
import type { AiStrength } from '@/lib/chess/ai';
import { colors, spacing, typography } from '@/lib/theme';

export default function PlaySetupScreen() {
  const { progress } = useProgress();
  const copy = useCopy();
  const [color, setColor] = useState<'white' | 'black'>('white');
  const [strength, setStrength] = useState<AiStrength>(progress.defaultAiStrength);

  function start() {
    router.push({
      pathname: '/play/game',
      params: { color, strength },
    });
  }

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.subtitle}>{copy.playSubtitle}</Text>
      <Text style={styles.label}>{copy.modesTitle}</Text>

      <ActionCard
        title={copy.modeClassic}
        body={copy.modeClassicBody}
        badge={copy.chapterAvailable}
      />

      <View style={styles.setup}>
        <Text style={styles.label}>{copy.colorLabel}</Text>
        <SegmentedControl
          value={color}
          onChange={setColor}
          options={[
            { value: 'white', label: copy.playAsWhite },
            { value: 'black', label: copy.playAsBlack },
          ]}
        />

        <Text style={styles.label}>{copy.strength}</Text>
        <SegmentedControl<AiStrength>
          value={strength}
          onChange={setStrength}
          options={[
            { value: 'easy', label: copy.strengthEasy },
            { value: 'medium', label: copy.strengthMedium },
            { value: 'hard', label: copy.strengthHard },
          ]}
        />

        <PrimaryButton label={copy.startGame} onPress={start} />
      </View>

      <ActionCard
        title={copy.modeCasual}
        body={copy.modeCasualBody}
        badge={copy.unavailable}
        available={false}
      />
      <ActionCard
        title={copy.modePuzzle}
        body={copy.modePuzzleBody}
        badge={copy.unavailable}
        available={false}
      />
      <ActionCard
        title={copy.modeKnight}
        body={copy.modeKnightBody}
        badge={copy.unavailable}
        available={false}
      />
      <ActionCard
        title={copy.modeEndgame}
        body={copy.modeEndgameBody}
        badge={copy.unavailable}
        available={false}
      />
      <ActionCard
        title={copy.modeDaily}
        body={copy.modeDailyBody}
        badge={copy.unavailable}
        available={false}
      />
      <ActionCard
        title={copy.modeRanked}
        body={copy.modeRankedBody}
        badge={copy.unavailable}
        available={false}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: colors.background },
  content: {
    padding: spacing.lg,
    gap: spacing.md,
    paddingBottom: spacing.xxl,
  },
  subtitle: {
    ...typography.body,
    color: colors.inkMuted,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  label: {
    ...typography.subtitle,
    color: colors.ink,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  setup: {
    gap: spacing.md,
    marginBottom: spacing.sm,
  },
});
