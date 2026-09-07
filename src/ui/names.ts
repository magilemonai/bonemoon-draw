// Short names for tight spaces. Formal names and titles stay in details.
const SHORT: Record<string, string> = {
  'sig-daxon': 'Daxon',
  'sig-lirielle': 'Lirielle',
  'sig-luigi': 'Luigi',
  'sig-rorik': 'Rorik',
  'sig-masque': 'Masque',
  'sig-shazz': 'Shazz',
}

export function shortSigName(id: string, fallback = id): string {
  return SHORT[id] ?? fallback
}

// One line on what a Significator's deck wants to do, for the choosing screen.
export const PLAYSTYLE: Record<string, string> = {
  'sig-daxon': 'Relics on cheap bodies, then pressure.',
  'sig-lirielle': 'Draws deep and picks the right card.',
  'sig-luigi': 'Omens in sequence, a Brog in hand.',
  'sig-rorik': 'Shields, healing, and a long game.',
  'sig-masque': 'Sturdy Upright Figures and the mirror.',
  'sig-shazz': 'Reversed bodies, then a flip at the right moment.',
}
