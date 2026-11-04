/** Canonical classical Arabic chess glossary — locked for MVP. */

export const PIECE_NAMES = {
  k: 'الملك',
  q: 'الوزير',
  r: 'الرخ',
  b: 'الفيل',
  n: 'الحصان',
  p: 'البيدق',
} as const;

export type PieceLetter = keyof typeof PIECE_NAMES;

export const TERMS = {
  check: 'كش',
  checkmate: 'كش مات',
  stalemate: 'بات',
  castling: 'التبييت',
  enPassant: 'الأخذ بالتجاوز',
  promotion: 'الترقية',
  capture: 'أسر',
  move: 'نقلة',
  opening: 'الافتتاح',
  endgame: 'نهاية اللعب',
  illegalMove: 'نقلة غير قانونية',
  chapter: 'فصل',
  exercise: 'تمرين',
  quiz: 'اختبار',
  white: 'الأبيض',
  black: 'الأسود',
  yourTurn: 'دورك',
  aiTurn: 'دور الكمبيوتر',
  newGame: 'لعبة جديدة',
  learn: 'تعلّم',
  play: 'العب',
  home: 'الرئيسية',
  settings: 'الإعدادات',
  tutor: 'المعلّم',
  guest: 'ضيف',
  easy: 'سهل',
  medium: 'متوسط',
  hard: 'صعب',
} as const;

export const GLOSSARY_NOTE =
  'نستخدم الأسماء الكلاسيكية: الوزير (لا الملكة)، الرخ (لا القلعة)، البيدق (لا الجندي). قد تُذكر البدائل مرة واحدة في ملاحظة توضيحية.';

export function pieceName(type: string, color?: 'w' | 'b'): string {
  const base = PIECE_NAMES[type.toLowerCase() as PieceLetter] ?? type;
  if (!color) return base;
  return color === 'w' ? `${base} الأبيض` : `${base} الأسود`;
}
