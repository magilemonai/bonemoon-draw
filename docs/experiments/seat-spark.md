# Experiment: seat-spark

Seat: the second player has 1 extra Spark on their first turn only.

600 games: 15 hero pairings, 20 seed pairs each, both seats, each hero keeping its own deck order across the seat swap. Planner depth 2, beam 5, 2 sampled worlds. Run in 51 seconds.

Code c283f90 with uncommitted changes in src or scripts. Rules 2026-09-06. Starter decks as shipped (daxon 30, lirielle 30, luigi 30, rorik 30, masque 30, shazz 30). Seeds: 20260906 + pairing x 104729 + pair x 7919, the seat swap at seed + 1, deck orders hashed per hero. Stamped 9/7/2026, 17:39:56 EDT.

Average length 8.0 rounds. 0 draws. First seat won 60% of decided games. The Bone Moon was up at the end of 25% of games.

## Heroes

| Hero | Win rate | Games | First seat | Second seat | Heal per game | Burns per game | Upright plays | Reversed plays |
|---|---|---|---|---|---|---|---|---|
| Daxon Lamn | 79% | 200 | 87% | 70% | 3.5 | 0.14 | 37% | 63% |
| Lirielle Starwhisper | 29% | 200 | 37% | 21% | 0.1 | 1.89 | 42% | 58% |
| Luigi Bonemoon | 42% | 200 | 53% | 31% | 5.3 | 1.23 | 46% | 54% |
| Rorik Flamebeard | 68% | 200 | 82% | 53% | 10.8 | 0.67 | 37% | 63% |
| Lord-Provost Elaina Masque | 58% | 200 | 70% | 46% | 2.8 | 0.68 | 42% | 58% |
| Imperator Amegmon Shazz | 25% | 200 | 33% | 17% | 0.3 | 0.57 | 29% | 71% |

## Matchups (row hero win rate against column hero, both seats combined)

| | Daxon | Lirielle | Luigi | Rorik | Lord-Provost | Imperator |
|---|---|---|---|---|---|---|
| Daxon |  | 85% | 83% | 63% | 70% | 93% |
| Lirielle | 15% |  | 23% | 23% | 25% | 60% |
| Luigi | 18% | 78% |  | 25% | 23% | 68% |
| Rorik | 38% | 78% | 75% |  | 63% | 85% |
| Lord-Provost | 30% | 75% | 78% | 38% |  | 70% |
| Imperator | 8% | 40% | 33% | 15% | 30% |  |

## Game length

- Rounds 5 to 6: 160
- Rounds 7 to 8: 219
- Rounds 9 to 10: 141
- Rounds 11 to 12: 64
- Rounds 13 and up: 16

## How games ended (the blow that took the loser to zero)

- attack: 411
- omen: 101
- boneMoon: 77
- fatigue: 1
- ability: 2
- other: 8

Per hero, what they lost to:

| Hero | attack | omen | Bone Moon | fatigue | ability | other |
|---|---|---|---|---|---|---|
| Daxon Lamn | 28 | 10 | 5 | 0 | 0 | 0 |
| Lirielle Starwhisper | 100 | 26 | 10 | 1 | 2 | 3 |
| Luigi Bonemoon | 72 | 17 | 26 | 0 | 0 | 1 |
| Rorik Flamebeard | 50 | 7 | 8 | 0 | 0 | 0 |
| Lord-Provost Elaina Masque | 51 | 20 | 12 | 0 | 0 | 1 |
| Imperator Amegmon Shazz | 110 | 21 | 16 | 0 | 0 | 3 |

## Face usage by card (plays and win rate when played on that face; at least 10 plays)

| Card | Upright plays | Upright win | Reversed plays | Reversed win |
|---|---|---|---|---|
| Eldertech Sphere | 196 | 24% | 279 | 37% |
| Captain Elira Voss | 0 | n/a | 444 | 75% |
| Mordeaux, the Clockwork Man | 246 | 36% | 93 | 20% |
| The Oondray | 3 | 33% | 331 | 48% |
| Dawn Over Aurengate | 213 | 76% | 114 | 57% |
| General Vath Enverez | 144 | 42% | 154 | 79% |
| Mr. Boscoe | 29 | 24% | 265 | 34% |
| Wisplight | 75 | 32% | 215 | 50% |
| Project Tamori | 171 | 33% | 113 | 35% |
| Kaipo’s Pearl | 14 | 71% | 261 | 67% |
| Pommeroy | 111 | 30% | 155 | 33% |
| Null-Zone Pylon | 137 | 45% | 117 | 26% |
| Braxon Lamn | 86 | 80% | 159 | 68% |
| Yvette Mirthwell | 244 | 24% | 1 | 0% |
| The Guard Post | 52 | 54% | 181 | 75% |
| The Sleepless Sentry | 200 | 35% | 31 | 68% |
| Mr. Zero | 3 | 33% | 214 | 44% |
| Elder Voren Nightbloom | 9 | 0% | 207 | 26% |
| Eva’s Kitchen | 145 | 58% | 65 | 88% |
| Zalian Fisherman | 146 | 56% | 57 | 37% |
| Brog | 1 | 0% | 198 | 42% |
| Kaelen Goldeneye | 1 | 100% | 189 | 52% |
| Thorn of the Bladed Wind | 188 | 51% | 0 | n/a |
| Archivist Esmerelda Gotch | 5 | 100% | 168 | 42% |
| The Sun: The Spark | 62 | 81% | 87 | 64% |
| Shadowling Stalkers | 0 | n/a | 149 | 23% |
| Temperance: Brother Soren | 3 | 0% | 142 | 79% |
| The Festival of Radiant Dawn | 27 | 44% | 114 | 75% |
| Death: The Man in Black | 41 | 32% | 87 | 39% |
| Aurium Plate | 44 | 86% | 81 | 85% |
| Taranis, the Laughing Crow | 61 | 23% | 60 | 20% |
| Vraxxis, the Hungering Cinder | 0 | n/a | 121 | 72% |
| Kaipo Nuvane | 80 | 60% | 37 | 38% |
| Vel, the Emberlight | 5 | 100% | 112 | 77% |
| Fin & Bin | 46 | 30% | 68 | 31% |
| The Solar Flare Cannon | 80 | 78% | 31 | 68% |
| Archmage Severyn Caldreth | 101 | 46% | 6 | 67% |
| Ilzaren, the Resplendent King | 90 | 61% | 9 | 89% |
| The High Priestess: Nitriti | 68 | 28% | 29 | 38% |
| The Tower: The Fallen Isle | 65 | 22% | 32 | 84% |
| The Empress: Que’Rubra | 67 | 49% | 27 | 37% |
| The Magician: Luigi Castanata | 0 | n/a | 93 | 44% |
| Cernis, the Horned Forest Lord | 87 | 46% | 4 | 25% |
| The Hermit: Luigi Bonemoon | 19 | 53% | 72 | 81% |
| Kojin, the Fiery Whip | 90 | 60% | 0 | n/a |
| Lake Mirrara | 28 | 39% | 60 | 23% |
| The Mirrored Dome | 1 | 0% | 85 | 65% |
| Portal of Autumn Leaves | 1 | 100% | 83 | 30% |
| Judgement: The Septor’s Chorus | 0 | n/a | 83 | 70% |
| Merrick Blackwater | 65 | 51% | 16 | 25% |
| The Hanged Man: Rorik Flamebeard | 71 | 77% | 8 | 75% |
| The Fool: Daxon Lamn | 0 | n/a | 78 | 73% |
| Brookskippers | 20 | 60% | 54 | 59% |
| Inspector Bramble | 0 | n/a | 72 | 33% |
| The Sunken Empire Rises | 0 | n/a | 72 | 38% |
| Tidecaller: Low Tide | 3 | 33% | 64 | 80% |
| The Heartwood | 7 | 29% | 59 | 83% |
| The Chariot: The Solar Wind | 28 | 54% | 36 | 83% |
| Bill Boggs, Cartel Runner | 42 | 86% | 19 | 68% |
| The Serattan Oath-Coin | 58 | 40% | 0 | n/a |
| The Garbage Boyz | 44 | 52% | 10 | 30% |
| Tyserion I, the Golden Blade | 50 | 84% | 0 | n/a |
| The Lovers: Althea & Caelum | 47 | 47% | 2 | 50% |
| Justice: Dagan, Sovereign of the Scales | 17 | 76% | 31 | 45% |
| Marin, Spirit of Ocean Waves | 10 | 90% | 36 | 81% |
| Calvera Blackwake, the Mad Pirate Queen | 22 | 59% | 24 | 63% |
| Bimp Bossington | 44 | 64% | 0 | n/a |
| The Star: Lirielle Starwhisper | 4 | 50% | 40 | 65% |
| Wheel of Fortune: The Orrery | 8 | 50% | 35 | 83% |
| The World: The Eldspyre | 37 | 51% | 4 | 25% |
| The Emperor: Izuriel Sakazarac II | 26 | 58% | 15 | 20% |
| Lorien of the Hand | 2 | 0% | 39 | 41% |
| Strength: Grimore | 30 | 37% | 0 | n/a |
| The Libra Stellae | 10 | 30% | 8 | 25% |
| The Moon: The Bone Moon | 10 | 30% | 2 | 50% |

## Sample traces (first 14 plays)

```
sig-daxon vs sig-lirielle seed 20365635: winner sig-daxon in round 8 by attack
  r1 p1 plays The Oondray (reversed)
  r2 p0 plays Captain Elira Voss (reversed)
  r2 p1 plays Elder Voren Nightbloom (upright)
  r3 p0 plays Braxon Lamn (upright)
  r3 p1 plays Yvette Mirthwell (upright)
  r3 p1 plays Eldertech Sphere (upright)
  r4 p0 plays Aurium Plate (reversed)
  r4 p1 plays Taranis, the Laughing Crow (reversed)
  r5 p0 plays Eva’s Kitchen (upright)
  r5 p0 plays Kaipo Nuvane (upright)
  r5 p1 plays Lake Mirrara (reversed)
  r6 p0 plays Kojin, the Fiery Whip (upright)
  r6 p1 plays Inspector Bramble (reversed)
  r7 p0 plays Marin, Spirit of Ocean Waves (reversed)
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
```

## Change against the baseline

Average length 8.2 to 8.0 rounds.

| Hero | Baseline | This run | Change |
|---|---|---|---|
| Daxon Lamn | 75% | 79% | +4 |
| Lirielle Starwhisper | 32% | 29% | -3 |
| Luigi Bonemoon | 43% | 42% | -1 |
| Rorik Flamebeard | 70% | 68% | -2 |
| Lord-Provost Elaina Masque | 56% | 58% | +3 |
| Imperator Amegmon Shazz | 26% | 25% | -1 |

With 200 games per hero, a swing under about 7 points is inside the noise.
