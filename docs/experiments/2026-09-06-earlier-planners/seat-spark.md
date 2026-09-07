# Experiment: seat-spark

Seat: the second player has 1 extra Spark on their first turn only.

600 games: 15 hero pairings, 20 seed pairs each, both seats, each hero keeping its own deck order across the seat swap. Planner depth 2, beam 5. Run on 2026-09-06 in 25 seconds.

Average length 8.0 rounds. 0 draws. First seat won 61% of decided games. The Bone Moon was up at the end of 23% of games.

## Heroes

| Hero | Win rate | Games | First seat | Second seat | Heal per game | Burns per game | Upright plays | Reversed plays |
|---|---|---|---|---|---|---|---|---|
| Daxon Lamn | 81% | 200 | 87% | 74% | 3.5 | 0.13 | 37% | 63% |
| Lirielle Starwhisper | 29% | 200 | 38% | 19% | 0.2 | 1.91 | 42% | 58% |
| Luigi Bonemoon | 45% | 200 | 57% | 33% | 5.0 | 1.26 | 46% | 54% |
| Rorik Flamebeard | 66% | 200 | 82% | 49% | 10.9 | 0.67 | 37% | 63% |
| Lord-Provost Elaina Masque | 57% | 200 | 70% | 44% | 2.7 | 0.65 | 42% | 58% |
| Imperator Amegmon Shazz | 24% | 200 | 32% | 15% | 0.2 | 0.58 | 29% | 71% |

## Matchups (row hero win rate against column hero, both seats combined)

| | Daxon | Lirielle | Luigi | Rorik | Lord-Provost | Imperator |
|---|---|---|---|---|---|---|
| Daxon |  | 88% | 85% | 65% | 70% | 95% |
| Lirielle | 13% |  | 20% | 23% | 28% | 60% |
| Luigi | 15% | 80% |  | 33% | 25% | 73% |
| Rorik | 35% | 78% | 68% |  | 63% | 85% |
| Lord-Provost | 30% | 73% | 75% | 38% |  | 70% |
| Imperator | 5% | 40% | 28% | 15% | 30% |  |

## Game length

- Rounds 5 to 6: 159
- Rounds 7 to 8: 218
- Rounds 9 to 10: 154
- Rounds 11 to 12: 59
- Rounds 13 and up: 10

## How games ended (the blow that took the loser to zero)

- attack: 431
- omen: 122
- boneMoon: 29
- fatigue: 1
- ability: 10
- other: 7

Per hero, what they lost to:

| Hero | attack | omen | Bone Moon | fatigue | ability | other |
|---|---|---|---|---|---|---|
| Daxon Lamn | 25 | 12 | 2 | 0 | 0 | 0 |
| Lirielle Starwhisper | 105 | 26 | 2 | 1 | 6 | 3 |
| Luigi Bonemoon | 78 | 24 | 8 | 0 | 0 | 0 |
| Rorik Flamebeard | 55 | 10 | 2 | 0 | 2 | 0 |
| Lord-Provost Elaina Masque | 55 | 21 | 9 | 0 | 0 | 1 |
| Imperator Amegmon Shazz | 113 | 29 | 6 | 0 | 2 | 3 |

## Face usage by card (plays and win rate when played on that face; at least 10 plays)

| Card | Upright plays | Upright win | Reversed plays | Reversed win |
|---|---|---|---|---|
| Eldertech Sphere | 205 | 25% | 267 | 36% |
| Captain Elira Voss | 0 | n/a | 448 | 75% |
| The Oondray | 2 | 0% | 335 | 45% |
| Mordeaux, the Clockwork Man | 246 | 38% | 89 | 19% |
| Dawn Over Aurengate | 215 | 74% | 115 | 55% |
| General Vath Enverez | 145 | 43% | 154 | 78% |
| Wisplight | 77 | 32% | 219 | 50% |
| Mr. Boscoe | 27 | 22% | 265 | 34% |
| Project Tamori | 171 | 36% | 118 | 34% |
| Kaipo’s Pearl | 13 | 77% | 264 | 68% |
| Pommeroy | 111 | 30% | 157 | 32% |
| Null-Zone Pylon | 138 | 44% | 117 | 24% |
| Braxon Lamn | 89 | 82% | 160 | 68% |
| Yvette Mirthwell | 242 | 25% | 3 | 67% |
| The Guard Post | 55 | 53% | 182 | 73% |
| The Sleepless Sentry | 201 | 33% | 27 | 63% |
| Mr. Zero | 3 | 33% | 216 | 46% |
| Eva’s Kitchen | 147 | 57% | 70 | 87% |
| Elder Voren Nightbloom | 9 | 0% | 206 | 24% |
| Zalian Fisherman | 155 | 59% | 47 | 34% |
| Brog | 1 | 0% | 199 | 45% |
| Kaelen Goldeneye | 1 | 100% | 189 | 51% |
| Thorn of the Bladed Wind | 186 | 51% | 0 | n/a |
| Archivist Esmerelda Gotch | 5 | 100% | 172 | 40% |
| Shadowling Stalkers | 0 | n/a | 152 | 22% |
| Temperance: Brother Soren | 3 | 0% | 146 | 79% |
| The Festival of Radiant Dawn | 28 | 39% | 118 | 75% |
| The Sun: The Spark | 61 | 80% | 83 | 65% |
| Death: The Man in Black | 48 | 38% | 86 | 43% |
| Aurium Plate | 45 | 89% | 82 | 85% |
| Taranis, the Laughing Crow | 64 | 22% | 58 | 17% |
| Vraxxis, the Hungering Cinder | 0 | n/a | 121 | 73% |
| Vel, the Emberlight | 5 | 60% | 115 | 79% |
| Fin & Bin | 47 | 28% | 70 | 30% |
| Kaipo Nuvane | 79 | 65% | 37 | 41% |
| The Solar Flare Cannon | 82 | 82% | 33 | 70% |
| Archmage Severyn Caldreth | 102 | 46% | 3 | 100% |
| The Tower: The Fallen Isle | 65 | 20% | 37 | 84% |
| The High Priestess: Nitriti | 70 | 27% | 31 | 39% |
| The Empress: Que’Rubra | 69 | 39% | 30 | 43% |
| Ilzaren, the Resplendent King | 89 | 56% | 9 | 89% |
| Kojin, the Fiery Whip | 95 | 60% | 0 | n/a |
| The Hermit: Luigi Bonemoon | 19 | 53% | 75 | 79% |
| Lake Mirrara | 30 | 33% | 63 | 27% |
| Cernis, the Horned Forest Lord | 86 | 45% | 4 | 50% |
| The Magician: Luigi Castanata | 0 | n/a | 89 | 47% |
| Portal of Autumn Leaves | 1 | 100% | 86 | 27% |
| The Mirrored Dome | 1 | 0% | 81 | 69% |
| Judgement: The Septor’s Chorus | 0 | n/a | 82 | 71% |
| The Hanged Man: Rorik Flamebeard | 71 | 82% | 9 | 89% |
| Merrick Blackwater | 64 | 48% | 16 | 50% |
| Brookskippers | 23 | 70% | 56 | 61% |
| The Fool: Daxon Lamn | 0 | n/a | 77 | 73% |
| The Sunken Empire Rises | 0 | n/a | 75 | 41% |
| Inspector Bramble | 0 | n/a | 73 | 30% |
| The Heartwood | 7 | 29% | 58 | 83% |
| The Chariot: The Solar Wind | 27 | 52% | 38 | 79% |
| Tidecaller: Low Tide | 1 | 100% | 63 | 79% |
| Bill Boggs, Cartel Runner | 40 | 88% | 20 | 75% |
| The Garbage Boyz | 46 | 59% | 11 | 36% |
| The Serattan Oath-Coin | 52 | 50% | 0 | n/a |
| Wheel of Fortune: The Orrery | 9 | 44% | 41 | 85% |
| Marin, Spirit of Ocean Waves | 9 | 100% | 40 | 75% |
| Tyserion I, the Golden Blade | 49 | 82% | 0 | n/a |
| Justice: Dagan, Sovereign of the Scales | 18 | 78% | 30 | 40% |
| The Lovers: Althea & Caelum | 45 | 47% | 2 | 0% |
| Calvera Blackwake, the Mad Pirate Queen | 21 | 76% | 25 | 64% |
| Bimp Bossington | 44 | 70% | 0 | n/a |
| Lorien of the Hand | 2 | 0% | 41 | 39% |
| The Star: Lirielle Starwhisper | 4 | 25% | 38 | 63% |
| The Emperor: Izuriel Sakazarac II | 26 | 46% | 12 | 17% |
| The World: The Eldspyre | 33 | 55% | 4 | 25% |
| Strength: Grimore | 27 | 30% | 0 | n/a |
| The Libra Stellae | 8 | 25% | 9 | 33% |
| The Moon: The Bone Moon | 8 | 25% | 2 | 50% |

## Sample traces (first 14 plays)

```
sig-daxon vs sig-lirielle seed 20365635: winner sig-daxon in round 6 by attack
  r1 p1 plays The Oondray (reversed)
  r2 p0 plays Captain Elira Voss (reversed)
  r2 p1 plays Elder Voren Nightbloom (upright)
  r3 p0 plays Braxon Lamn (upright)
  r3 p1 plays Yvette Mirthwell (upright)
  r3 p1 plays Eldertech Sphere (reversed)
  r4 p0 plays Aurium Plate (reversed)
  r4 p1 plays Taranis, the Laughing Crow (upright)
  r5 p0 plays Kaipo Nuvane (reversed)
  r5 p0 plays Eva’s Kitchen (upright)
  r5 p1 plays Inspector Bramble (reversed)
  r6 p0 plays Vel, the Emberlight (reversed)
```

```
sig-lirielle vs sig-daxon seed 20365636: winner sig-daxon in round 5 by attack
  r1 p1 plays Captain Elira Voss (reversed)
  r2 p0 plays The Oondray (reversed)
  r2 p1 plays Braxon Lamn (upright)
  r3 p0 plays Elder Voren Nightbloom (reversed)
  r3 p1 plays The Sun: The Spark (reversed)
  r4 p0 plays Taranis, the Laughing Crow (reversed)
  r4 p1 plays Eva’s Kitchen (reversed)
  r5 p0 plays Yvette Mirthwell (upright)
  r5 p0 plays Eldertech Sphere (upright)
  r5 p0 plays Wisplight (upright)
  r5 p1 plays Kaipo Nuvane (upright)
```

```
sig-daxon vs sig-lirielle seed 20373554: winner sig-daxon in round 6 by attack
  r1 p1 plays Pommeroy (upright)
  r2 p0 plays Captain Elira Voss (reversed)
  r2 p1 plays Wisplight (upright)
  r3 p0 plays Captain Elira Voss (reversed)
  r4 p0 plays Temperance: Brother Soren (reversed)
  r4 p1 plays Thorn of the Bladed Wind (upright)
  r5 p0 plays The Hanged Man: Rorik Flamebeard (reversed)
  r5 p1 plays Taranis, the Laughing Crow (upright)
  r5 p1 plays Eldertech Sphere (reversed)
  r6 p0 plays Aurium Plate (upright)
```

## Change against the baseline

Average length 8.1 to 8.0 rounds.

| Hero | Baseline | This run | Change |
|---|---|---|---|
| Daxon Lamn | 76% | 81% | +5 |
| Lirielle Starwhisper | 30% | 29% | -1 |
| Luigi Bonemoon | 44% | 45% | +2 |
| Rorik Flamebeard | 71% | 66% | -6 |
| Lord-Provost Elaina Masque | 54% | 57% | +3 |
| Imperator Amegmon Shazz | 27% | 24% | -3 |

With 200 games per hero, a swing under about 7 points is inside the noise.
