# Response to the follow-up verification

The follow-up (`docs/reviews/2026-09-07-followup/CLAUDE_FOLLOWUP.md`, with its metrics and screenshots beside it) checked the 477ae92 response at 1280 by 800, 390 by 844, and 390 by 664. It found three interaction failures and asked for them first. All three were real. This records what each became.

## 1. Retry on a wide screen

The coach rendered its action row only when the fold was open or a step had gone wrong, and a wide screen never folds, so an ordinary step had no Retry anywhere in the DOM. Now the row is part of the coach whenever it is open: "Retry this step" and "Leave the lesson" sit under the instruction on every step. A phone gets "Retry" in the coach's head instead, beside More and Hide. The paragraph is no longer a click target; More is the control, and it is a button.

## 2. The coach and the sheets

On a phone the coach was fixed over the top of the table at a higher layer than the play sheet, so the sheet's Cancel took the tap and the opponent's block sat under it at every height. Two changes.

The coach is now the first thing in the phone's column, in the flow, above the opponent. It is one action line long: every step has a `do` line (the action alone, under 92 characters, tested) and the full instruction is behind More. A nudge replaces the line for its moment instead of growing the coach. The opponent's identity, Health, Spark, hand, and deck are visible under it at 664 and at 844.

Every sheet sits above the coach. The play sheet, the Read chooser, the inspect view, and the result are all fixed layers; the coach's wide-screen layer is now below them, and on a phone it has no layer at all. Cancel on the play sheet takes a normal pointer click at both widths. When a lesson step is about the card in hand, the step's line is repeated inside the play sheet, so raising the sheet loses no instruction.

## 3. Cards on a short phone

The lanes were allowed down to 60px, where the name ran into the numbers and the painting was a sliver. Now:

- A compact card has a footer. The name sits under the painting at 14px, its keywords at 12px, and the two numbers in a reserved 27px row that nothing else may enter. The painting takes what is left. Wounds ride on the painting's lower edge instead of the footer.
- The lanes never go under 84px while the fan is out. When the fan would push them there, the hand tucks: a 50px strip with every card in miniature, the count, "2 to play" or "1 would burn on the next draw", and Show. Show raises the fan as a sheet under the play sheet; choosing a face, playing a card, or Hide lowers it. Tucked, the lanes can still give way to 72px before anything overlaps, which is the floor for a coach, a Full Moon warning, and a burn warning all at once.
- The phone HUD gave up more height to pay for it: the tools sit on the opponent's name line and Health on the numbers line; the turn text flows as one short paragraph beside the button; the ability button stacks its cost so the numbers never wrap; the deck's name waits for a wider screen. The targeting prompt moved into the turn panel on phones, with Cancel in the button's place, so a selection no longer resizes the lanes.

Measured in a 390-wide frame:

| Position | 664 tall | 844 tall |
| --- | --- | --- |
| Lesson 2, step 1 | lanes 86px, hand tucked | lanes 102px, fan out |
| Lesson 3, step 1 (six in hand, Full Moon, burn warning) | lanes 86px, hand tucked, nothing overlaps | fan out |
| A reading, Shazz vs Daxon | lanes 104px, hand tucked | fan out |

A wide screen that is short (1280 by 666, a laptop with the browser's chrome) overlapped its left column before this round; it now drops the deck line, the long Bone Moon sentence, and a little padding under 720px tall, and the panels keep their rows.

## 4. The visual language

Still the second pass on the board. This round kept to the three failures and the layout they needed; the builder's rows and the record screen were not touched. The compact card footer and the tucked hand are in the current language: brass edge, ivory type, gold only on the primary action.

## How it was verified

The frames were driven in a hidden tab, where the browser stops animation frames, so the app was loaded through a wrapper that ticks them from timers; screenshots and metrics were taken after the table settled. That wrapper is not in the app. Tests: 90, one new, that every step's phone line exists and is short. Fresh-profile import and a live reduced-motion run remain unverified here, as before.
