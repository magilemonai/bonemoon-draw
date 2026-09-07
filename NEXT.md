# NEXT

- [ ] [crew] Expert opponent: search a bounded set of the enemy's replies after the AI's turn, same rules and information
    Standard is the current two-step planner over dealt worlds. Expert should look at what the human can do back before committing. Budget it so the table never stalls.
- [ ] [crew] Three lessons on fixed positions: first reading, turn the fight, read the moon
    A lesson loader over real engine states, one prompt per decision, retry, and a test that each lesson's intended line still works after balance changes.
- [ ] [crew] A three-encounter story chapter with checkpoints, wrapped around ordinary matches
    Opponent order after matchup testing. Disclose any bespoke rule before the battle. Rewards are lore and card backs, no combat upgrades yet.
- [ ] [crew] A results screen with decisive events and up to three disclosed stars, no strategy grade
    Stars: won, optional objective met, Expert win. Validate from engine events, not animation timing.
- [ ] [cody] Play a game on your phone after the UX round and note anything the prompts still leave unclear
    The attack preview, the flip comparison, the Read chooser, and the phone HUD all changed. docs/UX_RESPONSE.md lists what moved and what was left.
- [ ] [cody] Read docs/REVIEW_RESPONSE.md and decide the first balance experiment
    Recommendation there: ship the rules fixes (done in code), then trial the Spent Sphere for the second seat.
    The seat split is 65/35 in the 600-game baseline; the token takes it to 58/42. Fallback: first player skips the turn-one draw.
- [ ] [crew] Lirielle burns two cards a game; test a Full Moon passive of Read 2 instead of an extra draw
    Define it as a variant in scripts/variants.ts and run `pnpm experiment lirielle-read` against the current baseline.
- [ ] [crew] Rorik's conditional passive measured 71% to 63%; queue it as the second experiment after the seat fix
    Variant `rorik-conditional` exists. Rerun it against the post-seat baseline before deciding.
- [ ] [cody] Second art pass from docs/ART_REVIEW.md: twelve touch-ups, Vraxxis and Cernis first
    The list is at the bottom of the review, one line per file. Same zip format as the first delivery;
    unzip over public/art and the game picks up the new files.
- [x] [cody] Send docs/UI_REVIEW_PACKET.md and docs/UI_KIT_PROMPTS.md out for an interface critique and ornament kit
    The packet points at the live page and asks nine questions. The kit is 13 transparent PNGs
    (six card frames, a lane mark, a banner ribbon, five emblems); unzip into public/art/ and the game wears them.
- [x] [cody] Send docs/DESIGN_REVIEW_PACKET.md to an outside designer for a written critique
    The packet is read-only: rules, every card, the decks, a fresh sim, and eight questions. Ask for prose,
    with card names and numbers. Bring the answers back here; each proposal gets checked against `pnpm sim`
    before it touches a card. Regenerate the packet with `pnpm review-packet` after any card change.
- [ ] [cody] Play five readings on the phone and note what felt bad
    The AI sim says Masque, Luigi, and Rorik decks win far more than Lirielle, Shazz, and Daxon.
    Some of that is the greedy AI misreading control decks. A human read is the real test.
- [x] [cody] Generate card art from docs/ART_PROMPTS.md and drop it in public/art
    Hand an image agent docs/ASTRA_PROMPT.md with ART_PROMPTS.md attached; it returns bonemoon-art.zip.
    Unzip with `unzip -o bonemoon-art.zip -d public/` so the files land in public/art/.
    Files are `public/art/<card-id>.jpg` (png also works), square 1024. Portraits are `public/art/sig-<name>.jpg`,
    plus `title.jpg` and `card-back.jpg` for the site. The procedural sigils stay as the fallback for anything missing.
- [x] [crew] Balance pass from the sim: Chariot, Merrick, Eldspyre, Chorus run hot
    `pnpm sim 200` prints win rate per card. First candidates: Sun Guard token 2/3 to 2/2,
    Merrick Blackwater 4/3 to 4/2, The World's full heal to 10, the Chorus 2/7 to 2/6.
- [ ] [crew] Deck builder screen: pick a Significator, build 30 from two suits plus Majors
    Rules are in docs/RULES.md under Building a deck. Store decks in localStorage.
- [ ] [crew] Hot-seat mode for two people on one phone
    The engine is symmetric already. Needs a hand-hiding handoff screen between turns.
- [ ] [crew] The Nine Seals expansion: the Seal heads as Gears court and pips
    Void, Gaunt, Oritur, Korth, Sallow, Vala, Kaelthos, Pym. Also Danara, Zyphri, Eilwys,
    Smaldge, the rot spirits (Velkor, Togarax, Phagor, Lothis) for Antlers.
- [ ] [crew] Sound: a card-slide, a flip, a strike, the moon turning
    Small, few, and off by default on phones until the player turns them on.
- [ ] [crew] Opening-hand mulligan and a second-player bonus
    Second player currently gets one extra card. Consider a one-shot Spark token like Hearthstone's coin,
    themed as an Eldertech Sphere.
