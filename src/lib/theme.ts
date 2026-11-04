/**
 * Premium dark tokens.
 *
 * Charcoal and black surfaces, crisp white type, silver structure,
 * and a restrained gold accent. The board squares stay high-contrast
 * black and white. This replaces the warm plaster / olive-wood scaffold.
 *
 * 3D pieces are not part of this theme. BoardStage still draws the flat board.
 */

export const colors = {
  background: '#090A0D',
  backgroundRaised: '#12141A',
  surface: '#171A21',
  surfaceMuted: '#212530',
  /** Primary text on dark surfaces */
  ink: '#F5F7FA',
  inkMuted: '#A7B0BE',
  /** Light text and primary-button fill */
  ivory: '#F7F8FA',
  /** Near-black text on ivory or gold */
  onAccent: '#101114',
  /** @deprecated alias of ivory — leftover light-on-dark text */
  cream: '#F7F8FA',
  silver: '#C5CCD6',
  /** Restrained gold */
  accent: '#C6A15B',
  accentSoft: '#E4D2A4',
  sand: '#C6A15B',
  /** Raised track behind segmented controls */
  sandSoft: '#232833',
  /** High-contrast squares. Coordinates use the opposite square color. */
  boardDark: '#14161C',
  boardLight: '#F3F4F6',
  boardFrame: '#3A4150',
  danger: '#E07A72',
  success: '#7DCEA0',
  border: 'rgba(197, 204, 214, 0.16)',
  highlight: 'rgba(198, 161, 91, 0.42)',
  lastMove: 'rgba(197, 204, 214, 0.28)',
  check: 'rgba(224, 122, 114, 0.45)',
  moveHint: 'rgba(198, 161, 91, 0.92)',
  lampBrass: '#C6A15B',
  lampGlow: 'rgba(198, 161, 91, 0.16)',
  genieMist: 'rgba(255, 255, 255, 0.06)',
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
  sm: 10,
  md: 16,
  lg: 22,
  pill: 999,
} as const;

export const shadows = {
  card: {
    shadowColor: '#000000',
    shadowOpacity: 0.35,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
} as const;

export const typography = {
  brand: {
    fontFamily: 'IBMPlexSansArabic_700Bold',
    fontSize: 34,
    lineHeight: 46,
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
    fontSize: 16,
    lineHeight: 24,
  },
} as const;
