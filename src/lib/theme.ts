/**
 * Design tokens — Arabic Chess (working name)
 *
 * Mood: naturally Arabic everyday life — hospitality, warm wood/brass/linen,
 * calm home light. NOT forced “Oriental” kitsch, purple neon, or Aladdin parody.
 *
 * Visual direction (scaffold → later art):
 * - Tilted top-down 3D board + 3D pieces (BoardStage)
 * - Genie lamp as a warm household object + friendly mentor (GenieLampTutor)
 * - Chess.com-like IA (learn / play / tips), non-flat material feel
 *
 * TODO(art): soft fabric/wood texture layers, lamp brass highlights, ambient
 * room light — keep saturation gentle.
 */

export const colors = {
  /** Deep ink for Arabic body text */
  ink: '#1A1714',
  inkMuted: '#5C534A',
  /** Warm plaster / linen page */
  cream: '#F2EBE1',
  /** Brass / hospitality accent (soft, not glittery) */
  sand: '#B0894F',
  sandSoft: '#E8DCC8',
  /** Board — olive wood / green felt family */
  boardDark: '#3E5C48',
  boardLight: '#E4D4B5',
  boardFrame: '#2A3F34',
  /** Soft saffron for focus — restrained */
  accent: '#C4922A',
  accentSoft: '#F0E2C0',
  danger: '#9A4540',
  success: '#3A6B52',
  surface: '#FFFBF5',
  surfaceMuted: '#F6F0E6',
  border: '#D8CFC0',
  highlight: 'rgba(196, 146, 42, 0.38)',
  lastMove: 'rgba(62, 92, 72, 0.32)',
  check: 'rgba(154, 69, 64, 0.42)',
  /** Lamp / genie UI */
  lampBrass: '#A67C3D',
  lampGlow: 'rgba(240, 226, 192, 0.9)',
  genieMist: 'rgba(232, 220, 200, 0.85)',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const radii = {
  sm: 8,
  md: 12,
  lg: 20,
} as const;

export const textures = {
  /**
   * Scaffold notes only — no image assets yet.
   * Prefer: plaster wash, olive-wood grain, linen weave, soft brass — subtle.
   * Avoid: ornate damask overload, cartoon magic carpets, heavy filigree chrome.
   */
  notes:
    'Warm plaster + linen backgrounds; olive-wood board frame; brass lamp as home object.',
} as const;

export const typography = {
  brand: {
    fontFamily: 'IBMPlexSansArabic_700Bold',
    fontSize: 36,
    lineHeight: 48,
  },
  title: {
    fontFamily: 'IBMPlexSansArabic_700Bold',
    fontSize: 26,
    lineHeight: 36,
  },
  subtitle: {
    fontFamily: 'IBMPlexSansArabic_600SemiBold',
    fontSize: 18,
    lineHeight: 28,
  },
  body: {
    fontFamily: 'IBMPlexSansArabic_400Regular',
    fontSize: 16,
    lineHeight: 26,
  },
  caption: {
    fontFamily: 'IBMPlexSansArabic_400Regular',
    fontSize: 13,
    lineHeight: 20,
  },
  button: {
    fontFamily: 'IBMPlexSansArabic_600SemiBold',
    fontSize: 17,
    lineHeight: 24,
  },
} as const;
