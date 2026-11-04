import React, { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Chess } from 'chess.js';
import { PrimaryButton } from '@/components/PrimaryButton';
import { useCopy } from '@/context/LocaleContext';
import { askTutor } from '@/lib/tutor/client';
import { colors, radii, spacing, typography } from '@/lib/theme';

type Props = {
  fen: string;
  chapterContext?: string;
  cannedPrompts?: string[];
};

/**
 * GenieLampTutor — Arabic LLM tutor behind a household lamp metaphor.
 *
 * Design: warm home object + friendly mentor. Rub the lamp → tip appears.
 * Not Aladdin parody / kitsch “Oriental” spectacle.
 *
 * TODO(genie-lamp):
 * - Brass lamp illustration / light 3D prop on the play table
 * - Gentle rub gesture → mist + mentor avatar (calm, hospitable)
 * - Motion: soft glow, short mist rise — not fireworks
 * LLM wiring already lives in `@/lib/tutor/client`.
 */
export function GenieLampTutor({
  fen,
  chapterContext,
  cannedPrompts = ['ما الحركة الأفضل؟', 'اشرح الوضع', 'هل الملك تحت كش؟'],
}: Props) {
  const copy = useCopy();
  const [input, setInput] = useState('');
  const [reply, setReply] = useState<string | null>(null);
  const [source, setSource] = useState<'llm' | 'fallback' | null>(null);
  const [loading, setLoading] = useState(false);
  const [lampRubbed, setLampRubbed] = useState(false);

  async function send(message: string) {
    const trimmed = message.trim();
    if (!trimmed || loading) return;
    setLoading(true);
    setReply(null);
    setLampRubbed(true);
    try {
      const game = new Chess(fen);
      const legalMoves = game.moves();
      const res = await askTutor({
        userMessage: trimmed,
        fen,
        legalMoves,
        chapterContext,
      });
      setReply(res.text);
      setSource(res.source);
      setInput('');
    } finally {
      setLoading(false);
    }
  }

  function rubLamp() {
    setLampRubbed(true);
    void send(cannedPrompts[0] ?? 'أعطني نصيحة قصيرة عن الوضع الحالي');
  }

  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>{copy.genieTitle}</Text>
      <Text style={styles.subtitle}>{copy.genieSubtitle}</Text>

      {/* Placeholder lamp — swap for art/3D prop later */}
      <Pressable
        onPress={rubLamp}
        disabled={loading}
        accessibilityRole="button"
        accessibilityLabel="امسح المصباح لطلب نصيحة"
        style={({ pressed }) => [
          styles.lamp,
          pressed && styles.lampPressed,
          lampRubbed && styles.lampActive,
        ]}
      >
        <View style={styles.lampGlow} />
        <Text style={styles.lampGlyph}>🪔</Text>
        <Text style={styles.lampLabel}>
          {loading ? copy.tutorThinking : copy.genieRub}
        </Text>
        <Text style={styles.lampTodo}>
          TODO: مصباح نحاسي منزلي + معلّم ودود (بدون كليشيه)
        </Text>
      </Pressable>

      <View style={styles.chips}>
        {cannedPrompts.map((p) => (
          <PrimaryButton
            key={p}
            label={p}
            variant="secondary"
            onPress={() => void send(p)}
            disabled={loading}
            style={styles.chip}
          />
        ))}
      </View>

      <TextInput
        value={input}
        onChangeText={setInput}
        placeholder={copy.tutorPlaceholder}
        placeholderTextColor={colors.inkMuted}
        style={styles.input}
        textAlign="right"
        editable={!loading}
        onSubmitEditing={() => void send(input)}
      />
      <PrimaryButton
        label={loading ? copy.tutorThinking : copy.tutorSend}
        onPress={() => void send(input)}
        disabled={loading || !input.trim()}
      />

      {loading ? (
        <ActivityIndicator color={colors.boardFrame} style={{ marginTop: 8 }} />
      ) : null}

      {reply ? (
        <View style={styles.replyBox}>
          <Text style={styles.replyMeta}>
            {source === 'llm' ? copy.geniePersona : copy.localTip}
          </Text>
          <Text style={styles.reply}>{reply}</Text>
          {source === 'fallback' ? (
            <Text style={styles.hint}>{copy.tutorUnavailable}</Text>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  title: {
    ...typography.subtitle,
    color: colors.ink,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  subtitle: {
    ...typography.caption,
    color: colors.inkMuted,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  lamp: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
    borderRadius: radii.lg,
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
    overflow: 'hidden',
  },
  lampPressed: { opacity: 0.9 },
  lampActive: {
    borderStyle: 'solid',
    borderColor: colors.lampBrass,
    backgroundColor: colors.lampGlow,
  },
  lampGlow: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.genieMist,
    top: -20,
  },
  lampGlyph: {
    fontSize: 42,
    zIndex: 1,
  },
  lampLabel: {
    ...typography.button,
    color: colors.ink,
    textAlign: 'center',
    writingDirection: 'rtl',
    zIndex: 1,
  },
  lampTodo: {
    ...typography.caption,
    color: colors.inkMuted,
    textAlign: 'center',
    writingDirection: 'rtl',
    zIndex: 1,
  },
  chips: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    minHeight: 40,
    paddingHorizontal: spacing.md,
  },
  input: {
    ...typography.body,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    color: colors.ink,
    minHeight: 48,
  },
  replyBox: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: radii.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.xs,
  },
  replyMeta: {
    ...typography.caption,
    color: colors.lampBrass,
    textAlign: 'right',
    writingDirection: 'rtl',
    fontFamily: 'IBMPlexSansArabic_600SemiBold',
  },
  reply: {
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
    marginTop: spacing.xs,
  },
});
