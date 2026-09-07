# Response to the progression proposal of 6 September 2026

The proposal (`docs/reviews/2026-09-06-metagame/BONEMOON_METAGAME.md`) is a design for reasons to return: a persistent record, Renown as an achievement ladder, per-Significator progress, a weekly shared challenge, and a home screen that says what to do next. It is explicit that it proposes rather than describes. Its "smallest useful release" lists five steps. The first three are built. This records what they do, the values chosen, and what is parked.

## Built

**A record, in this browser.** Every completed match is stored: hero, opponent, seat, result, rounds, final Health of both, and the rules version it was played under. A match is credited once, by a unique id made when it starts. Up to 200 matches are kept. Leaving a page mid-match no longer throws the reading away: the committed state is saved after every action, and the title screen offers "Continue the reading" with the matchup and round. Starting a new reading replaces it. An abandoned reading is not a loss on the record, which the proposal's Renown rules do not care about (nothing is lost by losing) but the recent-form counts do; it is the honest choice over recording a loss the player never finished.

**Renown.** Ten for the first Standard win in each directional matchup. It never falls. Thirty matchups make 300 on the board today. The proposal's Expert (25, replacing 10) and mastery objective (+5) values are reserved in the data and nothing awards them, because neither Expert nor objectives exist yet. Rank titles are the proposal's: Initiate, Reader at 30, Adept at 100, Seer at 200, Oracle at 300. The thresholds are provisional, as it asks, and are one list in `src/ui/profile.ts`.

**Eligibility.** A normal completed match under the shipped rules and decks. The profile stores the rules version with each match, and a win under a different version is recorded but earns nothing. Bump `RULES_VERSION` in `src/engine/rules.ts` when a card or rule change would change a matchup.

**The next game, on the title screen.** Rank, Renown, the distance to the next rank, the unfinished reading if there is one, one specific next goal ("Beat Rorik as Shazz for 10 Renown. 2 of 5 opponents beaten so far."), and recent form as counts: the last twenty readings against the twenty before, and only once both exist. Before that, readings completed and won.

**The result screen.** After a first win in a matchup: "+10 Renown. First win over Rorik as Shazz." After a repeat win: on the record, Renown unchanged. After a loss: recorded, Renown never falls. The final-turn review carries the same line.

**Choose.** Each Significator shows opponents beaten and readings won, and the opponent list marks the ones already beaten with the chosen hero.

Five tests cover the crediting rules, the rank ladder, the next goal, and the form counts (62 tests in all).

## Parked, in the proposal's order

- **Expert and objective Renown.** Values are reserved; they wait on the Expert opponent and on published objectives, both already on the board.
- **Per-Significator experience and cosmetics.** Not built. The record already gives each Significator its games, wins, and cleared opponents; an experience track and card backs come with the story chapter.
- **A Weekly Reading.** Not built. It needs a validated pool of authored challenges and a version-stamped personal best. On the board.
- **Export and import.** Not built. Browser storage is device-bound and can be cleared; the title screen does not yet say so. On the board.
- **Accounts, friends, leaderboards.** Not built, and the proposal is right that a public board needs replay validation against seed and version before it can trust a browser's claim.

## Two judgments

The proposal's rule that Renown must not be awarded for attendance, and that remaining Health and speed are not skill, is followed: the only source of Renown is a first win in a matchup. And its warning that a first clear can be luck is taken at face value on the screen: the strip says it records what you have done at the table, and makes no claim of skill.

## Verification round (same day)

The review (`docs/reviews/2026-09-06-metagame/BONEMOON_METAGAME_REVIEW.md`) reran the tests, wrote three diagnostics against the record, and confirmed the name: the game is Moonwyld. It found six things. All six are addressed.

1. **A saved reading carried its result under the wrong rules.** True: the saved match had no version, and the result was stamped with the version of the day. Now the rules version is stamped when the reading starts, travels with the save, and is what the record uses at the end. A saved reading from other rules does not continue; the title says so, keeps the record, and offers to set it aside. Tests cover the settle path with an older version and the resume check.
2. **Saving was silent.** The standing now says "Saved in this browser only", and if a write fails it says the session is not being kept, on the title and on the result line. "Your record" opens the last twenty readings and a copy-and-paste export and import. Import checks the text is a Moonwyld record, migrates the first shape, and says what it replaces before it does.
3. **Lifetime counts were computed from the last 200.** True: a Shazz win vanished from Shazz's record after 200 Daxon games. Totals per Significator are now kept for life, outside the list, and credited match ids are kept separately so an evicted match cannot be credited again. An existing record migrates with totals built from what its list still holds, which the record screen says.
4. **The next goal was a paragraph.** It is a button that opens Choose with both Significators selected. When a reading is saved, Continue comes first and the new-reading button is secondary and says it replaces the unfinished one.
5. **Recent form pooled everything.** It now compares one Significator under one rules version, the last ten against the ten before, only once there are twenty such readings. Otherwise it shows completed readings and wins as counts, with abandoned readings disclosed beside them.
6. **Abandonment was invisible.** Leaving the table still pauses. A Concede action, with one confirmation, records a loss without touching Renown and says so on the result screen. Replacing a saved reading counts it as abandoned, disclosed in the counts.

Its judgment on what comes next matches the board: a tested Expert opponent, then one authored, replayable Reading with a disclosed objective and a personal best. Neither is started.
