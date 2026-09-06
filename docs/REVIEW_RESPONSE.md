# Response to the design critique of 6 September 2026

The critique (`docs/reviews/2026-09-06-handoff/BONEMOON_DESIGN_HANDOFF.md`) read the packet and never touched the engine. This document checks each of its load-bearing claims against the implementation, records the rules decisions and bug fixes that came out of that, describes the planner improvements, reports a reproducible baseline, and ends with one concrete first patch. Everything under "Tests run" was run; everything under "Proposed" was not.

## 1. Verification against the engine

| Report claim | Engine, as built | Finding |
|---|---|---|
| T01: wounds persist across a flip; a 1/8 Heartwood with one wound dies as 8/1; a 3/2 Oondray with one wound lives as 2/3 with 2 left | Same. Damage is stored as a wound count; health is the new face's maximum minus wounds. | Correct. Test added. |
| T02: Sentry played Reversed attacks, is flipped Upright, and the dissolution clause is gone | Same. A Figure's effects come from its current face, and the Reversed face carries no Fixed, so Shazz's flip is legal. Shazz's Sentry hits for 6. Sphere Reversed leaves it 3/6 Guard, Fixed. | Correct. Test added. The report's withdrawal of "remove dissolution" is right; the puzzle is real. |
| T02 assumption: dissolving is a death | It is: `die` goes through the normal death check, so Vraxxis grows and Last Rites fire. | Correct. Test added. |
| T03: one Mordeaux copies Liquid Mana; 5 Spark, cast for 4, ends at 7; temporary Spark uncapped | Same. Temporary Spark can exceed the maximum and ten. | Correct. Test added. The rule is now written down. |
| T03: copy timing, cost, cast status, two engines, countered original | Copy happens after the original resolves, costs nothing, is not a cast (no Magician ping, no second engine wakes), once per turn per Mordeaux (two Mordeaux make two copies), and a countered Omen makes no copy. | The report assumed "once per eligible trigger"; it is once per turn per Mordeaux, which the card says. Tests added for all five. |
| T03 open question: what a copy does when its target is gone | Was: the copy hit whatever now stood in the lane (a Raccoon that replaced Bimp, for instance). | **Bug, fixed.** Targets are now exact Figures; the copy fizzles. Test added. |
| T04: Daxon turn two, Guard Post Reversed plus Pearl Reversed for 2 total is a 5/1 Windborne, Veiled | Same (Pearl costs 0 for Daxon). Elira Reversed's 2 damage kills it. | Correct. |
| T05: Brookskippers moves the Guard from Present to Past, so Merrick in Future hits the face for 4 | Guard redirection matched. But the engine had no rule for where a forced move goes and pushed enemy Figures toward Future, straight into Merrick's lane. | **Undefined rule, now defined:** an enemy Figure pushed by an effect goes toward Past if that lane is open, else toward Future; your own goes toward Present. Test added. |
| T06: Gale into an empty lane next to a Guard is intercepted | Same. | Correct. Test added. |
| T08/T14: bite, then active heal, then passive heal, then enemy damage; healing caps at 20; death at zero is immediate | Order matched and the cap matched. Death was not immediate: the game-over check ran at the end of the action, so a start-of-turn heal (Grimore at rest) could rescue a Significator the Bone Moon had just killed, and an Omen that dealt lethal then healed could too. | **Bug, fixed.** A Significator at 0 loses at once. Tests added for the Moon and for mid-Omen lethal. |
| T10: Lirielle at a Full Moon with six cards draws three, burns one; Lovers Reversed on Wisplight burns two more | Same. Sacrifice is a death; Wisplight's Last Rite draws. Burns are now counted per game. | Correct. Test added. |
| T11: Calvera Upright against a one-card hand | Was undefined in text. Engine: fewer than two cards means 5 damage and the hand is untouched. | Defined and written on the card side of the rules. Test added. Reversed at 3 own Health does kill its controller; test added. |
| "Enters Reversed" placement is ambiguous | The engine treats it as a card property: the keyword on either face forces the Reversed face at play time. Vraxxis and the Shadowlings cannot be played Upright. | Correct as intended; documented. |
| Yvette Upright should be able to strip a Veiled Figure | She could not: Veiled excluded her targets like any other effect, so the card's reason to exist did nothing. | **Bug, fixed.** Her Upright face pierces Veiled; the card says so. No other Arrive was exempted. Test added. |
| Aegis: one-shot grant versus recharging keyword, multiple sources, zero-damage events | Grants were one-shot, carried Aegis recharged... after every card play and every death, by either player. A Relic holder re-shielded whenever anyone played anything. | **Bug, fixed.** Carried Aegis (a Relic, a face, Rorik's aura) is on when the Figure enters and recharges at the start of its controller's turn only. Test added. |
| Hanged Man's aura under area damage must not depend on lane order | Each neighbor holds its own shield; area damage spends each one. | Correct. Test added. |
| Global flip plus the Oath-Coin; when wounds are checked; second flips on a dead target | Was sequential by lane, wounds checked at the end, so a Figure at 0 could still be flipped again by a linked trigger. | **Defined and fixed.** Wounds are checked the moment a face turns; a Figure that dies from its flip fires no triggers. A global flip turns every Figure at once, checks wounds, then fires survivors' triggers in lane order, yours first. Test added. |
| Rekindle: death or prevented death; is the return a flip; Fixed | Prevented death: no Last Rite, no death triggers, once per Figure. The return is not a flip and Fixed does not stop it. | Documented. Test added (Vraxxis does not grow). |
| Bone Moon Reversed "rises now" | Rose immediately, which gave the caster's opponent a first bite of 1 and the caster a first bite of 2. | **Changed to the report's proposal:** rises at the start of the next round, 1 for each, never delays the natural onset, no effect if already up. Card text updated. Test added. |
| Damage batches and Last Rite order | Deaths were checked at the end of an action, so a Mordeaux copy resolved before the original's Last Rites. | **Changed:** deaths are checked after every effect. |
| Summoned Fin & Bin triggering their Arrive discount off the Empress | They do not: Arrive fires only when played from hand. | Documented as intended. |
| The packet's worked example flips Fin & Bin after they died | The report is right. | Example rewritten; it now ends with the Heartwood lethal flip. |
| Win rates in the packet (Rorik 85%, Daxon 15%) | Those came from the old one-step planner; the report was right to distrust them. Under the new planner Daxon is 76% and Rorik 71%. | Stale. Replaced by the baseline below. |

The report's stated assumptions that were simply confirmed: printed stats swap on a flip while Relic and granted modifiers keep their meaning; hero healing caps at 20; Figures need an empty lane, so Vel cannot be played onto a full board while the Cannon can be cast; Brog costs 2.

Consequential choices made while resolving these, with the alternative each rejects:

- **Targets are exact.** An effect follows the Figure it chose. The alternative (lane targeting) let a copy or a delayed effect hit a token that arrived mid-resolution, which is unreadable at the table.
- **An attack stops if its defender leaves before the blow.** The alternative (retarget to the face) made Tidecaller's cleansing flip into hidden face damage. Stopping keeps "the defender died to the flip" as its own visible result.
- **Forced moves have a direction.** Giving the caster a choice would add a second targeting step to three cards; a fixed direction is legible and makes Brookskippers' lethal line the same every time.
- **Carried Aegis recharges only on your own turn.** The alternative (recharge at any refresh point) made a 5-Spark Relic a near-permanent shield.
- **The Moon Reversed waits a round.** The card says so now. It costs the card its "now" drama and buys symmetry.

## 2. Tests run

- Engine: 48 tests, all passing. Twenty-three of them are the review scenarios and the resolution rules above (`src/engine/review.test.ts`); four are planner behaviors (`src/ai/ai.test.ts`).
- Planner tests: Shazz attacks with the Reversed Sentry and then flips it; Brookskippers moves the Guard toward Past and Merrick takes the lethal swing; the planner does not cast a three-card draw into a full hand; with a playable Figure in hand and a full board it trades a Wisplight to free the lane.
- Simulation: a 600-game schedule, ten times (the baseline and nine single-variable experiments). Fifteen unordered hero pairings, twenty seed pairs each, both seats, each hero keeping its own deck order across the seat swap. One run takes about twenty seconds.

## 3. The planner

`src/ai/ai.ts` is now a two-step planner: every legal action is simulated, the best few plus the best action of each kind get a second look at what they enable, and the position is scored with a heuristic that knows about lethal, next-turn face threats through Guards, Figures that dissolve at end of turn, hand burns, lane congestion, and the deferred worth of ongoing text, Last Rites, auras, and Rekindle.

Its limits matter for reading the tables. Face usage measures the planner's taste. A human may value a face the bot never plays: it still never plays Captain Elira Voss Upright (Rekindle) because a 2-damage Arrive scores at once, and it plays Wisplight Reversed four times out of five. Improving the deferred-value terms moved Mordeaux from 10 Upright plays to 251, so the bias is fixable, but the columns below describe the bot until a human confirms them.

## 4. Baseline (`docs/BASELINE.md`, `docs/experiments/baseline.json`)

600 games. Average length 8.1 rounds (5 to 6: 131 games; 7 to 8: 250; 9 to 10: 160; 11 to 12: 52; 13 and up: 7). The Bone Moon was up at the end of 25% of games and delivered the killing blow in 32 (5%). Attacks ended 412 games, Omens 129. No fatigue deaths.

| Hero | Win rate | First seat | Second seat | Heal per game | Burns per game |
|---|---|---|---|---|---|
| Daxon | 76% | 85% | 66% | 3.8 | 0.22 |
| Rorik | 71% | 83% | 59% | 9.7 | 0.65 |
| Masque | 54% | 66% | 42% | 2.3 | 0.77 |
| Luigi | 44% | 63% | 24% | 4.9 | 1.27 |
| Lirielle | 30% | 51% | 8% | 0.1 | 2.12 |
| Shazz | 27% | 40% | 13% | 0.1 | 0.71 |

Three readings:

1. **The seat is the largest effect in the game.** The first player wins 65% of decided games. Every hero wins far more going first, and the slow decks collapse going second: Lirielle 8%, Shazz 13%. The report's T12 asked for seat evidence before adding a second-player bonus. This is that evidence.
2. **Rorik's free healing is real and large.** 9.7 Health healed per game, about a third of his starting total, most of it from the passive.
3. **Lirielle burns two cards a game.** Her Full Moon extra draw feeds a full hand on a full board. The report's T10 was the right diagnosis.

The matchup matrix, the lethal-source table per hero, the per-card face usage, and three sample traces are in `docs/BASELINE.md`.

## 5. Experiments run (one variable each, same 600-game schedule)

| Experiment | What changed | Result against the baseline |
|---|---|---|
| `seat-token` | Second player opens with a Spent Sphere: a 0-cost one-shot Omen, gain 1 Spark this turn, usable any turn | First-seat wins 65% to **58%**. Daxon +4, Masque +7, Shazz −5, others within noise. |
| `seat-spark` | Second player has +1 Spark on their first turn only | First-seat 65% to 61%. Daxon +5, Rorik −6. |
| `seat-nodraw` | First player draws no card on turn one | First-seat 65% to 62%. Lirielle −7, Luigi −4. |
| `rorik-conditional` | Forge of Kojin heals only if a friendly Figure died this turn (the report's T09 wording) | Rorik **71% to 63%**. Nobody else moved more than 2. |
| `mulligan` | Partial mulligan, AI policy: keep one card costing 5 or more | Masque +12, Lirielle −6, Daxon −5, seat unchanged at 66%. Noisy; the AI policy is crude. |
| `mana-draw` | Liquid Mana Upright also draws a card | No hero moved more than 1. |
| `tidecaller-gale` | Tidecaller Reversed +2/+1, Windborne, Gale | Daxon +4, Rorik −3. Noise. |
| `lirielle-thorn` | Bramble becomes a second Thorn | Lirielle +2. Noise. |
| `shazz-boscoe` | Mirrored Dome becomes a second Boscoe | Shazz −2. Noise. |

With 200 appearances per hero, a swing under about 7 points is inside the noise.

## 6. Proposed tests, not run

- Human sessions with Zach on the three plans the report names (Shazz's Sentry tricks, Daxon's attachment pressure, Luigi's Omen engine), seats swapped, with the questions the report suggests.
- A wider schedule (40 seed pairs, 1,200 games) once a patch candidate exists, and per-matchup confidence intervals.
- A three-step planner for the lines that need it (play, attack, flip) and a mulligan policy that reads the curve rather than the cost.
- A mulligan interface for humans.
- Telemetry the harness does not yet record: healing wasted at the cap, lane-blocked turns, Relic losses with their holders, and the round the Moon rose.

## 7. Independent judgment and the first patch

The report's instinct was right on the order of work: rules first, then the planner, then one experiment at a time. It was also right to withdraw the bigger Liquid Mana, the Sentry change, the Pearl buff, the outer-lane Masque passive, the Empire Rises rider, and the two-heals-per-round Rorik. None of those was implemented.

Where I part from it: the report puts a partial mulligan first. The measurements say the seat is the first problem. A 65/35 split is larger than any hero gap, and it is the thing that makes Lirielle and Shazz look broken. Fix the seat and remeasure. The hero picture will change.

**First patch, in two parts.**

1. **Ship the rules fixes** already in the engine: exact targets, immediate loss at 0, deaths after every effect, wound checks on flips with batched global flips, Aegis recharge on your own turn, Yvette piercing Veiled, forced-move direction, the Moon Reversed waiting a round, an attack stopping when its defender leaves. These are corrections with no balance intent, and every one has a test and a line in the rulebook.

2. **One balance experiment: the Spent Sphere for the second player.** The problem it solves is the 65/35 seat split. The evidence is the three seat runs: the token flattens the split most (to 58/42), and it does so without an unconditional first-turn tempo bump, because the second player chooses when to spend it. What it might break: the report's T12 line still exists (Daxon can spend it on turn one for a 5/1 Windborne on his first turn), and in the run the fast decks gained more from it than the slow ones (Daxon +4, Masque +7, Shazz −5). That is why it is an experiment rather than a rule: play it, and if the aggressive decks run away with it, the fallback is the first player skipping the turn-one draw, which was nearly as good (62/38) and cannot be spent on a burst.

The second experiment, after the seat, is Rorik's conditional passive: a measured −8 that touches nobody else and directly addresses the free repeatable healing the report worried about. The third is Lirielle's burns, which no shipped variant addresses; the hypothesis to test is her passive (Read 2 on a Full Moon instead of an extra draw), and it is not built yet.

Not recommended now: the mulligan (its only clear mover was Masque, and the AI policy is too crude to trust), the Liquid Mana draw, the Tidecaller Gale, and the two starter swaps. They are all within noise. Keep them defined in `scripts/variants.ts` so they can be rerun after the seat fix.

## How to reproduce

```
pnpm test                                   # 48 engine and planner tests
pnpm baseline                               # 600 games -> docs/BASELINE.md
pnpm experiment seat-token                  # any variant in scripts/variants.ts
pnpm review-packet                          # refresh the read-only packet
```
