# Experiment: mana-draw

Liquid Mana Upright: gain 3 Spark this turn and draw a card.

600 games: 15 hero pairings, 20 seed pairs each, both seats, each hero keeping its own deck order across the seat swap. Planner depth 2, beam 5, 2 sampled worlds. Run in 53 seconds.

Code c283f90 with uncommitted changes in src or scripts. Rules 2026-09-06. Starter decks as shipped (daxon 30, lirielle 30, luigi 30, rorik 30, masque 30, shazz 30). Seeds: 20260906 + pairing x 104729 + pair x 7919, the seat swap at seed + 1, deck orders hashed per hero. Stamped 9/7/2026, 17:40:47 EDT.

Average length 8.2 rounds. 0 draws. First seat won 64% of decided games. The Bone Moon was up at the end of 27% of games.

## Heroes

| Hero | Win rate | Games | First seat | Second seat | Heal per game | Burns per game | Upright plays | Reversed plays |
|---|---|---|---|---|---|---|---|---|
| Daxon Lamn | 76% | 200 | 85% | 66% | 4.0 | 0.23 | 38% | 62% |
| Lirielle Starwhisper | 32% | 200 | 53% | 10% | 0.1 | 2.09 | 41% | 59% |
| Luigi Bonemoon | 42% | 200 | 61% | 23% | 4.9 | 1.27 | 46% | 54% |
| Rorik Flamebeard | 70% | 200 | 81% | 59% | 9.9 | 0.63 | 36% | 64% |
| Lord-Provost Elaina Masque | 56% | 200 | 66% | 45% | 2.2 | 0.80 | 42% | 58% |
| Imperator Amegmon Shazz | 26% | 200 | 37% | 14% | 0.1 | 0.69 | 30% | 71% |

## Matchups (row hero win rate against column hero, both seats combined)

| | Daxon | Lirielle | Luigi | Rorik | Lord-Provost | Imperator |
|---|---|---|---|---|---|---|
| Daxon |  | 75% | 73% | 58% | 75% | 98% |
| Lirielle | 25% |  | 43% | 15% | 30% | 45% |
| Luigi | 28% | 58% |  | 33% | 25% | 68% |
| Rorik | 43% | 85% | 68% |  | 65% | 90% |
| Lord-Provost | 25% | 70% | 75% | 35% |  | 73% |
| Imperator | 3% | 55% | 33% | 10% | 28% |  |

## Game length

- Rounds 5 to 6: 116
- Rounds 7 to 8: 248
- Rounds 9 to 10: 149
- Rounds 11 to 12: 72
- Rounds 13 and up: 15

## How games ended (the blow that took the loser to zero)

- attack: 379
- omen: 114
- boneMoon: 88
- fatigue: 0
- ability: 4
- other: 15

Per hero, what they lost to:

| Hero | attack | omen | Bone Moon | fatigue | ability | other |
|---|---|---|---|---|---|---|
| Daxon Lamn | 31 | 7 | 10 | 0 | 1 | 0 |
| Lirielle Starwhisper | 87 | 30 | 16 | 0 | 1 | 3 |
| Luigi Bonemoon | 68 | 25 | 19 | 0 | 0 | 4 |
| Rorik Flamebeard | 38 | 8 | 12 | 0 | 0 | 2 |
| Lord-Provost Elaina Masque | 57 | 21 | 9 | 0 | 1 | 1 |
| Imperator Amegmon Shazz | 98 | 23 | 22 | 0 | 1 | 5 |

## Face usage by card (plays and win rate when played on that face; at least 10 plays)

| Card | Upright plays | Upright win | Reversed plays | Reversed win |
|---|---|---|---|---|
| Eldertech Sphere | 256 | 26% | 215 | 45% |
| Captain Elira Voss | 0 | n/a | 456 | 71% |
| The Oondray | 3 | 33% | 324 | 45% |
| Mordeaux, the Clockwork Man | 240 | 40% | 86 | 24% |
| Dawn Over Aurengate | 207 | 70% | 107 | 60% |
| Wisplight | 70 | 47% | 240 | 49% |
| General Vath Enverez | 136 | 40% | 172 | 70% |
| Mr. Boscoe | 37 | 30% | 253 | 32% |
| Kaipo’s Pearl | 11 | 82% | 271 | 65% |
| Project Tamori | 177 | 33% | 105 | 40% |
| Null-Zone Pylon | 136 | 46% | 125 | 31% |
| Pommeroy | 86 | 35% | 160 | 36% |
| Braxon Lamn | 89 | 73% | 156 | 69% |
| The Guard Post | 69 | 41% | 163 | 79% |
| Elder Voren Nightbloom | 9 | 11% | 221 | 24% |
| Mr. Zero | 3 | 100% | 221 | 40% |
| Zalian Fisherman | 141 | 60% | 75 | 35% |
| The Sleepless Sentry | 189 | 34% | 27 | 63% |
| Eva’s Kitchen | 142 | 54% | 73 | 93% |
| Yvette Mirthwell | 211 | 31% | 1 | 100% |
| Archivist Esmerelda Gotch | 8 | 88% | 193 | 36% |
| Brog | 1 | 0% | 198 | 42% |
| Kaelen Goldeneye | 6 | 50% | 189 | 54% |
| Thorn of the Bladed Wind | 176 | 51% | 0 | n/a |
| The Sun: The Spark | 80 | 74% | 93 | 60% |
| Temperance: Brother Soren | 2 | 50% | 164 | 76% |
| Shadowling Stalkers | 0 | n/a | 158 | 25% |
| Death: The Man in Black | 59 | 44% | 92 | 37% |
| Aurium Plate | 51 | 63% | 90 | 81% |
| The Festival of Radiant Dawn | 26 | 69% | 107 | 65% |
| Vel, the Emberlight | 5 | 40% | 119 | 74% |
| Vraxxis, the Hungering Cinder | 0 | n/a | 120 | 72% |
| Kaipo Nuvane | 76 | 54% | 41 | 29% |
| The Tower: The Fallen Isle | 77 | 14% | 38 | 92% |
| The Solar Flare Cannon | 84 | 77% | 30 | 60% |
| The High Priestess: Nitriti | 78 | 26% | 35 | 31% |
| Taranis, the Laughing Crow | 57 | 37% | 50 | 16% |
| Ilzaren, the Resplendent King | 89 | 53% | 16 | 69% |
| Cernis, the Horned Forest Lord | 97 | 46% | 6 | 50% |
| The Empress: Que’Rubra | 72 | 56% | 27 | 44% |
| Archmage Severyn Caldreth | 93 | 58% | 4 | 50% |
| The Hanged Man: Rorik Flamebeard | 87 | 80% | 8 | 88% |
| Judgement: The Septor’s Chorus | 3 | 67% | 88 | 66% |
| Lake Mirrara | 29 | 34% | 60 | 32% |
| Kojin, the Fiery Whip | 88 | 58% | 1 | 0% |
| The Hermit: Luigi Bonemoon | 15 | 67% | 74 | 80% |
| Fin & Bin | 29 | 34% | 59 | 41% |
| Portal of Autumn Leaves | 1 | 100% | 86 | 35% |
| The Magician: Luigi Castanata | 0 | n/a | 87 | 41% |
| Brookskippers | 32 | 59% | 50 | 66% |
| The Mirrored Dome | 0 | n/a | 79 | 68% |
| Tidecaller: Low Tide | 0 | n/a | 75 | 76% |
| Bill Boggs, Cartel Runner | 43 | 81% | 31 | 55% |
| Inspector Bramble | 0 | n/a | 73 | 30% |
| The Fool: Daxon Lamn | 0 | n/a | 73 | 68% |
| The Chariot: The Solar Wind | 33 | 67% | 38 | 74% |
| Marin, Spirit of Ocean Waves | 16 | 69% | 51 | 88% |
| The Sunken Empire Rises | 0 | n/a | 67 | 46% |
| Merrick Blackwater | 47 | 53% | 19 | 11% |
| The Garbage Boyz | 56 | 52% | 9 | 56% |
| The Heartwood | 9 | 0% | 54 | 78% |
| The Lovers: Althea & Caelum | 57 | 44% | 1 | 100% |
| Wheel of Fortune: The Orrery | 2 | 100% | 55 | 87% |
| Calvera Blackwake, the Mad Pirate Queen | 24 | 63% | 31 | 65% |
| The Star: Lirielle Starwhisper | 6 | 33% | 44 | 57% |
| Tyserion I, the Golden Blade | 46 | 70% | 1 | 100% |
| Bimp Bossington | 43 | 86% | 0 | n/a |
| Lorien of the Hand | 4 | 0% | 39 | 41% |
| Justice: Dagan, Sovereign of the Scales | 20 | 70% | 22 | 27% |
| The Emperor: Izuriel Sakazarac II | 19 | 68% | 13 | 8% |
| The World: The Eldspyre | 28 | 61% | 2 | 0% |
| The Serattan Oath-Coin | 24 | 54% | 0 | n/a |
| Strength: Grimore | 21 | 29% | 0 | n/a |
| The Libra Stellae | 14 | 36% | 6 | 50% |
| Liquid Mana | 12 | 25% | 3 | 67% |

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

## Change against the baseline

Average length 8.2 to 8.2 rounds.

| Hero | Baseline | This run | Change |
|---|---|---|---|
| Daxon Lamn | 75% | 76% | +1 |
| Lirielle Starwhisper | 32% | 32% | +0 |
| Luigi Bonemoon | 43% | 42% | -1 |
| Rorik Flamebeard | 70% | 70% | +1 |
| Lord-Provost Elaina Masque | 56% | 56% | +0 |
| Imperator Amegmon Shazz | 26% | 26% | +0 |

With 200 games per hero, a swing under about 7 points is inside the noise.
