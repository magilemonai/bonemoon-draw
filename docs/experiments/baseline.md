# Baseline

Shipped rules and decks.

600 games: 15 hero pairings, 20 seed pairs each, both seats, each hero keeping its own deck order across the seat swap. Planner depth 2, beam 5, 2 sampled worlds. Run in 53 seconds.

Code c283f90 with uncommitted changes in src or scripts. Rules 2026-09-06. Starter decks as shipped (daxon 30, lirielle 30, luigi 30, rorik 30, masque 30, shazz 30). Seeds: 20260906 + pairing x 104729 + pair x 7919, the seat swap at seed + 1, deck orders hashed per hero. Stamped 9/7/2026, 17:35:29 EDT.

Average length 8.2 rounds. 0 draws. First seat won 64% of decided games. The Bone Moon was up at the end of 26% of games.

## Heroes

| Hero | Win rate | Games | First seat | Second seat | Heal per game | Burns per game | Upright plays | Reversed plays |
|---|---|---|---|---|---|---|---|---|
| Daxon Lamn | 75% | 200 | 84% | 66% | 4.0 | 0.23 | 38% | 62% |
| Lirielle Starwhisper | 32% | 200 | 53% | 10% | 0.1 | 2.09 | 41% | 59% |
| Luigi Bonemoon | 43% | 200 | 62% | 24% | 4.9 | 1.27 | 45% | 55% |
| Rorik Flamebeard | 70% | 200 | 81% | 58% | 9.9 | 0.63 | 36% | 64% |
| Lord-Provost Elaina Masque | 56% | 200 | 66% | 45% | 2.2 | 0.79 | 42% | 58% |
| Imperator Amegmon Shazz | 26% | 200 | 37% | 14% | 0.1 | 0.71 | 29% | 71% |

## Matchups (row hero win rate against column hero, both seats combined)

| | Daxon | Lirielle | Luigi | Rorik | Lord-Provost | Imperator |
|---|---|---|---|---|---|---|
| Daxon |  | 75% | 70% | 58% | 75% | 98% |
| Lirielle | 25% |  | 43% | 15% | 30% | 45% |
| Luigi | 30% | 58% |  | 35% | 25% | 68% |
| Rorik | 43% | 85% | 65% |  | 65% | 90% |
| Lord-Provost | 25% | 70% | 75% | 35% |  | 73% |
| Imperator | 3% | 55% | 33% | 10% | 28% |  |

## Game length

- Rounds 5 to 6: 116
- Rounds 7 to 8: 249
- Rounds 9 to 10: 149
- Rounds 11 to 12: 71
- Rounds 13 and up: 15

## How games ended (the blow that took the loser to zero)

- attack: 382
- omen: 112
- boneMoon: 87
- fatigue: 0
- ability: 4
- other: 15

Per hero, what they lost to:

| Hero | attack | omen | Bone Moon | fatigue | ability | other |
|---|---|---|---|---|---|---|
| Daxon Lamn | 31 | 7 | 11 | 0 | 1 | 0 |
| Lirielle Starwhisper | 88 | 29 | 16 | 0 | 1 | 3 |
| Luigi Bonemoon | 67 | 25 | 18 | 0 | 0 | 4 |
| Rorik Flamebeard | 38 | 8 | 13 | 0 | 0 | 2 |
| Lord-Provost Elaina Masque | 58 | 20 | 9 | 0 | 1 | 1 |
| Imperator Amegmon Shazz | 100 | 23 | 20 | 0 | 1 | 5 |

## Face usage by card (plays and win rate when played on that face; at least 10 plays)

| Card | Upright plays | Upright win | Reversed plays | Reversed win |
|---|---|---|---|---|
| Eldertech Sphere | 257 | 26% | 215 | 46% |
| Captain Elira Voss | 0 | n/a | 456 | 70% |
| Mordeaux, the Clockwork Man | 240 | 42% | 87 | 24% |
| The Oondray | 3 | 33% | 323 | 45% |
| Dawn Over Aurengate | 207 | 70% | 107 | 59% |
| Wisplight | 70 | 46% | 240 | 49% |
| General Vath Enverez | 135 | 39% | 172 | 70% |
| Mr. Boscoe | 37 | 32% | 252 | 34% |
| Kaipo’s Pearl | 11 | 82% | 271 | 66% |
| Project Tamori | 176 | 34% | 106 | 42% |
| Null-Zone Pylon | 135 | 47% | 123 | 31% |
| Pommeroy | 86 | 35% | 160 | 36% |
| Braxon Lamn | 89 | 71% | 156 | 69% |
| The Guard Post | 70 | 40% | 163 | 78% |
| Elder Voren Nightbloom | 9 | 11% | 220 | 25% |
| Mr. Zero | 3 | 100% | 221 | 41% |
| Eva’s Kitchen | 142 | 53% | 73 | 93% |
| Zalian Fisherman | 140 | 60% | 75 | 35% |
| The Sleepless Sentry | 188 | 35% | 27 | 63% |
| Yvette Mirthwell | 211 | 31% | 1 | 100% |
| Archivist Esmerelda Gotch | 8 | 88% | 192 | 36% |
| Brog | 1 | 0% | 198 | 43% |
| Kaelen Goldeneye | 6 | 50% | 189 | 54% |
| Thorn of the Bladed Wind | 176 | 51% | 0 | n/a |
| The Sun: The Spark | 79 | 73% | 93 | 59% |
| Temperance: Brother Soren | 2 | 50% | 164 | 75% |
| Shadowling Stalkers | 0 | n/a | 155 | 25% |
| Death: The Man in Black | 58 | 45% | 92 | 38% |
| Aurium Plate | 51 | 63% | 90 | 81% |
| The Festival of Radiant Dawn | 26 | 69% | 107 | 65% |
| Vel, the Emberlight | 5 | 40% | 117 | 74% |
| Vraxxis, the Hungering Cinder | 0 | n/a | 120 | 71% |
| Kaipo Nuvane | 75 | 55% | 41 | 29% |
| The Solar Flare Cannon | 85 | 76% | 30 | 60% |
| The Tower: The Fallen Isle | 77 | 14% | 38 | 92% |
| The High Priestess: Nitriti | 77 | 26% | 36 | 31% |
| Taranis, the Laughing Crow | 56 | 38% | 50 | 16% |
| Ilzaren, the Resplendent King | 89 | 51% | 17 | 71% |
| Cernis, the Horned Forest Lord | 97 | 45% | 6 | 50% |
| The Empress: Que’Rubra | 71 | 55% | 28 | 43% |
| Archmage Severyn Caldreth | 92 | 60% | 4 | 50% |
| The Hanged Man: Rorik Flamebeard | 87 | 79% | 8 | 88% |
| Judgement: The Septor’s Chorus | 3 | 67% | 88 | 66% |
| Kojin, the Fiery Whip | 88 | 56% | 1 | 0% |
| The Hermit: Luigi Bonemoon | 15 | 60% | 74 | 80% |
| Fin & Bin | 29 | 34% | 59 | 41% |
| Lake Mirrara | 28 | 36% | 59 | 31% |
| Portal of Autumn Leaves | 1 | 100% | 86 | 35% |
| The Magician: Luigi Castanata | 0 | n/a | 87 | 44% |
| Brookskippers | 32 | 66% | 49 | 65% |
| The Mirrored Dome | 0 | n/a | 78 | 68% |
| Tidecaller: Low Tide | 0 | n/a | 75 | 73% |
| Bill Boggs, Cartel Runner | 43 | 79% | 31 | 55% |
| Inspector Bramble | 0 | n/a | 73 | 30% |
| The Fool: Daxon Lamn | 0 | n/a | 73 | 67% |
| The Chariot: The Solar Wind | 32 | 66% | 39 | 74% |
| Marin, Spirit of Ocean Waves | 16 | 69% | 51 | 86% |
| The Sunken Empire Rises | 0 | n/a | 67 | 48% |
| Merrick Blackwater | 47 | 53% | 19 | 16% |
| The Garbage Boyz | 55 | 55% | 10 | 60% |
| The Heartwood | 9 | 0% | 54 | 76% |
| Wheel of Fortune: The Orrery | 5 | 60% | 55 | 87% |
| The Lovers: Althea & Caelum | 57 | 44% | 1 | 100% |
| Calvera Blackwake, the Mad Pirate Queen | 24 | 63% | 31 | 61% |
| The Star: Lirielle Starwhisper | 6 | 33% | 44 | 55% |
| Tyserion I, the Golden Blade | 46 | 70% | 1 | 100% |
| Lorien of the Hand | 3 | 0% | 40 | 45% |
| Bimp Bossington | 42 | 86% | 0 | n/a |
| Justice: Dagan, Sovereign of the Scales | 19 | 68% | 23 | 30% |
| The Emperor: Izuriel Sakazarac II | 20 | 65% | 13 | 8% |
| The World: The Eldspyre | 28 | 68% | 2 | 0% |
| The Serattan Oath-Coin | 24 | 63% | 0 | n/a |
| Strength: Grimore | 23 | 26% | 0 | n/a |
| The Libra Stellae | 15 | 40% | 6 | 50% |

## Sample traces (first 14 plays)

```
sig-daxon vs sig-lirielle seed 20365635: winner sig-daxon in round 5 by attack
  r2 p0 plays Captain Elira Voss (reversed)
  r2 p1 plays The Oondray (reversed)
  r3 p0 plays Braxon Lamn (upright)
  r3 p1 plays Elder Voren Nightbloom (reversed)
  r4 p0 plays Brookskippers (reversed)
  r4 p1 plays Taranis, the Laughing Crow (reversed)
  r5 p0 plays The Sun: The Spark (reversed)
```

```
sig-lirielle vs sig-daxon seed 20365636: winner sig-daxon in round 8 by omen
  r2 p0 plays The Oondray (reversed)
  r2 p1 plays Braxon Lamn (reversed)
  r3 p0 plays Elder Voren Nightbloom (reversed)
  r3 p1 plays Captain Elira Voss (reversed)
  r4 p0 plays Taranis, the Laughing Crow (reversed)
  r4 p1 plays Aurium Plate (reversed)
  r5 p0 plays Yvette Mirthwell (upright)
  r5 p0 plays Eldertech Sphere (upright)
  r5 p0 plays Wisplight (reversed)
  r5 p1 plays Eva’s Kitchen (upright)
  r5 p1 plays Kaipo Nuvane (reversed)
  r6 p0 plays The Empress: Que’Rubra (upright)
  r6 p1 plays Vel, the Emberlight (reversed)
  r6 p1 plays Kaipo’s Pearl (reversed)
```

```
sig-daxon vs sig-lirielle seed 20373554: winner sig-daxon in round 6 by attack
  r1 p1 plays Wisplight (reversed)
  r2 p0 plays Captain Elira Voss (reversed)
  r2 p1 plays Pommeroy (reversed)
  r3 p0 plays Captain Elira Voss (reversed)
  r4 p0 plays Temperance: Brother Soren (reversed)
  r4 p1 plays Thorn of the Bladed Wind (upright)
  r5 p0 plays The Hanged Man: Rorik Flamebeard (reversed)
  r5 p1 plays Taranis, the Laughing Crow (reversed)
  r6 p0 plays Aurium Plate (upright)
```
