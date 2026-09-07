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

// UI aliases for the long card names. A compact card (the table, the hand, the strip)
// shows the alias; the Codex, inspection, the play sheet, and the log keep the full name.
// Keys are the face names as printed, after a Major's "Arcana: " prefix is dropped.
// docs/ALIASES.md is the same table with the flags for review.
export const CARD_ALIAS: Record<string, string> = {
  "Luigi, So Many Missed Eldritch Blasts": "Luigi, Missed Blasts",
  "Ruby, in the Sapphire": "Ruby in Sapphire",
  "Elenvar Elathriel, the Dusk": "Elenvar, the Dusk",
  "Masque, Through the Mirror": "Masque, Mirrored",
  "The Lovers, Through the Gate": "Lovers at the Gate",
  "The Solar Wind, Stained Glass Turned Down": "Glass Turned Down",
  "Dagan, Sovereign of the Scales": "Dagan of the Scales",
  "Dagan, the Scales Leveled": "Dagan, Leveled",
  "Old Midnight, at the Crossroads": "Old Midnight",
  "The Orrery, Rings Bent": "Orrery, Rings Bent",
  "Imperator Amegmon Shazz": "Imperator Shazz",
  "The Fallen Isle, Coming Down": "Isle Coming Down",
  "Lirielle, the Mirrored Sky": "Lirielle, Mirrored",
  "Children on the Threshold": "Chorus, Threshold",
  "Nitriti, Eternal Night": "Nitriti, Eternal",
  "Vraxxis, the Hungering Cinder": "Vraxxis, Cinder",
  "Vraxxis, Starving Ash at Rest": "Vraxxis, at Rest",
  "The Festival of Radiant Dawn": "Festival of Dawn",
  "Kojin, the Fiery Whip": "Kojin, Fiery Whip",
  "The Solar Flare Cannon": "Solar Flare Cannon",
  "Ilzaren, the Resplendent King": "Ilzaren, the King",
  "Ilzaren, Author of the Creed": "Ilzaren, the Creed",
  "Vath, No More Ash or Flame": "Vath, No More Ash",
  "Tyserion I, the Golden Blade": "Tyserion the Golden",
  "Izuriel, Wearing Tyserion’s Face": "Izuriel as Tyserion",
  "Elder Voren Nightbloom": "Elder Voren",
  "Portal of Autumn Leaves": "Autumn Leaves Portal",
  "Lake Mirrara, Filmed Over": "Mirrara, Filmed Over",
  "Taranis, the Laughing Crow": "Taranis the Crow",
  "Taranis, Gone to the Feywild": "Taranis, Feywild",
  "Bramble, at the Pale Edge": "Bramble, Pale Edge",
  "Fin & Bin, Nooooo Stinky": "Fin & Bin, Stinky",
  "Thorn of the Bladed Wind": "Thorn, Bladed Wind",
  "Kaelen, Immediate Ceasefire": "Kaelen, Ceasefire",
  "Cernis, the Horned Forest Lord": "Cernis, Forest Lord",
  "Cernis, the Oondray Remember": "Cernis Remembered",
  "Fisherman, Bloated and Full of Vines": "Fisherman, Bloated",
  "Bill Boggs, Cartel Runner": "Bill Boggs",
  "The Dusk, Wearing Bill’s Face": "The Dusk as Bill",
  "The Serattan Oath-Coin": "Serattan Oath-Coin",
  "The Sunken Empire Rises": "Sunken Empire Rises",
  "The Garbage Boyz, Let’s Get This Bread": "Boyz, Get This Bread",
  "Marin, Spirit of Ocean Waves": "Marin, Ocean Waves",
  "Marin, the Storm Held in Check": "Marin, Storm Held",
  "Kaipo, Knave and Rogue": "Kaipo, the Knave",
  "The Dusk, Wearing Merrick’s Face": "The Dusk as Merrick",
  "Calvera Blackwake, the Mad Pirate Queen": "Calvera Blackwake",
  "Calvera, Crash the Isle": "Calvera, Crashing",
  "Serratta, Spirit of the Deep Current": "Serratta of the Deep",
  "Mr. Boscoe, Treats I Have": "Mr. Boscoe, Treats",
  "Yvette, Too Close to the Leylines": "Yvette, the Leylines",
  "The Libra Stellae Is Now Closed": "Libra Stellae Closed",
  "Mordeaux, the Clockwork Man": "Mordeaux, Clockwork",
  "Mordeaux, Fist of Memory": "Mordeaux, Memory",
  "Archivist Esmerelda Gotch": "Archivist Gotch",
  "Gotch, Temporal Filing": "Gotch, Filing",
  "Archmage Severyn Caldreth": "Archmage Caldreth",
  "Severyn, Sigil Eye Open": "Severyn, Eye Open",
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
