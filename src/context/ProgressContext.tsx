import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { AiStrength } from '@/lib/chess/ai';
import {
  incrementGamesPlayed,
  loadProgress,
  markChapterComplete,
  resetProgress,
  saveProgress,
  type GuestProgress,
} from '@/lib/progress';

type ProgressContextValue = {
  progress: GuestProgress;
  ready: boolean;
  refresh: () => Promise<void>;
  completeChapter: (id: string) => Promise<void>;
  recordGame: () => Promise<void>;
  setSoundEnabled: (v: boolean) => Promise<void>;
  setDefaultAiStrength: (v: AiStrength) => Promise<void>;
  setTutorVerbose: (v: boolean) => Promise<void>;
  clearProgress: () => Promise<void>;
};

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [progress, setProgress] = useState<GuestProgress>({
    completedChapterIds: [],
    gamesPlayed: 0,
    soundEnabled: true,
    defaultAiStrength: 'easy',
    tutorVerbose: true,
  });
  const [ready, setReady] = useState(false);

  const refresh = useCallback(async () => {
    const p = await loadProgress();
    setProgress(p);
    setReady(true);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const completeChapter = useCallback(async (id: string) => {
    const p = await markChapterComplete(id);
    setProgress(p);
  }, []);

  const recordGame = useCallback(async () => {
    const p = await incrementGamesPlayed();
    setProgress(p);
  }, []);

  const patch = useCallback(async (partial: Partial<GuestProgress>) => {
    setProgress((prev) => {
      const next = { ...prev, ...partial };
      void saveProgress(next);
      return next;
    });
  }, []);

  const setSoundEnabled = useCallback(
    async (v: boolean) => patch({ soundEnabled: v }),
    [patch],
  );
  const setDefaultAiStrength = useCallback(
    async (v: AiStrength) => patch({ defaultAiStrength: v }),
    [patch],
  );
  const setTutorVerbose = useCallback(
    async (v: boolean) => patch({ tutorVerbose: v }),
    [patch],
  );

  const clearProgress = useCallback(async () => {
    const p = await resetProgress();
    setProgress(p);
  }, []);

  const value = useMemo(
    () => ({
      progress,
      ready,
      refresh,
      completeChapter,
      recordGame,
      setSoundEnabled,
      setDefaultAiStrength,
      setTutorVerbose,
      clearProgress,
    }),
    [
      progress,
      ready,
      refresh,
      completeChapter,
      recordGame,
      setSoundEnabled,
      setDefaultAiStrength,
      setTutorVerbose,
      clearProgress,
    ],
  );

  return (
    <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>
  );
}

export function useProgress(): ProgressContextValue {
  const ctx = useContext(ProgressContext);
  if (!ctx) {
    throw new Error('useProgress must be used within ProgressProvider');
  }
  return ctx;
}
