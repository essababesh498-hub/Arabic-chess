import { sampleChapter1 } from './sample-chapter-1';
import type { Chapter } from './types';

/** Full curriculum content arrives in AC-3; scaffold ships one sample chapter. */
export const CHAPTERS: Chapter[] = [sampleChapter1];

export const PLACEHOLDER_CHAPTERS: Array<{
  id: string;
  number: number;
  title: string;
  summary: string;
  locked: true;
}> = [
  {
    id: 'ch-2-placeholder',
    number: 2,
    title: 'البيدق والحصان',
    summary: 'قريباً — محتوى المنهج الكامل في مرحلة لاحقة.',
    locked: true,
  },
  {
    id: 'ch-3-placeholder',
    number: 3,
    title: 'الفيل والوزير',
    summary: 'قريباً — محتوى المنهج الكامل في مرحلة لاحقة.',
    locked: true,
  },
  {
    id: 'ch-4-placeholder',
    number: 4,
    title: 'كش وكش مات',
    summary: 'قريباً — محتوى المنهج الكامل في مرحلة لاحقة.',
    locked: true,
  },
];

export function getChapter(id: string): Chapter | undefined {
  return CHAPTERS.find((c) => c.id === id);
}
