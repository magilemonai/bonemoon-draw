# Experiment: seat-token

Seat: the second player opens with a Spent Sphere, a one-shot 0-cost Omen that gives 1 Spark this turn (usable any turn).

600 games: 15 hero pairings, 20 seed pairs each, both seats, each hero keeping its own deck order across the seat swap. Planner depth 2, beam 5, 2 sampled worlds. Run in 53 seconds.

Code c283f90 with uncommitted changes in src or scripts. Rules 2026-09-06. Starter decks as shipped (daxon 30, lirielle 30, luigi 30, rorik 30, masque 30, shazz 30). Seeds: 20260906 + pairing x 104729 + pair x 7919, the seat swap at seed + 1, deck orders hashed per hero. Stamped 9/7/2026, 17:39:02 EDT.

Average length 8.0 rounds. 0 draws. First seat won 58% of decided games. The Bone Moon was up at the end of 24% of games.

## Heroes

| Hero | Win rate | Games | First seat | Second seat | Heal per game | Burns per game | Upright plays | Reversed plays |
|---|---|---|---|---|---|---|---|---|
| Daxon Lamn | 78% | 200 | 84% | 72% | 3.6 | 0.14 | 41% | 59% |
| Lirielle Starwhisper | 28% | 200 | 35% | 20% | 0.2 | 1.84 | 44% | 56% |
| Luigi Bonemoon | 41% | 200 | 50% | 31% | 5.3 | 1.21 | 48% | 52% |
| Rorik Flamebeard | 69% | 200 | 81% | 57% | 10.2 | 0.65 | 40% | 60% |
| Lord-Provost Elaina Masque | 62% | 200 | 71% | 53% | 3.0 | 0.69 | 44% | 56% |
| Imperator Amegmon Shazz | 23% | 200 | 28% | 18% | 0.2 | 0.55 | 33% | 67% |

## Matchups (row hero win rate against column hero, both seats combined)

| | Daxon | Lirielle | Luigi | Rorik | Lord-Provost | Imperator |
|---|---|---|---|---|---|---|
| Daxon |  | 85% | 88% | 60% | 65% | 93% |
| Lirielle | 15% |  | 23% | 20% | 15% | 65% |
| Luigi | 13% | 78% |  | 25% | 20% | 68% |
| Rorik | 40% | 80% | 75% |  | 58% | 93% |
| Lord-Provost | 35% | 85% | 80% | 43% |  | 68% |
| Imperator | 8% | 35% | 33% | 8% | 33% |  |

## Game length

- Rounds 5 to 6: 146
- Rounds 7 to 8: 229
- Rounds 9 to 10: 152
- Rounds 11 to 12: 60
- Rounds 13 and up: 13

## How games ended (the blow that took the loser to zero)

- attack: 410
- omen: 100
- boneMoon: 76
- fatigue: 1
- ability: 4
- other: 9

Per hero, what they lost to:

| Hero | attack | omen | Bone Moon | fatigue | ability | other |
|---|---|---|---|---|---|---|
| Daxon Lamn | 28 | 11 | 5 | 0 | 0 | 0 |
| Lirielle Starwhisper | 99 | 29 | 10 | 1 | 3 | 3 |
| Luigi Bonemoon | 79 | 18 | 22 | 0 | 0 | 0 |
| Rorik Flamebeard | 45 | 5 | 10 | 0 | 0 | 2 |
| Lord-Provost Elaina Masque | 49 | 14 | 12 | 0 | 0 | 1 |
| Imperator Amegmon Shazz | 110 | 23 | 17 | 0 | 1 | 3 |

## Face usage by card (plays and win rate when played on that face; at least 10 plays)

| Card | Upright plays | Upright win | Reversed plays | Reversed win |
|---|---|---|---|---|
| Spent Sphere | 589 | 42% | 0 | n/a |
| Eldertech Sphere | 192 | 23% | 272 | 36% |
| Captain Elira Voss | 0 | n/a | 445 | 75% |
| Mordeaux, the Clockwork Man | 252 | 34% | 91 | 19% |
| Dawn Over Aurengate | 234 | 72% | 105 | 58% |
| The Oondray | 3 | 33% | 326 | 47% |
| Wisplight | 72 | 42% | 239 | 46% |
| General Vath Enverez | 148 | 46% | 162 | 80% |
| Mr. Boscoe | 27 | 19% | 264 | 34% |
| Kaipo’s Pearl | 13 | 77% | 262 | 67% |
| Project Tamori | 165 | 30% | 110 | 34% |
| Pommeroy | 99 | 30% | 168 | 29% |
| Null-Zone Pylon | 144 | 51% | 119 | 29% |
| Yvette Mirthwell | 246 | 23% | 1 | 0% |
| Braxon Lamn | 90 | 81% | 156 | 70% |
| The Guard Post | 65 | 51% | 174 | 75% |
| The Sleepless Sentry | 202 | 36% | 32 | 63% |
| Mr. Zero | 2 | 0% | 224 | 45% |
| Elder Voren Nightbloom | 7 | 0% | 209 | 23% |
| Eva’s Kitchen | 141 | 57% | 72 | 86% |
| Zalian Fisherman | 146 | 55% | 56 | 36% |
| Brog | 1 | 0% | 198 | 41% |
| Kaelen Goldeneye | 3 | 100% | 192 | 52% |
| Thorn of the Bladed Wind | 184 | 49% | 0 | n/a |
| Archivist Esmerelda Gotch | 4 | 100% | 177 | 42% |
| The Sun: The Spark | 61 | 74% | 87 | 69% |
| The Festival of Radiant Dawn | 27 | 48% | 120 | 73% |
| Shadowling Stalkers | 0 | n/a | 147 | 22% |
| Temperance: Brother Soren | 2 | 0% | 143 | 80% |
| Aurium Plate | 46 | 83% | 90 | 88% |
| Death: The Man in Black | 38 | 32% | 89 | 37% |
| Kaipo Nuvane | 86 | 56% | 38 | 37% |
| Vraxxis, the Hungering Cinder | 0 | n/a | 123 | 72% |
| Taranis, the Laughing Crow | 61 | 18% | 61 | 21% |
| Vel, the Emberlight | 5 | 100% | 113 | 75% |
| The Solar Flare Cannon | 84 | 76% | 31 | 68% |
| Ilzaren, the Resplendent King | 99 | 64% | 9 | 89% |
| Archmage Severyn Caldreth | 100 | 50% | 7 | 57% |
| Fin & Bin | 31 | 29% | 74 | 30% |
| Kojin, the Fiery Whip | 100 | 59% | 0 | n/a |
| The High Priestess: Nitriti | 67 | 31% | 31 | 39% |
| The Empress: Que’Rubra | 71 | 41% | 27 | 41% |
| Cernis, the Horned Forest Lord | 88 | 48% | 6 | 33% |
| Judgement: The Septor’s Chorus | 0 | n/a | 93 | 69% |
| The Tower: The Fallen Isle | 62 | 16% | 30 | 90% |
| The Magician: Luigi Castanata | 0 | n/a | 90 | 44% |
| The Hermit: Luigi Bonemoon | 16 | 63% | 73 | 78% |
| Lake Mirrara | 29 | 41% | 58 | 19% |
| Portal of Autumn Leaves | 1 | 100% | 82 | 30% |
| The Mirrored Dome | 2 | 0% | 80 | 65% |
| The Hanged Man: Rorik Flamebeard | 76 | 78% | 5 | 80% |
| The Fool: Daxon Lamn | 0 | n/a | 80 | 73% |
| Merrick Blackwater | 59 | 46% | 17 | 35% |
| Brookskippers | 20 | 70% | 53 | 60% |
| The Heartwood | 8 | 25% | 62 | 81% |
| The Sunken Empire Rises | 0 | n/a | 69 | 38% |
| Inspector Bramble | 0 | n/a | 67 | 34% |
| The Chariot: The Solar Wind | 24 | 46% | 42 | 79% |
| Bill Boggs, Cartel Runner | 41 | 83% | 22 | 77% |
| Tidecaller: Low Tide | 2 | 50% | 59 | 75% |
| The Garbage Boyz | 49 | 51% | 7 | 14% |
| The Lovers: Althea & Caelum | 52 | 40% | 2 | 50% |
| The Serattan Oath-Coin | 54 | 43% | 0 | n/a |
| Marin, Spirit of Ocean Waves | 11 | 82% | 40 | 83% |
| Tyserion I, the Golden Blade | 49 | 80% | 0 | n/a |
| Calvera Blackwake, the Mad Pirate Queen | 21 | 62% | 26 | 62% |
| Wheel of Fortune: The Orrery | 7 | 43% | 39 | 85% |
| Bimp Bossington | 44 | 61% | 0 | n/a |
| Lorien of the Hand | 2 | 0% | 41 | 37% |
| The Star: Lirielle Starwhisper | 5 | 40% | 36 | 58% |
| Justice: Dagan, Sovereign of the Scales | 14 | 79% | 27 | 59% |
| The Emperor: Izuriel Sakazarac II | 27 | 56% | 14 | 14% |
| The World: The Eldspyre | 36 | 53% | 4 | 25% |
| Strength: Grimore | 29 | 34% | 0 | n/a |
| The Moon: The Bone Moon | 12 | 42% | 2 | 50% |
| The Libra Stellae | 7 | 14% | 7 | 14% |

## Sample traces (first 14 plays)

```
sig-daxon vs sig-lirielle seed 20365635: winner sig-daxon in round 8 by attack
  r1 p1 plays Spent Sphere (upright)
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
```

```
sig-lirielle vs sig-daxon seed 20365636: winner sig-daxon in round 5 by attack
  r1 p1 plays Spent Sphere (upright)
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
sig-daxon vs sig-lirielle seed 20373554: winner sig-daxon in round 7 by attack
  r1 p1 plays Wisplight (reversed)
  r2 p0 plays Captain Elira Voss (reversed)
  r2 p1 plays Pommeroy (reversed)
  r3 p0 plays Captain Elira Voss (reversed)
  r3 p1 plays Spent Sphere (upright)
  r3 p1 plays Thorn of the Bladed Wind (upright)
  r4 p0 plays Temperance: Brother Soren (reversed)
  r4 p1 plays The Lovers: Althea & Caelum (upright)
  r5 p0 plays Eva’s Kitchen (reversed)
  r5 p1 plays Taranis, the Laughing Crow (reversed)
  r5 p1 plays Wisplight (upright)
  r6 p0 plays The Hanged Man: Rorik Flamebeard (upright)
  r6 p1 plays The Empress: Que’Rubra (upright)
  r7 p0 plays Eva’s Kitchen (reversed)
```

## Change against the baseline

Average length 8.2 to 8.0 rounds.

| Hero | Baseline | This run | Change |
|---|---|---|---|
| Daxon Lamn | 75% | 78% | +3 |
| Lirielle Starwhisper | 32% | 28% | -4 |
| Luigi Bonemoon | 43% | 41% | -3 |
| Rorik Flamebeard | 70% | 69% | -1 |
| Lord-Provost Elaina Masque | 56% | 62% | +7 |
| Imperator Amegmon Shazz | 26% | 23% | -3 |

With 200 games per hero, a swing under about 7 points is inside the noise.
