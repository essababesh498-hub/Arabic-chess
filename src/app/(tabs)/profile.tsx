import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { PrimaryButton } from '@/components/PrimaryButton';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { useLocale } from '@/context/LocaleContext';
import { useProgress } from '@/context/ProgressContext';
import type { AiStrength } from '@/lib/chess/ai';
import { GLOSSARY_NOTE, PIECE_NAMES } from '@/lib/glossary';
import type { AppLocale } from '@/lib/i18n';
import { useLocaleLayout } from '@/lib/localeLayout';
import { colors, radii, shadows, spacing, typography } from '@/lib/theme';

export default function ProfileScreen() {
  const { copy, locale, setLocale } = useLocale();
  const layout = useLocaleLayout();
  const {
    progress,
    setSoundEnabled,
    setDefaultAiStrength,
    setTutorVerbose,
    clearProgress,
  } = useProgress();
  const [cleared, setCleared] = useState(false);

  function confirmReset() {
    Alert.alert(copy.settingsReset, copy.settingsResetConfirm, [
      { text: copy.settingsResetCancel, style: 'cancel' },
      {
        text: copy.settingsResetConfirmAction,
        style: 'destructive',
        onPress: () => {
          void clearProgress().then(() => setCleared(true));
        },
      },
    ]);
  }

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.identity, { flexDirection: layout.mirrorRow }]}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{copy.profileGuestName.slice(0, 1)}</Text>
        </View>
        <View style={styles.identityBody}>
          <Text style={[styles.name, layout.block]}>{copy.profileGuestName}</Text>
          <Text style={[styles.body, layout.block]}>{copy.profilePrototype}</Text>
        </View>
      </View>

      <View style={[styles.stats, { flexDirection: layout.mirrorRow }]}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{progress.completedChapterIds.length}</Text>
          <Text style={[styles.caption, layout.center]}>{copy.chaptersDone}</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{progress.gamesPlayed}</Text>
          <Text style={[styles.caption, layout.center]}>{copy.gamesPlayed}</Text>
        </View>
      </View>

      <Text style={[styles.section, layout.block]}>{copy.settingsGuest}</Text>
      <Text style={[styles.body, layout.block]}>{copy.settingsGuestBody}</Text>

      <Text style={[styles.section, layout.block]}>{copy.languageLabel}</Text>
      <SegmentedControl<AppLocale>
        value={locale}
        onChange={setLocale}
        options={[
          { value: 'ar', label: copy.languageArabic },
          { value: 'en', label: copy.languageEnglish },
        ]}
      />

      <Text style={[styles.section, layout.block]}>{copy.settingsSound}</Text>
      <SegmentedControl
        value={progress.soundEnabled ? 'on' : 'off'}
        onChange={(value) => void setSoundEnabled(value === 'on')}
        options={[
          { value: 'on', label: copy.settingsSoundOn },
          { value: 'off', label: copy.settingsSoundOff },
        ]}
      />

      <Text style={[styles.section, layout.block]}>{copy.settingsAiDefault}</Text>
      <SegmentedControl<AiStrength>
        value={progress.defaultAiStrength}
        onChange={(value) => void setDefaultAiStrength(value)}
        options={[
          { value: 'easy', label: copy.strengthEasy },
          { value: 'medium', label: copy.strengthMedium },
          { value: 'hard', label: copy.strengthHard },
        ]}
      />

      <Text style={[styles.section, layout.block]}>{copy.settingsTutor}</Text>
      <SegmentedControl
        value={progress.tutorVerbose ? 'verbose' : 'brief'}
        onChange={(value) => void setTutorVerbose(value === 'verbose')}
        options={[
          { value: 'verbose', label: copy.settingsTutorVerbose },
          { value: 'brief', label: copy.settingsTutorBrief },
        ]}
      />

      <Text style={[styles.section, layout.block]}>{copy.settingsGlossary}</Text>
      <Text style={[styles.body, layout.arabic]}>{GLOSSARY_NOTE}</Text>
      {(
        [
          ['k', PIECE_NAMES.k],
          ['q', PIECE_NAMES.q],
          ['r', PIECE_NAMES.r],
          ['b', PIECE_NAMES.b],
          ['n', PIECE_NAMES.n],
          ['p', PIECE_NAMES.p],
        ] as const
      ).map(([key, name]) => (
        <Text key={key} style={[styles.glossaryRow, layout.arabic]}>
          {name}
        </Text>
      ))}

      <PrimaryButton
        label={copy.settingsReset}
        variant="danger"
        onPress={confirmReset}
        style={{ marginTop: spacing.lg }}
      />
      {cleared ? <Text style={[styles.caption, layout.center]}>{copy.settingsResetDone}</Text> : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: colors.background },
  content: {
    padding: spacing.lg,
    gap: spacing.sm,
    paddingBottom: spacing.xxl,
  },
  identity: {
    flexDirection: 'row-reverse',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    ...shadows.card,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    ...typography.title,
    color: colors.onAccent,
  },
  identityBody: { flex: 1, gap: 4 },
  name: {
    ...typography.subtitle,
    color: colors.ink,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  section: {
    ...typography.subtitle,
    color: colors.ink,
    textAlign: 'right',
    writingDirection: 'rtl',
    marginTop: spacing.md,
  },
  body: {
    ...typography.body,
    color: colors.inkMuted,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  caption: {
    ...typography.caption,
    color: colors.inkMuted,
    textAlign: 'center',
    writingDirection: 'rtl',
  },
  stats: {
    flexDirection: 'row-reverse',
    gap: spacing.sm,
  },
  stat: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    ...typography.title,
    color: colors.ivory,
  },
  glossaryRow: {
    ...typography.body,
    color: colors.ink,
    textAlign: 'right',
    writingDirection: 'rtl',
    paddingVertical: 4,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
});
