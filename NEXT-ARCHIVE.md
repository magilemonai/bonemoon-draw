# NEXT archive

Checked bullets move here from NEXT.md so the board stays lean. Newest first. Wording is kept as it was.

## Archived 2026-09-07

- [x] [crew] Display names for the 65 long card names, and a wider-card variant tested with six and eight cards on phone and desktop
    Full names stay in inspection. Judge board space and hand scrolling together.
    Done 2026-09-07: docs/ALIASES.md is the table, src/ui/names.ts the map; compact cards use the alias, the Codex and inspection keep the full name.
- [x] [crew] Export and import of the local profile, since browser storage is device-bound and can be cleared
    Built: Your record carries the profile and the decks as one pasted text. Fresh-context transfer is in the browser suite.
- [x] [crew] Three lessons on fixed positions: first reading, turn the fight, read the moon
    A lesson loader over real engine states, one prompt per decision, retry, and a test that each lesson's intended line still works after balance changes.
- [x] [cody] Read docs/REVIEW_RESPONSE.md and decide the first balance experiment
    Recommendation there: ship the rules fixes (done in code), then trial the Spent Sphere for the second seat.
    The seat split is 65/35 in the 600-game baseline; the token takes it to 58/42. Fallback: first player skips the turn-one draw.
    Decided 2026-09-07: screening targets are 45 to 55 percent first seat and 40 to 60 percent per Significator in bot play, as diagnostics. The nine variants were rerun on the current planner; seat and mulligan wait for the human trial.
- [x] [crew] Rorik's conditional passive measured 71% to 63%; queue it as the second experiment after the seat fix
    Variant `rorik-conditional` exists. Rerun it against the post-seat baseline before deciding.
    Rerun 2026-09-07 on the current planner as part of the full variant set; docs/experiments/rorik-conditional.md.
- [x] [cody] Send docs/UI_REVIEW_PACKET.md and docs/UI_KIT_PROMPTS.md out for an interface critique and ornament kit
    The packet points at the live page and asks nine questions. The kit is 13 transparent PNGs
    (six card frames, a lane mark, a banner ribbon, five emblems); unzip into public/art/ and the game wears them.
- [x] [cody] Send docs/DESIGN_REVIEW_PACKET.md to an outside designer for a written critique
    The packet is read-only: rules, every card, the decks, a fresh sim, and eight questions. Ask for prose,
    with card names and numbers. Bring the answers back here; each proposal gets checked against `pnpm sim`
    before it touches a card. Regenerate the packet with `pnpm review-packet` after any card change.
- [x] [cody] Generate card art from docs/ART_PROMPTS.md and drop it in public/art
    Hand an image agent docs/ASTRA_PROMPT.md with ART_PROMPTS.md attached; it returns bonemoon-art.zip.
    Unzip with `unzip -o bonemoon-art.zip -d public/` so the files land in public/art/.
    Files are `public/art/<card-id>.jpg` (png also works), square 1024. Portraits are `public/art/sig-<name>.jpg`,
    plus `title.jpg` and `card-back.jpg` for the site. The procedural sigils stay as the fallback for anything missing.
- [x] [crew] Balance pass from the sim: Chariot, Merrick, Eldspyre, Chorus run hot
    `pnpm sim 200` prints win rate per card. First candidates: Sun Guard token 2/3 to 2/2,
    Merrick Blackwater 4/3 to 4/2, The World's full heal to 10, the Chorus 2/7 to 2/6.
- [x] [crew] Deck builder screen: pick a Significator, build 30 from two suits plus Majors
    Rules are in docs/RULES.md under Building a deck. Store decks in localStorage.
    Built in the readability round (Your decks, the builder, per-revision records). docs/READABILITY_RESPONSE.md.

## Superseded 2026-09-07 (not done; folded into the phone-play bullet on the board)

- [ ] [cody] Play five readings on the phone and note what felt bad
    The AI sim says Masque, Luigi, and Rorik decks win far more than Lirielle, Shazz, and Daxon.
    Some of that is the greedy AI misreading control decks. A human read is the real test.
- [ ] [cody] Play a game on your phone after the UX round and note anything the prompts still leave unclear
    The attack preview, the flip comparison, the Read chooser, and the phone HUD all changed. docs/UX_RESPONSE.md lists what moved and what was left.
