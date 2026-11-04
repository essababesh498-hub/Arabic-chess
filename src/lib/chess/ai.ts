import { Chess, type Move, type Square } from 'chess.js';

export type AiStrength = 'easy' | 'medium' | 'hard';

const PIECE_VALUE: Record<string, number> = {
  p: 1,
  n: 3,
  b: 3,
  r: 5,
  q: 9,
  k: 0,
};

function scoreMove(game: Chess, move: Move): number {
  let score = Math.random() * 0.4;
  if (move.captured) {
    score += (PIECE_VALUE[move.captured] ?? 0) * 10;
    score -= (PIECE_VALUE[move.piece] ?? 0) * 0.5;
  }
  if (move.san.includes('+')) score += 2;
  if (move.san.includes('#')) score += 100;
  if (move.promotion) score += 8;

  // Light hanging-piece penalty for hard mode via probe
  const probe = new Chess(game.fen());
  probe.move({
    from: move.from,
    to: move.to,
    promotion: move.promotion,
  });
  if (probe.isCheckmate()) return 1000;
  return score;
}

/** Pick a legal move. Easy ≈ random; medium/hard bias toward captures and checks. */
export function chooseAiMove(fen: string, strength: AiStrength): Move | null {
  const game = new Chess(fen);
  const moves = game.moves({ verbose: true });
  if (moves.length === 0) return null;

  if (strength === 'easy') {
    return moves[Math.floor(Math.random() * moves.length)] ?? null;
  }

  const scored = moves
    .map((m) => ({ m, s: scoreMove(game, m) }))
    .sort((a, b) => b.s - a.s);

  if (strength === 'medium') {
    const top = scored.slice(0, Math.max(2, Math.ceil(scored.length * 0.35)));
    return top[Math.floor(Math.random() * top.length)]?.m ?? null;
  }

  // hard: nearly greedy among top few
  const top = scored.slice(0, Math.min(3, scored.length));
  return top[0]?.m ?? null;
}

export function applyMove(
  fen: string,
  from: Square,
  to: Square,
  promotion: 'q' | 'r' | 'b' | 'n' = 'q',
): { fen: string; move: Move } | null {
  const game = new Chess(fen);
  try {
    const move = game.move({ from, to, promotion });
    if (!move) return null;
    return { fen: game.fen(), move };
  } catch {
    return null;
  }
}
