# Moonwyld: readability and deck building

For Claude, from Cody's latest feedback and Codex's verification. Reviewed 6 September 2026 at `d782103`, against https://magilemonai.github.io/moonwyld/.

## Decisions and verification

**Moonwyld is the confirmed name.** Keep the Bone Moon and Luigi Bonemoon as lore, and preserve existing progress through branding and storage changes.

**Cody explicitly requires players to build their own decks from the Codex.** Treat this as a core game feature. For a player like Zach, discovering a combination, building around it, playing it, and refining it creates a strong reason to return.

The second verification response in `docs/POLISH_RESPONSE.md` checks out. All **74 shipped tests passed** in an isolated snapshot: 23 review, 10 profile, 13 preview, 7 AI, and 21 engine tests. The Kaipo movement, absorbed hit followed by damage, and Rekindle display defects are closed. Retain the engine-based preview and identity tracking. Earlier handoffs describe historical defects; do not implement those repairs again.

The remaining preview concern is wording. “Yours moves to Past at 1” should identify the Figure and the unit: **“Kaipo moves to Past with 1 Health.”** Likewise, identify who Rekindles and show the resulting face and Health when known. The tests establish those covered behaviors; they do not establish expert-level AI difficulty or visual polish.

This pass inspected the title, record, character selection, Codex, inspect, rules, battle, face selection, and Read screens at **1280 × 800** and **390 × 844**, plus Cody's screenshots. Battle evidence includes a partial Lirielle-versus-Shazz game through round 2. This was a focused UI audit, not three additional full games. Screenshots are in `readability-audit/screenshots/` beside this handoff; the test run is in `readability-audit/test-results.txt`.

## The visual direction

Cody's objection is justified. Essential information repeatedly lands around **10–12 px**, often dimmed, while substantial space is devoted to backgrounds or empty layout. Text that technically fits still demands effort to read. The title also places pale text over the brightest part of the moon.

Make functional body text approximately **16–18 px**, secondary information **14–16 px**, and critical resource values **24–32 px** as starting design targets. Use readable numerals with explicit units. Reserve the display serif for the logo, names, and headings. Give essential text a stable reading surface and full-strength color. These are proposed design targets, not a measured accessibility certification.

Reorganize and reflow the layout to support that scale. Increasing every font inside the existing boxes will create overflow. Preserve Valisar through the paintings, palette, moon, and character identities; make instructions direct enough to understand during a turn.

## Ten highest-impact interface changes

### 1. Rebuild the battle information layout around readable resources

**Problem and evidence:** Cody's battle screenshot leaves a large gap between opponent and player while names and counts are crowded. The opponent's identifying surname is truncated. On the phone audit, “Spark” measured **10.2 px**, hand/deck text **11.7 px**, and the Spark denominator **10.8 px**. Decorative card backs compete with the hand count.

**Smallest coherent fix:** group each character's short recognizable name, Health, Spark, hand count, and deck count in a compact, readable block near the board. Use “Masque” or “Shazz” in constrained space; put formal titles in details. Show clear numeric totals such as “Hand 8/8” and “Deck 19.” Keep decoration clear of those totals. Desktop space should support the board and these blocks; phone should reflow them into full-width rows.

**Could break:** larger blocks can consume board height. Verify the whole battle with a full hand and occupied lanes, not just an isolated header. Show resource overflow accurately when Spark exceeds its normal maximum.

### 2. Give End Turn and the forecast protected space

**Problem and evidence:** Cody's hand card overlaps the next-round forecast. The audited forecast was **11.1 px**, with reduced opacity. “Quick / Log / Concede / Leave” controls were only about **27 px high** on phone.

**Smallest fix:** put **End Turn** inside an obvious button. Place “Next draw: 1 card,” “Hand full · 1 card would burn,” and the Bone Moon countdown in reserved adjacent space. Keep the moon as a phase indicator. Use comfortably sized controls; approximately 44 px touch targets are a useful starting target. Put infrequent actions into a labeled menu and rename ambiguous “Leave” according to its actual save behavior.

**Could break:** a fixed footer can hide the hand or board. Reserve its space in layout. Forecasts must use actual effects and current state, including cards that accelerate the Bone Moon.

### 3. Establish a readable hand size and deliberate browsing

**Problem and evidence:** cards measured about **92 × 147 px** in the phone audit. The desktop rule `min(118px, 11.5vh)` also yields 92 px at an 800 px viewport height. A six-card phone hand already displayed “2 more.” Names clip and overlapping cards obscure useful information.

**Smallest fix:** test a deliberate minimum width around 110–120 px, curated short names, and controlled overlap. At phone width, show a few recognizable cards with explicit horizontal browsing and an accurate total. Keep battle cards focused on identity, cost, combat values, and important statuses; open readable details on tap.

**Could break:** larger cards reduce the number visible. Test eight-card access and selection while preserving the turn controls. Do not make hover the only route to information. Wounds deserve particular attention: the source currently specifies an **8 px** wound label.

### 4. Give the Codex a readable card-library presentation

**Problem and evidence:** the painting view makes the art recognizable. The card view reuses compact hand cards, measured around **111 × 177 px**, with nine columns on desktop. Effects are hidden, and some Omens have a large blank lower area. This will be a poor foundation for deck building.

**Smallest fix:** add a library presentation with fewer, larger cards or readable rows, plus both-face inspection. Display cost, type, identity, and useful effect information. Integrate quantity controls and the deck count into this view as described below.

**Could break:** more information reduces browse density. Offer a compact list for experienced players without forcing small text on everyone. Keep the art gallery available as a distinct browsing choice.

### 5. Protect title text from the moon and simplify the next goal

**Problem and evidence:** pale text crosses a bright textured moon. The desktop subtitle is **15.75 px** and only about 282 px wide. The standing panel is 420 px wide on a 1280 px screen. “Beat Lirielle Starwhisper as Daxon Lamn for your first 10 Renown” is a long sentence used as a button; “30 to Reader” lacks a unit.

**Smallest fix:** move the text to a consistently dark area or give it a stable dark surface. Use a prominent Play/Continue action. Structure the goal as “Daxon vs Lirielle,” “First victory · +10 Renown,” and “Play this matchup.” Show “0 / 30 Renown to Reader.”

**Could break:** heavy panels can bury the moon painting. Adjust composition and test contrast over the actual art at both widths. Keep goal identity and rewards connected.

### 6. Make both faces equally readable before commitment

**Problem and evidence:** inspect rules measured **13.8 px** on desktop despite a large art panel. The unselected face is dimmed to **0.78 opacity**. Gold Upright text is weak against pale parchment. Phone face selection squeezes two text columns beside a thumbnail; its rules measured **12.3 px**.

**Smallest fix:** use readable rules text, full contrast for both alternatives, and an outline/check to identify selection. Label Attack and Health in inspect. On phone, prioritize the comparison and let art occupy a smaller or collapsible region. Separate flavor asides from functional rules. “Need 1 more Spark” is clearer than an unexplained unavailable action.

**Could break:** stacked alternatives can require scrolling. Keep the selected face and commit action visible together. Preserve actual keywords and trigger meaning when changing presentation or copy.

### 7. Make Read choices easy to compare

**Problem and evidence:** Lirielle's Read 3 showed Mordeaux, Yvette, and Kaelen. Descriptions measured **11.7 px** with roughly 15 px line spacing. Desktop Keep buttons sit at different heights. Phone uses two narrow columns and a third differently sized centered option.

**Smallest fix:** use consistent full-width candidates on phone with name, cost, readable effects, and a clear “Keep [name]” action. Use aligned, readable columns on desktop. Preserve the repaired separation between inspecting a candidate and keeping it.

**Could break:** longer candidate rows can extend beyond the viewport. Ensure all three remain reachable without clipping the modal's actions, and retain the player's selection during inspection.

### 8. Keep character/deck selection and Play together

**Problem and evidence:** phone character selection is approximately **1321 px** tall. The start action begins around **y=1249**, so choosing a character near the top still requires scrolling past all six. Every candidate presents multiple layers of text at once.

**Smallest fix:** use “Choose your character,” a concise playstyle line, and expanded details for the selected character. Provide a persistent selection summary containing character, selected saved deck, and Play. Reserve its space. Keep “Significator” as the explained game term.

**Could break:** sticky controls can cover the last option; hiding details can make characters hard to compare. Keep a deliberate detail/inspect action available for every option.

### 9. Make the record show accomplishments first

**Problem and evidence:** opening Your Record exposes raw JSON and copy/import controls. On phone, the text area uses **10.8 px** text. Backup mechanics dominate the presentation of the player's accomplishments.

**Smallest fix:** lead with Renown, character clears, lifetime results, and recent matches. Move backup/restore into a secondary disclosure with understandable export/import controls. Include saved deck identity in future match history.

**Could break:** burying backup too deeply undermines browser-only persistence. Keep a clear storage notice and accessible backup action. Preserve validation, overwrite confirmation, and truthful save-failure messages.

### 10. Use concrete instructions and examples throughout

**Problem and evidence:** preview lines use “Yours,” “It,” and “at 1.” “Reading,” “Read,” and “Reader” have different meanings. The rules page is visually steadier than battle text but stretches to roughly **2317 px** on phone with about 3554 characters of prose.

**Smallest fix:** name actors and units in consequences, use direct navigation labels, and add a short play sequence plus one illustrated wounds-and-flipping example. Make keyword definitions easy to reach from card details. Keep full rules available.

**Could break:** terminology drift can confuse experienced players. Preserve formal rules terms and define them consistently. Avoid replacing established triggers with new synonyms in card rules.

## Required feature: build and play custom decks from the Codex

### The complete player flow

**Codex → Build deck → Choose character → Add cards → Save → Play that deck.** Also let players duplicate a starter deck and modify it. Keep multiple named decks, with rename and duplicate actions. Starter lists should remain available.

On desktop, use a readable card browser beside a persistent deck list. On phone, use **Cards / Deck 24/30** views with the count and key actions kept visible. A narrow sidebar beside tiny cards would reproduce the current problem.

Search should cover names and rules on **both faces**. Provide suit, cost, type, and keyword filters. Make search scope obvious. Each entry needs recognizable art/name, cost, quantity, accessible add/remove controls, and both-face inspection. Show why an unavailable card cannot be added. Never count Upright and Reversed as two separate cards.

Show the cost curve and Figure/Omen/Relic totals so Zach can evaluate a plan. Label whether the curve uses printed costs; character discounts can otherwise make it misleading. Keep the playable collection available without a card-unlock grind for this release.

### Deck rules and persistence

Enforce the current stated rules: **30 cards**, at most **two copies of a Minor**, at most **one copy of a Major**, and exclusion of the selected character's own Major. As the recommended initial constructed format, restrict Minors to that character's two suits, matching the current starter identities; make this rule explicit rather than assuming players infer it.

Tokens cannot be added. **Brog remains Luigi's automatic opening-hand addition** and does not consume a slot in the 30-card deck. Changing the character must revalidate the list.

Allow incomplete drafts to save. Disable Play until legal and state the actual problems, such as “24/30 cards” or “Remove one extra copy of Yvette.” Save decks locally and include them in backup/restore. After a balance update, explain any newly invalid list and preserve it for editing.

### Make the chosen deck reach the actual match

The current `createGame()` builds from `significator.deck`; it has no custom-deck input. A Codex list alone would not satisfy this feature. Add validated per-player deck inputs and ensure match setup actually uses the selected saved deck. Do not mutate shared starter definitions.

Snapshot the starting list, character, deck identity/revision, and rules version at match creation. Editing a saved deck later must not change an ongoing or resumed game. Match history should identify the deck used. Statistics by deck revision help players understand whether a change improved their results; show the number of games behind any win rate and separate relevant modes/opponents.

### Progress and AI consequences

**Recommended progression policy:** legal custom decks count in Standard PvE. Retain the once-per-character/opponent first-clear reward so duplicating decks cannot farm Renown. This deliberately expands the earlier fixed-starter progression proposal. Preserve existing awards, identify starter/custom decks in records, and clearly label any future challenge that requires a fixed deck. Make recorded results comparable by rules version and difficulty.

**Information fairness needs an explicit change.** In `src/ai/ai.ts`, `determinize()` currently builds its enemy pool from the actual `en.hand` plus `en.deck`, then shuffles it. This conceals allocation and order, but reveals the exact unseen composition. With published starter decks, composition can be inferred from the known list. With private custom decks, this becomes privileged information. For ordinary private-deck play, build beliefs from public history, known rules, and revealed cards rather than reading the opponent's actual unseen card multiset. If decklists are intentionally public, disclose that rule to both players. Preserve the earlier hidden-order repair.

Custom construction also changes balance. Test focused synergy decks, low-curve aggression, control, and resource abuse against the AI before claiming it provides a reliably challenging Expert experience. The builder makes those strategies possible; the present 74-test pass cannot establish their balance.

### Acceptance checks

- Build a legal deck in the Codex, replace one starter card, start a match, and verify the engine received the exact 30-card multiset. Repeat after reload and through the character-selection flow.
- Exercise copy limits, an excluded own Major, off-suit cards under the chosen format, tokens, and changing the character. Confirm Luigi still receives Brog correctly.
- Save an incomplete draft; clearly explain why it cannot play. Rename, duplicate, export, and restore decks without corrupting existing progress.
- Edit a deck while a match is saved; resume the original match with its original list and identity. Preserve seeded reproducibility for identical inputs.
- Award a legitimate custom-deck first clear once. Duplicating or renaming the deck must not award it again. Show deck identity and sample size in its results.
- Verify the AI's private-deck information boundary with states that share public information but have different unseen compositions.

## Delivery and visual acceptance

Prioritize the readable battle layout and the complete deck-building path. Apply the same typography and interaction rules to the remaining screens. Verify at **390 × 844**, **1280 × 800**, and a shorter desktop viewport at normal browser zoom. Include a full hand, occupied lanes, Relics, wounds, long names, Read 3, and both-face inspection. Essential text and actions must remain readable and reachable without cards covering forecasts.

The accompanying HUD concept demonstrates the proposed information scale and hierarchy. It is a component study; its layout still needs validation inside the full battlefield. Its local interactions and structure were checked, but that check is not a browser-rendered layout test.

This handoff proposes product and implementation changes for Claude. Production game source was not edited during this review.
