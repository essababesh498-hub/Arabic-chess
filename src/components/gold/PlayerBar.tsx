import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GoldPanel } from '@/components/gold/GoldPanel';
import { gold } from '@/lib/goldTheme';

type Props = {
  name: string;
  rating: number;
  seconds: number;
  incrementLabel: string;
  active?: boolean;
  avatarLabel: string;
  compact?: boolean;
  /** Two short bars at the sides, with a clear gap so the board shows through. */
  split?: boolean;
};

export function formatClock(totalSeconds: number): string {
  const safe = Math.max(0, totalSeconds);
  const minutes = Math.floor(safe / 60);
  const seconds = safe % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

/** Player strip: avatar, name, trophy rating, and the running clock. */
export function PlayerBar({
  name,
  rating,
  seconds,
  incrementLabel,
  active,
  avatarLabel,
  compact,
  split,
}: Props) {
  const identity = (
    <View style={styles.identityGroup}>
      <View style={[styles.avatar, active && styles.avatarActive]}>
        <Text style={styles.avatarText}>{avatarLabel}</Text>
      </View>
      <View style={split ? styles.identitySplit : styles.identity}>
        <Text numberOfLines={1} style={styles.name}>
          {name}
        </Text>
        <View style={styles.ratingRow}>
          <Ionicons name="trophy" size={12} color={gold.gold} />
          <Text style={styles.rating}>{rating}</Text>
        </View>
      </View>
    </View>
  );

  const clock = (
    <View style={styles.clock}>
      <Text style={[styles.time, active && styles.timeActive]}>{formatClock(seconds)}</Text>
      <Text style={styles.increment}>{incrementLabel}</Text>
    </View>
  );

  if (split) {
    return (
      <View style={styles.splitRow} pointerEvents="box-none">
        <GoldPanel active={active} contentStyle={styles.side}>
          {identity}
        </GoldPanel>
        <GoldPanel active={active} contentStyle={styles.side}>
          {clock}
        </GoldPanel>
      </View>
    );
  }

  return (
    <GoldPanel active={active} contentStyle={compact ? styles.compact : undefined}>
      <View style={styles.row}>
        {identity}
        {clock}
      </View>
    </GoldPanel>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minHeight: 36,
  },
  splitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  side: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  identityGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexShrink: 1,
    minWidth: 0,
  },
  compact: {
    paddingVertical: 4,
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1.5,
    borderColor: gold.gold,
    backgroundColor: gold.panelRaised,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarActive: {
    borderColor: gold.goldBright,
  },
  avatarText: {
    color: gold.goldBright,
    fontFamily: 'IBMPlexSansArabic_700Bold',
    fontSize: 15,
    lineHeight: 20,
  },
  identity: {
    flex: 1,
    minWidth: 0,
    gap: 1,
  },
  identitySplit: {
    flexShrink: 1,
    minWidth: 0,
    gap: 1,
    maxWidth: 148,
  },
  name: {
    color: gold.text,
    fontFamily: 'IBMPlexSansArabic_700Bold',
    fontSize: 15,
    lineHeight: 20,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 4,
  },
  rating: {
    color: gold.textMuted,
    fontFamily: 'IBMPlexSansArabic_600SemiBold',
    fontSize: 12,
    lineHeight: 16,
  },
  clock: {
    alignItems: 'center',
    minWidth: 62,
  },
  time: {
    color: gold.text,
    fontFamily: 'IBMPlexSansArabic_700Bold',
    fontSize: 18,
    lineHeight: 22,
    fontVariant: ['tabular-nums'],
  },
  timeActive: {
    color: gold.goldBright,
  },
  increment: {
    color: gold.goldDim,
    fontFamily: 'IBMPlexSansArabic_600SemiBold',
    fontSize: 11,
    lineHeight: 14,
  },
});
