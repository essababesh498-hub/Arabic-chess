import { Chess } from 'chess.js';

/**
 * Lesson diagrams often leave the kings off the board.
 * chess.js throws "missing white/black king" unless validation is skipped.
 * Legal game positions still load; only the king-count check is bypassed.
 */
export function loadPosition(fen: string): Chess {
  return new Chess(fen, { skipValidation: true });
}
