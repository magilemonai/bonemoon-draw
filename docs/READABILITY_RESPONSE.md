# Response to the readability audit and the deck-building requirement

The handoff (`docs/reviews/2026-09-06-readability/MOONWYLD_READABILITY_AND_DECK_BUILDER.md`) carried two things: Cody's objection that essential text sits at ten to twelve pixels while space goes to backgrounds, with ten proposed changes, and Cody's requirement that players build their own decks from the Codex and play them. Both are built. This records what, and what was left.

## Building and playing a deck

**The flow.** Title or Codex, Your decks, a Significator, a new empty deck or a copy of the starter, cards added from a readable list, saved as you go, played from the builder or from Choose. Decks are named, duplicated, renamed in place, and deleted with one confirmation. Starter lists stay, read-only, and can be copied.

**The rules, enforced and spoken.** Thirty cards; two copies of a Minor at most; one of a Major; never your own Major; Minors only from your Significator's two suits; no tokens. Brog still joins Luigi's hand without a slot. Each problem is a sentence in the builder ("24 of 30 cards", "Remove one extra copy of Yvette Mirthwell", "Merrick Blackwater is Tides, outside Shazz's suits") and the reason a card cannot be added appears when its plus is tapped. Play stays off until the list is legal, and the choose screen marks a not-ready deck in its list.

**The browser.** Search covers names and rules on both faces. Filters: suit (the two suits and the Majors), type, printed cost, keyword. Each row shows art, name, cost, suit and stats, both faces' text, and a quantity with plus and minus. Tapping art or name inspects. The deck list groups by printed cost, with a curve labelled as printed cost and the Figure, Omen, and Relic totals. The Codex opens on the same rows as a Library, with paintings and cards still a tap away.

**Into the match.** `createGame` takes a list per seat. The store snapshots the list, its name, and its revision into the saved reading when a match starts, so editing the deck afterwards changes nothing about an ongoing or resumed reading. The record stamps each match with the deck and revision, the deck rows and builder show "3 of 5 readings won with this list", and the record modal shows the deck beside each reading. Decks ride along in the copy-and-paste backup.

**Renown.** A legal custom deck counts in Standard. The first-clear award is per Significator and opponent, so duplicating or renaming a deck earns nothing twice.

**The AI's information.** The planner used to deal the enemy's unseen cards from the enemy's actual list. With private decks that would read a list nobody has shown it. It now believes: the enemy's legal pool (two suits, every Major but their own), less every card seen in public (the table, Relics on it, the graveyard, a revealed hand). Two private lists that have shown the same cards produce the same belief and the same decision; a test holds that. Decklists are private by default. This makes the AI a little weaker against a starter deck, whose list is public, and that is the fair side to err on.

Tests: seven for the deck rules and the list reaching the engine, one for the belief boundary. 81 in all.

## The readable table

Targets from the audit: body text 16 to 18px, secondary 14 to 16, resource values 24 to 32, units on numbers, the display serif for names and headings only. Changed:

1. **The Significator panels** are blocks: name in the serif, Health as a 32px numeral with its unit, then Spark, Hand, and Deck as labelled 26px numerals ("3 / 3", "8 / 8", "19"), and the ability as a 44px button with its Spark cost written out. The opponent's block is the same in miniature with "Opponent" over the short name. Card-back decoration is gone.
2. **The turn panel** has "Round 3, Full Moon" and whose turn it is, then "Next draw: 1 card", a red "Hand full: 1 card would burn" when it applies, a gold End turn button at 48px, and "Bone Moon in 7 rounds". On a phone the forecast sits beside the button; in the wide layout the panel stacks in the side column. "Leave" is "Pause", which is what it does.
3. **Hand cards** on a phone are a touch wider, the wound mark is 10px, and the "N more" pill stays.
4. **The Codex library** is the row presentation above.
5. **The title** puts the name and the line under it on a dark surface over the painting. The goal is three lines: "Daxon vs Lirielle", "First victory, +10 Renown", "Play this matchup". The rank line reads "0 / 30 Renown to Reader".
6. **Both faces** in inspection are full strength, the chosen one outlined; rules text is 16px; the comparison labels Attack and Health. The chooser says "Need 1 more Spark".
7. **Read** candidates are full-width rows with the card, both faces at 16px, and "Keep Mordeaux".
8. **Choose your character** shows one playstyle line per Significator and opens the passive and ability on the chosen one. Deck, opponent, and a large Play sit in a bar pinned to the bottom, with the summary "Shazz with The Devil's Hand, against Rorik".
9. **Your record** leads with the accomplishments and the last readings; backup and restore sit behind a disclosure.
10. **Consequences name their actors**: "Kaipo Nuvane moves to Past with 1 Health", "Zalian Fisherman falls", "Captain Elira Voss rekindles Reversed with 1 Health", "Counting Merrick Blackwater's attack text".

Verified at 390 by 844 and 1280 by 800 with occupied lanes and a full hand.

## Left for the next pass

- Curated display names for the sixty-five long card names, and a hand-width study with six and eight cards.
- An illustrated wounds-and-flipping example and a short play sequence on the rules page.
- Deck statistics beyond the last 200 readings, and results split by opponent per deck.
- Balance under construction: low-curve, control, and one-combo lists against the AI, before any Expert claim.
