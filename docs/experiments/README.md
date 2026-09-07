# The experiment set, 2026-09-07

All ten runs from one tree: code c283f90 with uncommitted changes, rules 2026-09-06, planner depth 2, beam 5, 2 sampled worlds, 600 games each on the same seed schedule. Stamped 9/7/2026, 17:35:29 EDT. The earlier runs (two older planners) are kept in `2026-09-06-earlier-planners/` for comparison only.

Screening targets, decided 2026-09-07: first seat 45 to 55 percent; each Significator 40 to 60 percent overall. Both are diagnostics on bot play. Neither is an instruction to change a card by itself. With 200 games per hero a swing under about 7 points is inside the noise.

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

## Against the targets

- First seat in the baseline: 64%, outside 45 to 55. Of the three seat variants, the one that moves it most without lifting the strongest deck further is the one to trial with people.
- Daxon: 75% overall, outside 40 to 60. Second seat 66%.
- Lirielle: 32% overall, outside 40 to 60. Second seat 10%.
- Rorik: 70% overall, outside 40 to 60. Second seat 58%.
- Shazz: 26% overall, outside 40 to 60. Second seat 14%.

## Matchups in the baseline (row beats column, both seats)

| | Daxon | Lirielle | Luigi | Rorik | Masque | Shazz |
|---|---|---|---|---|---|---|
| Daxon |  | 75% | 70% | 58% | 75% | 98% |
| Lirielle | 25% |  | 42% | 15% | 30% | 45% |
| Luigi | 30% | 58% |  | 35% | 25% | 68% |
| Rorik | 42% | 85% | 65% |  | 65% | 90% |
| Masque | 25% | 70% | 75% | 35% |  | 72% |
| Shazz | 2% | 55% | 32% | 10% | 28% |  |

Each run's own report (`<name>.md`) has face usage by card, how games ended, and sample traces; the JSON beside it is the data.
