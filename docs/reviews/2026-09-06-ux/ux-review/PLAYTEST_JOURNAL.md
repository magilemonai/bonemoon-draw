# Live UX playtest journal

Target: https://magilemonai.github.io/bonemoon-draw/
Date: 2026-09-06. Input through browser UI only. Desktop 1280×720; phone-width viewport 390×844 (pointer automation, not physical phone/touch hardware).

Read REVIEW_RESPONSE.md fully before testing. Its engine/simulation claims are context, not evidence of my own play.

## Sessions

- Preliminary desktop Daxon vs Rorik: interrupted at round 6 when the temporary browser tab was cleaned up across a user message. NOT a full game. Findings retained. Had Daxon at 5 HP and Rorik at 15 before Cannon U; no terminal outcome observed.
- Game 1 COMPLETE, desktop: Daxon vs Rorik, player first. Victory in round 6, own Health 20, opponent 0. Win modal read “The reading is yours” and “Daxon Lamn, The Fool, holds the table after 6 rounds.” Finishing line: Brookskippers U moved enemy Fool from Future to Present; Vraxxis R with Tidecaller U hit for 8. Screenshot saved.
- Game 2 COMPLETE, phone width: Shazz vs Masque, player second. Defeat in round 9, own Health 0, Masque 15. Terminal screenshot and full terminal AX snapshot saved. Successful wound-flip kill in round 3, copied Mana -> Death R in round 5, Sentry R attack for 6 -> hero flip U in round 7. Last turn used Lorien R (died attacking Gotch), Voren U Read Tower, then moved new Voren Present -> Past and Sentry Future -> Present. Masque cleared the blockers and ended the match next turn.
- Game 3 COMPLETE, phone width: Lirielle vs Luigi, player second. Defeat in round 7, own Health 0, Luigi 14. Round 3 Full Moon burned Lake Mirrara at an eight-card hand. Round 4 used Read the Stars and kept Null-Zone Pylon. Round 5 placed Pylon U centrally and Yvette U in Past, removing enemy Sentry's Guard. Round 6 cycled Sphere U into Pommeroy, played Pommeroy R, then discounted Lake Mirrara R to remove Merrick. Luigi ended the game on his following turn. Terminal screenshot and AX saved. Exact final damage chain was not inspected.

## Observations already reproduced

1. Desktop opening battlefield: board cards about 100×160, hand cards about 80×128, lots of unused horizontal space. Small resource labels. Fan overlaps hide names/text. At 720px height the lower hand is clipped in some selected-action layouts.
2. In preliminary round 2: selected ready Guard Post R, clicked empty enemy Future lane directly opposite. It canceled selection and dealt no damage. Selected again, clicked enemy portrait; dealt 3. Portrait glow existed but lane itself gave no attack action or explanation.
3. Hand face chooser explicitly says target/lane sequence. After a face is chosen, all action types use “Choose where it goes.” This loses the distinction between target and placement.
4. Elira R in game 1 round 2: enemy hero and enemy Wisplight appeared red-highlighted as targets. Clicking the hero canceled selection, retained Elira in hand, spent no Spark. Tried the line again; clicking Wisplight correctly changed prompt to “Now choose a lane.” Then choosing own Past played Elira, killed Wisplight. Potential UI bug in hero-targeted Figure placement; require separate reproduction/implementation confirmation before asserting root cause.
5. Pearl U movement works: selected armored Elira, attacked enemy Elira, selected own Elira again, clicked “Present (move).” She moved after attacking. Move label helps. Kaipo's automatic move after attacking worked as well.
6. Preliminary round 4 Braxon R + Aurium U: inspect said “On the table now: 5/5. Turned over it would be 4/6.” Correct computed totals, but right-side large stat badges still 2/3 and 3/2 (printed), visually competing with small prediction line. Screenshot desktop-braxon-flip-preview.png.
7. Unaffordable hand card chooser dims entire face descriptions as well as controls, reducing readability when planning future turns.
8. Phone hand uses “Has an effect” in place of effect text. Several cards extend off the right edge with no obvious next-card count/scroll cue in opening screenshot.
9. Phone Read 2: Grimore and Mordeaux displayed as small cards; Mordeaux text only “Has an effect.” I clicked Mordeaux's card to inspect its effect. That immediately KEPT it and dismissed Read. Separate Keep buttons were also displayed. This is an observed accidental commitment, not an inferred issue.
10. Read modal changed underlying turn label to “Their reading” / “Waiting” although it was waiting for my own Keep choice.
11. Phone Voren face chooser shows R 3/1 before play, without Shazz's +1 Attack included. Need on-board inspect comparison to confirm full projected preview.
12. Win modal “Back to the table” returns to title screen, not the completed battlefield. This prevented my planned postgame log review. Screenshot game1-daxon-victory.png.
13. Title moon landscape, indigo/gold typography, lore portraits, named suits/card scenes, and full-art inspect feel distinctly Valisar. Phone hero-name truncation shows “Imperator …” and “Lord-Provost Elaina …”.
14. Short damage/heal popups were useful to read resolved numerical changes (e.g., Vraxxis -8 to enemy, +4 healing to cap). Resolving locks all actions while animations finish; no measured animation durations yet. Do not claim timing measurements or audio tests.
15. Game 2 round 3: Voren U attacked Masque's central Guard Pylon. Pylon went from 1/5 to 1/4 with one wound. Inspect accurately said it would be 4/0 and dead after flipping. Closed inspect -> Wear a Face -> Pylon; it died as predicted. The phone inspect view fit both faces and the prediction at 390×844. Screenshot saved.
16. Game 2 round 4 Log showed the single normal draw of Shadowling Stalkers as two lines: “Shadowling Stalkers burns: Imperator Amegmon Shazz's hand is full.” and “Shadowling Stalkers burns: the hand is full.” Deck went 20 -> 19. No persistent own-hand count or burn count was visible in the HUD. A midgame AX/log file preserves this.
17. Horizontal scroll on the phone hand DOES work. Scrolling right at the bottom exposed Mordeaux and Liquid Mana, which were initially outside the visible area. Recommend discoverability rather than claiming cards inaccessible.
18. Phone Bone Moon countdown appears by round 7 (“Bone Moon in 3”), then round 8 (“in 2”), round 9 (“in 1”). Longer moon text squeezes own hero panel; round-8 screenshot shows own name reduced to “I…” and Wear a Face wrapped. Important responsive HUD issue.
19. Sentry R chooser shows printed 5/2, but on Shazz's board it becomes 6/2. Death R chooser likewise 6/6 -> board 7/6. Preplay stat preview omits hero passive. On-board inspect predictions were correct in tested cases.
20. A newly played Voren could move on arrival, as the rules permit. The “(move)” destination labels worked for both Voren and Sentry in game 2 round 8.
21. Read 2 round 8 offered Tower and Liquid Mana with only “Omen” on both small cards. A full screenshot documents that the decision screen omits the effects being chosen between.
22. Game 3 round 3: Full Moon burned Lake Mirrara, again with two log entries for the same card. Preserved in game3-fullmoon-log.txt.
23. Game 3 round 3: after placing Fin & Bin U, clicked Wisplight while the table still said Resolving. This opened the inspect modal. After closing and waiting for resolution, clicking the same card opened the play chooser with the correct discounted cost of 0. Same interaction changes meaning with animation state. Do not infer a timing duration from automated tool latency.
24. Game 3 round 4: Read the Stars displayed three small candidates (Taranis, Pylon, Boscoe), without full effects or visible reverse-face comparison. Boscoe read only “Has an effect.” The same own-choice modal showed underlying Their reading / Waiting. Kept Pylon with its explicit Keep button. Screenshot phone-lirielle-read3.png.
25. Rechecked the How to play page after all matches. It explains touching the moon to end a turn, Full Moon's two draws, round-ten Bone Moon, one attack OR move, wounds on flip, and Arrive not retriggering on flip. The information exists in the rules reference; the recommendation is to bring relevant pieces into live decision contexts. Visible text preserved in how-to-play-visible-text.txt.
26. None of the three completed matches reached active Bone Moon damage. Countdown observed through round 9; active escalation and early Bone Moon effects remain untested. No claims about touch hardware, audio, frame rate, statistical balance, or measured animation timing.

## Completion

Three complete games recorded. Desktop viewport restored and the live site left at its title screen. All gameplay used the visible browser UI; no engine globals or hidden game state were accessed.
