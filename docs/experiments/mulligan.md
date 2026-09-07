# Experiment: mulligan

Partial mulligan before the first turn (AI sets aside all but one card costing 5 or more).

600 games: 15 hero pairings, 20 seed pairs each, both seats, each hero keeping its own deck order across the seat swap. Planner depth 2, beam 5, 2 sampled worlds. Run in 55 seconds.

Code c283f90 with uncommitted changes in src or scripts. Rules 2026-09-06. Starter decks as shipped (daxon 30, lirielle 30, luigi 30, rorik 30, masque 30, shazz 30). Seeds: 20260906 + pairing x 104729 + pair x 7919, the seat swap at seed + 1, deck orders hashed per hero. Stamped 9/7/2026, 17:37:15 EDT.

Average length 8.2 rounds. 0 draws. First seat won 64% of decided games. The Bone Moon was up at the end of 25% of games.

## Heroes

| Hero | Win rate | Games | First seat | Second seat | Heal per game | Burns per game | Upright plays | Reversed plays |
|---|---|---|---|---|---|---|---|---|
| Daxon Lamn | 70% | 200 | 81% | 58% | 3.8 | 0.34 | 38% | 62% |
| Lirielle Starwhisper | 24% | 200 | 39% | 9% | 0.2 | 1.83 | 41% | 59% |
| Luigi Bonemoon | 46% | 200 | 63% | 29% | 5.3 | 1.21 | 48% | 52% |
| Rorik Flamebeard | 72% | 200 | 83% | 61% | 9.6 | 0.67 | 37% | 63% |
| Lord-Provost Elaina Masque | 66% | 200 | 80% | 52% | 2.0 | 0.69 | 44% | 56% |
| Imperator Amegmon Shazz | 23% | 200 | 39% | 6% | 0.1 | 0.67 | 30% | 70% |

## Matchups (row hero win rate against column hero, both seats combined)

| | Daxon | Lirielle | Luigi | Rorik | Lord-Provost | Imperator |
|---|---|---|---|---|---|---|
| Daxon |  | 80% | 70% | 40% | 65% | 93% |
| Lirielle | 20% |  | 30% | 10% | 18% | 43% |
| Luigi | 30% | 70% |  | 33% | 25% | 73% |
| Rorik | 60% | 90% | 68% |  | 50% | 93% |
| Lord-Provost | 35% | 83% | 75% | 50% |  | 88% |
| Imperator | 8% | 58% | 28% | 8% | 13% |  |

## Game length

- Rounds 5 to 6: 122
- Rounds 7 to 8: 254
- Rounds 9 to 10: 143
- Rounds 11 to 12: 70
- Rounds 13 and up: 11

## How games ended (the blow that took the loser to zero)

- attack: 401
- omen: 93
- boneMoon: 86
- fatigue: 0
- ability: 9
- other: 11

Per hero, what they lost to:

| Hero | attack | omen | Bone Moon | fatigue | ability | other |
|---|---|---|---|---|---|---|
| Daxon Lamn | 33 | 8 | 18 | 0 | 1 | 1 |
| Lirielle Starwhisper | 110 | 26 | 13 | 0 | 2 | 1 |
| Luigi Bonemoon | 69 | 13 | 20 | 0 | 0 | 6 |
| Rorik Flamebeard | 37 | 4 | 12 | 0 | 1 | 2 |
| Lord-Provost Elaina Masque | 47 | 11 | 10 | 0 | 0 | 0 |
| Imperator Amegmon Shazz | 105 | 31 | 13 | 0 | 5 | 1 |

## Face usage by card (plays and win rate when played on that face; at least 10 plays)

| Card | Upright plays | Upright win | Reversed plays | Reversed win |
|---|---|---|---|---|
| Eldertech Sphere | 256 | 27% | 253 | 38% |
| Captain Elira Voss | 0 | n/a | 460 | 73% |
| Mordeaux, the Clockwork Man | 242 | 36% | 94 | 30% |
| The Oondray | 1 | 0% | 331 | 46% |
| Dawn Over Aurengate | 238 | 78% | 94 | 64% |
| General Vath Enverez | 139 | 48% | 180 | 77% |
| Mr. Boscoe | 45 | 24% | 270 | 35% |
| Null-Zone Pylon | 167 | 50% | 134 | 28% |
| Project Tamori | 194 | 35% | 105 | 43% |
| Wisplight | 68 | 44% | 228 | 49% |
| Kaipo’s Pearl | 11 | 36% | 258 | 62% |
| The Guard Post | 80 | 31% | 173 | 71% |
| Braxon Lamn | 87 | 64% | 165 | 70% |
| Eva’s Kitchen | 167 | 49% | 81 | 84% |
| Zalian Fisherman | 166 | 43% | 80 | 35% |
| Pommeroy | 91 | 35% | 149 | 37% |
| The Sleepless Sentry | 208 | 37% | 32 | 66% |
| Elder Voren Nightbloom | 5 | 40% | 223 | 18% |
| Yvette Mirthwell | 215 | 28% | 1 | 0% |
| Mr. Zero | 4 | 75% | 202 | 48% |
| Brog | 0 | n/a | 200 | 46% |
| Temperance: Brother Soren | 3 | 33% | 187 | 74% |
| Archivist Esmerelda Gotch | 2 | 100% | 183 | 40% |
| Kaelen Goldeneye | 2 | 100% | 160 | 49% |
| The Sun: The Spark | 81 | 73% | 80 | 54% |
| Thorn of the Bladed Wind | 154 | 44% | 0 | n/a |
| Shadowling Stalkers | 0 | n/a | 135 | 24% |
| Taranis, the Laughing Crow | 72 | 33% | 55 | 11% |
| Vel, the Emberlight | 2 | 0% | 124 | 73% |
| The Festival of Radiant Dawn | 17 | 65% | 109 | 78% |
| The Solar Flare Cannon | 90 | 81% | 35 | 57% |
| Aurium Plate | 36 | 86% | 89 | 74% |
| Death: The Man in Black | 51 | 59% | 74 | 34% |
| The Tower: The Fallen Isle | 71 | 10% | 51 | 90% |
| The Empress: Que’Rubra | 81 | 36% | 40 | 48% |
| Vraxxis, the Hungering Cinder | 0 | n/a | 109 | 70% |
| Kaipo Nuvane | 65 | 51% | 43 | 28% |
| Archmage Severyn Caldreth | 100 | 72% | 4 | 0% |
| Kojin, the Fiery Whip | 101 | 56% | 1 | 0% |
| Fin & Bin | 27 | 19% | 75 | 29% |
| The Magician: Luigi Castanata | 0 | n/a | 102 | 52% |
| Lake Mirrara | 34 | 47% | 62 | 42% |
| Ilzaren, the Resplendent King | 87 | 59% | 7 | 100% |
| Cernis, the Horned Forest Lord | 88 | 47% | 3 | 0% |
| Judgement: The Septor’s Chorus | 0 | n/a | 90 | 78% |
| Portal of Autumn Leaves | 1 | 100% | 88 | 26% |
| The High Priestess: Nitriti | 54 | 39% | 33 | 24% |
| The Hanged Man: Rorik Flamebeard | 76 | 63% | 7 | 57% |
| The Hermit: Luigi Bonemoon | 24 | 50% | 58 | 76% |
| Merrick Blackwater | 61 | 59% | 16 | 50% |
| Brookskippers | 26 | 65% | 50 | 48% |
| The Chariot: The Solar Wind | 38 | 66% | 37 | 81% |
| The Fool: Daxon Lamn | 0 | n/a | 69 | 72% |
| Tidecaller: Low Tide | 3 | 0% | 63 | 81% |
| Bill Boggs, Cartel Runner | 38 | 74% | 26 | 62% |
| The Heartwood | 12 | 8% | 52 | 87% |
| The Garbage Boyz | 46 | 33% | 17 | 29% |
| Inspector Bramble | 0 | n/a | 62 | 21% |
| The Mirrored Dome | 0 | n/a | 62 | 52% |
| Marin, Spirit of Ocean Waves | 23 | 52% | 32 | 69% |
| Tyserion I, the Golden Blade | 53 | 77% | 2 | 100% |
| The Star: Lirielle Starwhisper | 6 | 50% | 45 | 64% |
| The Sunken Empire Rises | 1 | 100% | 48 | 46% |
| The Lovers: Althea & Caelum | 44 | 34% | 3 | 0% |
| Justice: Dagan, Sovereign of the Scales | 11 | 73% | 35 | 51% |
| The Serattan Oath-Coin | 45 | 71% | 0 | n/a |
| Wheel of Fortune: The Orrery | 6 | 67% | 38 | 87% |
| Calvera Blackwake, the Mad Pirate Queen | 17 | 65% | 26 | 42% |
| Bimp Bossington | 39 | 59% | 0 | n/a |
| The World: The Eldspyre | 38 | 50% | 1 | 0% |
| Lorien of the Hand | 3 | 0% | 30 | 33% |
| The Emperor: Izuriel Sakazarac II | 21 | 52% | 6 | 33% |
| Strength: Grimore | 27 | 33% | 0 | n/a |
| The Libra Stellae | 11 | 36% | 7 | 29% |

## Sample traces (first 14 plays)

```
sig-daxon vs sig-lirielle seed 20365635: winner sig-daxon in round 7 by attack
  r2 p0 plays Captain Elira Voss (reversed)
  r2 p1 plays The Oondray (reversed)
  r3 p0 plays Braxon Lamn (upright)
  r3 p1 plays Elder Voren Nightbloom (reversed)
  r4 p0 plays Temperance: Brother Soren (reversed)
  r4 p1 plays Mr. Boscoe (upright)
  r4 p1 plays Fin & Bin (reversed)
  r5 p0 plays Kojin, the Fiery Whip (upright)
  r5 p0 plays Kaipo’s Pearl (reversed)
  r5 p1 plays Taranis, the Laughing Crow (upright)
  r6 p0 plays Vel, the Emberlight (reversed)
  r6 p1 plays Kaelen Goldeneye (reversed)
  r7 p0 plays The Solar Flare Cannon (upright)
```

```
sig-lirielle vs sig-daxon seed 20365636: winner sig-daxon in round 7 by attack
  r1 p0 plays Eldertech Sphere (upright)
  r2 p0 plays The Oondray (reversed)
  r2 p1 plays Captain Elira Voss (reversed)
  r3 p0 plays Null-Zone Pylon (upright)
  r3 p1 plays Captain Elira Voss (reversed)
  r4 p0 plays Mordeaux, the Clockwork Man (upright)
  r4 p1 plays Temperance: Brother Soren (reversed)
  r5 p0 plays Elder Voren Nightbloom (reversed)
  r5 p0 plays Mr. Boscoe (reversed)
  r5 p1 plays The Sun: The Spark (reversed)
  r6 p0 plays Archivist Esmerelda Gotch (reversed)
  r6 p1 plays The Solar Flare Cannon (reversed)
  r7 p0 plays Yvette Mirthwell (upright)
  r7 p0 plays Pommeroy (reversed)
```

```
sig-daxon vs sig-lirielle seed 20373554: winner sig-lirielle in round 7 by attack
  r1 p1 plays Wisplight (upright)
  r2 p0 plays Captain Elira Voss (reversed)
  r2 p0 plays Kaipo’s Pearl (reversed)
  r2 p1 plays Pommeroy (reversed)
  r3 p0 plays Brookskippers (reversed)
  r3 p1 plays Yvette Mirthwell (upright)
  r3 p1 plays Wisplight (reversed)
  r4 p0 plays Temperance: Brother Soren (reversed)
  r4 p1 plays Thorn of the Bladed Wind (upright)
  r5 p0 plays Kojin, the Fiery Whip (upright)
  r5 p1 plays Mordeaux, the Clockwork Man (upright)
  r5 p1 plays Eldertech Sphere (reversed)
  r6 p0 plays Calvera Blackwake, the Mad Pirate Queen (upright)
  r6 p0 plays Kaipo’s Pearl (reversed)
```

## Change against the baseline

Average length 8.2 to 8.2 rounds.

| Hero | Baseline | This run | Change |
|---|---|---|---|
| Daxon Lamn | 75% | 70% | -6 |
| Lirielle Starwhisper | 32% | 24% | -8 |
| Luigi Bonemoon | 43% | 46% | +3 |
| Rorik Flamebeard | 70% | 72% | +3 |
| Lord-Provost Elaina Masque | 56% | 66% | +11 |
| Imperator Amegmon Shazz | 26% | 23% | -3 |

With 200 games per hero, a swing under about 7 points is inside the noise.
