# Response to the review of the first delivery

The review (`docs/reviews/2026-09-07-delivery-review/CLAUDE_DELIVERY_REVIEW.md`, its engine probe and screenshots beside it) accepted the experiment set, the suite, the aliases, and the study as progress, corrected three things I had claimed, and asked for the loss recap and the way back into the deck as the next delivery. This round is that delivery with the corrections alongside.

## The recap and the way back

Every reading now keeps its seed and every action, the opponent's included, with the list it was dealt. That is enough to play it again from nothing, and a test does: a whole bot reading replayed from its seed and actions reaches the same winner, round, and Health. The record keeps the same for finished readings, so a replay of a chosen turn has its foundation.

The result screen replays the reading and says up to five factual lines. Which blow ended it and from how much Health; the enemy turn that cost the most; the costliest Figure that fell; burns; the Bone Moon's total; Spark left unspent across the reading; cards still in hand at the end and the cheapest of them. Three readings the planner played against itself:

- Round 9: The Solar Flare Cannon took you from 2 to 0. Round 7: their turn cost you 8 Health, the most in the reading. Round 5: Mordeaux, the Clockwork Man (4 Spark) fell, your costliest loss. Your hand was full for 2 draws: The Tower: The Fallen Isle, Yvette Mirthwell burned. At the end 7 cards were still in hand; the cheapest cost 2.
- Round 6: Braxon Lamn's attack took you from 2 to 0. Round 5: Taranis, the Laughing Crow (4 Spark) fell, your costliest loss. Your hand was full for 1 draw: Lake Mirrara burned.
- Round 10: the Bone Moon's bite took you from 1 to 0. Round 9: their turn cost you 10 Health, the most in the reading. You ended turns with 6 Spark unspent in all.

Nothing in it evaluates a move. It counts what happened, from the engine's events, as the program asked.

Under the lines: the list and its revision, Edit this deck (a copy, for a starter or a deck since deleted), and Play the other seat. The builder opened from a result says "Play this deck against Daxon" and Choose comes up with that opponent, so the loop closes: lose, read why, edit, play the same opponent, and the builder's per-revision record keeps the score. A deck also has a code now, one line of text from Copy deck code in the builder; Your decks takes one back under Bring a deck by its code, without the whole record.

## The corrections

**The burn fixture.** The review was right, and the sentence in the last response was false. The hand held only Eldertech Spheres, which draw as they are played, so no line could shrink it; the planner played both and was right to. The case now gives it Mr. Boscoe and passes, and says in its own comment that this does not isolate burn-awareness. The earlier response carries a dated correction. Two Shazz lines the review asked for are in the suite and pass: swing with the Reversed Sentry then turn it over to survive Vath's reply, and spend the 2 Spark on the flip that kills rather than on a body. The block case now plays the enemy's reply and checks the Significator lives.

**The study's numbers.** They were taken in a hidden tab, where the key strip in the column never applied and the lanes never shrank; the review's settled browser had marks at 91px lanes against 105px for words. The key is now a sheet, so the lanes keep their width in both treatments, and the suite measures the study itself in a settled browser at all three sizes (`docs/CARD_STUDY.md` has the table). At 390 by 664: words 43 to 81px of painting, marks 100 to 115px, both at 105px lanes.

**The recommendation.** Words stay the default, as the reply preferred and the review recommended. Marks are a space prototype, kept selectable. Each tile on a table card is now a control: tapping it, or Enter on it, opens the key and never selects the card (the review's Mordeaux tap selected him; it does not now, and the suite checks it). The key lists the marks on the table with the word and what it does, and Key in the tools opens it too. Deliberate symbols for a phone strip, and a recognition check with labels, are on the board as a later design item.

**Aliases.** The cap is 24 now, and an alias keeps the name's subject and its action where it can: Dagan, Scales Leveled; Ilzaren, the Author; Yvette, Too Close; Marin, Storm in Check; Threshold Children; Lovers Through the Gate. Where an epithet cannot be shortened faithfully the character stands alone (Bill Boggs, Calvera Blackwake). Nitriti, Eternal Night and Calvera, Crash the Isle fit under the cap and are shown as printed; so is Fin & Bin, Nooooo Stinky. 41 aliases, four flagged, in `docs/ALIASES.md`; a test also refuses an alias for any name within the cap.

## The seat trial and Shazz

Choose your character has an Experiment control: Seat trial, the second player opens with a Spent Sphere. A trial reading is on the record as one and earns no Renown; the shipped rules are untouched, and the trial's rule holds only while that reading is being played. Play the other seat on the result screen repeats the same list and the same deal from the other side, so a pair is two readings, both seats, matched.

Every experiment report now keeps each game's outcome and compares game by game with the baseline: the same pairing, seed, and seat under both rules, a mean change per hero and a 95 percent interval from the per-game differences. `docs/experiments/README.md` has the table. What it says that the overall numbers hid: Rorik's conditional passive costs Rorik 7 points (−11 to −3); the mulligan gives Masque 10 (+3 to +18) and takes 7 from Lirielle; skipping the first draw takes 10 from Lirielle; and none of the Spent Sphere's per-hero changes clears the noise, though it moves the seat most. The eleventh run is a low-curve Shazz list, the nine cards costing 6 or more replaced with second copies of cheap Figures and two Portals. It changes nothing: Shazz 24 percent overall, 0 percent against Daxon. The curve is not the cause on its own. That leaves the planner's plan (Reversed bodies at 1 Health) and Pride's design, and the human trial on the board is still the way to tell them apart.

## The suite

Twelve flows, 41 checks across the four projects, all passing. New this round: lesson 1 played to its end through the coach's steps and its mark found after a reload; the paused reading whose deck is edited to a new revision while it waits, and still shows the revision it was dealt; the record transfer with a finished lesson, a revised deck, and a conceded reading, in contexts that carry the project's own viewport, checking the completed count, the conceded row, the lesson mark, and the deck's card count and revision; the recap's list line and the door into the builder; and the study measured. `docs/E2E.md` is current.

Tests: 107.
