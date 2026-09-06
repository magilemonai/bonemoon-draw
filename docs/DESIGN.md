# Design notes

How the game looks and why. Companion to RULES.md (what the game does).

## The brief, in one line

A tarot deck from Valisar, laid out on a night table under the stars that record everything.

## Where the look comes from

Every visual choice traces back to something in the campaign notes:

- **The table is Nitriti's sky.** Deep indigo, the color of her mist in the campaign art. The world's law says the stars glow brighter under a full moon, and the Libra Stellae's crystals are recorded by the stars, so the game happens under a sky that is watching. A faint brass orrery (the one from the Nitriti observatory) turns once every seven minutes behind the lanes.
- **Cards are parchment and suit ink.** Ivory faces, a hairline inner border like a printed tarot deck, corner stats shaped like a blade (Attack) and a shield (Health). Gold ink for Suns, moss for Antlers, deep teal for Tides, brass for Gears, violet for the Majors.
- **Reversed is the Bruise.** Lothis, the Corrupted Bloom, is called "the Bruise" in the notes, and that purple is the Reversed palette: a dusk wash over the art, a rose-brown parchment, the art turned upside down the way a reversed tarot card sits on a real table. The card itself flips over on its vertical axis so the text stays readable, but the picture is inverted. You can tell a Reversed card from across the room.
- **Spark is Liquid Mana.** The Eighth Seal compresses spirit-matter into glowing blue canisters. The Spark pips are little blue flames. Bonus Spark (Bill Boggs, Liquid Mana) burns gold instead.
- **The moon is the end-turn button.** The moon governs the round, so touching it passes the turn. Its shadow moves with the phase, and when the Bone Moon rises the disc goes cratered and pale and the lane lights go with it.
- **Type.** Cormorant Garamond for names, numerals, and anything that should feel engraved. Alegreya Sans for rules text and interface, because rules text at 9px on a phone has to be legible before it is pretty. Roman numerals on the Majors.

## What we refused

Cream-and-terracotta, tinted-black backgrounds, identical rounded cards with the same grey shadow, all-caps tracked-out labels, middle-dot separators, arrows on buttons, hairline broadsheet rules as decoration. None of that comes from Valisar, so none of it is here. Where structure shows (the inner card border, the lane outlines, the orrery), it is because the object in the world has that structure.

## Motion

Motion answers actions. A played card flies from the hand to its lane (shared layout id). A flip turns the card over with a spring. An attack lunges toward the defender, then the damage numbers rise. A death tilts, blurs, and dissolves. Turn banners are the only unrequested motion, and the star drift and orrery are slow enough to be felt rather than seen. `prefers-reduced-motion` collapses all of it.

The engine emits one snapshot per event, so the interface plays events in order with a duration per kind, and the AI's turn runs through the same queue. Nothing in the interface computes rules.

## Phone first

Base styles are the 390px phone. Three lanes fit across a phone at 100px per card; the hand scrolls sideways and centers when it can. Desktop (720px and up) widens the cards, centers the hand, and scales card size to viewport height so the whole table always fits on one screen without scrolling.

## Art

Every card ships with a procedural sigil (suit emblem, pip count, court mark, or roman numeral) drawn from its id, so the deck reads as one object with no art at all. Drop a real image at `public/art/<card-id>.png` and it replaces the sigil. `docs/ART_PROMPTS.md` has one prompt per card in a shared house style. Portraits for the six Significators go at `public/art/sig-<name>.png`.
