import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { CHAPTERS, PLACEHOLDER_CHAPTERS } from '@/lib/curriculum/chapters';
import { useProgress } from '@/context/ProgressContext';
import { strings } from '@/lib/strings';
import { colors, radii, spacing, typography } from '@/lib/theme';

export default function LearnListScreen() {
  const { progress } = useProgress();

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.subtitle}>{strings.learnSubtitle}</Text>

      {CHAPTERS.map((chapter) => {
        const done = progress.completedChapterIds.includes(chapter.id);
        return (
          <Pressable
            key={chapter.id}
            onPress={() => router.push(`/learn/${chapter.id}`)}
            style={({ pressed }) => [styles.row, pressed && styles.pressed]}
            accessibilityRole="button"
          >
            <View style={styles.numBadge}>
              <Text style={styles.numText}>{chapter.number}</Text>
            </View>
            <View style={styles.rowBody}>
              <Text style={styles.rowTitle}>{chapter.title}</Text>
              <Text style={styles.rowSummary}>{chapter.summary}</Text>
              <Text style={styles.rowStatus}>
                {done ? strings.chapterCompleted : strings.chapterAvailable}
              </Text>
            </View>
          </Pressable>
        );
      })}

      {PLACEHOLDER_CHAPTERS.map((chapter) => (
        <View key={chapter.id} style={[styles.row, styles.locked]}>
          <View style={[styles.numBadge, styles.numLocked]}>
            <Text style={styles.numText}>{chapter.number}</Text>
          </View>
          <View style={styles.rowBody}>
            <Text style={styles.rowTitle}>{chapter.title}</Text>
            <Text style={styles.rowSummary}>{chapter.summary}</Text>
            <Text style={styles.rowStatus}>{strings.chapterLocked}</Text>
          </View>
        </View>
      ))}
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
    marginBottom: spacing.sm,
  },
  row: {
    flexDirection: 'row-reverse',
    gap: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  pressed: { opacity: 0.75 },
  locked: { opacity: 0.55 },
  numBadge: {
    width: 44,
    height: 44,
    borderRadius: radii.sm,
    backgroundColor: colors.boardFrame,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numLocked: { backgroundColor: colors.inkMuted },
  numText: {
    ...typography.subtitle,
    color: colors.cream,
  },
  rowBody: { flex: 1, gap: 4 },
  rowTitle: {
    ...typography.subtitle,
    color: colors.ink,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  rowSummary: {
    ...typography.caption,
    color: colors.inkMuted,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  rowStatus: {
    ...typography.caption,
    color: colors.success,
    textAlign: 'right',
    writingDirection: 'rtl',
    fontFamily: 'IBMPlexSansArabic_600SemiBold',
  },
});
