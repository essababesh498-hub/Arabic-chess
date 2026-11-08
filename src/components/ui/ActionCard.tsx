import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useLocaleLayout } from '@/lib/localeLayout';
import { colors, radii, shadows, spacing, typography } from '@/lib/theme';

type Props = {
  title: string;
  body: string;
  badge?: string;
  available?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

export function ActionCard({
  title,
  body,
  badge,
  available = true,
  onPress,
  style,
}: Props) {
  const disabled = !available || !onPress;
  const layout = useLocaleLayout();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        !available && styles.unavailable,
        pressed && available && styles.pressed,
        style,
      ]}
    >
      <View style={[styles.head, { flexDirection: layout.mirrorRow }]}>
        <Text style={[styles.title, layout.block]}>{title}</Text>
        {badge ? (
          <Text style={[styles.badge, layout.center, !available && styles.badgeMuted]}>{badge}</Text>
        ) : null}
      </View>
      <Text style={[styles.body, layout.block]}>{body}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.sm,
    ...shadows.card,
  },
  unavailable: {
    opacity: 0.72,
  },
  pressed: {
    opacity: 0.86,
  },
  head: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  title: {
    ...typography.subtitle,
    color: colors.ink,
    textAlign: 'right',
    writingDirection: 'rtl',
    flex: 1,
  },
  body: {
    ...typography.body,
    color: colors.inkMuted,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  badge: {
    ...typography.caption,
    fontFamily: 'IBMPlexSansArabic_600SemiBold',
    color: colors.onAccent,
    backgroundColor: colors.accent,
    overflow: 'hidden',
    borderRadius: radii.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  badgeMuted: {
    color: colors.inkMuted,
    backgroundColor: colors.surfaceMuted,
  },
});
