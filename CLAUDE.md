# The Bonemoon Draw: standing contract

A Valisar tarot battler. Vite + React + TypeScript, pure TS engine, Motion for animation, Zustand for the store, Vitest for the engine.

## Ground truth

- `docs/RULES.md` is the rulebook. If the engine and the rulebook disagree, one of them is wrong; fix it and say which.
- Card text on the card is player-facing and must match what the effect does. Change both or neither.
- `pnpm test` must stay green. `pnpm sim 120` is the balance smoke test: every game must finish, average length 8 to 11 rounds.
- The world source is the two documents in the project root (worldbuilding master doc, campaign notes). Names, quotes, and lore come from there. Do not invent Valisar canon; when a card needs a fact the docs don't have, flag it in NEXT.md instead.

## Rulings

- **Cody's ruling 2026-09-05: design must feel of the world.** No stock generated-page tells: cream-and-terracotta, tinted-black backgrounds, identical rounded cards with grey shadows, all-caps eyebrow labels, middle-dot separators, arrows on buttons. Every visual choice should trace to something in the Valisar notes (see `docs/DESIGN.md`).
- **Cody's ruling 2026-09-05: run voicecheck on the writing.** Card text, flavor, rules, and docs get the VoiceCheck pass (`/voicecheck <file> global`). Verbatim quotes from the campaign notes are evidence and stay as written, even when they trip a pattern.
- **Standing rule: mobile is part of done.** Base styles are the 390px phone; desktop is the breakpoint. Verify at 390px before calling a screen finished.

## Conventions

- Cards: one entry per card in `src/data/cards-<suit>.ts`. Ranks follow a tarot suit exactly (Ace, 2 to 10, Page, Knight, Queen, King). Majors are numbered 0 to 21 with roman numerals.
- Costs follow rank loosely: Ace 1, 2-3 cost 2, 4-5 cost 3, 6-7 cost 4, 8 cost 5, 9 cost 6, 10 cost 7, Page 2, Knight 4, Queen 6, King 8. Deviate only on purpose.
- Effects are data (`Op`, `Trigger`, `Selector` in `types.ts`). Add an op to the engine before using it on a card. Special-case a Major in code only when the data language can't say it.
- Flavor text: one line per card, hyphens or parentheses over em dashes, no contrastive setups, no tidy triads for rhythm. A real quote from the notes beats an invented line.
