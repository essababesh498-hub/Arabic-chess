import { useLocale } from '@/context/LocaleContext';
import type { AppLocale } from '@/lib/i18n';

export function isRtlLocale(locale: AppLocale) {
  return locale !== 'en';
}

/**
 * Text and row direction for the selected language.
 * The app does not call I18nManager.forceRTL when the language changes,
 * because that only applies after a restart. Screens read this instead.
 */
export function useLocaleLayout() {
  const { locale } = useLocale();
  const rtl = isRtlLocale(locale);
  return {
    locale,
    rtl,
    direction: rtl ? ('rtl' as const) : ('ltr' as const),
    block: {
      textAlign: rtl ? ('right' as const) : ('left' as const),
      writingDirection: rtl ? ('rtl' as const) : ('ltr' as const),
    },
    /**
     * Curriculum and glossary stay Arabic. English still places that
     * text on the left, while the paragraph direction keeps Arabic punctuation.
     */
    arabic: {
      textAlign: rtl ? ('right' as const) : ('left' as const),
      writingDirection: 'rtl' as const,
    },
    center: {
      textAlign: 'center' as const,
      writingDirection: rtl ? ('rtl' as const) : ('ltr' as const),
    },
    /**
     * Rows that were authored as row-reverse while the UI is RTL.
     * English uses row, so the first child stays on the left.
     */
    mirrorRow: rtl ? ('row-reverse' as const) : ('row' as const),
    /** Keep a control on the physical left in either direction. */
    pinLeft: rtl ? ('flex-end' as const) : ('flex-start' as const),
  };
}
