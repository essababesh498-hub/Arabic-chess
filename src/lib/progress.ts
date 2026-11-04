import AsyncStorage from '@react-native-async-storage/async-storage';
import type { AiStrength } from './chess/ai';

const KEY = 'arabic-chess:guest-progress:v1';

export type GuestProgress = {
  completedChapterIds: string[];
  gamesPlayed: number;
  soundEnabled: boolean;
  defaultAiStrength: AiStrength;
  tutorVerbose: boolean;
};

const DEFAULT_PROGRESS: GuestProgress = {
  completedChapterIds: [],
  gamesPlayed: 0,
  soundEnabled: true,
  defaultAiStrength: 'easy',
  tutorVerbose: true,
};

export async function loadProgress(): Promise<GuestProgress> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return { ...DEFAULT_PROGRESS };
    return { ...DEFAULT_PROGRESS, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_PROGRESS };
  }
}

export async function saveProgress(next: GuestProgress): Promise<void> {
  await AsyncStorage.setItem(KEY, JSON.stringify(next));
}

export async function markChapterComplete(chapterId: string): Promise<GuestProgress> {
  const current = await loadProgress();
  if (!current.completedChapterIds.includes(chapterId)) {
    current.completedChapterIds = [...current.completedChapterIds, chapterId];
    await saveProgress(current);
  }
  return current;
}

export async function incrementGamesPlayed(): Promise<GuestProgress> {
  const current = await loadProgress();
  current.gamesPlayed += 1;
  await saveProgress(current);
  return current;
}

export async function resetProgress(): Promise<GuestProgress> {
  const fresh = { ...DEFAULT_PROGRESS };
  await saveProgress(fresh);
  return fresh;
}
