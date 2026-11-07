/**
 * Premium gold-on-black chrome for the game table.
 * Shared so any screen can reuse the same metal, glow, and type.
 */
export const gold = {
  black: '#0B0907',
  panel: '#14110D',
  panelRaised: '#1E1914',
  gloss: 'rgba(255, 226, 160, 0.16)',
  gold: '#E2B657',
  goldBright: '#F8E7B0',
  goldDeep: '#8A6428',
  goldDim: '#B8924A',
  text: '#F6E6BC',
  textMuted: '#C6A56A',
  glow: 'rgba(226, 182, 87, 0.55)',
  danger: '#F0B4A8',
} as const;

export const goldRadii = {
  panel: 14,
  button: 12,
  avatar: 999,
} as const;
