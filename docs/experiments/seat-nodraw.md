# Experiment: seat-nodraw

Seat: the first player draws no card on turn one (opening hands 4 and 5, then draws as usual).

600 games: 15 hero pairings, 20 seed pairs each, both seats, each hero keeping its own deck order across the seat swap. Planner depth 2, beam 5. Run on 2026-09-06 in 25 seconds.

Average length 8.1 rounds. 0 draws. First seat won 62% of decided games. The Bone Moon was up at the end of 23% of games.

## Heroes

| Hero | Win rate | Games | First seat | Second seat | Heal per game | Burns per game | Upright plays | Reversed plays |
|---|---|---|---|---|---|---|---|---|
| Daxon Lamn | 78% | 200 | 85% | 70% | 3.6 | 0.18 | 37% | 63% |
| Lirielle Starwhisper | 23% | 200 | 40% | 6% | 0.2 | 1.93 | 41% | 59% |
| Luigi Bonemoon | 40% | 200 | 57% | 23% | 4.9 | 1.10 | 47% | 53% |
| Rorik Flamebeard | 75% | 200 | 82% | 68% | 9.7 | 0.56 | 37% | 63% |
| Lord-Provost Elaina Masque | 56% | 200 | 67% | 45% | 2.7 | 0.67 | 40% | 60% |
| Imperator Amegmon Shazz | 29% | 200 | 42% | 15% | 0.2 | 0.59 | 31% | 69% |

## Matchups (row hero win rate against column hero, both seats combined)

| | Daxon | Lirielle | Luigi | Rorik | Lord-Provost | Imperator |
|---|---|---|---|---|---|---|
| Daxon |  | 93% | 75% | 53% | 73% | 95% |
| Lirielle | 8% |  | 38% | 8% | 30% | 33% |
| Luigi | 25% | 63% |  | 20% | 25% | 68% |
| Rorik | 48% | 93% | 80% |  | 68% | 88% |
| Lord-Provost | 28% | 70% | 75% | 33% |  | 75% |
| Imperator | 5% | 68% | 33% | 13% | 25% |  |

## Game length

- Rounds 5 to 6: 121
- Rounds 7 to 8: 251
- Rounds 9 to 10: 155
- Rounds 11 to 12: 62
- Rounds 13 and up: 11

## How games ended (the blow that took the loser to zero)

- attack: 409
- omen: 124
- boneMoon: 39
- fatigue: 0
- ability: 16
- other: 12

Per hero, what they lost to:

| Hero | attack | omen | Bone Moon | fatigue | ability | other |
|---|---|---|---|---|---|---|
| Daxon Lamn | 28 | 12 | 3 | 0 | 2 | 0 |
| Lirielle Starwhisper | 103 | 36 | 6 | 0 | 5 | 4 |
| Luigi Bonemoon | 82 | 25 | 11 | 0 | 0 | 2 |
| Rorik Flamebeard | 38 | 5 | 5 | 0 | 1 | 1 |
| Lord-Provost Elaina Masque | 60 | 17 | 7 | 0 | 2 | 2 |
| Imperator Amegmon Shazz | 98 | 29 | 7 | 0 | 6 | 3 |

## Face usage by card (plays and win rate when played on that face; at least 10 plays)

| Card | Upright plays | Upright win | Reversed plays | Reversed win |
|---|---|---|---|---|
| Eldertech Sphere | 238 | 24% | 223 | 37% |
| Captain Elira Voss | 0 | n/a | 439 | 72% |
| Dawn Over Aurengate | 220 | 72% | 120 | 66% |
| Mordeaux, the Clockwork Man | 243 | 33% | 86 | 29% |
| The Oondray | 2 | 50% | 324 | 49% |
| General Vath Enverez | 132 | 44% | 163 | 75% |
| Wisplight | 70 | 34% | 224 | 46% |
| Mr. Boscoe | 29 | 24% | 260 | 28% |
| Project Tamori | 174 | 36% | 106 | 41% |
| Kaipo’s Pearl | 7 | 71% | 271 | 67% |
| Null-Zone Pylon | 137 | 43% | 127 | 30% |
| Pommeroy | 85 | 33% | 158 | 34% |
| Braxon Lamn | 75 | 79% | 166 | 70% |
| Mr. Zero | 8 | 63% | 233 | 41% |
| The Guard Post | 68 | 49% | 164 | 76% |
| Yvette Mirthwell | 225 | 24% | 1 | 0% |
| Eva’s Kitchen | 145 | 54% | 80 | 89% |
| The Sleepless Sentry | 194 | 36% | 30 | 57% |
| Elder Voren Nightbloom | 13 | 15% | 204 | 27% |
| Archivist Esmerelda Gotch | 2 | 50% | 200 | 37% |
| Brog | 2 | 0% | 198 | 40% |
| Kaelen Goldeneye | 6 | 67% | 191 | 54% |
| Zalian Fisherman | 140 | 54% | 57 | 32% |
| Thorn of the Bladed Wind | 172 | 50% | 0 | n/a |
| Temperance: Brother Soren | 3 | 0% | 157 | 83% |
| Shadowling Stalkers | 0 | n/a | 151 | 27% |
| The Festival of Radiant Dawn | 30 | 67% | 118 | 69% |
| Aurium Plate | 51 | 76% | 92 | 82% |
| The Sun: The Spark | 67 | 81% | 75 | 59% |
| Death: The Man in Black | 49 | 39% | 83 | 37% |
| The High Priestess: Nitriti | 89 | 28% | 38 | 24% |
| The Tower: The Fallen Isle | 85 | 13% | 39 | 97% |
| Kaipo Nuvane | 88 | 64% | 35 | 26% |
| The Empress: Que’Rubra | 77 | 48% | 44 | 48% |
| Vel, the Emberlight | 2 | 0% | 116 | 80% |
| Vraxxis, the Hungering Cinder | 0 | n/a | 118 | 78% |
| The Solar Flare Cannon | 77 | 74% | 33 | 58% |
| Taranis, the Laughing Crow | 56 | 36% | 50 | 30% |
| Ilzaren, the Resplendent King | 90 | 61% | 15 | 80% |
| Kojin, the Fiery Whip | 98 | 71% | 1 | 100% |
| Fin & Bin | 23 | 35% | 76 | 30% |
| Cernis, the Horned Forest Lord | 92 | 47% | 4 | 75% |
| The Hermit: Luigi Bonemoon | 24 | 79% | 70 | 76% |
| Lake Mirrara | 41 | 29% | 51 | 33% |
| Archmage Severyn Caldreth | 87 | 55% | 3 | 33% |
| Portal of Autumn Leaves | 0 | n/a | 87 | 28% |
| Brookskippers | 31 | 71% | 52 | 56% |
| Judgement: The Septor’s Chorus | 1 | 100% | 82 | 59% |
| The Hanged Man: Rorik Flamebeard | 77 | 81% | 5 | 100% |
| The Magician: Luigi Castanata | 0 | n/a | 82 | 43% |
| The Fool: Daxon Lamn | 0 | n/a | 76 | 82% |
| The Mirrored Dome | 1 | 0% | 74 | 70% |
| Bill Boggs, Cartel Runner | 42 | 88% | 32 | 78% |
| The Chariot: The Solar Wind | 30 | 57% | 44 | 80% |
| Inspector Bramble | 0 | n/a | 72 | 21% |
| The Heartwood | 12 | 33% | 60 | 88% |
| The Sunken Empire Rises | 1 | 100% | 70 | 33% |
| Tidecaller: Low Tide | 2 | 50% | 68 | 82% |
| Merrick Blackwater | 49 | 53% | 20 | 30% |
| Wheel of Fortune: The Orrery | 12 | 33% | 48 | 81% |
| The Garbage Boyz | 45 | 42% | 15 | 40% |
| Marin, Spirit of Ocean Waves | 16 | 50% | 37 | 86% |
| The Lovers: Althea & Caelum | 49 | 39% | 3 | 67% |
| Tyserion I, the Golden Blade | 51 | 80% | 1 | 100% |
| The Star: Lirielle Starwhisper | 4 | 75% | 43 | 72% |
| Bimp Bossington | 46 | 72% | 0 | n/a |
| Calvera Blackwake, the Mad Pirate Queen | 25 | 64% | 20 | 85% |
| The Serattan Oath-Coin | 45 | 56% | 0 | n/a |
| Justice: Dagan, Sovereign of the Scales | 17 | 65% | 28 | 32% |
| Lorien of the Hand | 4 | 0% | 41 | 46% |
| The Emperor: Izuriel Sakazarac II | 20 | 60% | 17 | 18% |
| The World: The Eldspyre | 31 | 55% | 4 | 0% |
| Strength: Grimore | 25 | 52% | 0 | n/a |
| The Libra Stellae | 11 | 36% | 12 | 58% |
| The Moon: The Bone Moon | 12 | 50% | 0 | n/a |

## Sample traces (first 14 plays)

```
sig-daxon vs sig-lirielle seed 20365635: winner sig-daxon in round 6 by attack
  r2 p0 plays Captain Elira Voss (reversed)
  r2 p1 plays The Oondray (reversed)
  r3 p0 plays Braxon Lamn (upright)
  r3 p1 plays Elder Voren Nightbloom (reversed)
  r4 p0 plays Aurium Plate (upright)
  r4 p1 plays Taranis, the Laughing Crow (reversed)
  r5 p0 plays The Sun: The Spark (reversed)
  r5 p1 plays Wisplight (upright)
  r5 p1 plays Yvette Mirthwell (upright)
  r6 p0 plays Vel, the Emberlight (reversed)
```

```
sig-lirielle vs sig-daxon seed 20365636: winner sig-daxon in round 6 by attack
  r2 p0 plays The Oondray (reversed)
  r2 p1 plays Braxon Lamn (reversed)
  r3 p0 plays Elder Voren Nightbloom (upright)
  r3 p1 plays Captain Elira Voss (reversed)
  r4 p0 plays Taranis, the Laughing Crow (reversed)
  r4 p1 plays Aurium Plate (reversed)
  r5 p0 plays Wisplight (upright)
  r5 p0 plays Yvette Mirthwell (upright)
  r5 p1 plays Eva’s Kitchen (upright)
  r5 p1 plays Brookskippers (reversed)
  r6 p0 plays The Empress: Que’Rubra (upright)
  r6 p1 plays Vel, the Emberlight (reversed)
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

Average length 8.1 to 8.1 rounds.

| Hero | Baseline | This run | Change |
|---|---|---|---|
| Daxon Lamn | 76% | 78% | +2 |
| Lirielle Starwhisper | 30% | 23% | -7 |
| Luigi Bonemoon | 44% | 40% | -4 |
| Rorik Flamebeard | 71% | 75% | +4 |
| Lord-Provost Elaina Masque | 54% | 56% | +2 |
| Imperator Amegmon Shazz | 27% | 29% | +2 |

With 200 games per hero, a swing under about 7 points is inside the noise.
