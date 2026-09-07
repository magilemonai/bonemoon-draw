# Response to the verification of build 477ae92

The handoff (`docs/reviews/2026-09-07-477ae92/MOONWYLD_477AE92_HANDOFF.md`, with its journal, export, diagnostics, and the screenshots that matter beside it) completed all three lessons at both widths, played three full games with a built Masque deck, and measured the interface. It ranked ten changes. This records what each one became.

## The four P1s

**1. Regions.** The phone table now sizes its lanes from the space the panels and the hand leave, measured live, so two rows of cards can never run into a panel on any phone height. The phone HUD was compressed to make that space: a one-line opponent block, a tighter numbers row, a shorter Bone Moon line, a slimmer hand. The lesson coach no longer pushes anything; it folds to its head, two lines, and More, and opens on demand. The post-game strip floats over the sky like the coach (top right on wide screens, top on phones) instead of sitting in the column where it overlapped the name panel and swallowed clicks. Verified at 390 by 664, the shortest common phone viewport, with three Figures on each side and a coach open.

**2. Type floor.** Compact card names are 13px on phones and 14px on wider screens; keywords 10 and 11; stat numerals 14. On a phone the play sheet stacks the two cards, each at 76 percent of the width, with rules at 16px once the card's zoom is counted, and both play actions pinned at the foot of the sheet while it scrolls.

**3. Draw again.** A finished reading remembers the exact list it was played with. Draw again plays that list, and says which: "Draw again, Lantern Engine II, revision 19". It is the same list even when the deck has been edited since. A list that the rules no longer allow disables the button with the reason; nothing is ever swapped for a starter. The deck in play is also named under the Significator's title during the match.

**4. Lights that follow the table.** Hints can now be computed from the state. Lesson 1's attack step lights the lane the Guard Post actually went to; its draw step lights the lanes that are actually empty; lesson 3's "make room" steps light the cards in hand that can actually be paid for. Lesson 2 no longer lights the Veiled Wisplight during the ability step; the text says the ability will not offer it, and lights the Oondray instead.

## The fifth P1, and the two P2s about the same lessons

**5. Truthful recovery.** A step can declare a deadline within the turn. Lesson 1's and lesson 2's closing exercises do: end the turn without finishing, and the coach says so and offers Retry as the primary action; the exercise cannot complete later. A step can also declare when the position is stuck: lesson 3's two "make room" steps notice when no affordable card is left and say "Retry this step" instead of pointing at a card that is gone. Keeping a Read card before looking stays intentional; the step says so now. Astra's two "REPRO" diagnostics are regression tests in `src/tutorial/lessons.test.ts` with corrected expectations, alongside a test that the Pearl line completes lesson 1 in the same turn.

**8. Narration.** Lesson 2's Pylon "struck Voren once and never again". Lesson 3 says Luigi takes his bite at the start of his own turn, and its closing exercise asks for seven or fewer, which is the real no-burn line for a one-card draw. The turn panel now says the next bite: "The Bone Moon is up. Your next bite: 3." Before it rises: "first bite 1, then 1 more each round".

**6. Read rows.** Each candidate is a rectangle: a small painting with the name, cost, and kind on one line, the two faces underneath at 16px, and a full-width "Keep Mordeaux" at the foot. Tap the painting to inspect. On wide screens the candidates sit in equal columns; on a phone they stack.

## The other P2s

**7. Motion policy.** Reveals now scale with Quick like everything else in the queue. The app is wrapped in the motion library's `MotionConfig reducedMotion="user"`, so the OS preference governs the transform animations as well as the CSS ones. A cast is opaque, and a hand card cannot grow under it while it is up.

**9. Visual language, first pass.** One primary action per screen in gold; the title's other four destinations are quiet text links, which also stops the wrap the review saw. Secondary buttons are rectangles with a brass edge; filter chips are rectangles with a brass underline when chosen; the result screen has a moon over a brass rule, dusk for a loss. The builder's rows and the record screen are the next pass, on the board.

**10. Deck records.** The builder says "1 of 3 readings won across all revisions; this revision 1 of 2". The kept log is 240 lines and the drawer scrolls it. A loss recap is on the board.

## What did not change

- The lesson coach still overlays the opponent's block on a phone. Reserving its height pushed the board off a 664px screen; folding it was the better trade.
- 21st.dev components were not adopted. The review's own advice held: a collection of unrelated effects would add inconsistency, and the four screens it named get the language pass instead.
- Fresh-profile import and a live reduced-motion run remain unverified here as well; both need a browser this session cannot drive.

Tests: 89, including three new lesson tests. Verified in the browser at 1280 by 800 and in a 390 by 664 frame.
