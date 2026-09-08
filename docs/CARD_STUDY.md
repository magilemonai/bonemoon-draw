# The Card study

Title screen, Card study. One crowded table, Shazz against a sleeping Daxon in round six with the Bone Moon a round away: a wounded Guard carrying a Relic and an Aegis, a Veiled Windborne captain with Gale, a buffed and wounded general with a Relic, Voren Reversed on Guard, the Sentry Reversed with Rekindle and Veiled, Mordeaux Fixed with a Whisper and two wounds, eight cards in hand, two of them due to burn. One switch in the tools names the other treatment (it reads Marks while words are showing) and swaps the compact cards; the choice is kept and applies to every reading until it is switched back. Leave returns to the title. Nothing from the study goes on the record.

## The two treatments

**Words.** Each keyword is its word on a chip under the name, 12px. The numbers keep a reserved 27px row. The painting takes what is left. Words are the default.

**Marks.** Each keyword is a letter or two on a dark tile riding the painting's lower-left edge: G Guard, W Windborne, V Veiled, F Fixed, R Rekindle, Fe Feast, A Aegis, Ga Gale, Wh Whisper, D Dormant, and a gold + for a Relic. On a table card the tile is a control: tapping it, or focusing it and pressing Enter, opens the key and never selects the card. The key (also Key in the tools) lists the marks on the table right now with the word and what it does. The play sheet, inspection, the Codex, and the builder keep words everywhere.

## Measured in a settled browser

The browser suite measures both treatments on this table (`e2e/card-study.spec.ts`, evidence in `e2e/evidence/<project>/study-layout.json`). The key is a sheet, so the lanes keep their width in both treatments; an earlier draft had a key strip in the column that cost the lanes 14px, and the earlier numbers here were taken in a hidden tab that never applied it.

| | 390 by 664 | 390 by 844 | 1280 by 800 |
|---|---|---|---|
| Lane width, both | 105px | 112px | 160px |
| Painting, words | 43 to 81px | 54 to 108px | 165 to 184px |
| Painting, marks | 100 to 115px | 111 to 127px | 203px |
| The general (three keywords, a Relic) | 43 to 100 | 54 to 111 | 165 to 203 |

## Where it stands

Words stay the default, as the reply preferred and the review recommended. On a wide screen the words already leave most of the painting, and they say what a status is without a key. On a phone the marks give the crowded cards back a third to half of their painting, at the cost of a decoding step: the letters are initials, the two-letter ones are the rare keywords, and the key is one tap away, but a new player still meets G before Guard.

The marks are a space prototype, kept selectable so the table can be played that way on a real phone. A finished compact treatment for phones would want deliberate symbols (a shield for Guard and an anchor for Fixed are concepts to try), with Windborne and Gale made unmistakably different, and a recognition check with labels before any of it becomes a default. That is a later design item on the board.
