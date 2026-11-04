import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { PrimaryButton } from '@/components/PrimaryButton';
import { useProgress } from '@/context/ProgressContext';
import type { AiStrength } from '@/lib/chess/ai';
import { GLOSSARY_NOTE, PIECE_NAMES, TERMS } from '@/lib/glossary';
import { strings } from '@/lib/strings';
import { colors, radii, spacing, typography } from '@/lib/theme';

export default function SettingsScreen() {
  const {
    progress,
    setSoundEnabled,
    setDefaultAiStrength,
    setTutorVerbose,
    clearProgress,
  } = useProgress();
  const [cleared, setCleared] = useState(false);

  function confirmReset() {
    Alert.alert(strings.settingsReset, 'هل أنت متأكد؟ لا يمكن التراجع.', [
      { text: 'إلغاء', style: 'cancel' },
      {
        text: 'مسح',
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
      <Text style={styles.section}>{strings.settingsGuest}</Text>
      <Text style={styles.body}>{strings.settingsGuestBody}</Text>
      <Text style={styles.caption}>{strings.languageFixed}</Text>

      <Text style={styles.section}>{strings.settingsSound}</Text>
      <View style={styles.segment}>
        <Seg
          active={progress.soundEnabled}
          label={strings.settingsSoundOn}
          onPress={() => void setSoundEnabled(true)}
        />
        <Seg
          active={!progress.soundEnabled}
          label={strings.settingsSoundOff}
          onPress={() => void setSoundEnabled(false)}
        />
      </View>

      <Text style={styles.section}>{strings.settingsAiDefault}</Text>
      <View style={styles.segment}>
        {(
          [
            ['easy', TERMS.easy],
            ['medium', TERMS.medium],
            ['hard', TERMS.hard],
          ] as const
        ).map(([value, label]) => (
          <Seg
            key={value}
            active={progress.defaultAiStrength === value}
            label={label}
            onPress={() => void setDefaultAiStrength(value as AiStrength)}
          />
        ))}
      </View>

      <Text style={styles.section}>{strings.settingsTutor}</Text>
      <View style={styles.segment}>
        <Seg
          active={progress.tutorVerbose}
          label={strings.settingsTutorVerbose}
          onPress={() => void setTutorVerbose(true)}
        />
        <Seg
          active={!progress.tutorVerbose}
          label={strings.settingsTutorBrief}
          onPress={() => void setTutorVerbose(false)}
        />
      </View>

      <Text style={styles.section}>{strings.settingsGlossary}</Text>
      <Text style={styles.body}>{GLOSSARY_NOTE}</Text>
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
        <Text key={key} style={styles.glossaryRow}>
          {name}
        </Text>
      ))}

      <PrimaryButton
        label={strings.settingsReset}
        variant="danger"
        onPress={confirmReset}
        style={{ marginTop: spacing.lg }}
      />
      {cleared ? (
        <Text style={styles.caption}>{strings.settingsResetDone}</Text>
      ) : null}
    </ScrollView>
  );
}

function Seg({
  active,
  label,
  onPress,
}: {
  active: boolean;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.segBtn, active && styles.segActive]}
    >
      <Text style={[styles.segText, active && styles.segTextActive]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: colors.cream },
  content: {
    padding: spacing.lg,
    gap: spacing.sm,
    paddingBottom: spacing.xxl,
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
    textAlign: 'right',
    writingDirection: 'rtl',
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
  segActive: { backgroundColor: colors.boardFrame },
  segText: {
    ...typography.button,
    color: colors.ink,
    fontSize: 15,
  },
  segTextActive: { color: colors.cream },
});
