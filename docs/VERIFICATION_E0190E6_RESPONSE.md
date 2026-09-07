# Response to the verification of e0190e6

The verification (`docs/reviews/2026-09-07-verification-e0190e6/VERIFICATION.md`, screenshots and metrics beside it) closed the three interaction blockers from the follow-up: Retry on a wide screen, the coach over the opponent and over Cancel, and the 60px cards. It played a full drawer sequence at 390 by 664 (Show, the Oondray, Play Upright, the empty Past lane) and the Read chooser and inspection on top of the coach, all with ordinary clicks in a visible tab. Two P2s remained.

## 1. The strip's count and the lesson

The tucked hand said "3 to play" on a step that only accepts Read the Stars, and the lesson then refused the play. The count now asks the lesson: a card counts only when one of its playable faces is an action the current step allows. When cards are affordable but the step wants something else, the strip says "Not for this step"; "Nothing to play" stays for a hand that cannot be paid for; the burn warning still wins over both. Outside a lesson nothing changes.

## 2. More, without shrinking the table

Opening More grew the coach in the column, and the lanes shrank to 75px to make room. More now opens the whole instruction as a reading sheet under the coach, an overlay with its own edge, below every play and hand sheet, closed by Less. The coach keeps its one-line height and the lanes keep their size. Measured at 390 by 664 in lesson 2: 86px lanes before and after More, the coach at 55px both times.

## The portrait pass

The verification's larger point stands: the footer stops collisions, and on a short phone it still takes most of a compact card's height, with keywords at 12px against the 14px target. That is design work across the populated table, the hand drawer, and the two-face sheet together, and it wants two decisions before code. Short display names for the 65 long card names (a canon question, on the board), and whether keywords stay as words or become marks with a legend. It is the next round, with the builder rows and the record screen it was already paired with.

Tests: 90. Verified in 390 by 664 frames; the desktop coach is unchanged this round.
