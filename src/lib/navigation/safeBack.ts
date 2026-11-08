import { useCallback } from 'react';
import { BackHandler, Platform } from 'react-native';
import { router, useFocusEffect, type Href } from 'expo-router';

/** Pop the stack when it has history; otherwise open the parent or home screen. */
export function goBackOr(fallback: Href = '/') {
  if (router.canGoBack()) {
    router.back();
    return;
  }
  router.replace(fallback);
}

/**
 * Back handler for a screen. Android hardware back uses the same rule:
 * pop when possible, otherwise replace `fallback` so GO_BACK is never dispatched
 * into an empty stack.
 */
export function useSafeBack(fallback: Href = '/') {
  const onBack = useCallback(() => {
    goBackOr(fallback);
  }, [fallback]);

  useFocusEffect(
    useCallback(() => {
      if (Platform.OS !== 'android') {
        return;
      }
      const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
        if (router.canGoBack()) {
          return false;
        }
        router.replace(fallback);
        return true;
      });
      return () => subscription.remove();
    }, [fallback]),
  );

  return onBack;
}
