const WHITE: Record<string, string> = {
  k: '♔',
  q: '♕',
  r: '♖',
  b: '♗',
  n: '♘',
  p: '♙',
};

const BLACK: Record<string, string> = {
  k: '♚',
  q: '♛',
  r: '♜',
  b: '♝',
  n: '♞',
  p: '♟',
};

export function pieceGlyph(type: string, color: 'w' | 'b'): string {
  const map = color === 'w' ? WHITE : BLACK;
  return map[type.toLowerCase()] ?? '?';
}
