# NEXT

- [ ] [cody] Play a reading on your phone after the 477ae92 round and say whether the table finally keeps its regions
    The lanes size themselves to the room the panels leave, the coach is one line in the column, the hand tucks into a strip on short phones, the play sheet shows the whole card. Any normal reading on your phone is the evidence the next design pass needs most.
- [ ] [cody] Choose the compact card treatment from the Card study: words or marks
    Title screen, Card study. The same crowded Shazz position in both treatments at your phone's height; docs/CARD_STUDY.md has the recommendation and what each costs.
- [ ] [cody] Shazz against Daxon: play it yourself in both seats before any card changes
    The bot loses it 57 of 60. The planner attacks half as often as Daxon and flips 0.4 times a game; whether the deck or the planner is at fault needs human hands. docs/experiments/shazz-vs-daxon.md.
- [ ] [crew] The visual language, second pass: the builder's filter rows and the record screen on the brass, ink, and vellum tokens
    The Card study on the title screen shows the same crowded position in both compact treatments, words and marks, with the drawer and inspection. Builder rows and the record screen follow once the treatment is chosen.
- [ ] [crew] A loss recap on the result screen: the decisive public sequence and the deck revision, from the log
- [ ] [cody] Play the three lessons once on your phone and say where the words ran ahead of the table
    The tutorial is on the title and on the character screen. Each lesson ends with an exercise you solve without the lights.
- [ ] [cody] Build a deck in Your decks, play it, and say what the builder still makes hard
    Cards, filters on both faces, the curve by printed cost, and Play from the builder or Choose. docs/READABILITY_RESPONSE.md has the round.
- [ ] [crew] Opening-hand mulligan and a second-player bonus
    Bot runs of all nine variants are in docs/experiments, stamped with commit and planner. The final seat and mulligan rules wait on seat-swapped human trials: you and Zach, both seats, matched seeds. Targets: 45 to 55 percent first seat as a screen.
- [ ] [crew] Browser regression suite: the flows still uncovered and the real-device checks kept explicit
    pnpm e2e runs the Playwright suite at desktop and both phone heights with a reduced-motion project. docs/E2E.md lists the eight flows, what each verifies, and what still needs a real device.
- [ ] [crew] Play focused custom decks against the AI (low curve, control, one-combo) and record how it copes before calling anything Expert
- [ ] [cody] Play a few readings and see whether Renown, the next goal, and Continue the reading feel right
    Renown is 10 per first Standard win in a matchup, kept in this browser. Rank milestones are provisional. docs/METAGAME_RESPONSE.md has the values and what is parked.
- [ ] [crew] Expert opponent: search a bounded set of the enemy's replies after the AI's turn, same rules and information
    Standard is the current two-step planner over dealt worlds. Expert should look at what the human can do back before committing. Budget it so the table never stalls.
- [ ] [crew] A results screen with decisive events and up to three disclosed stars, no strategy grade
    Stars: won, optional objective met, Expert win. Validate from engine events, not animation timing.
- [ ] [crew] A first curated Reading: fixed Significator, deck, opponents, and seeds, with a personal best kept per version
    Only after a validated pool exists; label a returning Reading as such.
- [ ] [crew] A three-encounter story chapter with checkpoints, wrapped around ordinary matches
    Opponent order after matchup testing. Disclose any bespoke rule before the battle. Rewards are lore and card backs, no combat upgrades yet.
- [ ] [crew] Lirielle burns two cards a game; test a Full Moon passive of Read 2 instead of an extra draw
    Define it as a variant in scripts/variants.ts and run `pnpm experiment lirielle-read` against the current baseline.
- [ ] [crew] Sound: a card-slide, a flip, a strike, the moon turning
    An independent workstream. A small replaceable prototype set with clear licenses and credits, controls and event hooks prepared with the motion system. Custom sounds later if Cody chooses.
- [ ] [cody] Second art pass from docs/ART_REVIEW.md: twelve touch-ups, Vraxxis and Cernis first
    The list is at the bottom of the review, one line per file. Same zip format as the first delivery;
    unzip over public/art and the game picks up the new files.
- [ ] [crew] Hot-seat mode for two people on one phone
    The engine is symmetric already. Needs a hand-hiding handoff screen between turns.
- [ ] [crew] The Nine Seals expansion: the Seal heads as Gears court and pips
    Void, Gaunt, Oritur, Korth, Sallow, Vala, Kaelthos, Pym. Also Danara, Zyphri, Eilwys,
    Smaldge, the rot spirits (Velkor, Togarax, Phagor, Lothis) for Antlers.
