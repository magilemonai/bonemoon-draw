# Moonwyld: interface review packet

For a designer looking at the game's interface and feel. The game is live and public, so look at the real thing first, on a phone and on a laptop:

https://magilemonai.github.io/moonwyld/

Play at least two full readings against the AI before writing anything. Screenshots of the current build are in `docs/screenshots/`. The mechanics have their own packet (`docs/DESIGN_REVIEW_PACKET.md`); this one is about how the game looks, moves, and feels in the hand.

## What we want back

A written critique, specific and prioritized: the three things that would most improve the feel, then everything else. Name the screen and the element. Where a fix is visual, describe it in terms of the world's materials (parchment, gold leaf, indigo, brass, bruise purple) so it can be painted or coded. Where a fix is interaction, describe the tap-by-tap flow you'd want instead.

If you also want to paint interface ornament, there is a separate kit brief in `docs/UI_KIT_PROMPTS.md` with exact sizes; the game already has hooks for every piece in it.

## What the game is trying to be

A tarot reading that fights back. The table is Valisar's night sky, the cards are painted parchment, and the one big mechanic is that every card has two faces. The interface intent, and the things we deliberately refused, are written up in `docs/DESIGN.md`. In short:

- Deep indigo table (never black), gold leaf, parchment cards with suit-colored ink.
- Reversed is "the Bruise": a purple wash, the art turned upside down, the card flipped over on its vertical axis so the text stays readable.
- The moon is the end-turn control and the round clock. When the Bone Moon rises, the disc goes cratered and pale.
- Motion answers actions: cards fly from hand to lane, flips spring, attacks lunge, deaths dissolve. Turn banners are the only unrequested motion.
- Phone first. Three lanes fit across 390 pixels; the hand scrolls sideways.

## The screens

1. **Title.** Painted Bone Moon over Ebon Vale, three buttons.
2. **Choose your Significator.** Six characters with their deck names, passives, abilities; a dropdown for the opponent.
3. **The table.** Opponent panel at top (portrait, health, spark, hand as fanned card backs), three enemy lanes, three friendly lanes, your panel (portrait, health, spark pips, ability button, deck count), the moon dial, your hand.
4. **Face chooser.** Tapping a hand card slides up a two-column sheet: Upright on the left, Reversed on the right, with stats, text, and what happens next ("Then choose a lane").
5. **Inspect.** Both faces side by side, full text and flavor.
6. **Read.** When a card says Read N, a modal shows the options and you keep one.
7. **The Codex.** All 78 cards by suit with search.
8. **How to play.** The short rules.

## How you play it (tap by tap)

- Tap a hand card: it lifts and the face chooser opens. Tap a face. If the card needs a target, targets pulse red; tap one. If it's a Figure, empty lanes glow gold; tap one. Omens with no target cast on the face tap.
- Tap one of your Figures: enemies it can hit pulse red, adjacent empty lanes glow blue for a move. Tap again to inspect.
- The ability button on your panel arms the ability; targets pulse; tap one.
- Touch the moon to end the turn. The opponent's whole turn plays out as animation.
- Damage floats as red numbers, healing green, an absorbed hit says "Aegis".

## Questions

1. **First contact.** Someone who has played Hearthstone but never seen this: what confuses them in the first two turns? Is the face chooser the right shape, or should the two faces be visible on the card itself before tapping?
2. **Reading the table.** On a phone, can you tell at a glance which Figures can act, which lane is threatened, and what the opponent's board does? What is missing from the lane cards (they show art, name, keyword chips, stats)?
3. **Reversed.** Does a Reversed card read as Reversed from across the table? Is the flip animation the right gesture for "other face," or should it be the 180-degree turn a physical tarot card makes, even at the cost of readable text?
4. **The moon.** Is the moon dial a good end-turn control or a clever one? Does the Bone Moon's arrival feel like an event?
5. **Motion.** Where does the animation help you follow the opponent's turn, and where does it just take time? Is the pacing right (turn banner, card plays, attacks, deaths)? What is missing (a card being drawn, a Relic attaching, a Hush)?
6. **The cards themselves.** The frame, the corner badges (blade for Attack, shield for Health), the cost badge, the name band, the keyword chips: what is working and what looks generic? What would a real printed deck do that this doesn't?
7. **Typography and copy.** Cormorant Garamond for names and numerals, Alegreya Sans for text. Is the interface copy ("Your reading", "Their reading", "End the turn", "Draw again") consistent with the world, and is any of it unclear?
8. **Sound.** There is none yet. If you had five sounds, which five?
9. **Ornament.** Looking at the kit brief, what would you add, drop, or change so the interface and the paintings feel like one deck?
