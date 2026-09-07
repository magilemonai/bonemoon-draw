# Shazz against Daxon: a first look

The baseline has Shazz winning 3 percent of games against Daxon. A focused probe on the same planner (60 games, 30 seed pairs, both seats, 2026-09-07, code c283f90) puts numbers on how the games go. None of this decides whether the deck or the planner is at fault; it says where to look.

| Per game | Shazz | Daxon |
|---|---|---|
| Wins | 2 of 60 | 58 of 60 |
| Attacks | 2.5 | 5.8 |
| Cards played | 7.0 | 7.8 |
| Ability uses (Wear a Face, 2 Spark) | 0.40 | |
| Burns | 0.35 | |
| Spark left unspent at end of turn | 0.29 | |

Shazz's losses: 51 to an attack, 4 to an Omen, 3 to the Bone Moon, on average in round 7.

What the traces show:

- Shazz plays nearly everything Reversed. Pride gives Reversed Figures +1 Attack, and the planner takes it, but Reversed swaps a Figure's numbers: the 1/3 Voren becomes a 4/1, the 1/4 Pylon a 5/1. Every body Shazz puts down is a one-hit body, and Daxon's cheap Figures and Relics hit every turn.
- Shazz attacks half as often as Daxon. Bodies with 1 Health do not survive to attack twice, and the planner will not trade them into Daxon's Guards.
- Wear a Face is used less than once every two games. The one line that makes Shazz's plan work (a Reversed body swings, then turns over to a sturdy face, or an enemy turns over to die) is rarely found. The tactical fixture for the wounded flip passes in isolation, so the planner can see it one step out; in a real game the 2 Spark goes to a card instead.
- Shazz's starter list is top-heavy: six cards cost 6 or more, against Daxon's list where twenty of thirty cost 3 or less and Relics cost 1 less again.

Three ways to separate the causes, none done yet:

1. Alternate lists: a low-curve Shazz (no card over 6) against Daxon on the same seeds. The `shazz-boscoe` variant is a first step and moved nothing.
2. Tactical fixtures: the wounded flip passes; add the two-step line (swing Reversed, then flip to survive) and the choice between a Reversed play and a flip with the same 2 Spark.
3. Human hands: Shazz in both seats, matched seeds, by someone who knows the flip is the plan. That is the bullet on the board.
