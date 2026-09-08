# Response to the review of the recap delivery

The review (`docs/reviews/2026-09-07-recap-review/CLAUDE_DELIVERY_REVIEW.md`, with its two engine probes, eight trace fixtures, and the study screenshots beside it) kept the recap loop and the study corrections, and showed with the engine that the recap could explain a reading that did not happen. Both P1s were real, and so were the two P2s. This round closes them as one package, with the review's fixtures as regressions.

## The replay is the reading now

Four things were wrong, and the review named all four.

- **The seat.** A dealt seat spends one random step; the store saved the seat that came out and the replay forced it, skipping the step, so every later deal and effect drifted. The store now keeps the seat only when it was forced (the other-seat pair, or a trial with one), and a dealt seat is dealt again on replay.
- **The trial.** The store cleared the Spent Sphere's rule before the result screen asked for the recap, so a trial reading replayed under the shipped rules and ran into its own token. The replay applies the reading's trial for its own duration and restores whatever was set before, and a test checks nothing leaks.
- **The actions.** The engine writes to an action it resolves (a Figure's Arrive target), so the recorded action could differ from the one played. Actions are recorded as copies before the engine sees them, and replayed as copies.
- **The observations.** Without snapshots every event in an action pointed at the action's final state. The replay takes per-event snapshots, and a test checks that each damage event's own snapshot and the one before it differ by exactly that damage.

The replay also checks itself: an illegal action, or an end that is not the one recorded (winner, round, both Healths), makes it say so, and the result screen shows "The recap for this reading is not available" instead of lines. Twenty-four regressions follow the review's probe: seeds 4242, 7, 123, and 42, the seat dealt or forced to either side, the trial off and on, a custom list, the planner on both sides, full final-state equality including the random state. All pass, and the review's `verify-findings.py` style of check (the eight trace fixtures) is kept beside the review.

## The Bone Moon, counted once, as the Bone Moon

The reducer added the bite and then its damage event again, and read the turn's owner from the state before the action, which is the previous player's End turn. It now walks the per-event snapshots: the owner comes from `turnStart`, the cause of a damage event is whatever was resolving in the same action and resets with each action, Health lost is the difference between snapshots (so overkill is not overstated), and environmental damage (the Bone Moon, an empty deck) is never attributed to the opponent. The review's fixture is a test: Rorik and Daxon only end turns, and the recap says the Bone Moon's bite took Daxon to 0, says the Bone Moon bit you for exactly what the engine's snapshots show, and never says "their turn cost you".

## Records keep what a replay needs

A finished record now keeps the human's exact list, the opponent's list as dealt, the seed, the seat when forced, the trial, and every action. A deck edited or deleted later cannot change what a finished reading was; a starter changed in a later version cannot either. Records from before this round have none of it and read as unavailable rather than reconstructed from today's definitions.

## The natural finish, in the browser

`/?seed=4242` makes a reading's deal and the planner's choices the same every time. The suite plays one to its end (you only end turns), and asserts the lines on the result screen equal the lines the reducer computes in Node for the same reading, so a copy edit changes both and a wrong replay changes neither. It then opens Edit a copy of this deck, changes the list, and launches with Play this deck against Daxon, checking the opponent is preset. A second test plays a seat-trial reading to its end, checks the recap says it was under the trial and matches the reducer with the trial applied, and finds the trial tag on the record. The concession flow stays. Fourteen flows, 47 checks, all passing.

## The study's tools on a phone

Key joined the tools row and the row ran into Daxon's name at 390 by 664. The study's two buttons are one switch now that names the other treatment, Leave the study is Leave, and the opponent's name keeps clear of the row (the study test checks the two boxes do not meet). The lanes did not move for it.

Tests: 132, twenty-four of them the replay regressions. The next milestone is the one already discussed: the card and event-motion pass, words kept, symbols for a phone strip with labels, and arrivals, attacks, flips, wounds, and deaths made legible.
