# Display aliases

Compact cards (the table, the hand, the tucked strip) show a short alias for face names over 24 characters. The Codex, inspection, the play sheet, and the log keep the full canonical name. The map lives in `src/ui/names.ts`; a test keeps it honest: every face over 24 characters has an alias, no alias is over 24, and no face within the limit has one.

An alias keeps the name's subject and its action where it can (Dagan, Scales Leveled; Yvette, Too Close; Marin, Storm in Check). Where an epithet cannot be shortened faithfully, the character's name stands alone (Bill Boggs, Calvera Blackwake). The flag column marks the few that still change more than length; those are the ones to review.

| Full name | Alias | Flag |
|---|---|---|
| Luigi, So Many Missed Eldritch Blasts | Luigi, Missed Blasts | A joke title from the notes; the alias keeps the joke and loses the count. |
| Elenvar Elathriel, the Dusk | Elenvar, the Dusk |  |
| Masque, Through the Mirror | Masque Through Mirror | The articles go; the passage stays. |
| The Lovers, Through the Gate | Lovers Through the Gate |  |
| The Solar Wind, Stained Glass Turned Down | Glass Turned Down | The Solar Wind is dropped from the Reversed face; the Upright keeps it. |
| Dagan, Sovereign of the Scales | Dagan of the Scales |  |
| Dagan, the Scales Leveled | Dagan, Scales Leveled |  |
| Old Midnight, at the Crossroads | Midnight at Crossroads |  |
| The Fallen Isle, Coming Down | Fallen Isle Coming Down |  |
| Lirielle, the Mirrored Sky | Lirielle, Mirrored Sky |  |
| Children on the Threshold | Threshold Children | The Reversed Chorus; the subject stays and the preposition goes. |
| Vraxxis, the Hungering Cinder | Vraxxis, Cinder |  |
| Vraxxis, Starving Ash at Rest | Vraxxis, Ash at Rest |  |
| The Festival of Radiant Dawn | Festival of Radiant Dawn |  |
| Ilzaren, the Resplendent King | Ilzaren, Resplendent |  |
| Ilzaren, Author of the Creed | Ilzaren, the Author |  |
| Vath, No More Ash or Flame | Vath, No More Ash |  |
| Tyserion I, the Golden Blade | Tyserion, Golden Blade |  |
| Izuriel, Wearing Tyserion’s Face | Izuriel as Tyserion |  |
| Lake Mirrara, Filmed Over | Mirrara, Filmed Over |  |
| Taranis, the Laughing Crow | Taranis, Laughing Crow |  |
| Taranis, Gone to the Feywild | Taranis, to the Feywild |  |
| Bramble, at the Pale Edge | Bramble, Pale Edge |  |
| Kaelen, Immediate Ceasefire | Kaelen, Ceasefire |  |
| Cernis, the Horned Forest Lord | Cernis, Forest Lord |  |
| Cernis, the Oondray Remember | Cernis, Oondray Remember |  |
| Fisherman, Bloated and Full of Vines | Fisherman, Bloated |  |
| Bill Boggs, Cartel Runner | Bill Boggs |  |
| The Dusk, Wearing Bill’s Face | The Dusk as Bill |  |
| The Garbage Boyz, Let’s Get This Bread | Boyz, Get This Bread | A joke line; the alias drops Garbage. |
| Marin, Spirit of Ocean Waves | Marin, Ocean Waves |  |
| Marin, the Storm Held in Check | Marin, Storm in Check |  |
| The Dusk, Wearing Merrick’s Face | The Dusk as Merrick |  |
| Calvera Blackwake, the Mad Pirate Queen | Calvera Blackwake |  |
| Serratta, Spirit of the Deep Current | Serratta of the Deep |  |
| Mr. Boscoe, Treats I Have | Mr. Boscoe, Treats |  |
| Yvette, Too Close to the Leylines | Yvette, Too Close |  |
| The Libra Stellae Is Now Closed | Libra Stellae Closed |  |
| Mordeaux, the Clockwork Man | Mordeaux, Clockwork |  |
| Archivist Esmerelda Gotch | Archivist Gotch |  |
| Archmage Severyn Caldreth | Archmage Caldreth |  |

Names of 24 characters or fewer are shown as printed, with only a Major's "Arcana: " prefix dropped (Death: The Man in Black is The Man in Black on the table; Fin & Bin, Nooooo Stinky keeps its wail). Significators use the short names in `src/ui/names.ts` on the opponent's block.
