import type { PieceSymbol, Square } from 'chess.js';
import { loadPosition } from '@/lib/chess/position';

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] as const;

export type BoardActor = {
  id: string;
  type: PieceSymbol;
  color: 'w' | 'b';
  square: Square;
  leaving: boolean;
};

let sequence = 1;

export function squareToPoint(square: Square) {
  const file = square.charCodeAt(0) - 97;
  const rank = Number(square[1]);
  return {
    x: file - 3.5,
    z: 4.5 - rank,
  };
}

function squareDistance(a: Square, b: Square) {
  const file = a.charCodeAt(0) - b.charCodeAt(0);
  const rank = Number(a[1]) - Number(b[1]);
  return file * file + rank * rank;
}

export function readPieces(fen: string): Array<Omit<BoardActor, 'id' | 'leaving'>> {
  const board = loadPosition(fen).board();
  const pieces: Array<Omit<BoardActor, 'id' | 'leaving'>> = [];
  for (let row = 0; row < 8; row += 1) {
    for (let col = 0; col < 8; col += 1) {
      const piece = board[row]?.[col];
      if (!piece) continue;
      const file = FILES[col];
      const rank = 8 - row;
      pieces.push({
        type: piece.type,
        color: piece.color,
        square: `${file}${rank}` as Square,
      });
    }
  }
  return pieces;
}

function spawn(piece: Omit<BoardActor, 'id' | 'leaving'>): BoardActor {
  sequence += 1;
  return {
    id: `piece-${sequence}`,
    type: piece.type,
    color: piece.color,
    square: piece.square,
    leaving: false,
  };
}

function takeNearest(
  pool: BoardActor[],
  used: Set<string>,
  piece: Omit<BoardActor, 'id' | 'leaving'>,
  accept: (actor: BoardActor) => boolean,
) {
  let best: BoardActor | undefined;
  let bestDistance = Number.POSITIVE_INFINITY;
  for (const actor of pool) {
    if (used.has(actor.id) || actor.leaving || !accept(actor)) continue;
    const distance = squareDistance(actor.square, piece.square);
    if (distance < bestDistance) {
      best = actor;
      bestDistance = distance;
    }
  }
  return best;
}

/** Match the new position onto the previous pieces so moves can animate. */
export function reconcile(previous: BoardActor[], fen: string): BoardActor[] {
  const next = readPieces(fen);
  const pool = previous.filter((actor) => !actor.leaving);
  const used = new Set<string>();
  const placed: BoardActor[] = [];
  const moved: Array<Omit<BoardActor, 'id' | 'leaving'>> = [];

  for (const piece of next) {
    const stayed = pool.find(
      (actor) =>
        !used.has(actor.id) &&
        actor.square === piece.square &&
        actor.type === piece.type &&
        actor.color === piece.color,
    );
    if (!stayed) {
      moved.push(piece);
      continue;
    }
    used.add(stayed.id);
    placed.push({ ...stayed, ...piece, leaving: false });
  }

  const promoted: Array<Omit<BoardActor, 'id' | 'leaving'>> = [];
  for (const piece of moved) {
    const actor = takeNearest(
      pool,
      used,
      piece,
      (candidate) => candidate.type === piece.type && candidate.color === piece.color,
    );
    if (!actor) {
      promoted.push(piece);
      continue;
    }
    used.add(actor.id);
    placed.push({ ...actor, ...piece, leaving: false });
  }

  for (const piece of promoted) {
    const pawn = takeNearest(
      pool,
      used,
      piece,
      (candidate) => candidate.type === 'p' && candidate.color === piece.color,
    );
    if (!pawn) {
      placed.push(spawn(piece));
      continue;
    }
    used.add(pawn.id);
    placed.push({ ...pawn, ...piece, leaving: false });
  }

  const captured = pool
    .filter((actor) => !used.has(actor.id))
    .map((actor) => ({ ...actor, leaving: true }));

  return [...placed, ...captured];
}

export function initialActors(fen: string): BoardActor[] {
  return readPieces(fen).map((piece) => spawn(piece));
}
