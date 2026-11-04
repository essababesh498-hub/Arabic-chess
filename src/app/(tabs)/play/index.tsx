import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { PrimaryButton } from '@/components/PrimaryButton';
import { useProgress } from '@/context/ProgressContext';
import type { AiStrength } from '@/lib/chess/ai';
import { TERMS } from '@/lib/glossary';
import { strings } from '@/lib/strings';
import { colors, radii, spacing, typography } from '@/lib/theme';

export default function PlaySetupScreen() {
  const { progress } = useProgress();
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
      <Text style={styles.subtitle}>{strings.playSubtitle}</Text>

      <Text style={styles.label}>اللون</Text>
      <View style={styles.segment}>
        {(
          [
            ['white', strings.playAsWhite],
            ['black', strings.playAsBlack],
          ] as const
        ).map(([value, label]) => (
          <Pressable
            key={value}
            onPress={() => setColor(value)}
            style={[styles.segBtn, color === value && styles.segActive]}
          >
            <Text style={[styles.segText, color === value && styles.segTextActive]}>
              {label}
            </Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.label}>{strings.strength}</Text>
      <View style={styles.segment}>
        {(
          [
            ['easy', TERMS.easy],
            ['medium', TERMS.medium],
            ['hard', TERMS.hard],
          ] as const
        ).map(([value, label]) => (
          <Pressable
            key={value}
            onPress={() => setStrength(value)}
            style={[styles.segBtn, strength === value && styles.segActive]}
          >
            <Text
              style={[styles.segText, strength === value && styles.segTextActive]}
            >
              {label}
            </Text>
          </Pressable>
        ))}
      </View>

      <PrimaryButton label={strings.startGame} onPress={start} style={{ marginTop: 12 }} />
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
    marginTop: spacing.sm,
  },
  segment: {
    flexDirection: 'row-reverse',
    backgroundColor: colors.sandSoft,
    borderRadius: radii.md,
    padding: 4,
    gap: 4,
  },
  segBtn: {
    flex: 1,
    minHeight: 44,
    borderRadius: radii.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segActive: {
    backgroundColor: colors.boardFrame,
  },
  segText: {
    ...typography.button,
    color: colors.ink,
    fontSize: 15,
  },
  segTextActive: {
    color: colors.cream,
  },
});
