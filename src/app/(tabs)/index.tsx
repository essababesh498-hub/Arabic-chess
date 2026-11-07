import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { PrimaryButton } from '@/components/PrimaryButton';
import { useProgress } from '@/context/ProgressContext';
import { strings } from '@/lib/strings';
import { colors, spacing, typography } from '@/lib/theme';

export default function HomeScreen() {
  const { progress } = useProgress();

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.hero}>
        <Text style={styles.brand}>{strings.appName}</Text>
        <Text style={styles.tagline}>{strings.tagline}</Text>
        <Text style={styles.welcome}>{strings.homeSubtitle}</Text>
        <View style={styles.ctaRow}>
          <PrimaryButton
            label={strings.ctaLearn}
            onPress={() => router.push('/learn')}
            style={styles.cta}
          />
          <PrimaryButton
            label={strings.ctaPlay}
            variant="secondary"
            onPress={() => router.push('/play')}
            style={styles.cta}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{strings.progressTitle}</Text>
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{progress.completedChapterIds.length}</Text>
            <Text style={styles.statLabel}>{strings.chaptersDone}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statValue}>{progress.gamesPlayed}</Text>
            <Text style={styles.statLabel}>{strings.gamesPlayed}</Text>
          </View>
        </View>
        <Text style={styles.guestNote}>{strings.guestBadge}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  content: {
    paddingBottom: spacing.xxl,
  },
  hero: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xl,
    minHeight: 320,
    justifyContent: 'flex-end',
    gap: spacing.sm,
  },
  brand: {
    ...typography.brand,
    color: colors.cream,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  tagline: {
    ...typography.subtitle,
    color: colors.accentSoft,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  welcome: {
    ...typography.body,
    color: colors.sandSoft,
    textAlign: 'right',
    writingDirection: 'rtl',
    marginBottom: spacing.sm,
  },
  ctaRow: {
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  cta: {
    alignSelf: 'stretch',
  },
  section: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    gap: spacing.md,
  },
  sectionTitle: {
    ...typography.subtitle,
    color: colors.cream,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  statsRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingVertical: spacing.md,
  },
  stat: {
    alignItems: 'center',
    flex: 1,
    gap: 4,
  },
  statValue: {
    ...typography.title,
    color: colors.cream,
  },
  statLabel: {
    ...typography.caption,
    color: colors.sandSoft,
    textAlign: 'center',
    writingDirection: 'rtl',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(232, 220, 200, 0.45)',
  },
  guestNote: {
    ...typography.caption,
    color: colors.sandSoft,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
});
