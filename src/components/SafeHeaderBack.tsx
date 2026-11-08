import React from 'react';
import type { ColorValue, StyleProp, TextStyle, ViewStyle } from 'react-native';
import type { Href } from 'expo-router';
import { HeaderBackButton } from 'expo-router/react-navigation';
import { goBackOr } from '@/lib/navigation/safeBack';

type Props = {
  fallback: Href;
  tintColor?: ColorValue;
  label?: string;
  displayMode?: 'default' | 'generic' | 'minimal';
  pressColor?: ColorValue;
  pressOpacity?: number;
  style?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  canGoBack?: boolean;
  onPress?: () => void;
  href?: string;
};

/** Default stack back button, routed through goBackOr so an empty history cannot throw. */
export function SafeHeaderBack({
  fallback,
  label,
  canGoBack: _canGoBack,
  onPress: _onPress,
  href: _href,
  ...rest
}: Props) {
  return (
    <HeaderBackButton
      {...rest}
      label={label ?? 'رجوع'}
      onPress={() => goBackOr(fallback)}
    />
  );
}
