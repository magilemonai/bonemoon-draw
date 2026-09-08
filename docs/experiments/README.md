# The experiment set, 2026-09-07

All eleven runs from one tree: code b077b9e with uncommitted changes (the day's interface work and this script; no engine or card file differed), rules 2026-09-06, planner depth 2, beam 5, 2 sampled worlds, 600 games each on the same seed schedule, both seats. Stamped 9/7/2026, 20:01:09 EDT. Every JSON keeps each game's outcome, so a variant is compared with the baseline game by game, the same pairing, seed, and seat under both rules. The earlier runs (two older planners) are kept in `2026-09-06-earlier-planners/` for comparison only.

Screening targets, decided 2026-09-07: first seat 45 to 55 percent; each Significator 40 to 60 percent overall. Both are diagnostics on bot play. Neither is an instruction to change a card by itself.

## Overall

| Run | Change | First seat | Rounds | Daxon | Lirielle | Luigi | Rorik | Masque | Shazz |
|---|---|---|---|---|---|---|---|---|---|
| baseline | Shipped rules and decks. | 64% | 8.2 | 75% | 32% | 43% | 70% | 56% | 26% |
| rorik-conditional | Forge of Kojin heals 1 at end of turn only if a friendly Figure died this turn. | 66% | 8.1 | 76% | 34% | 42% | 62% | 58% | 28% |
| mulligan | Partial mulligan before the first turn (AI sets aside all but one card costing 5 or more). | 64% | 8.2 | 70% | 24% | 46% | 72% | 66% | 22% |
| seat-nodraw | the first player draws no card on turn one (opening hands 4 and 5, then draws as usual). | 61% | 8.2 | 77% | 22% | 42% | 73% | 56% | 30% |
| seat-token | the second player opens with a Spent Sphere, a one-shot 0-cost Omen that gives 1 Spark this turn (usable any turn). | 58% | 8.0 | 78% | 28% | 40% | 69% | 62% | 23% |
| seat-spark | the second player has 1 extra Spark on their first turn only. | 60% | 8.0 | 78% | 29% | 42% | 68% | 58% | 25% |
| mana-draw | gain 3 Spark this turn and draw a card. | 64% | 8.2 | 76% | 32% | 42% | 70% | 56% | 26% |
| tidecaller-gale | +2/+1, Windborne, Gale (was +3/+1 Windborne). | 64% | 8.1 | 78% | 32% | 42% | 68% | 56% | 26% |
| lirielle-thorn | Inspector Bramble becomes a second Thorn of the Bladed Wind. | 65% | 8.1 | 75% | 36% | 42% | 69% | 55% | 24% |
| shazz-boscoe | The Mirrored Dome becomes a second Mr. Boscoe. | 65% | 8.3 | 74% | 32% | 42% | 69% | 56% | 26% |
| shazz-lowcurve | the nine cards costing 6 or more become second copies of the Oondray, Yvette, Mr. Boscoe, the Pylon, Taranis, Mordeaux, the Sentry, and two Portals of Autumn Leaves. | 65% | 8.2 | 76% | 33% | 44% | 69% | 54% | 24% |

## Paired against the baseline

Each cell is the mean change in that hero's win rate over the same 200 games, in points, with a 95 percent interval from the per-game differences. An interval that includes zero is not shown to be a change by this run; a star marks one that excludes it.

| Run | Daxon | Lirielle | Luigi | Rorik | Masque | Shazz |
|---|---|---|---|---|---|---|
| rorik-conditional | +0.5 (-1 to +2) | +3.0 (+1 to +5) * | -1.0 (-2 to +0) | -7.0 (-11 to -3) * | +2.0 (+0 to +4) * | +2.5 (+0 to +5) * |
| mulligan | -5.5 (-13 to +2) | -7.5 (-15 to -0) * | +3.0 (-5 to +11) | +2.5 (-5 to +10) | +10.5 (+3 to +18) * | -3.0 (-10 to +4) |
| seat-nodraw | +2.0 (-4 to +8) | -10.0 (-16 to -4) * | -0.5 (-7 to +6) | +3.5 (-3 to +10) | +1.0 (-6 to +8) | +4.0 (-2 to +10) |
| seat-token | +3.0 (-3 to +9) | -4.0 (-11 to +3) | -2.5 (-10 to +5) | -0.5 (-7 to +6) | +6.5 (-1 to +14) | -2.5 (-9 to +4) |
| seat-spark | +3.5 (-3 to +10) | -2.5 (-9 to +4) | -1.0 (-8 to +6) | -2.0 (-9 to +5) | +2.5 (-4 to +9) | -0.5 (-6 to +5) |
| mana-draw | +0.5 (-0 to +1) | +0.0 (+0 to +0) | -1.0 (-2 to +0) | +0.5 (-0 to +1) | +0.0 (+0 to +0) | +0.0 (+0 to +0) |
| tidecaller-gale | +2.5 (-1 to +6) | +0.0 (-2 to +2) | -1.5 (-4 to +1) | -1.5 (-3 to +0) | +0.0 (-1 to +1) | +0.5 (-0 to +1) |
| lirielle-thorn | +0.0 (+0 to +0) | +4.0 (-0 to +8) | -1.0 (-2 to +0) | -0.5 (-2 to +1) | -0.5 (-3 to +2) | -2.0 (-4 to +0) |
| shazz-boscoe | -0.5 (-1 to +0) | +0.5 (-2 to +3) | -1.0 (-2 to +0) | -0.5 (-1 to +0) | +1.0 (-1 to +3) | +0.5 (-4 to +5) |
| shazz-lowcurve | +0.5 (-0 to +1) | +1.5 (-1 to +4) | +1.5 (-2 to +5) | -0.5 (-3 to +2) | -1.5 (-5 to +2) | -1.5 (-8 to +5) |

## Against the targets

- First seat in the baseline: 64%. No seat variant reaches 55; the Spent Sphere moves it most, to 58%, and none of its per-hero changes clears the noise.
- Daxon: 75% overall, outside 40 to 60. Second seat 66%.
- Lirielle: 32% overall, outside 40 to 60. Second seat 10%.
- Rorik: 70% overall, outside 40 to 60. Second seat 58%.
- Shazz: 26% overall, outside 40 to 60. Second seat 14%.
- The low-curve Shazz list: Shazz 24% overall (-1.5 points paired, -8 to +5); against Daxon 0% (baseline 2%).

## Matchups in the baseline (row beats column, both seats)

| | Daxon | Lirielle | Luigi | Rorik | Masque | Shazz |
|---|---|---|---|---|---|---|
| Daxon |  | 75% | 70% | 58% | 75% | 98% |
| Lirielle | 25% |  | 42% | 15% | 30% | 45% |
| Luigi | 30% | 58% |  | 35% | 25% | 68% |
| Rorik | 42% | 85% | 65% |  | 65% | 90% |
| Masque | 25% | 70% | 75% | 35% |  | 72% |
| Shazz | 2% | 55% | 32% | 10% | 28% |  |

Each run's own report (`<name>.md`) has face usage by card, how games ended, sample traces, and its own paired table; the JSON beside it is the data, outcomes included.
