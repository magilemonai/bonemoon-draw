# Response to the hands-on UX review of 6 September 2026

The review (`docs/reviews/2026-09-06-ux/BONEMOON_UX_REVIEW.md`, with its journal, logs, and screenshots beside it) came from three complete games played through the live page, one on desktop and two at phone width. This document checks each observation against the interface code, says what changed, and says what did not and why.

## What the review got right, checked against the code

| Observation | In the code | Outcome |
|---|---|---|
| Tapping a Read candidate's art kept it at once | The candidate card's click handler dispatched the choice | Fixed. Art opens the full two-face inspection over the Read; only Keep commits. The Read stays underneath and comes back when the inspection closes. |
| Read candidates showed only "Omen" or "Has an effect" | Phone-width hand cards hide their text | Fixed. Both faces' text sits under every candidate, whatever the width. |
| "Their reading / Waiting" during the player's own Read | The moon label only knew "my turn" and "not my turn"; a pending Read counted as not my turn | Fixed. It says "Your choice" while a Read waits on you. |
| Clicking an open enemy lane cancelled the attack | Empty enemy slots had no attack handler; only the portrait did | Fixed. An open enemy lane the selected Figure can strike into lights red and takes the tap. Its label says who takes the blow ("The Hermit takes 4", "Lethal", or "Guard Post steps in"). |
| Elira's Arrive target on the enemy Significator cancelled the play | The Significator's click handler dispatched a play with no lane; the engine refused it and the selection cleared | Confirmed as a bug and fixed. The Significator now stores itself as the target and asks for the lane, the same as a Figure target does. |
| "Choose where it goes" for every step | One string for all targeting states | Fixed. The prompt names the card and the step: "Choose Elira's target", "Target chosen. Place Elira in an empty lane", "Choose one of your Figures to carry Aurium", "Voren: tap an enemy or an open enemy lane to attack, or a lit lane to move", and when a Figure cannot do something, why ("it arrived this turn", "it has attacked already", "there is no empty lane beside it"). |
| The flip prediction is right but small, and the face panels show printed numbers that contradict it | The sentence was one line of body copy; the panels used printed stats | Fixed. Inspection opens with two large panels: "On the table 1/4, 1 wound, kept through a flip" beside "Turned over 4/0, it dies" (or "Fixed, it cannot be turned"). The face panels show the numbers as they would be on the table, with the printed pair as a footnote when they differ, and a note where Arrive would not fire. |
| The hand chooser showed Sentry Reversed as 5/2 when Shazz makes it 6/2 | Printed stats | Fixed. The chooser shows the Figure as it would stand on your table, hero passive and auras included, with the printed pair beside it when they differ. Inspecting a card in hand shows the same for both faces. |
| One burn logged twice | The engine wrote a log line and also emitted a burn event, and the table described both | Fixed in the engine. One line per burned card. Test added. |
| No own hand count, no Spark maximum, no draw forecast | True | Fixed. "7 of 8 in hand" (it turns gold at 7 and red at 8), "Spark 4/6" with any temporary Spark marked, and beside the moon: "Round 3 is a Full Moon: you draw 3, and 2 would burn at this hand size." The forecast knows Lirielle's extra draw and an empty deck. |
| Wounds and status need inspection to see | True | Partly fixed. Table cards carry a "1 wound" mark; Aegis, Hushed, Asleep, and keywords were already on the card. Attack and move availability now comes through the prompt rather than icons. |
| The phone HUD squeezed the name to "I…" and wrapped the ability | The Significator and the moon shared one row with the phase text | Fixed. On a phone the moon's text has its own row under the Significator and the moon button, so the name, ability, and hand count keep their space through "Bone Moon in 2". |
| The hand scrolled with no cue | True | Fixed. A "2 more" pill appears at the right edge when cards sit past it, and tapping it scrolls. |
| Tapping a hand card during resolution inspected it; afterwards it opened the chooser | The hand treated "animating" like "not my turn" | Fixed. On your turn a tap always opens the card's faces; while the table settles the faces wait ("The table is still settling"), then commit. Off your turn a tap inspects. |
| Unaffordable faces were too dim to plan from | Opacity 0.45 | Fixed. They stay readable and lose colour instead. |
| Desktop board cards small in a wide empty table | Cards were sized from viewport height with a low cap | Changed. From 1000px wide the Significators, the prompt, and the moon sit in a column beside the board, so the board gets the height the hand leaves. Cards are about 40 percent larger at 1280 by 720 than before, and up to 176px on tall screens. Below 1000px the old stacked layout stays, with slightly larger cards. |
| "Back to the table" went to the title; no way to look at the final turn | True | Fixed. The result offers "Review the final turn": the table stays as it ended with the log open and a strip of ways out. The title button is now "Title screen". |
| Faster presentation wanted | A speed setting existed in the store with no control | Added a "Quick" toggle beside Log. It is remembered. |

Verified visually at 390 by 700 (the phone frame), 500 by 667, and 1280 by 720.

## Not changed, and why

- **Buffered actions during resolution.** The chooser opens during resolution but does not queue a commit. Queuing a play that turns illegal a moment later would need the same revalidation the engine already does, and then a message when it fails, which is the interruption the review wants gone. Opening the choices early covers the planning case.
- **Dragging.** The review's own advice. Tap targeting with legal targets lit is the model; drag can come later without changing it.
- **An information control on the moon.** The forecast and the Bone Moon countdown now sit in the moon's text. A rules control mid-game would leave the table; the How to play page is one tap from the title. Worth adding as a drawer if players ask for it.
- **The Lorien and Gotch exchange.** The review could not read why damage looked uneven and did not verify it. The attack preview now spells the exchange out before the blow (Aegis, damage reduction, Whisper, both deaths), so the next such case will explain itself on screen.

## Tests

Six new engine tests (`src/engine/preview.test.ts`) pin the previews to resolution: a trade's numbers and deaths, an open lane's damage and lethal call, a Guard stepping in, a hand Figure's projected stats against the Figure actually played, the draw forecast for Lirielle at a Full Moon, and the single burn line. 54 tests in all. The interface itself has no automated tests; the checks above were done in the browser.

## What to watch next

- The attack preview describes the plain exchange. Text that fires on attack (Voren's Last Rite, an onAttack effect) is not in it. If a player is surprised by one of those, a "then" line is the next step.
- The wide layout puts the prompt in the left column. If it reads as detached from the board, it can move under the enemy row instead.
- The review's ranks were followed in order; ranks 1 to 6 and 10 are done, 7 is done as a layout change, 8 partly, 9 partly.
