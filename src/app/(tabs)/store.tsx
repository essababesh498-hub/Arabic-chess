import React from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { ActionCard } from '@/components/ui/ActionCard';
import { useCopy } from '@/context/LocaleContext';
import { useLocaleLayout } from '@/lib/localeLayout';
import { colors, spacing, typography } from '@/lib/theme';

export default function StoreScreen() {
  const copy = useCopy();
  const layout = useLocaleLayout();

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.subtitle, layout.block]}>{copy.storeSubtitle}</Text>
      <Text style={[styles.note, layout.block]}>{copy.storePreviewNote}</Text>

      <ActionCard
        title={copy.collectionClassic}
        body={copy.collectionClassicBody}
        badge={copy.priceFree}
      />
      <ActionCard
        title={copy.collectionPlatinum}
        body={copy.collectionPlatinumBody}
        badge={copy.unavailable}
        available={false}
      />
      <ActionCard
        title={copy.collectionRoyal}
        body={copy.collectionRoyalBody}
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
    color: colors.ink,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  note: {
    ...typography.caption,
    color: colors.accentSoft,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
});
