# Experiment: tidecaller-gale

Tidecaller Reversed: +2/+1, Windborne, Gale (was +3/+1 Windborne).

600 games: 15 hero pairings, 20 seed pairs each, both seats, each hero keeping its own deck order across the seat swap. Planner depth 2, beam 5, 2 sampled worlds. Run in 51 seconds.

Code c283f90 with uncommitted changes in src or scripts. Rules 2026-09-06. Starter decks as shipped (daxon 30, lirielle 30, luigi 30, rorik 30, masque 30, shazz 30). Seeds: 20260906 + pairing x 104729 + pair x 7919, the seat swap at seed + 1, deck orders hashed per hero. Stamped 9/7/2026, 17:41:41 EDT.

Average length 8.1 rounds. 0 draws. First seat won 64% of decided games. The Bone Moon was up at the end of 25% of games.

## Heroes

| Hero | Win rate | Games | First seat | Second seat | Heal per game | Burns per game | Upright plays | Reversed plays |
|---|---|---|---|---|---|---|---|---|
| Daxon Lamn | 78% | 200 | 88% | 67% | 3.7 | 0.23 | 37% | 63% |
| Lirielle Starwhisper | 32% | 200 | 54% | 9% | 0.1 | 2.06 | 41% | 59% |
| Luigi Bonemoon | 42% | 200 | 62% | 21% | 4.9 | 1.27 | 45% | 55% |
| Rorik Flamebeard | 68% | 200 | 80% | 56% | 9.6 | 0.63 | 36% | 64% |
| Lord-Provost Elaina Masque | 56% | 200 | 65% | 46% | 2.0 | 0.78 | 42% | 58% |
| Imperator Amegmon Shazz | 26% | 200 | 37% | 15% | 0.1 | 0.70 | 29% | 71% |

## Matchups (row hero win rate against column hero, both seats combined)

| | Daxon | Lirielle | Luigi | Rorik | Lord-Provost | Imperator |
|---|---|---|---|---|---|---|
| Daxon |  | 75% | 78% | 65% | 75% | 95% |
| Lirielle | 25% |  | 43% | 15% | 30% | 45% |
| Luigi | 23% | 58% |  | 35% | 25% | 68% |
| Rorik | 35% | 85% | 65% |  | 65% | 90% |
| Lord-Provost | 25% | 70% | 75% | 35% |  | 73% |
| Imperator | 5% | 55% | 33% | 10% | 28% |  |

## Game length

- Rounds 5 to 6: 121
- Rounds 7 to 8: 249
- Rounds 9 to 10: 151
- Rounds 11 to 12: 68
- Rounds 13 and up: 11

## How games ended (the blow that took the loser to zero)

- attack: 386
- omen: 115
- boneMoon: 81
- fatigue: 0
- ability: 4
- other: 14

Per hero, what they lost to:

| Hero | attack | omen | Bone Moon | fatigue | ability | other |
|---|---|---|---|---|---|---|
| Daxon Lamn | 28 | 8 | 8 | 0 | 1 | 0 |
| Lirielle Starwhisper | 88 | 31 | 14 | 0 | 1 | 3 |
| Luigi Bonemoon | 69 | 25 | 20 | 0 | 0 | 3 |
| Rorik Flamebeard | 42 | 8 | 12 | 0 | 0 | 2 |
| Lord-Provost Elaina Masque | 58 | 20 | 8 | 0 | 1 | 2 |
| Imperator Amegmon Shazz | 101 | 23 | 19 | 0 | 1 | 4 |

## Face usage by card (plays and win rate when played on that face; at least 10 plays)

| Card | Upright plays | Upright win | Reversed plays | Reversed win |
|---|---|---|---|---|
| Eldertech Sphere | 256 | 26% | 212 | 47% |
| Captain Elira Voss | 0 | n/a | 454 | 72% |
| Mordeaux, the Clockwork Man | 238 | 40% | 88 | 26% |
| The Oondray | 3 | 33% | 318 | 45% |
| Dawn Over Aurengate | 205 | 69% | 107 | 61% |
| Wisplight | 72 | 43% | 238 | 49% |
| General Vath Enverez | 130 | 40% | 174 | 71% |
| Mr. Boscoe | 37 | 30% | 250 | 32% |
| Kaipo’s Pearl | 11 | 82% | 273 | 67% |
| Project Tamori | 175 | 32% | 107 | 42% |
| Null-Zone Pylon | 134 | 46% | 121 | 31% |
| Pommeroy | 86 | 38% | 159 | 36% |
| Braxon Lamn | 80 | 78% | 154 | 72% |
| Elder Voren Nightbloom | 9 | 11% | 219 | 25% |
| The Guard Post | 69 | 45% | 156 | 78% |
| Mr. Zero | 3 | 100% | 220 | 42% |
| The Sleepless Sentry | 183 | 34% | 29 | 62% |
| Yvette Mirthwell | 210 | 32% | 1 | 100% |
| Zalian Fisherman | 129 | 58% | 76 | 34% |
| Eva’s Kitchen | 135 | 53% | 68 | 93% |
| Brog | 1 | 0% | 198 | 41% |
| Archivist Esmerelda Gotch | 8 | 88% | 188 | 37% |
| Kaelen Goldeneye | 6 | 50% | 187 | 52% |
| Thorn of the Bladed Wind | 178 | 51% | 0 | n/a |
| The Sun: The Spark | 73 | 75% | 93 | 57% |
| Temperance: Brother Soren | 2 | 50% | 157 | 75% |
| Shadowling Stalkers | 0 | n/a | 153 | 25% |
| Death: The Man in Black | 57 | 46% | 93 | 37% |
| Aurium Plate | 48 | 67% | 85 | 85% |
| The Festival of Radiant Dawn | 26 | 69% | 103 | 64% |
| Vraxxis, the Hungering Cinder | 0 | n/a | 119 | 73% |
| Vel, the Emberlight | 4 | 50% | 114 | 76% |
| Kaipo Nuvane | 72 | 56% | 43 | 30% |
| The Solar Flare Cannon | 84 | 79% | 28 | 57% |
| The Tower: The Fallen Isle | 73 | 14% | 39 | 90% |
| The High Priestess: Nitriti | 74 | 27% | 37 | 32% |
| Taranis, the Laughing Crow | 54 | 37% | 52 | 19% |
| Ilzaren, the Resplendent King | 88 | 50% | 17 | 65% |
| Cernis, the Horned Forest Lord | 95 | 44% | 5 | 40% |
| The Empress: Que’Rubra | 69 | 54% | 28 | 39% |
| Archmage Severyn Caldreth | 88 | 58% | 4 | 50% |
| The Hanged Man: Rorik Flamebeard | 82 | 84% | 8 | 75% |
| Tidecaller: Low Tide | 21 | 86% | 68 | 82% |
| Judgement: The Septor’s Chorus | 3 | 67% | 86 | 67% |
| Portal of Autumn Leaves | 1 | 100% | 87 | 34% |
| The Hermit: Luigi Bonemoon | 15 | 60% | 72 | 78% |
| Lake Mirrara | 29 | 34% | 57 | 32% |
| The Magician: Luigi Castanata | 0 | n/a | 86 | 42% |
| Fin & Bin | 27 | 37% | 58 | 40% |
| Kojin, the Fiery Whip | 81 | 62% | 1 | 0% |
| The Mirrored Dome | 0 | n/a | 78 | 68% |
| Brookskippers | 27 | 67% | 47 | 64% |
| Bill Boggs, Cartel Runner | 44 | 80% | 29 | 69% |
| The Fool: Daxon Lamn | 0 | n/a | 73 | 66% |
| Inspector Bramble | 0 | n/a | 71 | 31% |
| The Chariot: The Solar Wind | 32 | 66% | 39 | 72% |
| The Sunken Empire Rises | 0 | n/a | 68 | 46% |
| Merrick Blackwater | 48 | 52% | 18 | 11% |
| The Garbage Boyz | 57 | 47% | 9 | 44% |
| Marin, Spirit of Ocean Waves | 14 | 79% | 50 | 86% |
| Wheel of Fortune: The Orrery | 5 | 60% | 56 | 88% |
| The Heartwood | 7 | 0% | 53 | 74% |
| The Lovers: Althea & Caelum | 54 | 44% | 1 | 100% |
| Calvera Blackwake, the Mad Pirate Queen | 16 | 69% | 33 | 64% |
| The Star: Lirielle Starwhisper | 6 | 33% | 43 | 51% |
| Tyserion I, the Golden Blade | 47 | 70% | 1 | 100% |
| Justice: Dagan, Sovereign of the Scales | 19 | 68% | 24 | 29% |
| Lorien of the Hand | 3 | 0% | 38 | 50% |
| Bimp Bossington | 40 | 88% | 0 | n/a |
| The Emperor: Izuriel Sakazarac II | 21 | 67% | 13 | 8% |
| The World: The Eldspyre | 26 | 62% | 2 | 0% |
| The Serattan Oath-Coin | 26 | 50% | 0 | n/a |
| Strength: Grimore | 23 | 26% | 0 | n/a |
| The Libra Stellae | 15 | 40% | 5 | 40% |

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
| Daxon Lamn | 75% | 78% | +3 |
| Lirielle Starwhisper | 32% | 32% | +0 |
| Luigi Bonemoon | 43% | 42% | -2 |
| Rorik Flamebeard | 70% | 68% | -2 |
| Lord-Provost Elaina Masque | 56% | 56% | +0 |
| Imperator Amegmon Shazz | 26% | 26% | +1 |

With 200 games per hero, a swing under about 7 points is inside the noise.
