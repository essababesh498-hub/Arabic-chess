import type { AppLocale } from '@/lib/i18n/types';
import { ar } from '@/lib/i18n/ar';
import { en } from '@/lib/i18n/en';

export type { AppLocale, UiCopy } from '@/lib/i18n/types';
export { ar, en };

export const catalogs = { ar, en } as const;

export function exercisePartialLabel(
  found: number,
  total: number,
  locale: AppLocale = 'ar',
): string {
  if (locale === 'en') {
    const progress =
      found === 0 ? `${total} squares required` : `${found} of ${total} correct`;
    return `${progress}. More squares are still required.`;
  }
  const progress =
    found === 0 ? `المطلوب ${total} مربعات` : `${found} من ${total} صحيحة`;
  return `${progress}. ما زال هناك مربعات مطلوبة.`;
}
