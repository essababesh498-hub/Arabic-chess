import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { catalogs, type AppLocale, type UiCopy } from '@/lib/i18n';

/** Separate from guest progress so the progress blob stays unchanged. */
const LOCALE_KEY = 'arabic-chess:locale:v1';

type LocaleContextValue = {
  locale: AppLocale;
  copy: UiCopy;
  ready: boolean;
  setLocale: (locale: AppLocale) => void;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<AppLocale>('ar');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(LOCALE_KEY)
      .then((stored) => {
        if (!active) return;
        if (stored === 'en' || stored === 'ar') setLocaleState(stored);
      })
      .catch(() => undefined)
      .finally(() => {
        if (active) setReady(true);
      });
    return () => {
      active = false;
    };
  }, []);

  const setLocale = useCallback((next: AppLocale) => {
    setLocaleState(next);
    void AsyncStorage.setItem(LOCALE_KEY, next);
  }, []);

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      copy: catalogs[locale],
      ready,
      setLocale,
    }),
    [locale, ready, setLocale],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale(): LocaleContextValue {
  const value = useContext(LocaleContext);
  if (!value) {
    throw new Error('useLocale must be used within LocaleProvider');
  }
  return value;
}

export function useCopy(): UiCopy {
  return useLocale().copy;
}
