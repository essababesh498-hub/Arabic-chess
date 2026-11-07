import { useWindowDimensions } from 'react-native';

/**
 * Lessons keep a modest inset. The game passes the measured slot so the table
 * can grow to the largest square that fits between the player bars.
 */
export function boardPixelSize(windowWidth: number, maxSize?: number) {
  const fitted = Math.min(windowWidth - 32, 420);
  const size = maxSize == null ? fitted : Math.min(maxSize, windowWidth);
  if (!Number.isFinite(size)) return 280;
  return Math.max(48, Math.floor(size));
}

/** The play area itself, so the table can fill the screen behind the bars. */
export function overheadFrame(slotWidth: number, slotHeight: number) {
  return {
    width: Math.max(48, Math.floor(slotWidth)),
    height: Math.max(48, Math.floor(slotHeight)),
  };
}

export function useBoardPixelSize(maxSize?: number) {
  const { width } = useWindowDimensions();
  return boardPixelSize(width, maxSize);
}
