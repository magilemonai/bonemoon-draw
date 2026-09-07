# Response to the AI and compact-card follow-up of 6 September 2026

The follow-up (`docs/reviews/2026-09-06-polish/BONEMOON_AI_AND_CARD_POLISH.md`) probed the planner with constructed positions, measured the compact cards, and proposed a tutorial, a story chapter, and a results screen. This records what was verified, what changed, and what is parked on the board.

## The planner

| Finding | Checked | Outcome |
|---|---|---|
| Planning used the real order of unseen cards. Swapping two cards at the top of an unseen deck changed the AI's choice. | True. The simulated state kept the real deck, and draws take from its top. | Fixed. Before planning, the unseen cards are dealt again from a seeded shuffle: the AI's own deck, and the enemy's hand and deck together unless the hand has been revealed. The deal is computed from a fixed ordering of the unseen cards, so two states that differ only in an order nobody has seen produce the same deal and the same decision. Two such deals are averaged per decision. Test added: the same choice for both orders, and the enemy's hand size preserved. |
| A Read was kept by curve even when a candidate won on the spot. With 2 Spark and the enemy at 2, it kept Death over Elira. | True. The Read chooser scored cost against next turn's Spark only. | Fixed. Each Keep is simulated, then the best single thing it enables this turn is scored, with the curve as a tiebreak. Test added: it keeps Elira and wins. |
| Ending the turn was never a candidate. With a lethal Bone Moon bite pending, it played a pointless Yvette first. | True. | Fixed for the case that matters: if ending the turn wins outright, it ends. Test added. Comparing "end now" against "act, then end" in general is the Expert work below. |
| No search of the opponent's reply. | True. | Not done. It is the substance of an Expert setting and is on the board with a budget note. |

What the AI legitimately knows and no longer sees: after a Read, the cards it sent to the bottom of its deck are known to it in life but are shuffled in its planning. That is a small loss of strength in its favour of fairness, and it can be tracked later.

The 600-game baseline was rerun with the fair planner. It moved within noise (first seat 63% against 65%, Daxon 76%, Rorik 70%, Masque 56%, Luigi 42%, Lirielle 32%, Shazz 26%), so the earlier balance picture did not rest on the leak. The run takes 53 seconds now against 20, from the two deals per decision. The nine experiments in `docs/experiments/` were run under the old planner; their deltas still read against `baseline-planner-v1.json`, kept beside the new baseline.

Difficulty settings: not built. The report's rule is the right one, that difficulty should come from better decisions under the same information, and the leak had to close before any of it. Standard is the shipped planner. Expert is the reply search on the board.

## Compact cards

The measurements were right: the art window was about 40 percent of a hand card's area and the card carried cost, rank, name, nested rules, a text block or placeholder, and stat furniture. Changed, on hand, table, and mini cards:

- The art takes roughly 60 percent of the face. The inner tarot rule and the "Has an effect" placeholder are gone; the outer border is lighter.
- Table cards drop cost and rank. Hand cards keep cost in the corner and drop rank.
- Names are the short form on compact cards: "The Man in Black" for "Death: The Man in Black". Inspection shows the full name.
- Stat badges are plain pills.
- Rules paragraphs no longer appear on hand cards at any width. The face chooser and inspection carry the text.
- Desktop hover enlarges a hand card in place, without moving its neighbours. On a phone a tap opens the card's faces, as before.

Reversed art stays rotated. The report is right that a rotated painting reads less well at a glance, and it is also the tarot in the game; the Reversed mark and the dusk tint stay with it. Worth testing an upright-art variant with a stronger Reversed treatment once someone other than the two of us has played it.

Not done from this section: per-card focal points for the art crop (the crop is a fixed 42 percent from the top), and a hand-width study with less overlap. Both are on the list below the board items.

## Other polish

- **Preview honesty.** The attack preview now names what fires around the exchange: "Its attack text fires first" when the attacker has attack text, "Then Voren's Last Rite" when the blow would kill a Figure with one, "Then its text fires" for after-attack text. It still shows the plain exchange rather than resolving the text, and says so.
- **Opening-hand agency.** Unchanged. The mulligan variant exists and measured within noise under the old planner; it is queued behind the seat experiment.
- **Combat causality.** Unchanged beyond the preview lines and the final-turn review. A compact per-exchange history entry is a good next step.
- **AI identity.** Not built. The reply search comes first; personality behind shared lethal and survival checks after it.
- **Crowded states.** Not verified this round. The eight-card hand, three Relic holders, and Read 3 at phone width together are on the board's phone-check bullet.

## Tutorial, story, results

All three are on the board as proposals, in the report's order and with its smallest implementations. None was started. They sit on top of a fair match, and the fair match came first.

## Tests

Three planner tests added (57 in all): the unseen-order regression, the winning Read, and the end-turn win. Browser checks of the compact cards at 390 by 756 and 1512 by 756.
