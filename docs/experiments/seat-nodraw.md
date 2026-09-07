# Experiment: seat-nodraw

Seat: the first player draws no card on turn one (opening hands 4 and 5, then draws as usual).

600 games: 15 hero pairings, 20 seed pairs each, both seats, each hero keeping its own deck order across the seat swap. Planner depth 2, beam 5, 2 sampled worlds. Run in 52 seconds.

Code c283f90 with uncommitted changes in src or scripts. Rules 2026-09-06. Starter decks as shipped (daxon 30, lirielle 30, luigi 30, rorik 30, masque 30, shazz 30). Seeds: 20260906 + pairing x 104729 + pair x 7919, the seat swap at seed + 1, deck orders hashed per hero. Stamped 9/7/2026, 17:38:10 EDT.

Average length 8.2 rounds. 0 draws. First seat won 61% of decided games. The Bone Moon was up at the end of 24% of games.

## Heroes

| Hero | Win rate | Games | First seat | Second seat | Heal per game | Burns per game | Upright plays | Reversed plays |
|---|---|---|---|---|---|---|---|---|
| Daxon Lamn | 77% | 200 | 84% | 70% | 3.5 | 0.19 | 38% | 62% |
| Lirielle Starwhisper | 22% | 200 | 38% | 5% | 0.1 | 1.88 | 41% | 59% |
| Luigi Bonemoon | 43% | 200 | 56% | 29% | 4.9 | 1.14 | 47% | 53% |
| Rorik Flamebeard | 73% | 200 | 80% | 66% | 9.6 | 0.54 | 37% | 63% |
| Lord-Provost Elaina Masque | 57% | 200 | 64% | 49% | 2.8 | 0.68 | 41% | 59% |
| Imperator Amegmon Shazz | 30% | 200 | 42% | 17% | 0.3 | 0.57 | 31% | 69% |

## Matchups (row hero win rate against column hero, both seats combined)

| | Daxon | Lirielle | Luigi | Rorik | Lord-Provost | Imperator |
|---|---|---|---|---|---|---|
| Daxon |  | 88% | 80% | 55% | 68% | 95% |
| Lirielle | 13% |  | 28% | 8% | 30% | 30% |
| Luigi | 20% | 73% |  | 20% | 30% | 70% |
| Rorik | 45% | 93% | 80% |  | 63% | 85% |
| Lord-Provost | 33% | 70% | 70% | 38% |  | 73% |
| Imperator | 5% | 70% | 30% | 15% | 28% |  |

## Game length

- Rounds 5 to 6: 118
- Rounds 7 to 8: 259
- Rounds 9 to 10: 145
- Rounds 11 to 12: 66
- Rounds 13 and up: 12

## How games ended (the blow that took the loser to zero)

- attack: 381
- omen: 105
- boneMoon: 89
- fatigue: 0
- ability: 12
- other: 13

Per hero, what they lost to:

| Hero | attack | omen | Bone Moon | fatigue | ability | other |
|---|---|---|---|---|---|---|
| Daxon Lamn | 30 | 11 | 4 | 0 | 1 | 0 |
| Lirielle Starwhisper | 99 | 30 | 21 | 0 | 4 | 3 |
| Luigi Bonemoon | 69 | 17 | 25 | 0 | 0 | 4 |
| Rorik Flamebeard | 36 | 5 | 12 | 0 | 0 | 1 |
| Lord-Provost Elaina Masque | 58 | 16 | 9 | 0 | 2 | 2 |
| Imperator Amegmon Shazz | 89 | 26 | 18 | 0 | 5 | 3 |

## Face usage by card (plays and win rate when played on that face; at least 10 plays)

| Card | Upright plays | Upright win | Reversed plays | Reversed win |
|---|---|---|---|---|
| Eldertech Sphere | 235 | 27% | 225 | 35% |
| Captain Elira Voss | 0 | n/a | 440 | 74% |
| Dawn Over Aurengate | 219 | 70% | 117 | 62% |
| Mordeaux, the Clockwork Man | 246 | 32% | 88 | 34% |
| The Oondray | 3 | 33% | 318 | 47% |
| Wisplight | 72 | 29% | 226 | 44% |
| General Vath Enverez | 136 | 44% | 154 | 75% |
| Mr. Boscoe | 28 | 29% | 257 | 30% |
| Project Tamori | 177 | 36% | 108 | 38% |
| Kaipo’s Pearl | 9 | 78% | 268 | 68% |
| Null-Zone Pylon | 131 | 42% | 127 | 32% |
| Mr. Zero | 4 | 25% | 236 | 43% |
| Pommeroy | 85 | 36% | 154 | 30% |
| Braxon Lamn | 76 | 76% | 159 | 70% |
| The Guard Post | 67 | 46% | 165 | 73% |
| Eva’s Kitchen | 148 | 51% | 76 | 86% |
| Yvette Mirthwell | 220 | 25% | 3 | 0% |
| The Sleepless Sentry | 189 | 36% | 31 | 61% |
| Elder Voren Nightbloom | 12 | 0% | 199 | 28% |
| Zalian Fisherman | 145 | 53% | 57 | 40% |
| Brog | 2 | 50% | 198 | 42% |
| Archivist Esmerelda Gotch | 4 | 75% | 192 | 35% |
| Kaelen Goldeneye | 5 | 60% | 189 | 50% |
| Thorn of the Bladed Wind | 163 | 47% | 0 | n/a |
| Temperance: Brother Soren | 3 | 0% | 155 | 82% |
| Shadowling Stalkers | 0 | n/a | 144 | 26% |
| The Festival of Radiant Dawn | 30 | 67% | 111 | 67% |
| Aurium Plate | 52 | 79% | 87 | 78% |
| The Sun: The Spark | 64 | 83% | 74 | 53% |
| Death: The Man in Black | 48 | 38% | 81 | 41% |
| The High Priestess: Nitriti | 86 | 29% | 39 | 21% |
| Kaipo Nuvane | 86 | 65% | 37 | 24% |
| Vraxxis, the Hungering Cinder | 0 | n/a | 119 | 75% |
| Vel, the Emberlight | 2 | 0% | 115 | 80% |
| The Tower: The Fallen Isle | 80 | 14% | 36 | 94% |
| The Empress: Que’Rubra | 70 | 39% | 45 | 49% |
| The Solar Flare Cannon | 77 | 74% | 33 | 64% |
| Ilzaren, the Resplendent King | 89 | 60% | 16 | 63% |
| Taranis, the Laughing Crow | 56 | 30% | 47 | 32% |
| Lake Mirrara | 45 | 27% | 52 | 35% |
| Fin & Bin | 23 | 30% | 72 | 28% |
| Cernis, the Horned Forest Lord | 89 | 40% | 5 | 60% |
| Kojin, the Fiery Whip | 94 | 69% | 0 | n/a |
| Archmage Severyn Caldreth | 86 | 57% | 4 | 0% |
| The Hermit: Luigi Bonemoon | 23 | 74% | 67 | 72% |
| Judgement: The Septor’s Chorus | 1 | 100% | 84 | 58% |
| Portal of Autumn Leaves | 1 | 100% | 83 | 23% |
| The Hanged Man: Rorik Flamebeard | 74 | 81% | 6 | 100% |
| Tidecaller: Low Tide | 3 | 67% | 75 | 83% |
| Bill Boggs, Cartel Runner | 46 | 87% | 31 | 74% |
| Brookskippers | 27 | 74% | 49 | 57% |
| The Magician: Luigi Castanata | 0 | n/a | 74 | 47% |
| The Fool: Daxon Lamn | 0 | n/a | 74 | 80% |
| Inspector Bramble | 0 | n/a | 73 | 19% |
| The Chariot: The Solar Wind | 31 | 55% | 42 | 81% |
| The Sunken Empire Rises | 0 | n/a | 72 | 40% |
| The Heartwood | 10 | 20% | 60 | 87% |
| The Mirrored Dome | 1 | 0% | 66 | 68% |
| Merrick Blackwater | 46 | 52% | 21 | 29% |
| The Garbage Boyz | 48 | 48% | 17 | 29% |
| Wheel of Fortune: The Orrery | 13 | 38% | 43 | 77% |
| Marin, Spirit of Ocean Waves | 18 | 44% | 38 | 87% |
| The Lovers: Althea & Caelum | 49 | 39% | 3 | 67% |
| Tyserion I, the Golden Blade | 49 | 82% | 1 | 100% |
| Bimp Bossington | 46 | 76% | 0 | n/a |
| Calvera Blackwake, the Mad Pirate Queen | 26 | 73% | 18 | 89% |
| The Serattan Oath-Coin | 43 | 58% | 0 | n/a |
| The Star: Lirielle Starwhisper | 4 | 75% | 39 | 72% |
| Justice: Dagan, Sovereign of the Scales | 15 | 67% | 27 | 33% |
| Lorien of the Hand | 4 | 0% | 38 | 53% |
| The Emperor: Izuriel Sakazarac II | 22 | 59% | 13 | 15% |
| The World: The Eldspyre | 29 | 52% | 4 | 25% |
| Strength: Grimore | 25 | 56% | 0 | n/a |
| The Libra Stellae | 10 | 40% | 13 | 69% |
| The Moon: The Bone Moon | 10 | 40% | 0 | n/a |

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

Average length 8.2 to 8.2 rounds.

| Hero | Baseline | This run | Change |
|---|---|---|---|
| Daxon Lamn | 75% | 77% | +2 |
| Lirielle Starwhisper | 32% | 22% | -10 |
| Luigi Bonemoon | 43% | 43% | -1 |
| Rorik Flamebeard | 70% | 73% | +4 |
| Lord-Provost Elaina Masque | 56% | 57% | +1 |
| Imperator Amegmon Shazz | 26% | 30% | +4 |

With 200 games per hero, a swing under about 7 points is inside the noise.
