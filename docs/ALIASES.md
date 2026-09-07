# Display aliases

Compact cards (the table, the hand, the tucked strip) show a short alias for names over 20 characters. The Codex, inspection, the play sheet, and the log keep the full canonical name. The map lives in `src/ui/names.ts`; a test keeps it complete: every face name over 20 characters has an alias, and no alias is over 20.

The flag column marks the aliases that change more than length: a joke shortened, a title altered, an act turned into a state. Those are the ones to review; the rest are routine.

| Full name | Alias | Flag |
|---|---|---|
| Luigi, So Many Missed Eldritch Blasts | Luigi, Missed Blasts | A joke title from the notes; the alias keeps the joke but not the count. |
| Ruby, in the Sapphire | Ruby in Sapphire |  |
| Elenvar Elathriel, the Dusk | Elenvar, the Dusk |  |
| Masque, Through the Mirror | Masque, Mirrored | Through the Mirror is the event; Mirrored is a state. Same card, smaller claim. |
| The Lovers, Through the Gate | Lovers at the Gate | Through becomes at; the passage is implied. |
| The Solar Wind, Stained Glass Turned Down | Glass Turned Down | The Solar Wind is dropped from the reversed face; the upright keeps it. |
| Dagan, Sovereign of the Scales | Dagan of the Scales |  |
| Dagan, the Scales Leveled | Dagan, Leveled |  |
| Old Midnight, at the Crossroads | Old Midnight |  |
| The Orrery, Rings Bent | Orrery, Rings Bent |  |
| Imperator Amegmon Shazz | Imperator Shazz |  |
| The Fallen Isle, Coming Down | Isle Coming Down |  |
| Lirielle, the Mirrored Sky | Lirielle, Mirrored |  |
| Children on the Threshold | Chorus, Threshold | The reversed Chorus; the children are the point in the notes and the alias loses them. |
| Nitriti, Eternal Night | Nitriti, Eternal | Night is her title in the notes; Eternal alone reads as a different epithet. |
| Vraxxis, the Hungering Cinder | Vraxxis, Cinder |  |
| Vraxxis, Starving Ash at Rest | Vraxxis, at Rest |  |
| The Festival of Radiant Dawn | Festival of Dawn |  |
| Kojin, the Fiery Whip | Kojin, Fiery Whip |  |
| The Solar Flare Cannon | Solar Flare Cannon |  |
| Ilzaren, the Resplendent King | Ilzaren, the King |  |
| Ilzaren, Author of the Creed | Ilzaren, the Creed |  |
| Vath, No More Ash or Flame | Vath, No More Ash |  |
| Tyserion I, the Golden Blade | Tyserion the Golden |  |
| Izuriel, Wearing Tyserion’s Face | Izuriel as Tyserion |  |
| Elder Voren Nightbloom | Elder Voren |  |
| Portal of Autumn Leaves | Autumn Leaves Portal |  |
| Lake Mirrara, Filmed Over | Mirrara, Filmed Over |  |
| Taranis, the Laughing Crow | Taranis the Crow |  |
| Taranis, Gone to the Feywild | Taranis, Feywild |  |
| Bramble, at the Pale Edge | Bramble, Pale Edge |  |
| Fin & Bin, Nooooo Stinky | Fin & Bin, Stinky | A joke line; the alias keeps the word and loses the wail. |
| Thorn of the Bladed Wind | Thorn, Bladed Wind |  |
| Kaelen, Immediate Ceasefire | Kaelen, Ceasefire |  |
| Cernis, the Horned Forest Lord | Cernis, Forest Lord |  |
| Cernis, the Oondray Remember | Cernis Remembered | The notes say the Oondray remember him; the alias makes it passive. Identity, not lore, is unchanged. |
| Fisherman, Bloated and Full of Vines | Fisherman, Bloated |  |
| Bill Boggs, Cartel Runner | Bill Boggs |  |
| The Dusk, Wearing Bill’s Face | The Dusk as Bill |  |
| The Serattan Oath-Coin | Serattan Oath-Coin |  |
| The Sunken Empire Rises | Sunken Empire Rises |  |
| The Garbage Boyz, Let’s Get This Bread | Boyz, Get This Bread | A joke line; the alias drops Garbage. |
| Marin, Spirit of Ocean Waves | Marin, Ocean Waves |  |
| Marin, the Storm Held in Check | Marin, Storm Held |  |
| Kaipo, Knave and Rogue | Kaipo, the Knave |  |
| The Dusk, Wearing Merrick’s Face | The Dusk as Merrick |  |
| Calvera Blackwake, the Mad Pirate Queen | Calvera Blackwake |  |
| Calvera, Crash the Isle | Calvera, Crashing | Crash the Isle names the act; Crashing is only the mood. |
| Serratta, Spirit of the Deep Current | Serratta of the Deep |  |
| Mr. Boscoe, Treats I Have | Mr. Boscoe, Treats |  |
| Yvette, Too Close to the Leylines | Yvette, the Leylines |  |
| The Libra Stellae Is Now Closed | Libra Stellae Closed |  |
| Mordeaux, the Clockwork Man | Mordeaux, Clockwork |  |
| Mordeaux, Fist of Memory | Mordeaux, Memory |  |
| Archivist Esmerelda Gotch | Archivist Gotch |  |
| Gotch, Temporal Filing | Gotch, Filing |  |
| Archmage Severyn Caldreth | Archmage Caldreth |  |
| Severyn, Sigil Eye Open | Severyn, Eye Open |  |

Names of 20 characters or fewer are shown as printed, with only a Major's "Arcana: " prefix dropped (Death: The Man in Black is The Man in Black on the table). Significators use the short names in `src/ui/names.ts` on the opponent's block.
