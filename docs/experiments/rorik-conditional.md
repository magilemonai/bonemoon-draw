# Experiment: rorik-conditional

Rorik: Forge of Kojin heals 1 at end of turn only if a friendly Figure died this turn.

600 games: 15 hero pairings, 20 seed pairs each, both seats, each hero keeping its own deck order across the seat swap. Planner depth 2, beam 5, 2 sampled worlds. Run in 51 seconds.

Code c283f90 with uncommitted changes in src or scripts. Rules 2026-09-06. Starter decks as shipped (daxon 30, lirielle 30, luigi 30, rorik 30, masque 30, shazz 30). Seeds: 20260906 + pairing x 104729 + pair x 7919, the seat swap at seed + 1, deck orders hashed per hero. Stamped 9/7/2026, 17:36:23 EDT.

Average length 8.1 rounds. 0 draws. First seat won 66% of decided games. The Bone Moon was up at the end of 24% of games.

## Heroes

| Hero | Win rate | Games | First seat | Second seat | Heal per game | Burns per game | Upright plays | Reversed plays |
|---|---|---|---|---|---|---|---|---|
| Daxon Lamn | 76% | 200 | 86% | 65% | 3.8 | 0.23 | 37% | 63% |
| Lirielle Starwhisper | 35% | 200 | 58% | 11% | 0.1 | 2.13 | 41% | 59% |
| Luigi Bonemoon | 42% | 200 | 62% | 22% | 4.6 | 1.27 | 46% | 54% |
| Rorik Flamebeard | 63% | 200 | 81% | 44% | 6.4 | 0.68 | 35% | 65% |
| Lord-Provost Elaina Masque | 58% | 200 | 69% | 46% | 2.1 | 0.79 | 42% | 58% |
| Imperator Amegmon Shazz | 28% | 200 | 41% | 15% | 0.1 | 0.72 | 29% | 71% |

## Matchups (row hero win rate against column hero, both seats combined)

| | Daxon | Lirielle | Luigi | Rorik | Lord-Provost | Imperator |
|---|---|---|---|---|---|---|
| Daxon |  | 75% | 70% | 60% | 75% | 98% |
| Lirielle | 25% |  | 43% | 30% | 30% | 45% |
| Luigi | 30% | 58% |  | 30% | 25% | 68% |
| Rorik | 40% | 70% | 70% |  | 55% | 78% |
| Lord-Provost | 25% | 70% | 75% | 45% |  | 73% |
| Imperator | 3% | 55% | 33% | 23% | 28% |  |

## Game length

- Rounds 5 to 6: 123
- Rounds 7 to 8: 252
- Rounds 9 to 10: 149
- Rounds 11 to 12: 66
- Rounds 13 and up: 10

## How games ended (the blow that took the loser to zero)

- attack: 385
- omen: 113
- boneMoon: 80
- fatigue: 0
- ability: 6
- other: 16

Per hero, what they lost to:

| Hero | attack | omen | Bone Moon | fatigue | ability | other |
|---|---|---|---|---|---|---|
| Daxon Lamn | 28 | 8 | 12 | 0 | 1 | 0 |
| Lirielle Starwhisper | 85 | 29 | 13 | 0 | 1 | 3 |
| Luigi Bonemoon | 65 | 24 | 22 | 0 | 0 | 5 |
| Rorik Flamebeard | 54 | 9 | 8 | 0 | 2 | 2 |
| Lord-Provost Elaina Masque | 56 | 20 | 7 | 0 | 1 | 1 |
| Imperator Amegmon Shazz | 97 | 23 | 18 | 0 | 1 | 5 |

## Face usage by card (plays and win rate when played on that face; at least 10 plays)

| Card | Upright plays | Upright win | Reversed plays | Reversed win |
|---|---|---|---|---|
| Eldertech Sphere | 255 | 28% | 213 | 45% |
| Captain Elira Voss | 0 | n/a | 449 | 70% |
| Mordeaux, the Clockwork Man | 239 | 39% | 86 | 28% |
| The Oondray | 2 | 50% | 321 | 46% |
| Wisplight | 71 | 42% | 235 | 50% |
| Dawn Over Aurengate | 199 | 67% | 105 | 56% |
| General Vath Enverez | 129 | 37% | 167 | 70% |
| Mr. Boscoe | 38 | 32% | 251 | 33% |
| Kaipo’s Pearl | 12 | 83% | 268 | 66% |
| Project Tamori | 177 | 34% | 99 | 39% |
| Null-Zone Pylon | 134 | 49% | 122 | 32% |
| Pommeroy | 85 | 40% | 160 | 40% |
| Braxon Lamn | 89 | 71% | 155 | 68% |
| The Guard Post | 66 | 30% | 165 | 77% |
| Elder Voren Nightbloom | 9 | 11% | 219 | 26% |
| Mr. Zero | 3 | 100% | 221 | 43% |
| The Sleepless Sentry | 187 | 33% | 25 | 64% |
| Zalian Fisherman | 137 | 59% | 74 | 32% |
| Yvette Mirthwell | 208 | 33% | 2 | 100% |
| Eva’s Kitchen | 144 | 50% | 66 | 89% |
| Archivist Esmerelda Gotch | 6 | 83% | 193 | 39% |
| Brog | 1 | 0% | 198 | 42% |
| Kaelen Goldeneye | 4 | 25% | 181 | 53% |
| Thorn of the Bladed Wind | 170 | 51% | 0 | n/a |
| Temperance: Brother Soren | 2 | 50% | 154 | 77% |
| Shadowling Stalkers | 0 | n/a | 156 | 28% |
| The Sun: The Spark | 68 | 72% | 87 | 60% |
| Death: The Man in Black | 55 | 44% | 90 | 38% |
| Aurium Plate | 48 | 69% | 91 | 82% |
| The Festival of Radiant Dawn | 25 | 68% | 104 | 64% |
| Vel, the Emberlight | 4 | 25% | 119 | 75% |
| Kaipo Nuvane | 76 | 54% | 44 | 23% |
| Vraxxis, the Hungering Cinder | 0 | n/a | 115 | 70% |
| The High Priestess: Nitriti | 78 | 32% | 36 | 33% |
| The Solar Flare Cannon | 80 | 78% | 30 | 67% |
| The Tower: The Fallen Isle | 73 | 14% | 36 | 94% |
| Taranis, the Laughing Crow | 53 | 40% | 52 | 19% |
| Ilzaren, the Resplendent King | 89 | 54% | 10 | 60% |
| Cernis, the Horned Forest Lord | 90 | 49% | 5 | 40% |
| The Hanged Man: Rorik Flamebeard | 86 | 79% | 8 | 88% |
| Archmage Severyn Caldreth | 89 | 60% | 4 | 50% |
| Judgement: The Septor’s Chorus | 2 | 50% | 89 | 70% |
| Lake Mirrara | 26 | 38% | 60 | 40% |
| Portal of Autumn Leaves | 0 | n/a | 86 | 40% |
| The Empress: Que’Rubra | 56 | 48% | 29 | 45% |
| The Magician: Luigi Castanata | 0 | n/a | 85 | 42% |
| The Hermit: Luigi Bonemoon | 14 | 43% | 71 | 73% |
| Fin & Bin | 30 | 30% | 53 | 42% |
| Kojin, the Fiery Whip | 82 | 52% | 0 | n/a |
| The Mirrored Dome | 0 | n/a | 77 | 75% |
| The Fool: Daxon Lamn | 0 | n/a | 75 | 60% |
| Brookskippers | 29 | 66% | 45 | 62% |
| Bill Boggs, Cartel Runner | 42 | 79% | 31 | 58% |
| Inspector Bramble | 0 | n/a | 73 | 33% |
| Tidecaller: Low Tide | 0 | n/a | 72 | 71% |
| The Chariot: The Solar Wind | 31 | 68% | 39 | 79% |
| Merrick Blackwater | 47 | 51% | 18 | 11% |
| Marin, Spirit of Ocean Waves | 15 | 67% | 49 | 86% |
| Wheel of Fortune: The Orrery | 5 | 60% | 59 | 88% |
| The Sunken Empire Rises | 0 | n/a | 62 | 44% |
| The Garbage Boyz | 51 | 51% | 10 | 60% |
| The Lovers: Althea & Caelum | 57 | 46% | 1 | 100% |
| The Heartwood | 8 | 13% | 49 | 73% |
| Calvera Blackwake, the Mad Pirate Queen | 22 | 64% | 32 | 59% |
| Lorien of the Hand | 4 | 25% | 40 | 50% |
| Tyserion I, the Golden Blade | 42 | 69% | 1 | 100% |
| Bimp Bossington | 41 | 83% | 0 | n/a |
| Justice: Dagan, Sovereign of the Scales | 19 | 68% | 22 | 32% |
| The Star: Lirielle Starwhisper | 4 | 25% | 34 | 74% |
| The Emperor: Izuriel Sakazarac II | 18 | 56% | 12 | 8% |
| The World: The Eldspyre | 25 | 60% | 2 | 0% |
| The Serattan Oath-Coin | 23 | 48% | 0 | n/a |
| Strength: Grimore | 21 | 33% | 0 | n/a |
| The Libra Stellae | 12 | 33% | 7 | 57% |
| The Moon: The Bone Moon | 8 | 13% | 3 | 33% |

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

Average length 8.2 to 8.1 rounds.

| Hero | Baseline | This run | Change |
|---|---|---|---|
| Daxon Lamn | 75% | 76% | +1 |
| Lirielle Starwhisper | 32% | 35% | +3 |
| Luigi Bonemoon | 43% | 42% | -1 |
| Rorik Flamebeard | 70% | 63% | -7 |
| Lord-Provost Elaina Masque | 56% | 58% | +2 |
| Imperator Amegmon Shazz | 26% | 28% | +3 |

With 200 games per hero, a swing under about 7 points is inside the noise.
