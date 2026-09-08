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

// UI aliases for face names over 24 characters. A compact card (the table, the hand, the
// strip) shows the alias; the Codex, inspection, the play sheet, and the log keep the full
// name. An alias keeps the name's subject and its action where it can; where the epithet
// cannot be shortened faithfully, the character's name stands alone. Keys are the face
// names as printed, after a Major's "Arcana: " prefix is dropped. docs/ALIASES.md is the
// same table with the flags for review.
export const CARD_ALIAS: Record<string, string> = {
  "Luigi, So Many Missed Eldritch Blasts": "Luigi, Missed Blasts",
  "Elenvar Elathriel, the Dusk": "Elenvar, the Dusk",
  "Masque, Through the Mirror": "Masque Through Mirror",
  "The Lovers, Through the Gate": "Lovers Through the Gate",
  "The Solar Wind, Stained Glass Turned Down": "Glass Turned Down",
  "Dagan, Sovereign of the Scales": "Dagan of the Scales",
  "Dagan, the Scales Leveled": "Dagan, Scales Leveled",
  "Old Midnight, at the Crossroads": "Midnight at Crossroads",
  "The Fallen Isle, Coming Down": "Fallen Isle Coming Down",
  "Lirielle, the Mirrored Sky": "Lirielle, Mirrored Sky",
  "Children on the Threshold": "Threshold Children",
  "Vraxxis, the Hungering Cinder": "Vraxxis, Cinder",
  "Vraxxis, Starving Ash at Rest": "Vraxxis, Ash at Rest",
  "The Festival of Radiant Dawn": "Festival of Radiant Dawn",
  "Ilzaren, the Resplendent King": "Ilzaren, Resplendent",
  "Ilzaren, Author of the Creed": "Ilzaren, the Author",
  "Vath, No More Ash or Flame": "Vath, No More Ash",
  "Tyserion I, the Golden Blade": "Tyserion, Golden Blade",
  "Izuriel, Wearing Tyserion’s Face": "Izuriel as Tyserion",
  "Lake Mirrara, Filmed Over": "Mirrara, Filmed Over",
  "Taranis, the Laughing Crow": "Taranis, Laughing Crow",
  "Taranis, Gone to the Feywild": "Taranis, to the Feywild",
  "Bramble, at the Pale Edge": "Bramble, Pale Edge",
  "Kaelen, Immediate Ceasefire": "Kaelen, Ceasefire",
  "Cernis, the Horned Forest Lord": "Cernis, Forest Lord",
  "Cernis, the Oondray Remember": "Cernis, Oondray Remember",
  "Fisherman, Bloated and Full of Vines": "Fisherman, Bloated",
  "Bill Boggs, Cartel Runner": "Bill Boggs",
  "The Dusk, Wearing Bill’s Face": "The Dusk as Bill",
  "The Garbage Boyz, Let’s Get This Bread": "Boyz, Get This Bread",
  "Marin, Spirit of Ocean Waves": "Marin, Ocean Waves",
  "Marin, the Storm Held in Check": "Marin, Storm in Check",
  "The Dusk, Wearing Merrick’s Face": "The Dusk as Merrick",
  "Calvera Blackwake, the Mad Pirate Queen": "Calvera Blackwake",
  "Serratta, Spirit of the Deep Current": "Serratta of the Deep",
  "Mr. Boscoe, Treats I Have": "Mr. Boscoe, Treats",
  "Yvette, Too Close to the Leylines": "Yvette, Too Close",
  "The Libra Stellae Is Now Closed": "Libra Stellae Closed",
  "Mordeaux, the Clockwork Man": "Mordeaux, Clockwork",
  "Archivist Esmerelda Gotch": "Archivist Gotch",
  "Archmage Severyn Caldreth": "Archmage Caldreth",
}

// "Death: The Man in Black" is "The Man in Black" on a compact card; the full name is in inspection.
export function shortName(name: string): string {
  const i = name.indexOf(': ')
  return i > 0 ? name.slice(i + 2) : name
}

// The name a compact card wears.
export function displayName(name: string): string {
  const s = shortName(name)
  return CARD_ALIAS[s] ?? s
}
