import { chapter2PawnKnight } from './chapter-2-pawn-knight';
import { chapter3BishopWazir } from './chapter-3-bishop-wazir';
import { chapter4CheckMate } from './chapter-4-check-mate';
import { sampleChapter1 } from './sample-chapter-1';
import type { Chapter } from './types';

export const CHAPTERS: Chapter[] = [
  sampleChapter1,
  chapter2PawnKnight,
  chapter3BishopWazir,
  chapter4CheckMate,
];

export function getChapter(id: string): Chapter | undefined {
  return CHAPTERS.find((chapter) => chapter.id === id);
}

/** Chapter 1 is always open. Each later chapter opens when the previous one is complete. */
export function isChapterUnlocked(
  chapterId: string,
  completedIds: readonly string[],
): boolean {
  const index = CHAPTERS.findIndex((chapter) => chapter.id === chapterId);
  if (index <= 0) return index === 0;
  const previous = CHAPTERS[index - 1];
  return previous != null && completedIds.includes(previous.id);
}

export function isLastChapter(chapterId: string): boolean {
  return CHAPTERS[CHAPTERS.length - 1]?.id === chapterId;
}
