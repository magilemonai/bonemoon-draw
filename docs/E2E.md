# The browser regression suite

`pnpm e2e` runs Playwright against the dev server (it starts one on port 5178) in four projects: desktop at 1280 by 800, phone at 390 by 844, phone-short at 390 by 664, and a reduced-motion pass at desktop over the tests tagged `@motion`. Evidence screenshots and measurements land in `e2e/evidence/<project>/`, ignored by git. `pnpm exec playwright test --project=phone-short` runs one project; `--ui` opens the runner.

Engine tests cannot see a missing React control or a button under another layer. These flows are the ones that failed in review before this suite existed, or would have.

| Flow | What it verifies |
|---|---|
| Tutorial entry | The tutorial opens from the title screen and from the character screen, with three lessons listed. |
| Lesson progression, recovery | Lesson 2: the right move advances the step; a wrong move is refused with a nudge; Retry restores the step's position with nothing selected; Leave returns to the list. |
| Lesson persistence | Lesson 1 played to its end through the coach's own steps; after a reload its mark reads Play it again and lesson 2 still reads Start. |
| Two-face play | Lesson 1: a hand card opens the play sheet, the Reversed face is chosen, the lane is tapped, and the card sits Reversed in Present. Tagged `@motion`. |
| Targeting and cancellation | Lesson 2: selecting Voren shows the ask (the turn panel on phones, the hint on desktop) and Cancel clears it; the play sheet's Cancel closes it with the coach in place. Tagged `@motion`. |
| Read and inspection | Lesson 3: Read the Stars opens above the coach, a candidate can be inspected and closed, Keep commits and the hand count follows. |
| Deck building and launch | Copy a starter, remove and restore a card (the problems list appears and clears), name it, Play from the builder, Play from Choose, and the deck's name is on the table. |
| Saved-reading continuity | Pause the built deck's reading; edit that deck to a new revision while it waits; Continue shows the revision that was dealt, and again after a reload. |
| Record transfer | In a context with the project's own viewport: a finished lesson, a built and revised deck, and a conceded reading are copied as one record and pasted, checked, and accepted in a fresh context; the completed count, the conceded row, the lesson mark, and the deck's card count and revision arrive. |
| The recap, conceded | A conceded reading's result names the list and revision, and Edit this deck opens the builder with Play this deck against the same opponent. |
| The natural finish | With the seed in the address (`/?seed=4242`), a reading is played to its end by ending turns; the recap's lines equal the lines the reducer computes in Node for the same reading; Edit a copy of this deck, a change, and Play this deck against Daxon launch with the opponent preset. A second reading under the seat trial replays with the trial, says so, and is tagged on the record. |
| The Card study | Words and Marks on the same table, measured after the layout settles, written to `study-layout.json`: the lanes keep their width in both, the smallest marks painting is larger than the smallest words painting, and a keyword tile opens the key without selecting the card. |

Not covered here, and still needing a real device: OS-level reduced motion (this suite emulates it), touch gestures and scroll on a real phone, and backgrounding and foregrounding a reading.
