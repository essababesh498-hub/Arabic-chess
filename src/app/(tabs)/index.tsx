import React, { useEffect, useRef } from 'react';
import {
  AccessibilityInfo,
  Animated,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradientFallback } from '@/components/LinearGradientFallback';
import { ActionCard } from '@/components/ui/ActionCard';
import { useProgress } from '@/context/ProgressContext';
import { useCopy } from '@/context/LocaleContext';
import { brand } from '@/lib/brand';
import { useLocaleLayout } from '@/lib/localeLayout';
import { colors, radii, shadows, spacing, typography } from '@/lib/theme';

export default function HomeScreen() {
  const { progress } = useProgress();
  const copy = useCopy();
  const layout = useLocaleLayout();
  const opacity = useRef(new Animated.Value(0)).current;
  const rise = useRef(new Animated.Value(12)).current;

  useEffect(() => {
    let active = true;
    AccessibilityInfo.isReduceMotionEnabled()
      .then((reduce) => {
        if (!active) return;
        if (reduce) {
          opacity.setValue(1);
          rise.setValue(0);
          return;
        }
        const nativeDriver = Platform.OS !== 'web';
        Animated.parallel([
          Animated.timing(opacity, {
            toValue: 1,
            duration: 420,
            useNativeDriver: nativeDriver,
          }),
          Animated.timing(rise, {
            toValue: 0,
            duration: 420,
            useNativeDriver: nativeDriver,
          }),
        ]).start();
      })
      .catch(() => {
        opacity.setValue(1);
        rise.setValue(0);
      });
    return () => {
      active = false;
    };
  }, [opacity, rise]);

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <LinearGradientFallback style={styles.hero}>
        <Text style={[styles.eyebrow, layout.block]}>{brand.name}</Text>
        <Text style={[styles.tagline, layout.block]}>{copy.tagline}</Text>
        <Text style={[styles.welcome, layout.block]}>{copy.homeSubtitle}</Text>
      </LinearGradientFallback>

      <Animated.View
        style={[styles.stack, { opacity, transform: [{ translateY: rise }] }]}
      >
        <ActionCard
          title={copy.navPlay}
          body={copy.homePlayBody}
          onPress={() => router.push('/play')}
        />
        <ActionCard
          title={copy.navLearn}
          body={copy.homeLearnBody}
          onPress={() => router.push('/learn')}
        />
        <ActionCard
          title={copy.competeTitle}
          body={copy.competeBody}
          badge={copy.unavailable}
          available={false}
        />

        <View style={styles.progress}>
          <Text style={[styles.sectionTitle, layout.block]}>{copy.progressTitle}</Text>
          <View style={[styles.statsRow, { flexDirection: layout.mirrorRow }]}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{progress.completedChapterIds.length}</Text>
              <Text style={[styles.statLabel, layout.center]}>{copy.chaptersDone}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statValue}>{progress.gamesPlayed}</Text>
              <Text style={[styles.statLabel, layout.center]}>{copy.gamesPlayed}</Text>
            </View>
          </View>
          <Text style={[styles.guestNote, layout.block]}>{copy.guestBadge}</Text>
        </View>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingBottom: spacing.xxl,
    gap: spacing.lg,
  },
  hero: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
    gap: spacing.sm,
  },
  eyebrow: {
    ...typography.caption,
    color: colors.accent,
    textAlign: 'right',
    writingDirection: 'rtl',
    letterSpacing: 0.4,
  },
  tagline: {
    ...typography.brand,
    color: colors.ink,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  welcome: {
    ...typography.body,
    color: colors.inkMuted,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  stack: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  progress: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.sm,
    ...shadows.card,
  },
  sectionTitle: {
    ...typography.subtitle,
    color: colors.ink,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  statsRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingVertical: spacing.sm,
  },
  stat: {
    alignItems: 'center',
    flex: 1,
    gap: 4,
  },
  statValue: {
    ...typography.title,
    color: colors.ivory,
  },
  statLabel: {
    ...typography.caption,
    color: colors.inkMuted,
    textAlign: 'center',
    writingDirection: 'rtl',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.border,
  },
  guestNote: {
    ...typography.caption,
    color: colors.inkMuted,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
});
