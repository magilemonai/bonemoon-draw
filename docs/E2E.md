# The browser regression suite

`pnpm e2e` runs Playwright against the dev server (it starts one on port 5178) in four projects: desktop at 1280 by 800, phone at 390 by 844, phone-short at 390 by 664, and a reduced-motion pass at desktop over the tests tagged `@motion`. Evidence screenshots land in `e2e/evidence/<project>/`, ignored by git. `pnpm exec playwright test --project=phone-short` runs one project; `--ui` opens the runner.

Engine tests cannot see a missing React control or a button under another layer. These eight flows are the ones that failed in review before this suite existed, or would have.

| Flow | What it verifies |
|---|---|
| Tutorial entry | The tutorial opens from the title screen and from the character screen, with three lessons listed. |
| Lesson progression, recovery | Lesson 2: the right move advances the step; a wrong move is refused with a nudge; Retry restores the step's position with nothing selected; Leave returns to the list. |
| Two-face play | Lesson 1: a hand card opens the play sheet, the Reversed face is chosen, the lane is tapped, and the card sits Reversed in Present. Tagged `@motion`. |
| Targeting and cancellation | Lesson 2: selecting Voren shows the ask (the turn panel on phones, the hint on desktop) and Cancel clears it; the play sheet's Cancel closes it with the coach in place. Tagged `@motion`. |
| Read and inspection | Lesson 3: Read the Stars opens above the coach, a candidate can be inspected and closed, Keep commits and the hand count follows. |
| Deck building and launch | Copy a starter, remove and restore a card (the problems list appears and clears), name it, Play from the builder, Play from Choose, and the deck's name is on the table. |
| Saved-reading continuity | Pause the built deck's reading; Continue keeps the deck; a reload keeps it again. |
| Record transfer | A record with a built deck is copied from one browser context and pasted, checked, and accepted in a fresh one. |

Not covered here, and still needing a real device: OS-level reduced motion (this suite emulates it), touch gestures and scroll on a real phone, backgrounding and foregrounding a reading, and lesson completion marks across a reload (the suite does not play a lesson to its end).
