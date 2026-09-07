# The first delivery of the program

The program (`docs/reviews/2026-09-07-milestones/MOONWYLD_NEXT_MILESTONES.md`) and the reply that set its terms (`CLAUDE_NEXT_ROUND_REPLY.md` beside it) asked for one package: a cleaned-up status, a comparable experiment set, the alias table, both compact card treatments with a recommendation, and browser-regression progress. This is that package, with a Shazz probe and a first tactical suite alongside because the reply asked for both early.

## Status

The board (`NEXT.md`) is flat again: twenty open bullets, most important first. Ten checked bullets moved to `NEXT-ARCHIVE.md` with their wording kept, among them the deck builder and the record transfer, which were built rounds ago and still listed as future. Two phone-play asks that said the same thing as a newer one moved to the archive as superseded, unchecked. The rulebook no longer says the builder is next. Three bullets are new: choose the card treatment, play Shazz against Daxon by hand, and the browser suite's remaining flows.

## The experiment set

The reply was right about the baseline's provenance. The saved baseline came from `1a1eaf5`, and the belief-pool change in the planner came after it in `0b9f4aa`; the report's UTC date hid the order. The earlier runs are kept in `docs/experiments/2026-09-06-earlier-planners/` as history.

All ten runs (the baseline and the nine named variants) were played from one tree on the same seed schedule, 600 games each, and every report now opens with its stamp: commit, whether the tree had uncommitted changes, rules version, the starter decks, the planner's depth, beam, and sampled worlds, the seed formula, and the time with its zone. This set ran on the `c283f90` engine with the stamp itself and the day's interface work uncommitted; no engine or card file differed. `docs/experiments/README.md` has the table.

Against the screening targets: first seat is 64 percent in the baseline. The Spent Sphere moves it to 58, the extra first-turn Spark to 60, the skipped draw to 61; none reaches 55, and all three lift Daxon a little further. The mulligan does nothing for the seat and helps the strong decks more than the weak (Masque 56 to 66, Lirielle 32 to 24). Rorik's conditional passive brings him from 70 to 62. Neither deck variant moves its hero outside the noise. Four Significators sit outside 40 to 60: Daxon 75, Rorik 70, Lirielle 32, Shazz 26. These are bot numbers, and the reply's caution stands. They say where to look; the change itself is a separate decision.

## Shazz against Daxon

A 60-game probe on the same planner (`docs/experiments/shazz-vs-daxon.md`): Shazz wins two. Shazz attacks 2.5 times a game to Daxon's 5.8, plays almost everything Reversed for Pride's +1 Attack and so fields one-Health bodies, uses Wear a Face 0.4 times a game, and carries six cards costing 6 or more against a list where twenty of thirty cost 3 or less. The tactical fixture for the wounded flip passes, so the planner can see that line one step out; in a game the 2 Spark goes to a card. Whether the deck or the planner is at fault is not settled here, and the bullet on the board asks for human hands in both seats before any card moves.

## Aliases

`docs/ALIASES.md` is the table: 58 aliases for every face name over 20 characters, none over 20, with eleven flagged because they change more than length (a joke shortened, a title altered, an act made a state). Compact cards, the hand, and the tucked strip show the alias; the Codex, inspection, the play sheet, and the log keep the full name. A test keeps the map complete and short.

## The two card treatments

The Card study is on the title screen: one crowded position, Shazz against a sleeping Daxon, with every keyword on the table, wounds, Relics, a buff, an Aegis, and a full hand due to burn. Words and Marks switch the compact treatment, the choice is kept for every reading, and the drawer and inspection are there to try. `docs/CARD_STUDY.md` has the measurements and the recommendation: marks on compact cards, words everywhere else. At 390 by 664 the words treatment leaves the captain 40px of painting under her three keywords; marks leave every card 83px, keep the footer the same height across a row, and cost one line of key under the board. The split by width was the hypothesis and it lost: at 104px the words already take half a painting.

The study also found a regression: since the 477ae92 round a phone root rule had capped wide-screen lanes at 11.5vh outside lessons (92px at 800 tall instead of 160). It is fixed; lessons were unaffected because they set their own size.

## The browser suite

`pnpm e2e` runs Playwright in four projects: desktop, phone at 844, phone at 664, and a reduced-motion pass over the tests that move cards. Eight flows, 32 checks, all passing: both tutorial entries; lesson progression, a refused move, Retry, Leave; a Reversed play into a chosen lane; the targeting ask and its Cancel, and the play sheet's Cancel over the coach; Read the Stars, inspection, Keep; deck building and launch; the paused reading across a reload; the record carried to a fresh context. `docs/E2E.md` lists them and what still needs a real device: OS reduced motion, touch, backgrounding, and lesson completion across a reload.

## A first tactical suite

`src/ai/tactics.test.ts`: five positions with one right answer. The planner takes lethal, blocks a lethal attacker, attacks with a Windborne arrival, and flips a wounded enemy for the kill. It does not play a cheap card to avoid a burn at eight in hand; that case is kept as a known gap so the suite says when it closes.

## Decisions waiting

1. The card treatment, from the study on your phone.
2. The eleven flagged aliases.
3. Which seat variant to trial with people, since the bot cannot reach the target; the Spent Sphere is the one that moves it most.

Tests: 99. The loss recap and the edit-and-replay loop are the next player-facing milestone.
