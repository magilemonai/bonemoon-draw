# The Bonemoon Draw: design review packet

A read-only snapshot of the game for an outside designer. It has the full rules, every card, the six playable Significators and their decks, and numbers from an AI-versus-AI simulation. The questions at the end are what we most want an opinion on. Nothing here needs to be edited; a written critique is the deliverable.

## What we want back

A critique in plain prose, organized by the questions below, with specific card names and numbers wherever possible. For any change you propose, say what problem it solves and what it might break. Proposals should stay inside the effect language the cards already use (the keywords and triggers you see on the cards); a new keyword is fine if it is defined in one sentence.

## Questions

1. **The two faces.** Choosing Upright or Reversed is meant to be the interesting decision on almost every play. Where is that choice obvious (one face is always right)? Which cards have a second face that nobody would ever choose? Which Reversed faces are so much better that the Upright face is dead?
2. **Flipping as a weapon.** Wounds persist across a flip, so flipping a damaged wall kills it. Is that too strong, too niche, or right? Are there enough flip effects, and are they in the right suits?
3. **Three lanes.** Each side holds at most three Figures, attacks go straight across, and Guard only redirects from adjacent empty lanes. Does the lane system create real positional decisions, or does it collapse into "play the biggest thing in the middle"? Is moving (one action, adjacent empty lane only) worth its cost?
4. **The Bone Moon.** It rises on round ten and bites both players harder each round. Is round ten right? Should it scale faster? Is bringing it early (The Moon, Reversed) a real strategy or a gimmick?
5. **Balance across Significators.** The sim below shows Masque, Luigi, and Rorik winning far more than Lirielle, Shazz, and Daxon. The AI is a greedy one-step planner and misplays control and Read-heavy decks, so treat the numbers as a hint. Which decks look weak on paper, and why?
6. **Card-by-card.** Which cards are over- or under-costed for their rank? The rank-to-cost ladder is: Ace 1, Two and Three 2, Four and Five 3, Six and Seven 4, Eight 5, Nine 6, Ten 7, Page 2, Knight 4, Queen 6, King 8. Majors are priced individually.
7. **Significator abilities.** Each is 2 Spark, once a turn, meant to be small. Are any of them too central or too irrelevant? Is any passive doing nothing?
8. **What is missing.** What would a seasoned card-game player expect that is not here (mulligan, a second-player bonus beyond one extra card, a discard outlet, reach for finishing)? What is here that could be cut?

## Rules


A two-player tarot battler set in Valisar. One deck of seventy-eight cards, four suits and twenty-two trumps, every card with two faces. This is the long version of the rules. The short version lives in the game under How to play.

## What you are trying to do

Each player is a Significator: the card that stands for them at the table. Daxon is The Fool, Lirielle is The Star, Luigi is The Hermit, Rorik is The Hanged Man, Masque is The Hierophant, Shazz is The Devil. A Significator has 20 Health, a passive, and an ability that costs 2 Spark and can be used once a turn.

Bring the other Significator to 0 Health and the reading is yours.

## The table

Three lanes sit between the players: Past, Present, Future. Each lane holds one Figure per side. A Figure attacks the Figure across from it. If the lane across is empty, it attacks the enemy Significator instead, unless a Guard in a neighboring lane steps in.

Three lanes is the whole board. There is no crowding, no wide board of tokens. Every Figure matters, and the fight is about which lanes you hold, which faces are up, and what you turn.

## Two faces

This is the game's one big idea, borrowed straight from the tarot table: a card that comes out upside down means something else.

Every card has an Upright face and a Reversed face. When you play a card, you choose the face. For a Figure, Reversed swaps its printed Attack and Health and gives it different text. A 1/3 Guard Post played Reversed is a 3/1 with Windborne. Kojin the Fiery Whip, played Upright, scorches the Figure across from him at the end of each turn. Reversed he is Kojin, Burning Wild, and he scorches everyone.

For an Omen, the two faces are two different spells. For a Relic, two different attachments.

Some cards say **Enters Reversed**. Those can only be played face down, so to speak. The Shadow's creatures work like that.

### Flipping

Many cards flip a Figure to its other face. The Figure keeps whatever wounds it has taken. Its Attack and Health swap, its text changes, and its name sometimes changes too (Lorien of the Hand becomes Lorien Shadowblade).

Wounds staying put is the sharp edge here. A 1/8 Heartwood that has taken one point of damage is an 8/1 with one point of damage when it flips, which means it is dead. Flipping your opponent's damaged wall is a kill. Flipping your own glass cannon after it attacks turns it into a wall.

A Figure with **Fixed** can't be flipped. The Empire likes Fixed.

## A turn

1. **Spark.** Your maximum Spark rises by one, up to ten, and you refill to the maximum.
2. **Draw** one card. On a Full Moon round, draw two.
3. **Act** in any order: play cards by paying their Spark cost, attack with Figures, move a Figure to an adjacent empty lane, use your Significator's ability.
4. **End the turn** by touching the moon.

A Figure gets one action a turn: attack, or move to an adjacent empty lane. It can't attack on the turn it arrives unless it is Windborne. Attacking is mutual: the attacker and defender deal their Attack to each other at the same time. Attacking the Significator costs the attacker nothing.

Your hand holds eight cards. Draws beyond that burn. When your deck is empty, each draw costs you Health instead: one, then two, then three.

## The moon

The moon turns once each round: new, waxing, full, waning. On a Full Moon everyone draws an extra card, because in Valisar the stars glow brighter when the moon is full.

On round ten the Bone Moon rises. From then on every Significator loses Health at the start of each of their turns: one point in round ten, two in round eleven, three in round twelve. Nobody outlasts the Bone Moon. It ends stalls, and it makes a few cards very interesting. The Bone Moon Reversed brings it early, for both of you.

## Card types

- **Figures** stand in lanes. They have Attack and Health, and most have text or keywords.
- **Omens** are cast once and go to the graveyard. Many need a target.
- **Relics** attach to one of your Figures and stay until it leaves the table. Relic stats and keywords keep working even if the Figure is Hushed.

## Keywords

| Keyword | What it does |
|---|---|
| Arrive | Triggers when the Figure is played. Not when it flips. |
| Last Rite | Triggers when the Figure dies. |
| Guard | Attacks into an adjacent empty lane hit this Figure instead of your Significator. |
| Windborne | May attack the turn it arrives. |
| Gale | May attack into any enemy lane. |
| Veiled | Can't be targeted by enemy Omens or abilities. Drops the first time it attacks. |
| Fixed | Can't be flipped. |
| Aegis | Absorbs the next damage the Figure would take. If the Figure carries Aegis as a keyword (a Relic, an aura), it recharges at the start of your turn. |
| Rekindle | The first time this Figure would die, it comes back Reversed with 1 Health. |
| Feast | Damage this Figure deals also heals your Significator. |
| Whisper | Takes no damage back from Figures it attacks. |
| Dormant | Can't attack. |
| Hush | The Figure loses its text and keywords. |
| Read N | Look at the top N cards of your deck. Keep one, put the rest on the bottom. |
| Enters Reversed | May only be played Reversed. |

## The suits

**Suns** is Aurengate and the Empire, and the hearth folk the Empire rules. Order, armor, Guard, Fixed, fire, healing. Upright is the Creed's warm face. Reversed shows its teeth.

**Antlers** is the spirits and the wild: Mystarion, the Ebon Forest, Dagan's Grove, Nitriti's night. Growth, small spirits, big spirits, flips, Last Rites. Spirits have two natures, so Antlers is comfortable on either face, and it is where the Shadow's creatures crawl in.

**Tides** is Zalia, the Sunken Empire, and the Tradewind Isles. Tempo, movement, theft, cards that send things back where they came from. Pirates, a genasi rogue, a kraken long past.

**Gears** is Eldertech and the Citidaea. Knowledge, constructs, counters, and flipping, because the Seals study both faces. Mr. Zero counters your spell and shatters. Mordeaux casts your spell twice.

**The Major Arcana** are the twenty-two trumps. One copy per deck. Their Reversed faces are where the campaign's secrets live: Tyserion the Golden Blade is Izuriel wearing a face, the Imperator is the Spirit of Pride, and the Emperor is the Dusk.

## Building a deck

Thirty cards. Two copies at most of any Minor Arcana card, one copy at most of any Major, and never the Major that is your own Significator. Each shipped Significator comes with a 30-card reading built from two suits; the deck builder is next on the list.

## A worked example

It is round three, waxing moon. You are Lirielle with 3 Spark. Across from your empty Present lane sits an Oondray your opponent played Reversed last turn: a 3/2 with Windborne that already hit you once.

You have Lake Mirrara in hand. Upright, it flips a Figure and draws you a card, for 4 Spark. You can't afford it. Reversed, it deals 2 damage to every Upright Figure, also 4. No good either.

You have Fin & Bin for 2. You play them Upright into Present. Their Arrive makes your next card this turn cost 1 less. Now Lake Mirrara costs 3, and you have 1 left. Not enough.

So you play Fin & Bin and end the turn. The Oondray swings into Present and kills Fin & Bin (3 damage on a 1/2), and their 1 Attack scratches the Oondray to 3/1. Next turn you have 4 Spark. Lake Mirrara flips the scratched Oondray Upright: it becomes a 2/3 with one wound, a 2/2, and you draw a card. Now you face a 2/2 instead of a 3/2 that hits you every round, and your Fin & Bin are Reversed in your hand's memory only: they died.

The sharper version of the same trick: an enemy Heartwood (1/8) that has taken a single wound is an 8/1 with a single wound after Lake Mirrara, which is to say a dead Heartwood for 4 Spark and a card.

## How things resolve

The fine print. Every line here is what the engine does, and each has a test.

- **Start of a turn, in order.** Your Spark maximum rises and refills. The Bone Moon bites if it is up. You draw (two on a Full Moon). Aegis you carry recharges. Start-of-turn text fires. A Significator at 0 Health loses at once, at any point, and nothing later in the turn brings them back.
- **One face at a time.** A Figure's text, keywords, and auras are those of its current face. Turn it over and the old face is gone, including anything it was about to do at the end of the turn. The Sleepless Sentry played Reversed, attacked, and turned Upright is a Guard that stays.
- **Flipping.** Wounds are checked the moment a face turns. A Figure that dies from its own flip fires none of its flip triggers. "Becomes Upright" is a flip and respects Fixed. A global flip (the Wheel, the Dome, Cernis) turns every Figure at once, checks wounds, then fires the survivors' flip triggers in lane order, yours first. Rekindle's return to Reversed is not a flip.
- **Rekindle replaces death.** No Last Rite, no death triggers, once per Figure. Fixed does not stop the return.
- **Effects resolve one at a time**, and deaths are checked after each one. Damage to every enemy Figure is one effect; the Last Rites it causes happen before the next effect.
- **Targets are exact.** An effect that chose a Figure follows that Figure. If it has left the lane, the effect fizzles rather than hitting whatever arrived.
- **Copies.** Mordeaux repeats an Omen after the original resolves, with the same face and target. The copy costs nothing, is not a cast (it wakes no other Mordeaux and pays no Magician), fizzles if the chosen Figure is gone, and never happens if the original was countered. Two Mordeaux make two copies.
- **Spark gained this turn** can exceed your maximum and ten.
- **Aegis.** Granted Aegis (Dawn, the Lovers, Soren) is one shield. Aegis a Figure carries (a Relic, a face, Rorik's aura) is on when the Figure enters and recharges at the start of your turn.
- **Guard** intercepts attacks aimed at your Significator from an adjacent empty lane, including Gale attacks. With a Guard on each side, the one nearer Past steps in.
- **An attack stops** if its defender leaves the lane before the blow. The attacker does not retarget.
- **Arrive** fires when a card is played from hand. Summoned Figures do not Arrive.
- **Shatters, ceases to exist** (Mr. Zero, Vel): removed with no Last Rite. **Dissolves** (the Sentry): a death.
- **Moving** is a Figure's action for the turn, and a Figure may move the turn it enters. When an effect moves a Figure, an enemy Figure is pushed toward Past if that lane is open and toward Future otherwise; your own Figure goes toward Present when it can.
- **Read** with a full hand burns the card you keep. Read with one card in the deck draws it.
- **Calvera Upright** against fewer than two cards deals 5 and leaves the hand alone. **Brog** costs 2.
- **The Bone Moon Reversed** rises at the start of the next round, one point for each player, then grows. It does nothing if the Moon is already up or already due sooner.

## Design notes

Three lanes and twenty Health are deliberate. Games run eight to eleven rounds, and the Bone Moon makes sure of the upper end.

Reversed is neither a debuff nor a buff. It is a different card. Some decks (Shazz, the Shadow cards) want to be Reversed. Most cards' Reversed faces are a little wilder, a little riskier, and sometimes a little better in a spot you didn't plan for. Choosing the face is the interesting decision on almost every play.

The Significator abilities are small on purpose. They give you something to do with two leftover Spark, and a deck should win without them.


## Significators and decks

### Daxon Lamn, 0. The Fool

- Health 20. Suits: Suns and Tides. Deck: "The Willing Blade".
- Passive: Bonded Blades: your Relics cost 1 less.
- Ability (2 Spark, once a turn): Sword Guy. A friendly Figure gets +2 Attack this turn.
- Deck list: 2x The Guard Post; 2x Braxon Lamn; 2x Eva’s Kitchen; 1x Vraxxis, the Hungering Cinder; 1x Kojin, the Fiery Whip; 1x Aurium Plate; 2x Captain Elira Voss; 1x General Vath Enverez; 1x Vel, the Emberlight; 1x The Solar Flare Cannon; 2x Kaipo’s Pearl; 2x Zalian Fisherman; 1x Bimp Bossington; 1x Bill Boggs, Cartel Runner; 2x Tidecaller: Low Tide; 2x Kaipo Nuvane; 1x Marin, Spirit of Ocean Waves; 1x Brookskippers; 1x Calvera Blackwake, the Mad Pirate Queen; 1x The Hanged Man: Rorik Flamebeard; 1x Temperance: Brother Soren; 1x The Sun: The Spark

### Lirielle Starwhisper, XVII. The Star

- Health 20. Suits: Antlers and Gears. Deck: "The Mirrored Sky".
- Passive: Star Map: on Full Moon rounds you draw one extra card.
- Ability (2 Spark, once a turn): Read the Stars. Read 3: look at the top three cards of your deck, keep one, and put the rest on the bottom.
- Deck list: 2x Wisplight; 1x Elder Voren Nightbloom; 1x The Oondray; 1x Portal of Autumn Leaves; 2x Lake Mirrara; 1x Taranis, the Laughing Crow; 1x Inspector Bramble; 2x Fin & Bin; 1x Thorn of the Bladed Wind; 1x Kaelen Goldeneye; 1x Cernis, the Horned Forest Lord; 2x Eldertech Sphere; 1x Mr. Boscoe; 2x Yvette Mirthwell; 1x Null-Zone Pylon; 1x The Libra Stellae; 2x Pommeroy; 1x Mordeaux, the Clockwork Man; 1x Archivist Esmerelda Gotch; 1x The Mirrored Dome; 1x The Empress: Que’Rubra; 1x Wheel of Fortune: The Orrery; 1x The Lovers: Althea & Caelum; 1x The High Priestess: Nitriti

### Luigi Bonemoon, IX. The Hermit

- Health 20. Suits: Gears and Tides. Deck: "As Above, So Below".
- Passive: Brog: you start the game with Brog in your hand.
- Ability (2 Spark, once a turn): Eldritch Blast. Deal 1 damage to an enemy. If it is a Reversed Figure, deal 2 instead.
- Deck list: 2x Eldertech Sphere; 2x Mr. Boscoe; 1x Yvette Mirthwell; 2x Project Tamori; 1x Liquid Mana; 1x The Sleepless Sentry; 1x The Libra Stellae; 1x Mr. Zero; 1x Pommeroy; 2x Mordeaux, the Clockwork Man; 1x Archmage Severyn Caldreth; 1x Kaipo’s Pearl; 1x Brookskippers; 2x Zalian Fisherman; 2x The Serattan Oath-Coin; 1x The Sunken Empire Rises; 1x Kaipo Nuvane; 1x Merrick Blackwater; 1x The Garbage Boyz; 1x The Magician: Luigi Castanata; 1x The Moon: The Bone Moon; 1x Death: The Man in Black; 1x The Tower: The Fallen Isle; 1x The World: The Eldspyre

### Rorik Flamebeard, XII. The Hanged Man

- Health 20. Suits: Suns and Antlers. Deck: "The Forge Remembers".
- Passive: Forge of Kojin: at the end of your turn, restore 1 Health to your Significator.
- Ability (2 Spark, once a turn): Lay on Hands. Restore 3 Health to a friendly Figure or your Significator.
- Deck list: 2x Dawn Over Aurengate; 2x The Guard Post; 1x Braxon Lamn; 2x Eva’s Kitchen; 1x The Festival of Radiant Dawn; 2x Kojin, the Fiery Whip; 1x Aurium Plate; 1x Captain Elira Voss; 1x General Vath Enverez; 1x Ilzaren, the Resplendent King; 2x Wisplight; 2x The Oondray; 1x Fin & Bin; 1x Thorn of the Bladed Wind; 1x Kaelen Goldeneye; 1x The Heartwood; 1x Lake Mirrara; 1x Cernis, the Horned Forest Lord; 1x Temperance: Brother Soren; 1x The Sun: The Spark; 1x The Fool: Daxon Lamn; 1x The Star: Lirielle Starwhisper; 1x The Hermit: Luigi Bonemoon; 1x The Empress: Que’Rubra

### Lord-Provost Elaina Masque, V. The Hierophant

- Health 20. Suits: Suns and Gears. Deck: "The Radiant Dawn".
- Passive: Solar Creed: your Upright Figures have +1 Health.
- Ability (2 Spark, once a turn): The Chorus Speaks. A friendly Figure becomes Upright and Fixed.
- Deck list: 2x Dawn Over Aurengate; 1x The Guard Post; 1x Vraxxis, the Hungering Cinder; 2x The Festival of Radiant Dawn; 1x Aurium Plate; 1x The Solar Flare Cannon; 1x Ilzaren, the Resplendent King; 2x Captain Elira Voss; 2x General Vath Enverez; 1x Vel, the Emberlight; 1x Tyserion I, the Golden Blade; 2x Null-Zone Pylon; 2x The Sleepless Sentry; 1x The Libra Stellae; 1x Mr. Zero; 1x Pommeroy; 1x Archivist Esmerelda Gotch; 1x Archmage Severyn Caldreth; 1x The Emperor: Izuriel Sakazarac II; 1x The Chariot: The Solar Wind; 1x Judgement: The Septor’s Chorus; 1x The Sun: The Spark; 1x Justice: Dagan, Sovereign of the Scales; 1x Wheel of Fortune: The Orrery

### Imperator Amegmon Shazz, XV. The Devil

- Health 20. Suits: Gears and Antlers. Deck: "Something Rotten at the Core".
- Passive: Pride: your Reversed Figures have +1 Attack.
- Ability (2 Spark, once a turn): Wear a Face. Flip any Figure.
- Deck list: 2x Elder Voren Nightbloom; 2x Shadowling Stalkers; 2x Lake Mirrara; 1x Lorien of the Hand; 1x Taranis, the Laughing Crow; 1x The Oondray; 2x Eldertech Sphere; 1x Yvette Mirthwell; 1x Null-Zone Pylon; 2x Project Tamori; 2x Liquid Mana; 1x Mr. Zero; 1x Mordeaux, the Clockwork Man; 1x Archivist Esmerelda Gotch; 1x The Mirrored Dome; 1x The Sleepless Sentry; 1x Mr. Boscoe; 1x The Emperor: Izuriel Sakazarac II; 1x The Moon: The Bone Moon; 1x The Tower: The Fallen Isle; 1x Death: The Man in Black; 1x The High Priestess: Nitriti; 1x Strength: Grimore; 1x Wheel of Fortune: The Orrery

## Every card

Format: name, rank, type, cost, printed Attack/Health for Figures. Upright text, then Reversed text (with the Reversed name if it changes). Bold words are keywords defined in the rules.

### Major Arcana

**The Fool: Daxon Lamn** (0, figure, cost 3, 3/3)
- Upright: **Windborne.** Whenever a Relic is attached to Daxon, draw a card.
- Reversed (Daxon, Quest Fever): **Windborne. Fixed.** After this attacks, it gets +1 Attack.

**The Magician: Luigi Castanata** (I, figure, cost 3, 2/3)
- Upright: Whenever you cast an Omen, deal 1 damage to the enemy Significator. (As above, so below.)
- Reversed (Luigi, So Many Missed Eldritch Blasts): **Arrive:** deal 3 damage to a random enemy.

**The High Priestess: Nitriti** (II, figure, cost 7, 5/7)
- Upright: **Veiled. Arrive:** destroy every Reversed Figure. (The hallowing.)
- Reversed (Nitriti, Eternal Night): **Veiled. Arrive:** enemy Figures lose **Veiled** and can’t attack next turn.

**The Empress: Que’Rubra** (III, figure, cost 6, 4/6)
- Upright: **Arrive:** summon Fin & Bin in an adjacent empty lane. At the start of your turn, restore 2 Health to your Figures.
- Reversed (Ruby, in the Sapphire): **Guard. Fixed. Last Rite:** summon Fin & Bin (Reversed) here.

**The Emperor: Izuriel Sakazarac II** (IV, figure, cost 9, 7/7)
- Upright: **Fixed. Arrive:** your other Figures become Upright, **Fixed**, and get +1/+1. At the start of your turn, deal 2 damage to each Reversed enemy Figure.
- Reversed (Elenvar Elathriel, the Dusk): **Fixed. Arrive:** flip every enemy Figure. Whenever an enemy Figure is flipped, draw a card.

**The Hierophant: Lord-Provost Masque** (V, figure, cost 6, 4/5)
- Upright: **Guard.** Your Figures are **Fixed**. At the start of your turn, deal 1 damage to enemy Figures in adjacent lanes. (Solar Aura.)
- Reversed (Masque, Through the Mirror): **Arrive:** Hush every enemy Figure.

**The Lovers: Althea & Caelum** (VI, omen, cost 4)
- Upright: A friendly Figure gets +2/+2 and **Aegis**. Draw a card.
- Reversed (The Lovers, Through the Gate): Sacrifice a friendly Figure. Summon Lumina (3/3, **Windborne, Veiled**) in its lane and draw 2 cards.

**The Chariot: The Solar Wind** (VII, omen, cost 5)
- Upright: Summon a Sun Guard (2/2, **Guard**) in each of your empty lanes.
- Reversed (The Solar Wind, Stained Glass Turned Down): Deal 2 damage to every enemy Figure and 2 to the enemy Significator.

**Strength: Grimore** (VIII, figure, cost 8, 8/8)
- Upright: **Gale.** Whenever an enemy Figure moves, destroy it. (Run, and she will absolutely destroy you.)
- Reversed (Grimore, at Rest): **Dormant** (can’t attack). At the start of your turn, restore 4 Health to your Significator and give your other Figures +1/+1.

**The Hermit: Luigi Bonemoon** (IX, figure, cost 4, 2/4)
- Upright: **Veiled. Arrive:** summon Brog (1/3, **Veiled**) in an adjacent empty lane.
- Reversed (Luigi, Blue Flame): **Arrive:** deal 2 damage to every enemy Figure.

**Wheel of Fortune: The Orrery** (X, omen, cost 4)
- Upright: Read 4. Then draw a card.
- Reversed (The Orrery, Rings Bent): Flip every Figure. Each Significator takes 2 damage.

**Justice: Dagan, Sovereign of the Scales** (XI, omen, cost 5)
- Upright: Destroy the Figure with the highest Attack on the board. (Enemy first on ties.)
- Reversed (Dagan, the Scales Leveled): Both Significators’ Health becomes the average of the two (rounded down).

**The Hanged Man: Rorik Flamebeard** (XII, figure, cost 5, 4/5)
- Upright: Adjacent friendly Figures have **Aegis**. **Arrive:** restore 4 Health to a friendly Figure or your Significator. (Lay on Hands.)
- Reversed (Rorik, Suspended): **Rekindle.** When Rorik Rekindles, your other Figures get +2 Attack. (Vow of Enmity.)

**Death: The Man in Black** (XIII, figure, cost 7, 6/6)
- Upright: **Gale.** Whenever any Figure dies, this gets +1/+1.
- Reversed (Old Midnight, at the Crossroads): **Arrive:** destroy every other Figure with 3 or less Health.

**Temperance: Brother Soren** (XIV, figure, cost 4, 2/5)
- Upright: At the end of your turn, restore 1 Health to your Significator and to each of your Figures. (Eilwys’s breezes.)
- Reversed (Soren, the Dual Rite): **Arrive:** a friendly Figure gets +2/+2 and **Aegis**. (Eilwys and Kojin, consecrated together.)

**The Devil: Imperator Amegmon Shazz** (XV, figure, cost 7, 5/6)
- Upright: **Arrive:** look at your opponent’s hand. (Zone of Truth.) Your Omens cost 1 less.
- Reversed (The Spirit of Pride): **Fixed.** Enemy Figures enter Reversed. Whenever an enemy Figure is flipped, it takes 2 damage.

**The Tower: The Fallen Isle** (XVI, omen, cost 6)
- Upright: Destroy every Figure.
- Reversed (The Fallen Isle, Coming Down): Deal 4 damage to every Figure and to each Significator. Both players discard 2 random cards.

**The Star: Lirielle Starwhisper** (XVII, figure, cost 5, 3/5)
- Upright: **Arrive:** Read 3. At the start of your turn, deal 1 damage to the enemy Figure opposite. (Guiding Bolt.)
- Reversed (Lirielle, the Mirrored Sky): **Arrive:** flip a Figure and draw 2 cards.

**The Moon: The Bone Moon** (XVIII, omen, cost 5)
- Upright: The stars glow brighter: draw 2 cards and gain 2 Spark this turn.
- Reversed (The Bone Moon Rises): The Bone Moon rises at the start of the next round. Every Significator takes damage at the start of each of their turns from then on, and it grows.

**The Sun: The Spark** (XIX, omen, cost 3)
- Upright: A friendly Figure becomes Upright, gets +2/+2, and is **Fixed**.
- Reversed (The False Sun): Deal 3 damage to every Reversed Figure.

**Judgement: The Septor’s Chorus** (XX, figure, cost 6, 2/6)
- Upright: **Guard.** Whenever your opponent plays a card, deal 1 damage to their Significator. (The Chorus watches.)
- Reversed (The Chorus: Children on the Threshold): **Gale. Arrive:** deal 1 damage to each enemy Figure for every card in your hand.

**The World: The Eldspyre** (XXI, omen, cost 9)
- Upright: Restore 10 Health to your Significator. Draw until you have 5 cards. Your Spark maximum becomes 10.
- Reversed (The Sundering): Destroy every Figure. Both players discard their hands and draw 4 cards.

### Suit of Suns

**Dawn Over Aurengate** (Ace of Suns, omen, cost 1)
- Upright: A friendly Figure gets +1/+1 and **Aegis**.
- Reversed: Deal 1 damage to every Reversed Figure.

**The Guard Post** (Two of Suns, figure, cost 2, 1/3)
- Upright: **Guard.**
- Reversed: **Windborne.**

**Braxon Lamn** (Three of Suns, figure, cost 2, 2/3)
- Upright: **Arrive:** another friendly Figure gets +2 Attack.
- Reversed: **Arrive:** deal 2 damage to the enemy Figure opposite.

**Eva’s Kitchen** (Four of Suns, omen, cost 3)
- Upright: Restore 4 Health to your Significator. Draw a card.
- Reversed: A friendly Figure breathes fire: deal 3 damage to the enemy Figure opposite it.

**Vraxxis, the Hungering Cinder** (Five of Suns, figure, cost 3, 3/3)
- Upright: At the end of your turn, restore 2 Health to your Significator.
- Reversed: **Enters Reversed. Feast.** Whenever any Figure dies, this gets +1/+1.

**The Festival of Radiant Dawn** (Six of Suns, omen, cost 4)
- Upright: Draw 2 cards. Restore 2 Health to your Significator.
- Reversed: Deal 2 damage to each Reversed enemy Figure and 1 to the enemy Significator.

**Kojin, the Fiery Whip** (Seven of Suns, figure, cost 4, 4/3)
- Upright: At the end of your turn, deal 1 damage to the enemy Figure opposite.
- Reversed (Kojin, Burning Wild): At the end of your turn, deal 1 damage to every other Figure.

**Aurium Plate** (Eight of Suns, relic, cost 5)
- Upright: Attach to a friendly Figure: +2/+3 and **Aegis**.
- Reversed: Attach to a friendly Figure: +4/+1 and **Windborne**. (Operation Iron-Skin. High rejection rate.)
- As a Relic: Upright +2/+3; Reversed +4/+1.

**The Solar Flare Cannon** (Nine of Suns, omen, cost 6)
- Upright: Deal 5 damage to an enemy Figure and 2 to the enemy Significator.
- Reversed: Deal 3 damage to every enemy Figure.

**Ilzaren, the Resplendent King** (Ten of Suns, figure, cost 7, 5/6)
- Upright: Your Omens cost 1 less. **Arrive:** restore 5 Health to your Significator.
- Reversed (Ilzaren, Author of the Creed): **Arrive:** Hush every enemy Figure (they lose their text and keywords).

**Captain Elira Voss** (Page of Suns, figure, cost 2, 2/2)
- Upright: **Rekindle.** (Relentless Will.)
- Reversed: **Arrive:** deal 2 damage to an enemy.

**General Vath Enverez** (Knight of Suns, figure, cost 4, 3/5)
- Upright: **Guard. Fixed.** Adjacent friendly Figures take 1 less damage.
- Reversed (Vath, No More Ash or Flame): **Windborne. Fixed.**

**Vel, the Emberlight** (Queen of Suns, figure, cost 6, 3/3)
- Upright: **Veiled. Last Rite:** deal 4 damage to every enemy Figure and 2 to the enemy Significator.
- Reversed (Vel, Last Spark): **Arrive:** deal 5 damage to every enemy Figure. Vel ceases to exist.

**Tyserion I, the Golden Blade** (King of Suns, figure, cost 8, 7/7)
- Upright: **Arrive:** deal 4 damage to every enemy Figure. Your other Figures have +1 Attack.
- Reversed (Izuriel, Wearing Tyserion’s Face): **Rekindle. Last Rite:** deal 4 damage to the enemy Significator.

### Suit of Antlers

**Wisplight** (Ace of Antlers, figure, cost 1, 1/1)
- Upright: **Last Rite:** draw a card.
- Reversed: **Windborne. Veiled.**

**Elder Voren Nightbloom** (Two of Antlers, figure, cost 2, 1/3)
- Upright: **Arrive:** Read 2.
- Reversed (Voren, Corrupted): **Last Rite:** flip the enemy Figure opposite.

**The Oondray** (Three of Antlers, figure, cost 2, 2/3)
- Upright: **Arrive:** the enemy Figure opposite can’t attack next turn. (Entangling brambles.)
- Reversed: **Windborne.**

**Portal of Autumn Leaves** (Four of Antlers, omen, cost 3)
- Upright: Return a friendly Figure to your hand. The next card you play this turn costs 2 less.
- Reversed: Return an enemy Figure to its owner’s hand.

**Shadowling Stalkers** (Five of Antlers, figure, cost 3, 3/2)
- Upright: **Veiled.**
- Reversed: **Enters Reversed. Veiled. Last Rite:** summon a Gloomghast (Reversed) here.

**Lake Mirrara** (Six of Antlers, omen, cost 4)
- Upright: Flip a Figure. Draw a card.
- Reversed (Lake Mirrara, Filmed Over): Deal 2 damage to every Upright Figure.

**Taranis, the Laughing Crow** (Seven of Antlers, figure, cost 4, 2/3)
- Upright: **Windborne. Arrive:** take a random card from your opponent’s hand.
- Reversed (Taranis, Gone to the Feywild): **Veiled. Last Rite:** return Taranis to your hand.

**Inspector Bramble** (Eight of Antlers, figure, cost 5, 3/4)
- Upright: **Arrive:** Read 3. Whenever the enemy plays a Relic, draw a card. (Follow the money.)
- Reversed (Bramble, at the Pale Edge): **Rekindle.** (“I saw the very pale edge of God himself.”)

**Lorien of the Hand** (Nine of Antlers, figure, cost 6, 4/5)
- Upright: **Guard. Arrive:** a friendly Figure becomes **Fixed**.
- Reversed (Lorien Shadowblade): **Veiled. Windborne.** Whenever this kills a Figure, draw a card.

**The Heartwood** (Ten of Antlers, figure, cost 7, 1/8)
- Upright: **Guard.** At the start of your turn, summon a Wisplight in an empty lane.
- Reversed (The Roothold Rises): **Windborne. Gale.**

**Fin & Bin** (Page of Antlers, figure, cost 2, 1/2)
- Upright: **Arrive:** the next card you play this turn costs 1 less.
- Reversed (Fin & Bin, Nooooo Stinky): **Last Rite:** return Fin & Bin to your hand.

**Thorn of the Bladed Wind** (Knight of Antlers, figure, cost 4, 4/3)
- Upright: **Windborne. Gale** (may attack any enemy lane).
- Reversed (Thorn, Undercover): **Veiled. Whisper** (takes no damage back from Figures it attacks).

**Kaelen Goldeneye** (Queen of Antlers, figure, cost 6, 4/6)
- Upright: **Guard.** Friendly Figures in adjacent lanes can’t be targeted by enemy Omens. (Sanctuary.)
- Reversed (Kaelen, Immediate Ceasefire): **Arrive:** throw an enemy Figure out. Return it to its owner’s hand.

**Cernis, the Horned Forest Lord** (King of Antlers, figure, cost 8, 6/8)
- Upright: **Arrive:** summon Wisplights in your empty lanes, and your other Figures get +2/+2.
- Reversed (Cernis, the Oondray Remember): **Arrive:** flip every other Figure.

### Suit of Tides

**Kaipo’s Pearl** (Ace of Tides, relic, cost 1)
- Upright: Attach to a friendly Figure: +0/+2. It may move and attack in the same turn.
- Reversed: Attach to a friendly Figure: +2/+0 and **Veiled**.
- As a Relic: Upright +0/+2; Reversed +2/+0.

**Brookskippers** (Two of Tides, omen, cost 2)
- Upright: Move a Figure to an adjacent empty lane. Draw a card.
- Reversed: Overturn the boat: an enemy Figure takes 1 damage and can’t attack next turn.

**Zalian Fisherman** (Three of Tides, figure, cost 2, 2/2)
- Upright: **Arrive:** draw a card.
- Reversed (Fisherman, Bloated and Full of Vines): **Last Rite:** deal 2 damage to the enemy Figure opposite.

**Bimp Bossington** (Four of Tides, figure, cost 3, 3/3)
- Upright: **Last Rite:** summon Raccoons in your empty lanes.
- Reversed: **Veiled.**

**Bill Boggs, Cartel Runner** (Five of Tides, figure, cost 3, 4/2)
- Upright: **Arrive:** gain 2 Spark this turn.
- Reversed (The Dusk, Wearing Bill’s Face): **Rekindle.** When this Rekindles, it gets +3 Attack.

**The Serattan Oath-Coin** (Six of Tides, relic, cost 4)
- Upright: Attach: +1/+1. When this Figure is flipped, flip the enemy Figure opposite too.
- Reversed: Attach: +1/+1. At the start of your turn, Read 1.
- As a Relic: Upright +1/+1; Reversed +1/+1.

**The Sunken Empire Rises** (Seven of Tides, omen, cost 4)
- Upright: Return the last Figure that died from your graveyard to your hand.
- Reversed: Summon a Drowned Legionnaire (Reversed) in an empty lane.

**Tidecaller: Low Tide** (Eight of Tides, relic, cost 5)
- Upright: Attach: +2/+2. When this Figure attacks, the defender becomes Upright.
- Reversed: Attach: +3/+1 and **Windborne**.
- As a Relic: Upright +2/+2; Reversed +3/+1.

**The Garbage Boyz** (Nine of Tides, figure, cost 6, 5/5)
- Upright: **Arrive:** forklift an enemy Figure into any empty lane.
- Reversed (The Garbage Boyz, Let’s Get This Bread): **Arrive:** draw 2 cards.

**Marin, Spirit of Ocean Waves** (Ten of Tides, figure, cost 7, 5/7)
- Upright: **Guard. Arrive:** return every enemy Figure with 3 or less Attack to its owner’s hand.
- Reversed (Marin, the Storm Held in Check): **Windborne. Gale.**

**Kaipo Nuvane** (Page of Tides, figure, cost 2, 2/2)
- Upright: **Windborne.** After this attacks, move it to an adjacent empty lane. (Ebb and flow.)
- Reversed (Kaipo, Knave and Rogue): **Veiled. Arrive:** look at your opponent’s hand.

**Merrick Blackwater** (Knight of Tides, figure, cost 4, 4/2)
- Upright: **Windborne. Arrive:** gain 1 Spark this turn.
- Reversed (The Dusk, Wearing Merrick’s Face): **Veiled. Last Rite:** summon Shadowling Stalkers (Reversed) here.

**Calvera Blackwake, the Mad Pirate Queen** (Queen of Tides, figure, cost 6, 5/5)
- Upright: **Arrive:** your opponent discards 2 random cards. If they can’t, they take 5 damage instead.
- Reversed (Calvera, Crash the Isle): **Arrive:** destroy the enemy Figure opposite. Your Significator takes 3 damage.

**Serratta, Spirit of the Deep Current** (King of Tides, figure, cost 8, 7/8)
- Upright: **Guard. Arrive:** return every other Figure to its owner’s hand.
- Reversed (Serratta, Long Past): **Veiled. Feast.**

### Suit of Gears

**Eldertech Sphere** (Ace of Gears, omen, cost 1)
- Upright: Draw a card. Gain 1 Spark this turn.
- Reversed: Flip a friendly Figure. It gets +1/+1.

**Mr. Boscoe** (Two of Gears, figure, cost 2, 1/3)
- Upright: At the end of your turn, restore 2 Health to your Significator. (Honeyed star-rolls.)
- Reversed (Mr. Boscoe, Treats I Have): **Arrive:** draw a card.

**Yvette Mirthwell** (Three of Gears, figure, cost 2, 2/2)
- Upright: **Arrive:** an enemy Figure (even a Veiled one) loses **Veiled** and **Guard**. (A jailbroken Knock.)
- Reversed (Yvette, Too Close to the Leylines): **Arrive:** draw 2 cards. Your Significator takes 2 damage.

**Null-Zone Pylon** (Four of Gears, figure, cost 3, 1/4)
- Upright: **Guard.** Enemy Omens cost 1 more.
- Reversed: **Arrive:** Hush the enemy Figure opposite.

**Project Tamori** (Five of Gears, omen, cost 3)
- Upright: Summon a Tamori Warhead (3/2, **Last Rite:** deal 3 damage to the enemy opposite) in an empty lane.
- Reversed: Destroy a friendly Figure. Deal damage equal to its Attack to every enemy Figure.

**Liquid Mana** (Six of Gears, omen, cost 4)
- Upright: Gain 3 Spark this turn.
- Reversed: Gain 4 Spark this turn. A random friendly Figure is flipped. (Tendency to mutate engine crews.)

**The Sleepless Sentry** (Seven of Gears, figure, cost 4, 2/5)
- Upright: **Guard. Fixed.**
- Reversed (Project Lazarus): **Windborne.** At the end of your turn, this dissolves.

**The Libra Stellae** (Eight of Gears, omen, cost 5)
- Upright: Draw 3 cards.
- Reversed (The Libra Stellae Is Now Closed): Hush every Figure.

**Mr. Zero** (Nine of Gears, figure, cost 6, 4/4)
- Upright: **Veiled.** The next Omen your opponent casts is countered. Then Mr. Zero shatters.
- Reversed (Mr. Zero, Worth It): **Arrive:** destroy an enemy Figure. Mr. Zero shatters.

**The Mirrored Dome** (Ten of Gears, omen, cost 7)
- Upright: Flip every Figure. Draw 2 cards.
- Reversed (Project Needle): Puncture reality: deal 6 damage to the enemy Significator.

**Pommeroy** (Page of Gears, figure, cost 2, 1/3)
- Upright: **Arrive:** Read 2. (The standard tour.)
- Reversed: **Arrive:** your next Omen this turn costs 1 less.

**Mordeaux, the Clockwork Man** (Knight of Gears, figure, cost 4, 3/4)
- Upright: Once per turn, when you cast an Omen, Mordeaux casts it again with the same face and targets. (Mimicry Engine.)
- Reversed (Mordeaux, Fist of Memory): When this attacks, Hush the defender.

**Archivist Esmerelda Gotch** (Queen of Gears, figure, cost 6, 3/6)
- Upright: Enemy Omens cost 2 more. (Mnemonic Redaction.)
- Reversed (Gotch, Temporal Filing): **Arrive:** Hush an enemy Figure and deal 3 damage to it.

**Archmage Severyn Caldreth** (King of Gears, figure, cost 8, 6/7)
- Upright: **Arrive:** deal 4 damage to every enemy Figure. Whenever your opponent casts an Omen, deal 2 damage to their Significator.
- Reversed (Severyn, Sigil Eye Open): **Arrive:** every enemy Figure loses **Veiled** and is flipped.

### Tokens

**Spent Sphere** (token omen, undefined/undefined). Upright: Gain 1 Spark this turn. Reversed: Gain 1 Spark this turn.

**Gloomghast** (token figure, 1/1). Upright: no text Reversed: **Veiled.**

**Raccoon** (token figure, 1/1). Upright: Chittering. Reversed: **Windborne.**

**Drowned Legionnaire** (token figure, 3/3). Upright: **Guard.** Reversed: **Feast.**

**Tamori Warhead** (token figure, 3/2). Upright: **Last Rite:** deal 3 damage to the enemy Figure opposite. Reversed: **Last Rite:** deal 1 damage to every enemy Figure.

**Sun Guard** (token figure, 2/2). Upright: **Guard.** Reversed: **Windborne.**

**Lumina** (token figure, 3/3). Upright: **Windborne. Veiled.** Reversed: **Veiled. Last Rite:** draw a card.

**Brog** (token figure, 1/3). Upright: **Veiled. Last Rite:** return Brog to your hand. (Brog is Brog.) Reversed: **Windborne. Feast.**

## Simulation

120 games, a greedy one-step AI playing both sides, every Significator against a rotating opponent. Average length 8.1 rounds (shortest 5, longest 14). The Bone Moon rises in round 10.

| Significator | Wins | Games | Rate |
|---|---|---|---|
| Daxon Lamn | 12 | 40 | 30% |
| Rorik Flamebeard | 28 | 40 | 70% |
| Lirielle Starwhisper | 11 | 40 | 28% |
| Lord-Provost Elaina Masque | 29 | 40 | 73% |
| Luigi Bonemoon | 27 | 40 | 68% |
| Imperator Amegmon Shazz | 13 | 40 | 33% |

Cards by win rate of the player who played them (at least 8 appearances). High is a hint of strength, low a hint of weakness, with the AI caveat above.

| Card | Win rate | Games played |
|---|---|---|
| The Festival of Radiant Dawn | 96% | 25 |
| The Chariot: The Solar Wind | 88% | 8 |
| The Fool: Daxon Lamn | 79% | 14 |
| The Hermit: Luigi Bonemoon | 75% | 16 |
| Tyserion I, the Golden Blade | 75% | 8 |
| Judgement: The Septor’s Chorus | 73% | 15 |
| The Magician: Luigi Castanata | 71% | 21 |
| Mr. Zero | 71% | 42 |
| Wheel of Fortune: The Orrery | 70% | 10 |
| Dawn Over Aurengate | 70% | 46 |
| Ilzaren, the Resplendent King | 68% | 28 |
| Brog | 68% | 40 |
| Archmage Severyn Caldreth | 65% | 17 |
| The Garbage Boyz | 64% | 14 |
| Thorn of the Bladed Wind | 64% | 36 |
| ... | | |
| The Empress: Que’Rubra | 43% | 21 |
| Archivist Esmerelda Gotch | 42% | 38 |
| Yvette Mirthwell | 42% | 53 |
| Wisplight | 40% | 52 |
| The High Priestess: Nitriti | 38% | 24 |
| Elder Voren Nightbloom | 36% | 39 |
| Lorien of the Hand | 36% | 14 |
| Marin, Spirit of Ocean Waves | 33% | 12 |
| Lake Mirrara | 31% | 16 |
| Bimp Bossington | 30% | 10 |
| Shadowling Stalkers | 27% | 22 |
| The Emperor: Izuriel Sakazarac II | 25% | 8 |
| Taranis, the Laughing Crow | 21% | 28 |
| Bill Boggs, Cartel Runner | 20% | 15 |
| Fin & Bin | 20% | 15 |
