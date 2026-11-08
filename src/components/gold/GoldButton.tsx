import React from 'react';
import { Pressable, StyleSheet, Text, type StyleProp, type ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GoldPanel } from '@/components/gold/GoldPanel';
import { gold } from '@/lib/goldTheme';
import { useLocaleLayout } from '@/lib/localeLayout';

type Props = {
  label: string;
  onPress: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  style?: StyleProp<ViewStyle>;
  compact?: boolean;
};

/** Tappable gold-on-black control. The label stays on one line so rows don't wrap. */
export function GoldButton({ label, onPress, icon, style, compact }: Props) {
  const layout = useLocaleLayout();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [styles.press, pressed && styles.pressed, style]}
    >
      <GoldPanel contentStyle={compact ? styles.compact : styles.pad}>
        {icon ? (
          <Ionicons
            name={icon}
            size={compact ? 14 : 16}
            color={gold.goldBright}
          />
        ) : null}
        <Text
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.7}
          style={[styles.label, layout.center, compact && styles.labelCompact]}
        >
          {label}
        </Text>
      </GoldPanel>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    minWidth: 0,
  },
  pressed: {
    opacity: 0.82,
  },
  pad: {
    minHeight: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  compact: {
    minHeight: 36,
    paddingVertical: 3,
    paddingHorizontal: 2,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 1,
  },
  label: {
    color: gold.text,
    fontFamily: 'IBMPlexSansArabic_600SemiBold',
    fontSize: 14,
    lineHeight: 18,
    textAlign: 'center',
    writingDirection: 'rtl',
    flexShrink: 1,
  },
  labelCompact: {
    fontSize: 11,
    lineHeight: 15,
  },
});
