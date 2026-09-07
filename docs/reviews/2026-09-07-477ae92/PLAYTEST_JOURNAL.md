# Moonwyld 477ae92 verification journal

Active review begun 6 September, continuing 7 September 2026. Production source untouched. Local snapshot under `sandbox/`; all 86 shipped tests pass (see `test-results.txt`). This is a chronological journal. The completed handoff is MOONWYLD_477AE92_HANDOFF.md; later closure notes below supersede the early outstanding list.

## Tutorial coverage so far

- Entered Learn to play from title. Played lesson 1 completely at 1280×800, normal speed (Quick unchecked; initially inherited checked). Intended sequence: Guard Post Reversed in Present, attack Rorik 20→17, end (Rorik heals to 18), Fisherman Upright in Past, Sword Guy on Guard Post, attack to 13. Complete.
- Lesson 2 played completely at 390×844: Voren attacks Pylon (each takes 1); attempted ability before required inspection, correctly refused with “Inspect the Pylon first: the small i on its card.” Spark stays 2. Inspected Pylon: clear comparison 1 Attack/3 Health → 4 Attack/0 Health, “it dies”; used Wear a Face to kill it; ended; Oondray attacked and killed Veiled Wisplight; killed wounded Guard Post with Wear a Face. Complete.
- Lesson 2 Retry checked during final exercise: deliberately flipped own wounded Voren and killed him, spent 2 Spark (3→1); Retry restored Voren with one wound, Spark 3, hand 2, deck 25, enemy Guard Post wounded and present.
- During lesson 2 Veiled step: ability then click Wisplight opens inspection, without an explicit refusal sentence; closing inspection leaves no ability target selection. Need inspect tutorial glow behavior on desktop replay: source `hints` includes Wisplight's lane unconditionally even though instruction says it should not light up for ability.
- Lesson 2 copy defect: after Pylon dies text says “it never dealt a blow,” although it dealt 1 retaliation earlier.
- Lesson 3 played completely at 390×844. Step 1 End turn refused “Play a card first.” Played Wisplight Reversed in Past (legal, though hints suggest Oondray/Boscoe), then Read the Stars. Pressed Keep Null-Zone Pylon without inspecting: advances step 3 directly to step 5. Source/tests confirm this is intentional to prevent a stalled Read; recommend make inspection optional in copy rather than call it an accidental engine bug.
- Lesson 3 step 5 says “The Wisplight costs 1” although Wisplight already played legally in step 1. Reversed Yvette accepted at step 5: Spark 2→0, hand 6→7, own Health 20→18; instruction still says back to 6 and play Wisplight. No affordable cards left. Retry restores Health20/Spark2/hand6/deck25. Played Oondray Reversed in Present to free space instead.
- Lesson 3 end round2: Full Moon drew 3, hand5→8, no burns. End round3: own Health20→19, Luigi remains20, hand8 burned the next draw. Step8 says “You took 1, and so did Luigi” prematurely; Luigi takes his first Bone Moon damage only on his round4 turn.
- Lesson 3 final exercise completed using Liquid Mana Upright, then Null-Zone Pylon Upright in Future: hand8→7→6, then End turn. Complete; settled next round5 Lirielle17, Luigi19, hand7. Source completion checks hand before ending, appropriately.
- All three Completed marks appeared. Reload returned to title without disturbing pre-existing saved ordinary Lirielle-vs-Shazz round2 match. Entered New reading → “New here? Three short lessons”; all three Completed marks persisted. Screenshot saved.
- Lesson1 replay at 390×844: wrong Fisherman Upright refused “Start with the Guard Post, Reversed.” Correct Guard Post Reversed in wrong lane Past ACCEPTED; step2 highlights remain fixed to Present despite actual Figure in Past. Screenshot saved. Attack via actual Past works; subsequent Fisherman step's Past hint can also point to an occupied lane.
- Lesson1 replay final exercise deadline bypass: did not use Sword Guy. Rorik18→15 from Guard Post; ended round2; Rorik healed to16; round3 Guard Post alone attacked to13 and lesson marked Complete despite “before the turn ends.” Screenshot saved. Source final done predicate only checks Health<=13 and has no deadline.
- At this early checkpoint, lesson2 desktop replay and the remaining expanded checks were still in progress. See final closure below.

## UI evidence observed

- Phone lesson coach overlays opponent HUD and top portions of all enemy cards. Long step7 coach almost covers entire enemy row. Own board cards overlap player name/portrait area in phone battle. Screenshot `lesson-2-phone-overlay.png`.
- Phone play sheet Yvette showed full two cards and Shazz-adjusted Reversed 3/2 (printed2/2), correctly. Text is still very small; measurement pending. Screenshot `shazz-play-sheet-phone.png`.
- Phone inspect Pylon comparison is clear and fits full portrait, both rules panels, and flavor at390×844.
- Phone Read rows use narrow middle prose columns and tall rounded Keep buttons, splitting names vertically (“Keep / Null- / Zone / Pylon”). Need save screenshot on desktop replay resized phone; first screenshot observed in tool only.
- Phone turn banner “Luigi Bonemoon reads” appeared clipped on right during transition, overlapping own Health area. This was an intermediate screenshot, not a measured frame-rate/jitter claim.
- Full cards / card backs appear in animated transitions; no definitive early-front or stuck-back conclusion yet. Need source/animation inspection and reduced-motion verification.

## Initial outstanding list (historical; see final closure)

1. Finish coverage of all lessons at both widths; leave/reenter, hints, alternative solutions diagnostics.
2. Masque +1 Upright Health, Figure/Omen/Relic/full card, enters-only-Reversed, Need N more Spark.
3. Draw, AI Figure, Read, both players' Omen backs/reveal; reduced motion; polish animation recommendations.
4. Custom deck copy/edit/illegal copies/suit/ownMajor/token; engine actual list; builder & Choose play; edit while saved and resume; export/import fresh browser profile.
5. Readability measure min essential text across requested screens.
6. Build private nonstarter deck and play THREE full games; controlled hidden-information diagnostic, do not infer proof from anecdotes.

All future findings should distinguish live browser observations, source findings, and constructed tests. Final handoff: problem, evidence, smallest fix, what it might break. Keep screenshots and diagnostics in this folder.

## Final closure

- All three lessons completed at both 1280×800 and 390×844. Desktop lesson2 confirmed the Veiled tutorial light contradicts its instruction. Desktop lesson3 inspected and kept Sentry, used Wisplight, then Liquid Mana and Sentry to finish the final exercise. Leaving lesson3 at step2 and returning reset step1.
- Added a final lesson1 replay: Sword Guy spent Spark2→0 and raised Guard Post3→5; Retry restored Spark2 and Attack3. Played Kaipo’s Pearl Reversed for0 on Guard Post, attacked for5, and completed the exercise with Rorik13 in round2. Alternative solution accepted live.
- Built Masque custom deck Lantern Engine rev17 through UI. Removed eight starter slots, added Boscoe×2, Mordeaux×2, Sphere×2, one Guard Post, one Vraxxis. Third Pylon disabled with sentence on pointer tap; off-suit Merrick, own Hierophant, actual Brog token excluded.
- Started game1 via builder. Masque preview bonuses correct (Boscoe1/4, Pylon1/5); Vraxxis hypothetical Upright3/4 disabled because only enters Reversed; insufficient Spark reasons correct.
- Paused game1 at round1. Renamed to Lantern Engine II and replaced one Vraxxis with Pommeroy, creating revision19. Resumed original hand/resources. Completed game1 retained name/rev17 on record.
- Game1, desktop normal, Masque vs Lirielle, second seat: lost round8. Reversed Orrery dealt lethal2 at own Health2.
- Game2, phone Quick, Masque vs Daxon, first seat, rev19: lost round13. Tested Relic attachment, Aegis, Guard, trades, healing, and Bone Moon.
- Game3, desktop Quick, Masque vs Luigi, first seat, rev19: won round8. Mordeaux echoed Eldertech Sphere, then Reversed Solar Wind cleared three Figures. Reversed Vraxxis plus Reversed Aurium Plate gave7Attack/Windborne and lethal into Future.
- Exported actual three-match record,1win/2losses/0concessions/10Renown and legal30-card deck. Same-browser Paste→Check→Replace passed and retained all lesson marks. The actual JSON is audit-record-export.json.
- Native computer-use permissions remained pending after two attempts. Fresh browser-profile import and live OS reduced-motion could not be completed. Do not describe these as passed.
- Sampled card-back animations for draw, opponent Figure, Read the Stars, own Omen, opponent Omen; see frame files. Read Stars initial matrices were180degrees and all settled to fronts. No persistent stuck back observed. Phone Figure entrance crosses HUD; Omen opacity/hover overlap is muddy. Sampling did not cover every initial frame.
- Font measurements: phone keywords8px; names11px; play-sheet rules11px with1.05cardzoom; desktop keywords9px. Pinned phone Play remained y788,height46 before/after scrolling at844height. Title painting/text separation improved.
- Source-confirmed Draw again omits deck argument and falls back to starter. Builder’s “with this list” tally groups across revisions (1/3 for current revision19, which actually went1/2).
- Eight supplemental diagnostics passed: exact custom list across20dealing seeds, input-list isolation,20AIbelief samples/five decisions invariant to hidden composition in one matched public position, wrong-lane reproduction, deadline-bypass reproduction, Pearl alternative, actual export parsing, and FlipIn zero-duration component-props check. Original86tests also passed.
- Later local HEAD3c826bb appeared during testing. Relevant frozen files match477ae92 byte for byte. Browser remained on loaded assets/index-BAtMHkXL.js.
- Returned browser to title and restored initial Quick preference; viewport override reset. Final browser console query returned no warnings/errors. Production source untouched.
