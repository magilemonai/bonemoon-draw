# Moonwyld: art production brief

A complete job for an image-generating agent: 94 images for a tarot card game set in the fantasy world of Valisar. Read the Brief, then produce every item in the Manifest in order, checking each one against the quality list before saving it. Nobody will be answering questions between images; every decision needed is written here.

## Deliverable

- 94 images, one per manifest item, named exactly as each item's `file` field (for example `art/major-0.jpg`). Lowercase, no spaces, no renaming.
- Format: JPG, quality 85 to 90, sRGB. Sizes are given per item: most are square 1024 by 1024; the card back is portrait 1024 by 1536; the title painting is landscape 1536 by 1024.
- Package everything as one zip named `bonemoon-art.zip` with a single folder `art/` at its root containing all the files.
- Include `art/report.md` in the zip: one line per item that needed more than one attempt or that failed a quality check, saying which check and what was done about it. If everything passed first time, say so in one line.
- Work in the batch order given in the Manifest. Batch 1 and Batch 2 matter most; if the job has to stop early, stop after a complete batch.
- Do not add borders, card frames, titles, captions, or any lettering. The game draws the frame and prints the names.

## Brief

You are painting the seventy-eight cards of a tarot deck from the world of Valisar, for a card game called Moonwyld. Read this whole brief before the first image, and hold to it for every image after.

**The world.** Valisar is high fantasy in the spirit of the Zelda games and Studio Ghibli films (Spirited Away, Princess Mononoke, Howl's Moving Castle), with a thread of FromSoftware melancholy underneath. Magic comes from a lost cosmic source called the Eldspyre. A false sun-king has ruled for a thousand years under seven names. Spirits are old and real, and they mostly ignore people. Ancient machines called Eldertech (brass gears, glowing blue crystal, runes) sit in ruins. The moon is too big, and one day it will be made of bone.

**The medium.** Every image looks like a painted tarot card from that world: gouache and ink on aged parchment, with touches of gold leaf where light hits. Soft painterly edges, visible brush texture, ink lines holding the forms. No photorealism, no 3D render, no airbrushed digital gloss, no anime cel shading. Think of a Rider-Waite deck repainted by a Ghibli background artist.

**The composition.** Compose like a tarot card. One clear subject, centered or nearly so, drawn frontally or in three-quarter view, with a horizon line and a sky. Symbolic objects are placed deliberately, the way a tarot painter places a cup or a sword, and they are legible at thumbnail size. Keep the important content inside the middle 80 percent of the frame, because the game crops the top and bottom edges slightly. Sky goes at the top: the game turns the image upside down when a card is played Reversed, so a clear up and down matters.

**Light and palette.** Night is the default. Deep indigo skies, a blue-violet with depth in it, full of small warm stars. Warm light comes from lanterns, forges, sunbursts, and glowing crystal. Each suit has its own ink, given below; use it as the dominant color of the scene, with ivory parchment tones and one warm accent.

**Hard rules.** No text, letters, numbers, or runic writing that reads as text. No borders, frames, or card edges: the game draws the frame. No watermarks and no modern objects. Square image, 1024 by 1024, one image per card.

**The suits.**
- Suns (gold #c9962b, ivory, white-gold light): the Sakazarac Empire and the hearth folk it rules. Aurium armor, sixteen-point sunbursts, forges, stained glass, festival lanterns. The emblem is a sixteen-point sun.
- Antlers (moss green #4d7f57, indigo night, pale wisplight): the spirits and the wild. Mystarion's forest, black-barked Ebon trees, bioluminescent groves, porcelain masks, antlers. The emblem is a pair of antlers.
- Tides (deep teal #2f7f8f, sea foam, wet stone): Zalia's coast, the Sunken Empire, pirates on floating islands. Waves, coral, pearls, kraken, sea-silk. The emblem is a cresting wave.
- Gears (brass #a8623a, sandstone, blue crystal glow): Eldertech and the Citidaea, a city of melting sandstone towers in a desert canyon. Gears, orreries, knowledge crystals, tamori (people made of a single spell). The emblem is a twelve-tooth gear.
- Major Arcana (violet #6e5ab8, starlight, gold leaf): the trumps. Grander, more symbolic, more symmetrical than the suit cards. Each one is a person or a force from the story.

**Tarot conventions by rank.**
- Ace: a single large emblem-object held up by a hand emerging from cloud or mist, with the landscape small below.
- Two through Ten: the scene contains exactly that many of the suit's emblem-objects (suns, antlers, waves or cups, gears), worked into the picture the way a pip card arranges its cups or coins. Seven of Suns shows seven small suns or flames somewhere in the frame.
- Page: a young standing figure holding the suit's object, looking at it.
- Knight: a figure in motion, armed or mounted, mid-action.
- Queen: a seated figure with the suit's object, calm, looking outward.
- King: an enthroned or towering figure of authority, symmetrical.
- Major Arcana: a hieratic figure or scene, frontal, with its symbols arranged around it.

## Quality check, applied to every image before saving

1. No text, letters, numbers, signatures, or runes that read as writing, anywhere in the image.
2. No border, frame, vignette edge, or card edge. The picture runs to the edge of the canvas.
3. The dominant color is the suit ink named in the prompt, on an indigo night ground, with ivory and one warm accent.
4. Up and down are unmistakable: sky or the lightest area at the top, ground at the bottom.
5. The subject sits inside the middle 80 percent of the frame; nothing important touches the top or bottom edge.
6. Pip cards (Two through Ten of a suit): the number of emblem-objects matches the rank and can be counted at a glance.
7. Portraits: the face is centered and readable at 48 pixels across. The card back reads the same upside down.

If an image fails a check, regenerate it, up to two more attempts. If it still fails, keep the best attempt, save it under the correct filename, and note it in `report.md`.

## Manifest

Each item gives the file name, the size, and the full prompt. Prompts repeat the house style in short form so each one stands alone; the Brief above is the authority when they seem to disagree.

### Batch 1: portraits and site

#### sig-daxon

- Name: Daxon Lamn, The Fool (portrait)
- File: `art/sig-daxon.jpg`
- Size: 1024x1024
- Prompt: Tarot card illustration from the fantasy world of Valisar, painted in gouache and ink on aged parchment with gold-leaf highlights, painterly, in the spirit of Studio Ghibli backgrounds and Zelda concept art with a FromSoftware melancholy. Deep indigo night sky with small warm stars, warm lantern and crystal light. Composed like a tarot card, with one clear central subject, frontal or three-quarter, a horizon line, symbolic objects placed deliberately, sky at the top, and the important content inside the middle 80 percent. Square 1024 by 1024. No text, no letters, no border, no frame, no watermark. Portrait, head and shoulders, three-quarter view, face centered and lit warmly, looking slightly off-frame. Suit of Suns palette: dominant gold (#c9962b), ivory, white-gold light, warm shadows. The emblem is a sixteen-point sun. Subject: a bright-eyed young swordsman with a fire sword on one hip and a water sword on the other, striding out of a farm village at dawn. Behind the figure, a hint of the The Fool tarot card's traditional symbolism (a traveler stepping off a cliff edge with a small dog, a bundle on a stick, the sun behind), kept quiet.

#### sig-lirielle

- Name: Lirielle Starwhisper, The Star (portrait)
- File: `art/sig-lirielle.jpg`
- Size: 1024x1024
- Prompt: Tarot card illustration from the fantasy world of Valisar, painted in gouache and ink on aged parchment with gold-leaf highlights, painterly, in the spirit of Studio Ghibli backgrounds and Zelda concept art with a FromSoftware melancholy. Deep indigo night sky with small warm stars, warm lantern and crystal light. Composed like a tarot card, with one clear central subject, frontal or three-quarter, a horizon line, symbolic objects placed deliberately, sky at the top, and the important content inside the middle 80 percent. Square 1024 by 1024. No text, no letters, no border, no frame, no watermark. Portrait, head and shoulders, three-quarter view, face centered and lit warmly, looking slightly off-frame. Suit of Antlers palette: dominant moss green (#4d7f57) against indigo night, pale blue-white wisplight. The emblem is a pair of antlers. Subject: an elven druid in starlit robes holding a glowing star map, a fox of pale light at her side, a huge full moon above. Behind the figure, a hint of the The Star tarot card's traditional symbolism (a kneeling figure pouring water into a pool and onto the land beneath one great star and seven small ones), kept quiet.

#### sig-luigi

- Name: Luigi Bonemoon, The Hermit (portrait)
- File: `art/sig-luigi.jpg`
- Size: 1024x1024
- Prompt: Tarot card illustration from the fantasy world of Valisar, painted in gouache and ink on aged parchment with gold-leaf highlights, painterly, in the spirit of Studio Ghibli backgrounds and Zelda concept art with a FromSoftware melancholy. Deep indigo night sky with small warm stars, warm lantern and crystal light. Composed like a tarot card, with one clear central subject, frontal or three-quarter, a horizon line, symbolic objects placed deliberately, sky at the top, and the important content inside the middle 80 percent. Square 1024 by 1024. No text, no letters, no border, no frame, no watermark. Portrait, head and shoulders, three-quarter view, face centered and lit warmly, looking slightly off-frame. Suit of Gears palette: dominant brass (#a8623a), sandstone, blue crystal glow. The emblem is a twelve-tooth gear. Subject: a weathered man in plain burlap clothes holding a glowing brass lamp, a small fuzzy blob at his feet, blue flame at his fingertips. Behind the figure, a hint of the The Hermit tarot card's traditional symbolism (a hooded elder on a mountain peak holding a lantern with a star inside, a staff), kept quiet.

#### sig-rorik

- Name: Rorik Flamebeard, The Hanged Man (portrait)
- File: `art/sig-rorik.jpg`
- Size: 1024x1024
- Prompt: Tarot card illustration from the fantasy world of Valisar, painted in gouache and ink on aged parchment with gold-leaf highlights, painterly, in the spirit of Studio Ghibli backgrounds and Zelda concept art with a FromSoftware melancholy. Deep indigo night sky with small warm stars, warm lantern and crystal light. Composed like a tarot card, with one clear central subject, frontal or three-quarter, a horizon line, symbolic objects placed deliberately, sky at the top, and the important content inside the middle 80 percent. Square 1024 by 1024. No text, no letters, no border, no frame, no watermark. Portrait, head and shoulders, three-quarter view, face centered and lit warmly, looking slightly off-frame. Suit of Suns palette: dominant gold (#c9962b), ivory, white-gold light, warm shadows. The emblem is a sixteen-point sun. Subject: a red-bearded dwarf paladin with a molten-veined warhammer standing before a lit brazier in a wooden chapel, dwarves behind him raising pints. Behind the figure, a hint of the The Hanged Man tarot card's traditional symbolism (a figure suspended upside down by one foot from a living tree, a halo of light, serene), kept quiet.

#### sig-masque

- Name: Lord-Provost Elaina Masque, The Hierophant (portrait)
- File: `art/sig-masque.jpg`
- Size: 1024x1024
- Prompt: Tarot card illustration from the fantasy world of Valisar, painted in gouache and ink on aged parchment with gold-leaf highlights, painterly, in the spirit of Studio Ghibli backgrounds and Zelda concept art with a FromSoftware melancholy. Deep indigo night sky with small warm stars, warm lantern and crystal light. Composed like a tarot card, with one clear central subject, frontal or three-quarter, a horizon line, symbolic objects placed deliberately, sky at the top, and the important content inside the middle 80 percent. Square 1024 by 1024. No text, no letters, no border, no frame, no watermark. Portrait, head and shoulders, three-quarter view, face centered and lit warmly, looking slightly off-frame. Suit of Suns palette: dominant gold (#c9962b), ivory, white-gold light, warm shadows. The emblem is a sixteen-point sun. Subject: a high elf in flowing gold and indigo robes with a half-mask of sun-forged metal, standing on a floating alabaster platform as doves wheel skyward. Behind the figure, a hint of the The Hierophant tarot card's traditional symbolism (a robed figure on a throne between two pillars, two keys crossed at the feet, two kneeling acolytes), kept quiet.

#### sig-shazz

- Name: Imperator Amegmon Shazz, The Devil (portrait)
- File: `art/sig-shazz.jpg`
- Size: 1024x1024
- Prompt: Tarot card illustration from the fantasy world of Valisar, painted in gouache and ink on aged parchment with gold-leaf highlights, painterly, in the spirit of Studio Ghibli backgrounds and Zelda concept art with a FromSoftware melancholy. Deep indigo night sky with small warm stars, warm lantern and crystal light. Composed like a tarot card, with one clear central subject, frontal or three-quarter, a horizon line, symbolic objects placed deliberately, sky at the top, and the important content inside the middle 80 percent. Square 1024 by 1024. No text, no letters, no border, no frame, no watermark. Portrait, head and shoulders, three-quarter view, face centered and lit warmly, looking slightly off-frame. Suit of Gears palette: dominant brass (#a8623a), sandstone, blue crystal glow. The emblem is a twelve-tooth gear. Subject: a kindly white-haired scholar pouring mint tea at a cluttered desk with a cat, the window behind him reflecting a massive spider covered in eyes. Behind the figure, a hint of the The Devil tarot card's traditional symbolism (a horned figure on a pedestal with two chained figures below, an inverted star), kept quiet.

#### title

- Name: title (site art: The painting behind the title screen. Wide, dark at the edges so it fades into the sky. Landscape 1536 by 1024.)
- File: `art/title.jpg`
- Size: 1536x1024
- Prompt: Wide painted landscape from the fantasy world of Valisar, gouache and ink with gold-leaf highlights, Studio Ghibli background painting meets Zelda concept art. An enormous cratered bone-white moon, far too large, rising over a dark valley: a small farm village with a few warm lantern windows, black-barked forest beyond, a ruined stone archway in a field with faint blue runes. Deep indigo night sky full of small warm stars. The moon is the subject, centered high; the land is a dark band along the bottom third. Melancholy and beautiful. No text, no border, no watermark. Landscape 1536 by 1024.

#### card-back

- Name: card-back (site art: The back of every card (the opponent’s hand, the deck). Portrait 1024 by 1536, symmetrical top to bottom so it reads the same upside down.)
- File: `art/card-back.jpg`
- Size: 1024x1536
- Prompt: The back of a tarot card from the fantasy world of Valisar. Ink and gold leaf on deep indigo parchment. A perfectly symmetrical design that reads the same upside down: a brass orrery of concentric rings and small gem planets around a central eight-point star, a crescent moon mirrored above and below, a sixteen-point sun, a pair of antlers, a cresting wave and a twelve-tooth gear worked into the four corners as small emblems. Fine hairline ornament, no figures, no text, no letters, no outer border (the game adds the frame). Flat and graphic like a printed card back, with slight parchment texture. Portrait 1024 by 1536.

#### table

- Name: table (site art: Optional. A texture for the reading cloth behind the lanes. Square 1024 by 1024, dark, low contrast, tileable if possible.)
- File: `art/table.jpg`
- Size: 1024x1024
- Prompt: A dark indigo velvet reading cloth seen from directly above, with a very faint gold-thread orrery pattern of concentric circles and tick marks woven into it, worn at the edges, a few tiny embroidered stars. Very low contrast, nothing bright, no text, no border, seamless and tileable. Square 1024 by 1024.

### Batch 2: Major Arcana

#### major-0

- Name: The Fool: Daxon Lamn (0)
- File: `art/major-0.jpg`
- Size: 1024x1024
- Prompt: Tarot card illustration from the fantasy world of Valisar, painted in gouache and ink on aged parchment with gold-leaf highlights, painterly, in the spirit of Studio Ghibli backgrounds and Zelda concept art with a FromSoftware melancholy. Deep indigo night sky with small warm stars, warm lantern and crystal light. Composed like a tarot card, with one clear central subject, frontal or three-quarter, a horizon line, symbolic objects placed deliberately, sky at the top, and the important content inside the middle 80 percent. Square 1024 by 1024. No text, no letters, no border, no frame, no watermark. Major Arcana palette: dominant violet (#6e5ab8) with starlight and gold leaf. Grander and more symmetrical than a suit card, like a tarot trump. Subject: a bright-eyed young swordsman with a fire sword on one hip and a water sword on the other, striding out of a farm village at dawn, a dog-like grin. Compose as a tarot trump: hieratic and frontal, the figure or force centered with its symbols arranged around it, gold leaf on the brightest points. Let the traditional symbolism of The Fool (a traveler stepping off a cliff edge with a small dog, a bundle on a stick, the sun behind) echo underneath the Valisar subject.

#### major-1

- Name: The Magician: Luigi Castanata (I)
- File: `art/major-1.jpg`
- Size: 1024x1024
- Prompt: Tarot card illustration from the fantasy world of Valisar, painted in gouache and ink on aged parchment with gold-leaf highlights, painterly, in the spirit of Studio Ghibli backgrounds and Zelda concept art with a FromSoftware melancholy. Deep indigo night sky with small warm stars, warm lantern and crystal light. Composed like a tarot card, with one clear central subject, frontal or three-quarter, a horizon line, symbolic objects placed deliberately, sky at the top, and the important content inside the middle 80 percent. Square 1024 by 1024. No text, no letters, no border, no frame, no watermark. Major Arcana palette: dominant violet (#6e5ab8) with starlight and gold leaf. Grander and more symmetrical than a suit card, like a tarot trump. Subject: a young charismatic relic hunter in a university library surrounded by books and artifacts, one hand raised, one lowered, a strange coin between his fingers. Compose as a tarot trump: hieratic and frontal, the figure or force centered with its symbols arranged around it, gold leaf on the brightest points. Let the traditional symbolism of The Magician (one hand raised and one lowered, as above so below, the four suit objects on a table, an infinity sign overhead) echo underneath the Valisar subject.

#### major-2

- Name: The High Priestess: Nitriti (II)
- File: `art/major-2.jpg`
- Size: 1024x1024
- Prompt: Tarot card illustration from the fantasy world of Valisar, painted in gouache and ink on aged parchment with gold-leaf highlights, painterly, in the spirit of Studio Ghibli backgrounds and Zelda concept art with a FromSoftware melancholy. Deep indigo night sky with small warm stars, warm lantern and crystal light. Composed like a tarot card, with one clear central subject, frontal or three-quarter, a horizon line, symbolic objects placed deliberately, sky at the top, and the important content inside the middle 80 percent. Square 1024 by 1024. No text, no letters, no border, no frame, no watermark. Major Arcana palette: dominant violet (#6e5ab8) with starlight and gold leaf. Grander and more symmetrical than a suit card, like a tarot trump. Subject: a vast amorphous spirit of night mist and vaporous tentacles, ringed by floating white porcelain masks with too many eyes or no mouths, stars behind. Compose as a tarot trump: hieratic and frontal, the figure or force centered with its symbols arranged around it, gold leaf on the brightest points. Let the traditional symbolism of The High Priestess (a veiled figure seated between two pillars, a crescent moon at her feet, a scroll in her lap) echo underneath the Valisar subject.

#### major-3

- Name: The Empress: Que’Rubra (III)
- File: `art/major-3.jpg`
- Size: 1024x1024
- Prompt: Tarot card illustration from the fantasy world of Valisar, painted in gouache and ink on aged parchment with gold-leaf highlights, painterly, in the spirit of Studio Ghibli backgrounds and Zelda concept art with a FromSoftware melancholy. Deep indigo night sky with small warm stars, warm lantern and crystal light. Composed like a tarot card, with one clear central subject, frontal or three-quarter, a horizon line, symbolic objects placed deliberately, sky at the top, and the important content inside the middle 80 percent. Square 1024 by 1024. No text, no letters, no border, no frame, no watermark. Major Arcana palette: dominant violet (#6e5ab8) with starlight and gold leaf. Grander and more symmetrical than a suit card, like a tarot trump. Subject: a sixty-foot oak spirit woman with bark skin etched in glowing spiral runes, hair of living leaves from green to amber, a crystal-topped staff, two twig children in her hair. Compose as a tarot trump: hieratic and frontal, the figure or force centered with its symbols arranged around it, gold leaf on the brightest points. Let the traditional symbolism of The Empress (a crowned woman seated in a field of grain, a heart-shaped shield, flowing water behind) echo underneath the Valisar subject.

#### major-4

- Name: The Emperor: Izuriel Sakazarac II (IV)
- File: `art/major-4.jpg`
- Size: 1024x1024
- Prompt: Tarot card illustration from the fantasy world of Valisar, painted in gouache and ink on aged parchment with gold-leaf highlights, painterly, in the spirit of Studio Ghibli backgrounds and Zelda concept art with a FromSoftware melancholy. Deep indigo night sky with small warm stars, warm lantern and crystal light. Composed like a tarot card, with one clear central subject, frontal or three-quarter, a horizon line, symbolic objects placed deliberately, sky at the top, and the important content inside the middle 80 percent. Square 1024 by 1024. No text, no letters, no border, no frame, no watermark. Major Arcana palette: dominant violet (#6e5ab8) with starlight and gold leaf. Grander and more symmetrical than a suit card, like a tarot trump. Subject: a distant sun-king on a throne of gold in a hall of stained glass, face hidden in radiance, seven shadows of seven different crowned men cast behind him. Compose as a tarot trump: hieratic and frontal, the figure or force centered with its symbols arranged around it, gold leaf on the brightest points. Let the traditional symbolism of The Emperor (a crowned figure on a stone throne with rams’ heads, an orb and scepter, barren mountains behind) echo underneath the Valisar subject.

#### major-5

- Name: The Hierophant: Lord-Provost Masque (V)
- File: `art/major-5.jpg`
- Size: 1024x1024
- Prompt: Tarot card illustration from the fantasy world of Valisar, painted in gouache and ink on aged parchment with gold-leaf highlights, painterly, in the spirit of Studio Ghibli backgrounds and Zelda concept art with a FromSoftware melancholy. Deep indigo night sky with small warm stars, warm lantern and crystal light. Composed like a tarot card, with one clear central subject, frontal or three-quarter, a horizon line, symbolic objects placed deliberately, sky at the top, and the important content inside the middle 80 percent. Square 1024 by 1024. No text, no letters, no border, no frame, no watermark. Major Arcana palette: dominant violet (#6e5ab8) with starlight and gold leaf. Grander and more symmetrical than a suit card, like a tarot trump. Subject: a high elf in flowing gold and indigo robes with a half-mask of sun-forged metal over one eye, standing before an eighteen-foot standing mirror, thirty-two robed singers behind. Compose as a tarot trump: hieratic and frontal, the figure or force centered with its symbols arranged around it, gold leaf on the brightest points. Let the traditional symbolism of The Hierophant (a robed figure on a throne between two pillars, two keys crossed at the feet, two kneeling acolytes) echo underneath the Valisar subject.

#### major-6

- Name: The Lovers: Althea & Caelum (VI)
- File: `art/major-6.jpg`
- Size: 1024x1024
- Prompt: Tarot card illustration from the fantasy world of Valisar, painted in gouache and ink on aged parchment with gold-leaf highlights, painterly, in the spirit of Studio Ghibli backgrounds and Zelda concept art with a FromSoftware melancholy. Deep indigo night sky with small warm stars, warm lantern and crystal light. Composed like a tarot card, with one clear central subject, frontal or three-quarter, a horizon line, symbolic objects placed deliberately, sky at the top, and the important content inside the middle 80 percent. Square 1024 by 1024. No text, no letters, no border, no frame, no watermark. Major Arcana palette: dominant violet (#6e5ab8) with starlight and gold leaf. Grander and more symmetrical than a suit card, like a tarot trump. Subject: an elven couple holding a small child’s hands before a radiant celestial gate of swirling stardust, a fox of starlight sitting on the far side. This card is an Omen (a spell or an event), so the image is a moment or a place rather than a portrait. Compose as a tarot trump: hieratic and frontal, the figure or force centered with its symbols arranged around it, gold leaf on the brightest points. Let the traditional symbolism of The Lovers (two figures beneath a radiant angel, a tree of flame and a tree of fruit, a mountain between them) echo underneath the Valisar subject.

#### major-7

- Name: The Chariot: The Solar Wind (VII)
- File: `art/major-7.jpg`
- Size: 1024x1024
- Prompt: Tarot card illustration from the fantasy world of Valisar, painted in gouache and ink on aged parchment with gold-leaf highlights, painterly, in the spirit of Studio Ghibli backgrounds and Zelda concept art with a FromSoftware melancholy. Deep indigo night sky with small warm stars, warm lantern and crystal light. Composed like a tarot card, with one clear central subject, frontal or three-quarter, a horizon line, symbolic objects placed deliberately, sky at the top, and the important content inside the middle 80 percent. Square 1024 by 1024. No text, no letters, no border, no frame, no watermark. Major Arcana palette: dominant violet (#6e5ab8) with starlight and gold leaf. Grander and more symmetrical than a suit card, like a tarot trump. Subject: an enormous airship of sunlit silverwood and gold tracery with stained-glass towers, prow shaped like a rising sun with wings, parting the clouds over a valley town. This card is an Omen (a spell or an event), so the image is a moment or a place rather than a portrait. Compose as a tarot trump: hieratic and frontal, the figure or force centered with its symbols arranged around it, gold leaf on the brightest points. Let the traditional symbolism of The Chariot (a crowned figure in a canopied chariot drawn by two sphinxes, a walled city behind) echo underneath the Valisar subject.

#### major-8

- Name: Strength: Grimore (VIII)
- File: `art/major-8.jpg`
- Size: 1024x1024
- Prompt: Tarot card illustration from the fantasy world of Valisar, painted in gouache and ink on aged parchment with gold-leaf highlights, painterly, in the spirit of Studio Ghibli backgrounds and Zelda concept art with a FromSoftware melancholy. Deep indigo night sky with small warm stars, warm lantern and crystal light. Composed like a tarot card, with one clear central subject, frontal or three-quarter, a horizon line, symbolic objects placed deliberately, sky at the top, and the important content inside the middle 80 percent. Square 1024 by 1024. No text, no letters, no border, no frame, no watermark. Major Arcana palette: dominant violet (#6e5ab8) with starlight and gold leaf. Grander and more symmetrical than a suit card, like a tarot trump. Subject: a gargantuan feral huntress spirit with claws and talons and a mane like a predator’s, mid-leap over a mountain treeline, wolves scattering beneath her. Compose as a tarot trump: hieratic and frontal, the figure or force centered with its symbols arranged around it, gold leaf on the brightest points. Let the traditional symbolism of Strength (a woman calmly closing a lion’s jaws, a lemniscate above her head, garlands) echo underneath the Valisar subject.

#### major-9

- Name: The Hermit: Luigi Bonemoon (IX)
- File: `art/major-9.jpg`
- Size: 1024x1024
- Prompt: Tarot card illustration from the fantasy world of Valisar, painted in gouache and ink on aged parchment with gold-leaf highlights, painterly, in the spirit of Studio Ghibli backgrounds and Zelda concept art with a FromSoftware melancholy. Deep indigo night sky with small warm stars, warm lantern and crystal light. Composed like a tarot card, with one clear central subject, frontal or three-quarter, a horizon line, symbolic objects placed deliberately, sky at the top, and the important content inside the middle 80 percent. Square 1024 by 1024. No text, no letters, no border, no frame, no watermark. Major Arcana palette: dominant violet (#6e5ab8) with starlight and gold leaf. Grander and more symmetrical than a suit card, like a tarot trump. Subject: a weathered 44-year-old man in plain burlap clothes holding a glowing brass lamp, a small fuzzy blob spirit at his feet, a cabin in the distance, blue flame at his fingertips. Compose as a tarot trump: hieratic and frontal, the figure or force centered with its symbols arranged around it, gold leaf on the brightest points. Let the traditional symbolism of The Hermit (a hooded elder on a mountain peak holding a lantern with a star inside, a staff) echo underneath the Valisar subject.

#### major-10

- Name: Wheel of Fortune: The Orrery (X)
- File: `art/major-10.jpg`
- Size: 1024x1024
- Prompt: Tarot card illustration from the fantasy world of Valisar, painted in gouache and ink on aged parchment with gold-leaf highlights, painterly, in the spirit of Studio Ghibli backgrounds and Zelda concept art with a FromSoftware melancholy. Deep indigo night sky with small warm stars, warm lantern and crystal light. Composed like a tarot card, with one clear central subject, frontal or three-quarter, a horizon line, symbolic objects placed deliberately, sky at the top, and the important content inside the middle 80 percent. Square 1024 by 1024. No text, no letters, no border, no frame, no watermark. Major Arcana palette: dominant violet (#6e5ab8) with starlight and gold leaf. Grander and more symmetrical than a suit card, like a tarot trump. Subject: a grand brass orrery in an obsidian observatory, gem planets orbiting a glowing core, a crystal dome above showing the night sky, one ring visibly bent. This card is an Omen (a spell or an event), so the image is a moment or a place rather than a portrait. Compose as a tarot trump: hieratic and frontal, the figure or force centered with its symbols arranged around it, gold leaf on the brightest points. Let the traditional symbolism of Wheel of Fortune (a great wheel with figures rising and falling, a sphinx on top, clouds at the corners) echo underneath the Valisar subject.

#### major-11

- Name: Justice: Dagan, Sovereign of the Scales (XI)
- File: `art/major-11.jpg`
- Size: 1024x1024
- Prompt: Tarot card illustration from the fantasy world of Valisar, painted in gouache and ink on aged parchment with gold-leaf highlights, painterly, in the spirit of Studio Ghibli backgrounds and Zelda concept art with a FromSoftware melancholy. Deep indigo night sky with small warm stars, warm lantern and crystal light. Composed like a tarot card, with one clear central subject, frontal or three-quarter, a horizon line, symbolic objects placed deliberately, sky at the top, and the important content inside the middle 80 percent. Square 1024 by 1024. No text, no letters, no border, no frame, no watermark. Major Arcana palette: dominant violet (#6e5ab8) with starlight and gold leaf. Grander and more symmetrical than a suit card, like a tarot trump. Subject: a silver stag standing in a beam of moonlight in a grove, a set of perfectly balanced scales suspended between its antlers. This card is an Omen (a spell or an event), so the image is a moment or a place rather than a portrait. Compose as a tarot trump: hieratic and frontal, the figure or force centered with its symbols arranged around it, gold leaf on the brightest points. Let the traditional symbolism of Justice (a seated figure with a raised sword and balanced scales between two pillars) echo underneath the Valisar subject.

#### major-12

- Name: The Hanged Man: Rorik Flamebeard (XII)
- File: `art/major-12.jpg`
- Size: 1024x1024
- Prompt: Tarot card illustration from the fantasy world of Valisar, painted in gouache and ink on aged parchment with gold-leaf highlights, painterly, in the spirit of Studio Ghibli backgrounds and Zelda concept art with a FromSoftware melancholy. Deep indigo night sky with small warm stars, warm lantern and crystal light. Composed like a tarot card, with one clear central subject, frontal or three-quarter, a horizon line, symbolic objects placed deliberately, sky at the top, and the important content inside the middle 80 percent. Square 1024 by 1024. No text, no letters, no border, no frame, no watermark. Major Arcana palette: dominant violet (#6e5ab8) with starlight and gold leaf. Grander and more symmetrical than a suit card, like a tarot trump. Subject: a red-bearded dwarf paladin suspended upside down fifteen feet in the air over a goblin ritual circle, a warhammer with molten veins falling from his grip. Compose as a tarot trump: hieratic and frontal, the figure or force centered with its symbols arranged around it, gold leaf on the brightest points. Let the traditional symbolism of The Hanged Man (a figure suspended upside down by one foot from a living tree, a halo of light, serene) echo underneath the Valisar subject.

#### major-13

- Name: Death: The Man in Black (XIII)
- File: `art/major-13.jpg`
- Size: 1024x1024
- Prompt: Tarot card illustration from the fantasy world of Valisar, painted in gouache and ink on aged parchment with gold-leaf highlights, painterly, in the spirit of Studio Ghibli backgrounds and Zelda concept art with a FromSoftware melancholy. Deep indigo night sky with small warm stars, warm lantern and crystal light. Composed like a tarot card, with one clear central subject, frontal or three-quarter, a horizon line, symbolic objects placed deliberately, sky at the top, and the important content inside the middle 80 percent. Square 1024 by 1024. No text, no letters, no border, no frame, no watermark. Major Arcana palette: dominant violet (#6e5ab8) with starlight and gold leaf. Grander and more symmetrical than a suit card, like a tarot trump. Subject: a lone figure in a wide-brimmed black hat, poncho, and dark boots standing at a moonlit crossroads, no face visible, a long road behind and ahead. Compose as a tarot trump: hieratic and frontal, the figure or force centered with its symbols arranged around it, gold leaf on the brightest points. Let the traditional symbolism of Death (a skeletal rider on a pale horse with a black banner, a rising sun between two towers) echo underneath the Valisar subject.

#### major-14

- Name: Temperance: Brother Soren (XIV)
- File: `art/major-14.jpg`
- Size: 1024x1024
- Prompt: Tarot card illustration from the fantasy world of Valisar, painted in gouache and ink on aged parchment with gold-leaf highlights, painterly, in the spirit of Studio Ghibli backgrounds and Zelda concept art with a FromSoftware melancholy. Deep indigo night sky with small warm stars, warm lantern and crystal light. Composed like a tarot card, with one clear central subject, frontal or three-quarter, a horizon line, symbolic objects placed deliberately, sky at the top, and the important content inside the middle 80 percent. Square 1024 by 1024. No text, no letters, no border, no frame, no watermark. Major Arcana palette: dominant violet (#6e5ab8) with starlight and gold leaf. Grander and more symmetrical than a suit card, like a tarot trump. Subject: a soft-spoken tabaxi cleric in simple robes tending a zen garden of jasmine and sage beside a wooden chapel, a brazier and a metal wind chime behind him. Compose as a tarot trump: hieratic and frontal, the figure or force centered with its symbols arranged around it, gold leaf on the brightest points. Let the traditional symbolism of Temperance (an angel pouring water between two cups, one foot in water and one on land, a path to the sun) echo underneath the Valisar subject.

#### major-15

- Name: The Devil: Imperator Amegmon Shazz (XV)
- File: `art/major-15.jpg`
- Size: 1024x1024
- Prompt: Tarot card illustration from the fantasy world of Valisar, painted in gouache and ink on aged parchment with gold-leaf highlights, painterly, in the spirit of Studio Ghibli backgrounds and Zelda concept art with a FromSoftware melancholy. Deep indigo night sky with small warm stars, warm lantern and crystal light. Composed like a tarot card, with one clear central subject, frontal or three-quarter, a horizon line, symbolic objects placed deliberately, sky at the top, and the important content inside the middle 80 percent. Square 1024 by 1024. No text, no letters, no border, no frame, no watermark. Major Arcana palette: dominant violet (#6e5ab8) with starlight and gold leaf. Grander and more symmetrical than a suit card, like a tarot trump. Subject: a kindly white-haired old scholar in spectacles pouring mint tea at a cluttered desk with a cat, and in the window behind him the reflection of a massive spider covered in eyes. Compose as a tarot trump: hieratic and frontal, the figure or force centered with its symbols arranged around it, gold leaf on the brightest points. Let the traditional symbolism of The Devil (a horned figure on a pedestal with two chained figures below, an inverted star) echo underneath the Valisar subject.

#### major-16

- Name: The Tower: The Fallen Isle (XVI)
- File: `art/major-16.jpg`
- Size: 1024x1024
- Prompt: Tarot card illustration from the fantasy world of Valisar, painted in gouache and ink on aged parchment with gold-leaf highlights, painterly, in the spirit of Studio Ghibli backgrounds and Zelda concept art with a FromSoftware melancholy. Deep indigo night sky with small warm stars, warm lantern and crystal light. Composed like a tarot card, with one clear central subject, frontal or three-quarter, a horizon line, symbolic objects placed deliberately, sky at the top, and the important content inside the middle 80 percent. Square 1024 by 1024. No text, no letters, no border, no frame, no watermark. Major Arcana palette: dominant violet (#6e5ab8) with starlight and gold leaf. Grander and more symmetrical than a suit card, like a tarot trump. Subject: a mile-long floating island with a village on top plummeting out of a sunset sky toward golden farmland, its anchor chains snapping. This card is an Omen (a spell or an event), so the image is a moment or a place rather than a portrait. Compose as a tarot trump: hieratic and frontal, the figure or force centered with its symbols arranged around it, gold leaf on the brightest points. Let the traditional symbolism of The Tower (a tower struck by lightning, its crown knocked off, figures falling) echo underneath the Valisar subject.

#### major-17

- Name: The Star: Lirielle Starwhisper (XVII)
- File: `art/major-17.jpg`
- Size: 1024x1024
- Prompt: Tarot card illustration from the fantasy world of Valisar, painted in gouache and ink on aged parchment with gold-leaf highlights, painterly, in the spirit of Studio Ghibli backgrounds and Zelda concept art with a FromSoftware melancholy. Deep indigo night sky with small warm stars, warm lantern and crystal light. Composed like a tarot card, with one clear central subject, frontal or three-quarter, a horizon line, symbolic objects placed deliberately, sky at the top, and the important content inside the middle 80 percent. Square 1024 by 1024. No text, no letters, no border, no frame, no watermark. Major Arcana palette: dominant violet (#6e5ab8) with starlight and gold leaf. Grander and more symmetrical than a suit card, like a tarot trump. Subject: an elven druid in starlit robes holding a glowing star map that projects constellations into the air, a fox of pale light at her side, a huge full moon above. Compose as a tarot trump: hieratic and frontal, the figure or force centered with its symbols arranged around it, gold leaf on the brightest points. Let the traditional symbolism of The Star (a kneeling figure pouring water into a pool and onto the land beneath one great star and seven small ones) echo underneath the Valisar subject.

#### major-18

- Name: The Moon: The Bone Moon (XVIII)
- File: `art/major-18.jpg`
- Size: 1024x1024
- Prompt: Tarot card illustration from the fantasy world of Valisar, painted in gouache and ink on aged parchment with gold-leaf highlights, painterly, in the spirit of Studio Ghibli backgrounds and Zelda concept art with a FromSoftware melancholy. Deep indigo night sky with small warm stars, warm lantern and crystal light. Composed like a tarot card, with one clear central subject, frontal or three-quarter, a horizon line, symbolic objects placed deliberately, sky at the top, and the important content inside the middle 80 percent. Square 1024 by 1024. No text, no letters, no border, no frame, no watermark. Major Arcana palette: dominant violet (#6e5ab8) with starlight and gold leaf. Grander and more symmetrical than a suit card, like a tarot trump. Subject: a colossal cratered white moon filling the sky over a dead grey plain of twisted trees, tiny human silhouettes casting long shadows toward it. This card is an Omen (a spell or an event), so the image is a moment or a place rather than a portrait. Compose as a tarot trump: hieratic and frontal, the figure or force centered with its symbols arranged around it, gold leaf on the brightest points. Let the traditional symbolism of The Moon (a face in the moon over a path between two towers, a dog and a wolf howling, a crayfish in the pool) echo underneath the Valisar subject.

#### major-19

- Name: The Sun: The Spark (XIX)
- File: `art/major-19.jpg`
- Size: 1024x1024
- Prompt: Tarot card illustration from the fantasy world of Valisar, painted in gouache and ink on aged parchment with gold-leaf highlights, painterly, in the spirit of Studio Ghibli backgrounds and Zelda concept art with a FromSoftware melancholy. Deep indigo night sky with small warm stars, warm lantern and crystal light. Composed like a tarot card, with one clear central subject, frontal or three-quarter, a horizon line, symbolic objects placed deliberately, sky at the top, and the important content inside the middle 80 percent. Square 1024 by 1024. No text, no letters, no border, no frame, no watermark. Major Arcana palette: dominant violet (#6e5ab8) with starlight and gold leaf. Grander and more symmetrical than a suit card, like a tarot trump. Subject: two suns in one sky over a green valley, one gold and one pale blue-white, a lone figure on a hill with arms raised between them. This card is an Omen (a spell or an event), so the image is a moment or a place rather than a portrait. Compose as a tarot trump: hieratic and frontal, the figure or force centered with its symbols arranged around it, gold leaf on the brightest points. Let the traditional symbolism of The Sun (a child on a white horse under a huge radiant sun, sunflowers over a wall) echo underneath the Valisar subject.

#### major-20

- Name: Judgement: The Septor’s Chorus (XX)
- File: `art/major-20.jpg`
- Size: 1024x1024
- Prompt: Tarot card illustration from the fantasy world of Valisar, painted in gouache and ink on aged parchment with gold-leaf highlights, painterly, in the spirit of Studio Ghibli backgrounds and Zelda concept art with a FromSoftware melancholy. Deep indigo night sky with small warm stars, warm lantern and crystal light. Composed like a tarot card, with one clear central subject, frontal or three-quarter, a horizon line, symbolic objects placed deliberately, sky at the top, and the important content inside the middle 80 percent. Square 1024 by 1024. No text, no letters, no border, no frame, no watermark. Major Arcana palette: dominant violet (#6e5ab8) with starlight and gold leaf. Grander and more symmetrical than a suit card, like a tarot trump. Subject: thirty-two robed singers of every age standing in rows with hoods thrown back, all their eyes solid gold and glowing, mouths open in one chord, trumpets above. Compose as a tarot trump: hieratic and frontal, the figure or force centered with its symbols arranged around it, gold leaf on the brightest points. Let the traditional symbolism of Judgement (an angel with a trumpet above, figures rising from tombs with arms raised) echo underneath the Valisar subject.

#### major-21

- Name: The World: The Eldspyre (XXI)
- File: `art/major-21.jpg`
- Size: 1024x1024
- Prompt: Tarot card illustration from the fantasy world of Valisar, painted in gouache and ink on aged parchment with gold-leaf highlights, painterly, in the spirit of Studio Ghibli backgrounds and Zelda concept art with a FromSoftware melancholy. Deep indigo night sky with small warm stars, warm lantern and crystal light. Composed like a tarot card, with one clear central subject, frontal or three-quarter, a horizon line, symbolic objects placed deliberately, sky at the top, and the important content inside the middle 80 percent. Square 1024 by 1024. No text, no letters, no border, no frame, no watermark. Major Arcana palette: dominant violet (#6e5ab8) with starlight and gold leaf. Grander and more symmetrical than a suit card, like a tarot trump. Subject: a cosmic forge-flame at the center of everything, half radiant white-gold and half deep shadow, ancient sorcerer-kings kneeling around it, a continent cracking beneath. This card is an Omen (a spell or an event), so the image is a moment or a place rather than a portrait. Compose as a tarot trump: hieratic and frontal, the figure or force centered with its symbols arranged around it, gold leaf on the brightest points. Let the traditional symbolism of The World (a dancing figure inside a laurel wreath with the four living creatures at the corners) echo underneath the Valisar subject.

### Batch 3: Suns and Antlers

#### suns-ace

- Name: Dawn Over Aurengate (Ace of Suns)
- File: `art/suns-ace.jpg`
- Size: 1024x1024
- Prompt: Tarot card illustration from the fantasy world of Valisar, painted in gouache and ink on aged parchment with gold-leaf highlights, painterly, in the spirit of Studio Ghibli backgrounds and Zelda concept art with a FromSoftware melancholy. Deep indigo night sky with small warm stars, warm lantern and crystal light. Composed like a tarot card, with one clear central subject, frontal or three-quarter, a horizon line, symbolic objects placed deliberately, sky at the top, and the important content inside the middle 80 percent. Square 1024 by 1024. No text, no letters, no border, no frame, no watermark. Suit of Suns palette: dominant gold (#c9962b), ivory, white-gold light, warm shadows. The emblem is a sixteen-point sun. Subject: sunrise breaking over the marble steps and canals of Aurengate, a sixteen-point golden sunburst cresting the horizon, long gold light on white stone. This card is an Omen (a spell or an event), so the image is a moment or a place rather than a portrait. Compose as a tarot Ace: a single large sunburst medallion held up by a hand emerging from cloud or mist, the landscape small below it.

#### suns-2

- Name: The Guard Post (Two of Suns)
- File: `art/suns-2.jpg`
- Size: 1024x1024
- Prompt: Tarot card illustration from the fantasy world of Valisar, painted in gouache and ink on aged parchment with gold-leaf highlights, painterly, in the spirit of Studio Ghibli backgrounds and Zelda concept art with a FromSoftware melancholy. Deep indigo night sky with small warm stars, warm lantern and crystal light. Composed like a tarot card, with one clear central subject, frontal or three-quarter, a horizon line, symbolic objects placed deliberately, sky at the top, and the important content inside the middle 80 percent. Square 1024 by 1024. No text, no letters, no border, no frame, no watermark. Suit of Suns palette: dominant gold (#c9962b), ivory, white-gold light, warm shadows. The emblem is a sixteen-point sun. Subject: two tired town guards on a wooden watchtower at dusk, one holding a lantern, farmland and dark forest behind them. Compose as a tarot pip card: work exactly two small suns or sunburst medallions into the scene, arranged deliberately so they can be counted at a glance.

#### suns-3

- Name: Braxon Lamn (Three of Suns)
- File: `art/suns-3.jpg`
- Size: 1024x1024
- Prompt: Tarot card illustration from the fantasy world of Valisar, painted in gouache and ink on aged parchment with gold-leaf highlights, painterly, in the spirit of Studio Ghibli backgrounds and Zelda concept art with a FromSoftware melancholy. Deep indigo night sky with small warm stars, warm lantern and crystal light. Composed like a tarot card, with one clear central subject, frontal or three-quarter, a horizon line, symbolic objects placed deliberately, sky at the top, and the important content inside the middle 80 percent. Square 1024 by 1024. No text, no letters, no border, no frame, no watermark. Suit of Suns palette: dominant gold (#c9962b), ivory, white-gold light, warm shadows. The emblem is a sixteen-point sun. Subject: a broad soot-stained blacksmith in a leather apron at a glowing forge, sparks flying, a small boy watching from the doorway. Compose as a tarot pip card: work exactly three small suns or sunburst medallions into the scene, arranged deliberately so they can be counted at a glance.

#### suns-4

- Name: Eva’s Kitchen (Four of Suns)
- File: `art/suns-4.jpg`
- Size: 1024x1024
- Prompt: Tarot card illustration from the fantasy world of Valisar, painted in gouache and ink on aged parchment with gold-leaf highlights, painterly, in the spirit of Studio Ghibli backgrounds and Zelda concept art with a FromSoftware melancholy. Deep indigo night sky with small warm stars, warm lantern and crystal light. Composed like a tarot card, with one clear central subject, frontal or three-quarter, a horizon line, symbolic objects placed deliberately, sky at the top, and the important content inside the middle 80 percent. Square 1024 by 1024. No text, no letters, no border, no frame, no watermark. Suit of Suns palette: dominant gold (#c9962b), ivory, white-gold light, warm shadows. The emblem is a sixteen-point sun. Subject: a cozy cottage kitchen turned laboratory, glowing orbs of liquid floating over a stew pot, herbs hanging from the beams, a woman in an apron muttering an incantation. This card is an Omen (a spell or an event), so the image is a moment or a place rather than a portrait. Compose as a tarot pip card: work exactly four small suns or sunburst medallions into the scene, arranged deliberately so they can be counted at a glance.

#### suns-5

- Name: Vraxxis, the Hungering Cinder (Five of Suns)
- File: `art/suns-5.jpg`
- Size: 1024x1024
- Prompt: Tarot card illustration from the fantasy world of Valisar, painted in gouache and ink on aged parchment with gold-leaf highlights, painterly, in the spirit of Studio Ghibli backgrounds and Zelda concept art with a FromSoftware melancholy. Deep indigo night sky with small warm stars, warm lantern and crystal light. Composed like a tarot card, with one clear central subject, frontal or three-quarter, a horizon line, symbolic objects placed deliberately, sky at the top, and the important content inside the middle 80 percent. Square 1024 by 1024. No text, no letters, no border, no frame, no watermark. Suit of Suns palette: dominant gold (#c9962b), ivory, white-gold light, warm shadows. The emblem is a sixteen-point sun. Subject: a towering spirit of ash and glowing ember-bone looming over a burning market square, its hollow face lit from within, collapsing wagons around it. Compose as a tarot pip card: work exactly five small suns or sunburst medallions into the scene, arranged deliberately so they can be counted at a glance.

#### suns-6

- Name: The Festival of Radiant Dawn (Six of Suns)
- File: `art/suns-6.jpg`
- Size: 1024x1024
- Prompt: Tarot card illustration from the fantasy world of Valisar, painted in gouache and ink on aged parchment with gold-leaf highlights, painterly, in the spirit of Studio Ghibli backgrounds and Zelda concept art with a FromSoftware melancholy. Deep indigo night sky with small warm stars, warm lantern and crystal light. Composed like a tarot card, with one clear central subject, frontal or three-quarter, a horizon line, symbolic objects placed deliberately, sky at the top, and the important content inside the middle 80 percent. Square 1024 by 1024. No text, no letters, no border, no frame, no watermark. Suit of Suns palette: dominant gold (#c9962b), ivory, white-gold light, warm shadows. The emblem is a sixteen-point sun. Subject: a village square strung with golden sun-lanterns at night, a crowd cheering a stage play, banners with a radiant eye, a few faces in the crowd unsmiling. This card is an Omen (a spell or an event), so the image is a moment or a place rather than a portrait. Compose as a tarot pip card: work exactly six small suns or sunburst medallions into the scene, arranged deliberately so they can be counted at a glance.

#### suns-7

- Name: Kojin, the Fiery Whip (Seven of Suns)
- File: `art/suns-7.jpg`
- Size: 1024x1024
- Prompt: Tarot card illustration from the fantasy world of Valisar, painted in gouache and ink on aged parchment with gold-leaf highlights, painterly, in the spirit of Studio Ghibli backgrounds and Zelda concept art with a FromSoftware melancholy. Deep indigo night sky with small warm stars, warm lantern and crystal light. Composed like a tarot card, with one clear central subject, frontal or three-quarter, a horizon line, symbolic objects placed deliberately, sky at the top, and the important content inside the middle 80 percent. Square 1024 by 1024. No text, no letters, no border, no frame, no watermark. Suit of Suns palette: dominant gold (#c9962b), ivory, white-gold light, warm shadows. The emblem is a sixteen-point sun. Subject: a fire spirit shaped like a coiled whip of living flame rising from a mountain forge, dwarven anvils below, molten veins in black rock. Compose as a tarot pip card: work exactly seven small suns or sunburst medallions into the scene, arranged deliberately so they can be counted at a glance.

#### suns-8

- Name: Aurium Plate (Eight of Suns)
- File: `art/suns-8.jpg`
- Size: 1024x1024
- Prompt: Tarot card illustration from the fantasy world of Valisar, painted in gouache and ink on aged parchment with gold-leaf highlights, painterly, in the spirit of Studio Ghibli backgrounds and Zelda concept art with a FromSoftware melancholy. Deep indigo night sky with small warm stars, warm lantern and crystal light. Composed like a tarot card, with one clear central subject, frontal or three-quarter, a horizon line, symbolic objects placed deliberately, sky at the top, and the important content inside the middle 80 percent. Square 1024 by 1024. No text, no letters, no border, no frame, no watermark. Suit of Suns palette: dominant gold (#c9962b), ivory, white-gold light, warm shadows. The emblem is a sixteen-point sun. Subject: a suit of mirrored gold-and-steel plate armor on a stand, etched with sixteen-point stars, catching torchlight in an armory. This card is a Relic (an object), so the object is the hero of the image, shown large and detailed. Compose as a tarot pip card: work exactly eight small suns or sunburst medallions into the scene, arranged deliberately so they can be counted at a glance.

#### suns-9

- Name: The Solar Flare Cannon (Nine of Suns)
- File: `art/suns-9.jpg`
- Size: 1024x1024
- Prompt: Tarot card illustration from the fantasy world of Valisar, painted in gouache and ink on aged parchment with gold-leaf highlights, painterly, in the spirit of Studio Ghibli backgrounds and Zelda concept art with a FromSoftware melancholy. Deep indigo night sky with small warm stars, warm lantern and crystal light. Composed like a tarot card, with one clear central subject, frontal or three-quarter, a horizon line, symbolic objects placed deliberately, sky at the top, and the important content inside the middle 80 percent. Square 1024 by 1024. No text, no letters, no border, no frame, no watermark. Suit of Suns palette: dominant gold (#c9962b), ivory, white-gold light, warm shadows. The emblem is a sixteen-point sun. Subject: an enormous brass siege cannon on a canyon rampart firing a beam of white-gold radiant heat across a desert, sand turning to glass. This card is an Omen (a spell or an event), so the image is a moment or a place rather than a portrait. Compose as a tarot pip card: work exactly nine small suns or sunburst medallions into the scene, arranged deliberately so they can be counted at a glance.

#### suns-10

- Name: Ilzaren, the Resplendent King (Ten of Suns)
- File: `art/suns-10.jpg`
- Size: 1024x1024
- Prompt: Tarot card illustration from the fantasy world of Valisar, painted in gouache and ink on aged parchment with gold-leaf highlights, painterly, in the spirit of Studio Ghibli backgrounds and Zelda concept art with a FromSoftware melancholy. Deep indigo night sky with small warm stars, warm lantern and crystal light. Composed like a tarot card, with one clear central subject, frontal or three-quarter, a horizon line, symbolic objects placed deliberately, sky at the top, and the important content inside the middle 80 percent. Square 1024 by 1024. No text, no letters, no border, no frame, no watermark. Suit of Suns palette: dominant gold (#c9962b), ivory, white-gold light, warm shadows. The emblem is a sixteen-point sun. Subject: a theatrical elf king in radiant robes on a festival dais, arms spread, golden light behind his head like a halo, worshippers below. Compose as a tarot pip card: work exactly ten small suns or sunburst medallions into the scene, arranged deliberately so they can be counted at a glance.

#### suns-page

- Name: Captain Elira Voss (Page of Suns)
- File: `art/suns-page.jpg`
- Size: 1024x1024
- Prompt: Tarot card illustration from the fantasy world of Valisar, painted in gouache and ink on aged parchment with gold-leaf highlights, painterly, in the spirit of Studio Ghibli backgrounds and Zelda concept art with a FromSoftware melancholy. Deep indigo night sky with small warm stars, warm lantern and crystal light. Composed like a tarot card, with one clear central subject, frontal or three-quarter, a horizon line, symbolic objects placed deliberately, sky at the top, and the important content inside the middle 80 percent. Square 1024 by 1024. No text, no letters, no border, no frame, no watermark. Suit of Suns palette: dominant gold (#c9962b), ivory, white-gold light, warm shadows. The emblem is a sixteen-point sun. Subject: a charred and bloodied half-elf guard captain with a longsword, shouting over a burning marketplace, two wounded guards at her back. Compose as a tarot Page: a young standing figure holding one of the suit's objects (small suns or sunburst medallions), looking at it.

#### suns-knight

- Name: General Vath Enverez (Knight of Suns)
- File: `art/suns-knight.jpg`
- Size: 1024x1024
- Prompt: Tarot card illustration from the fantasy world of Valisar, painted in gouache and ink on aged parchment with gold-leaf highlights, painterly, in the spirit of Studio Ghibli backgrounds and Zelda concept art with a FromSoftware melancholy. Deep indigo night sky with small warm stars, warm lantern and crystal light. Composed like a tarot card, with one clear central subject, frontal or three-quarter, a horizon line, symbolic objects placed deliberately, sky at the top, and the important content inside the middle 80 percent. Square 1024 by 1024. No text, no letters, no border, no frame, no watermark. Suit of Suns palette: dominant gold (#c9962b), ivory, white-gold light, warm shadows. The emblem is a sixteen-point sun. Subject: a young paladin in gleaming aurium plate etched with sixteen-point stars, silver circlet, sword raised in a dawn field, haunted eyes. Compose as a tarot Knight: a figure in motion, armed or mounted, caught mid-action, the suit emblem on their gear.

#### suns-queen

- Name: Vel, the Emberlight (Queen of Suns)
- File: `art/suns-queen.jpg`
- Size: 1024x1024
- Prompt: Tarot card illustration from the fantasy world of Valisar, painted in gouache and ink on aged parchment with gold-leaf highlights, painterly, in the spirit of Studio Ghibli backgrounds and Zelda concept art with a FromSoftware melancholy. Deep indigo night sky with small warm stars, warm lantern and crystal light. Composed like a tarot card, with one clear central subject, frontal or three-quarter, a horizon line, symbolic objects placed deliberately, sky at the top, and the important content inside the middle 80 percent. Square 1024 by 1024. No text, no letters, no border, no frame, no watermark. Suit of Suns palette: dominant gold (#c9962b), ivory, white-gold light, warm shadows. The emblem is a sixteen-point sun. Subject: a serene red-haired woman in a duelist tunic whose skin shimmers like heat haze, faint arc-light pulsing beneath, standing perfectly still. Compose as a tarot Queen: a seated figure, calm, looking outward, with the suit's object (small suns or sunburst medallions) beside or in hand.

#### suns-king

- Name: Tyserion I, the Golden Blade (King of Suns)
- File: `art/suns-king.jpg`
- Size: 1024x1024
- Prompt: Tarot card illustration from the fantasy world of Valisar, painted in gouache and ink on aged parchment with gold-leaf highlights, painterly, in the spirit of Studio Ghibli backgrounds and Zelda concept art with a FromSoftware melancholy. Deep indigo night sky with small warm stars, warm lantern and crystal light. Composed like a tarot card, with one clear central subject, frontal or three-quarter, a horizon line, symbolic objects placed deliberately, sky at the top, and the important content inside the middle 80 percent. Square 1024 by 1024. No text, no letters, no border, no frame, no watermark. Suit of Suns palette: dominant gold (#c9962b), ivory, white-gold light, warm shadows. The emblem is a sixteen-point sun. Subject: a warrior-king in gold armor with a blazing golden greatsword leading a charge against a canyon city of melting stone towers, sun behind him. Compose as a tarot King: an enthroned or towering figure of authority, symmetrical, the suit emblem repeated in the throne or the sky.

#### antlers-ace

- Name: Wisplight (Ace of Antlers)
- File: `art/antlers-ace.jpg`
- Size: 1024x1024
- Prompt: Tarot card illustration from the fantasy world of Valisar, painted in gouache and ink on aged parchment with gold-leaf highlights, painterly, in the spirit of Studio Ghibli backgrounds and Zelda concept art with a FromSoftware melancholy. Deep indigo night sky with small warm stars, warm lantern and crystal light. Composed like a tarot card, with one clear central subject, frontal or three-quarter, a horizon line, symbolic objects placed deliberately, sky at the top, and the important content inside the middle 80 percent. Square 1024 by 1024. No text, no letters, no border, no frame, no watermark. Suit of Antlers palette: dominant moss green (#4d7f57) against indigo night, pale blue-white wisplight. The emblem is a pair of antlers. Subject: a tiny drifting wisp of pale blue-white light in a dark forest clearing, ferns lit faintly beneath it. Compose as a tarot Ace: a single large pair of antlers held up by a hand emerging from cloud or mist, the landscape small below it.

#### antlers-2

- Name: Elder Voren Nightbloom (Two of Antlers)
- File: `art/antlers-2.jpg`
- Size: 1024x1024
- Prompt: Tarot card illustration from the fantasy world of Valisar, painted in gouache and ink on aged parchment with gold-leaf highlights, painterly, in the spirit of Studio Ghibli backgrounds and Zelda concept art with a FromSoftware melancholy. Deep indigo night sky with small warm stars, warm lantern and crystal light. Composed like a tarot card, with one clear central subject, frontal or three-quarter, a horizon line, symbolic objects placed deliberately, sky at the top, and the important content inside the middle 80 percent. Square 1024 by 1024. No text, no letters, no border, no frame, no watermark. Suit of Antlers palette: dominant moss green (#4d7f57) against indigo night, pale blue-white wisplight. The emblem is a pair of antlers. Subject: a hooded wood elf elder in robes that shimmer with ethereal light, standing inside a hollowed tree, a purple bruise of shadow at the hem. Compose as a tarot pip card: work exactly two antlers or antler-shaped branches into the scene, arranged deliberately so they can be counted at a glance.

#### antlers-3

- Name: The Oondray (Three of Antlers)
- File: `art/antlers-3.jpg`
- Size: 1024x1024
- Prompt: Tarot card illustration from the fantasy world of Valisar, painted in gouache and ink on aged parchment with gold-leaf highlights, painterly, in the spirit of Studio Ghibli backgrounds and Zelda concept art with a FromSoftware melancholy. Deep indigo night sky with small warm stars, warm lantern and crystal light. Composed like a tarot card, with one clear central subject, frontal or three-quarter, a horizon line, symbolic objects placed deliberately, sky at the top, and the important content inside the middle 80 percent. Square 1024 by 1024. No text, no letters, no border, no frame, no watermark. Suit of Antlers palette: dominant moss green (#4d7f57) against indigo night, pale blue-white wisplight. The emblem is a pair of antlers. Subject: a humanoid tangle of dry thorned brambles with two hollow eyes, dragging itself across a rutted road toward a stuck caravan. Compose as a tarot pip card: work exactly three antlers or antler-shaped branches into the scene, arranged deliberately so they can be counted at a glance.

#### antlers-4

- Name: Portal of Autumn Leaves (Four of Antlers)
- File: `art/antlers-4.jpg`
- Size: 1024x1024
- Prompt: Tarot card illustration from the fantasy world of Valisar, painted in gouache and ink on aged parchment with gold-leaf highlights, painterly, in the spirit of Studio Ghibli backgrounds and Zelda concept art with a FromSoftware melancholy. Deep indigo night sky with small warm stars, warm lantern and crystal light. Composed like a tarot card, with one clear central subject, frontal or three-quarter, a horizon line, symbolic objects placed deliberately, sky at the top, and the important content inside the middle 80 percent. Square 1024 by 1024. No text, no letters, no border, no frame, no watermark. Suit of Antlers palette: dominant moss green (#4d7f57) against indigo night, pale blue-white wisplight. The emblem is a pair of antlers. Subject: a spiraling vortex of orange and amber autumn leaves opening like a doorway in a black-barked forest, warm light inside. This card is an Omen (a spell or an event), so the image is a moment or a place rather than a portrait. Compose as a tarot pip card: work exactly four antlers or antler-shaped branches into the scene, arranged deliberately so they can be counted at a glance.

#### antlers-5

- Name: Shadowling Stalkers (Five of Antlers)
- File: `art/antlers-5.jpg`
- Size: 1024x1024
- Prompt: Tarot card illustration from the fantasy world of Valisar, painted in gouache and ink on aged parchment with gold-leaf highlights, painterly, in the spirit of Studio Ghibli backgrounds and Zelda concept art with a FromSoftware melancholy. Deep indigo night sky with small warm stars, warm lantern and crystal light. Composed like a tarot card, with one clear central subject, frontal or three-quarter, a horizon line, symbolic objects placed deliberately, sky at the top, and the important content inside the middle 80 percent. Square 1024 by 1024. No text, no letters, no border, no frame, no watermark. Suit of Antlers palette: dominant moss green (#4d7f57) against indigo night, pale blue-white wisplight. The emblem is a pair of antlers. Subject: lean shadow creatures with too-long limbs circling a lantern-lit alley in a treehouse city, eyes like pinpricks. Compose as a tarot pip card: work exactly five antlers or antler-shaped branches into the scene, arranged deliberately so they can be counted at a glance.

#### antlers-6

- Name: Lake Mirrara (Six of Antlers)
- File: `art/antlers-6.jpg`
- Size: 1024x1024
- Prompt: Tarot card illustration from the fantasy world of Valisar, painted in gouache and ink on aged parchment with gold-leaf highlights, painterly, in the spirit of Studio Ghibli backgrounds and Zelda concept art with a FromSoftware melancholy. Deep indigo night sky with small warm stars, warm lantern and crystal light. Composed like a tarot card, with one clear central subject, frontal or three-quarter, a horizon line, symbolic objects placed deliberately, sky at the top, and the important content inside the middle 80 percent. Square 1024 by 1024. No text, no letters, no border, no frame, no watermark. Suit of Antlers palette: dominant moss green (#4d7f57) against indigo night, pale blue-white wisplight. The emblem is a pair of antlers. Subject: a perfectly still moonlit lake with a stone arch on an island at its center, glowing blue crocuses along the shore, a film of purple corruption at the far edge. This card is an Omen (a spell or an event), so the image is a moment or a place rather than a portrait. Compose as a tarot pip card: work exactly six antlers or antler-shaped branches into the scene, arranged deliberately so they can be counted at a glance.

#### antlers-7

- Name: Taranis, the Laughing Crow (Seven of Antlers)
- File: `art/antlers-7.jpg`
- Size: 1024x1024
- Prompt: Tarot card illustration from the fantasy world of Valisar, painted in gouache and ink on aged parchment with gold-leaf highlights, painterly, in the spirit of Studio Ghibli backgrounds and Zelda concept art with a FromSoftware melancholy. Deep indigo night sky with small warm stars, warm lantern and crystal light. Composed like a tarot card, with one clear central subject, frontal or three-quarter, a horizon line, symbolic objects placed deliberately, sky at the top, and the important content inside the middle 80 percent. Square 1024 by 1024. No text, no letters, no border, no frame, no watermark. Suit of Antlers palette: dominant moss green (#4d7f57) against indigo night, pale blue-white wisplight. The emblem is a pair of antlers. Subject: a large crow with oil-slick iridescent feathers perched on a branch, a stolen silver ring in its beak, laughing. Compose as a tarot pip card: work exactly seven antlers or antler-shaped branches into the scene, arranged deliberately so they can be counted at a glance.

#### antlers-8

- Name: Inspector Bramble (Eight of Antlers)
- File: `art/antlers-8.jpg`
- Size: 1024x1024
- Prompt: Tarot card illustration from the fantasy world of Valisar, painted in gouache and ink on aged parchment with gold-leaf highlights, painterly, in the spirit of Studio Ghibli backgrounds and Zelda concept art with a FromSoftware melancholy. Deep indigo night sky with small warm stars, warm lantern and crystal light. Composed like a tarot card, with one clear central subject, frontal or three-quarter, a horizon line, symbolic objects placed deliberately, sky at the top, and the important content inside the middle 80 percent. Square 1024 by 1024. No text, no letters, no border, no frame, no watermark. Suit of Antlers palette: dominant moss green (#4d7f57) against indigo night, pale blue-white wisplight. The emblem is a pair of antlers. Subject: a stout badger detective in a tweed vest and coat holding a magnifying glass, standing among the roots of a giant library tree. Compose as a tarot pip card: work exactly eight antlers or antler-shaped branches into the scene, arranged deliberately so they can be counted at a glance.

#### antlers-9

- Name: Lorien of the Hand (Nine of Antlers)
- File: `art/antlers-9.jpg`
- Size: 1024x1024
- Prompt: Tarot card illustration from the fantasy world of Valisar, painted in gouache and ink on aged parchment with gold-leaf highlights, painterly, in the spirit of Studio Ghibli backgrounds and Zelda concept art with a FromSoftware melancholy. Deep indigo night sky with small warm stars, warm lantern and crystal light. Composed like a tarot card, with one clear central subject, frontal or three-quarter, a horizon line, symbolic objects placed deliberately, sky at the top, and the important content inside the middle 80 percent. Square 1024 by 1024. No text, no letters, no border, no frame, no watermark. Suit of Antlers palette: dominant moss green (#4d7f57) against indigo night, pale blue-white wisplight. The emblem is a pair of antlers. Subject: a tall lithe fae warrior with midnight hair, half in shadow, holding a black blade that swallows the light around it, remorse in one eye. Compose as a tarot pip card: work exactly nine antlers or antler-shaped branches into the scene, arranged deliberately so they can be counted at a glance.

#### antlers-10

- Name: The Heartwood (Ten of Antlers)
- File: `art/antlers-10.jpg`
- Size: 1024x1024
- Prompt: Tarot card illustration from the fantasy world of Valisar, painted in gouache and ink on aged parchment with gold-leaf highlights, painterly, in the spirit of Studio Ghibli backgrounds and Zelda concept art with a FromSoftware melancholy. Deep indigo night sky with small warm stars, warm lantern and crystal light. Composed like a tarot card, with one clear central subject, frontal or three-quarter, a horizon line, symbolic objects placed deliberately, sky at the top, and the important content inside the middle 80 percent. Square 1024 by 1024. No text, no letters, no border, no frame, no watermark. Suit of Antlers palette: dominant moss green (#4d7f57) against indigo night, pale blue-white wisplight. The emblem is a pair of antlers. Subject: a colossal tree a hundred feet wide at the center of a treehouse city, bioluminescent markets spiraling around its base, mist in the canopy. Compose as a tarot pip card: work exactly ten antlers or antler-shaped branches into the scene, arranged deliberately so they can be counted at a glance.

#### antlers-page

- Name: Fin & Bin (Page of Antlers)
- File: `art/antlers-page.jpg`
- Size: 1024x1024
- Prompt: Tarot card illustration from the fantasy world of Valisar, painted in gouache and ink on aged parchment with gold-leaf highlights, painterly, in the spirit of Studio Ghibli backgrounds and Zelda concept art with a FromSoftware melancholy. Deep indigo night sky with small warm stars, warm lantern and crystal light. Composed like a tarot card, with one clear central subject, frontal or three-quarter, a horizon line, symbolic objects placed deliberately, sky at the top, and the important content inside the middle 80 percent. Square 1024 by 1024. No text, no letters, no border, no frame, no watermark. Suit of Antlers palette: dominant moss green (#4d7f57) against indigo night, pale blue-white wisplight. The emblem is a pair of antlers. Subject: two tiny twig-bodied spirits with acorn heads peeking out of the branch of a huge oak, little stick arms reaching out. Compose as a tarot Page: a young standing figure holding one of the suit's objects (antlers or antler-shaped branches), looking at it.

#### antlers-knight

- Name: Thorn of the Bladed Wind (Knight of Antlers)
- File: `art/antlers-knight.jpg`
- Size: 1024x1024
- Prompt: Tarot card illustration from the fantasy world of Valisar, painted in gouache and ink on aged parchment with gold-leaf highlights, painterly, in the spirit of Studio Ghibli backgrounds and Zelda concept art with a FromSoftware melancholy. Deep indigo night sky with small warm stars, warm lantern and crystal light. Composed like a tarot card, with one clear central subject, frontal or three-quarter, a horizon line, symbolic objects placed deliberately, sky at the top, and the important content inside the middle 80 percent. Square 1024 by 1024. No text, no letters, no border, no frame, no watermark. Suit of Antlers palette: dominant moss green (#4d7f57) against indigo night, pale blue-white wisplight. The emblem is a pair of antlers. Subject: a lean knight in grey-blue leather with a hooded cloak, one hilt glowing with a blade of green wind, the other a short dark sword. Compose as a tarot Knight: a figure in motion, armed or mounted, caught mid-action, the suit emblem on their gear.

#### antlers-queen

- Name: Kaelen Goldeneye (Queen of Antlers)
- File: `art/antlers-queen.jpg`
- Size: 1024x1024
- Prompt: Tarot card illustration from the fantasy world of Valisar, painted in gouache and ink on aged parchment with gold-leaf highlights, painterly, in the spirit of Studio Ghibli backgrounds and Zelda concept art with a FromSoftware melancholy. Deep indigo night sky with small warm stars, warm lantern and crystal light. Composed like a tarot card, with one clear central subject, frontal or three-quarter, a horizon line, symbolic objects placed deliberately, sky at the top, and the important content inside the middle 80 percent. Square 1024 by 1024. No text, no letters, no border, no frame, no watermark. Suit of Antlers palette: dominant moss green (#4d7f57) against indigo night, pale blue-white wisplight. The emblem is a pair of antlers. Subject: a green-skinned half-orc paladin with gold rune tattoos, a golden clockwork eye, radiant white wings spread over a garden tavern. Compose as a tarot Queen: a seated figure, calm, looking outward, with the suit's object (antlers or antler-shaped branches) beside or in hand.

#### antlers-king

- Name: Cernis, the Horned Forest Lord (King of Antlers)
- File: `art/antlers-king.jpg`
- Size: 1024x1024
- Prompt: Tarot card illustration from the fantasy world of Valisar, painted in gouache and ink on aged parchment with gold-leaf highlights, painterly, in the spirit of Studio Ghibli backgrounds and Zelda concept art with a FromSoftware melancholy. Deep indigo night sky with small warm stars, warm lantern and crystal light. Composed like a tarot card, with one clear central subject, frontal or three-quarter, a horizon line, symbolic objects placed deliberately, sky at the top, and the important content inside the middle 80 percent. Square 1024 by 1024. No text, no letters, no border, no frame, no watermark. Suit of Antlers palette: dominant moss green (#4d7f57) against indigo night, pale blue-white wisplight. The emblem is a pair of antlers. Subject: an enormous antlered forest lord with the soft face of a hare, moss on his shoulders, deer and rabbits gathered at his hooves in a misty grove. Compose as a tarot King: an enthroned or towering figure of authority, symmetrical, the suit emblem repeated in the throne or the sky.

### Batch 4: Tides and Gears

#### tides-ace

- Name: Kaipo’s Pearl (Ace of Tides)
- File: `art/tides-ace.jpg`
- Size: 1024x1024
- Prompt: Tarot card illustration from the fantasy world of Valisar, painted in gouache and ink on aged parchment with gold-leaf highlights, painterly, in the spirit of Studio Ghibli backgrounds and Zelda concept art with a FromSoftware melancholy. Deep indigo night sky with small warm stars, warm lantern and crystal light. Composed like a tarot card, with one clear central subject, frontal or three-quarter, a horizon line, symbolic objects placed deliberately, sky at the top, and the important content inside the middle 80 percent. Square 1024 by 1024. No text, no letters, no border, no frame, no watermark. Suit of Tides palette: dominant deep teal (#2f7f8f), sea foam, wet dark stone. The emblem is a cresting wave. Subject: a large pearl held in a wet palm, swirling grey-blue mist visible inside it, sea-silk sleeve, harbor lights behind. This card is a Relic (an object), so the object is the hero of the image, shown large and detailed. Compose as a tarot Ace: a single large cup of seawater with a wave cresting out of it held up by a hand emerging from cloud or mist, the landscape small below it.

#### tides-2

- Name: Brookskippers (Two of Tides)
- File: `art/tides-2.jpg`
- Size: 1024x1024
- Prompt: Tarot card illustration from the fantasy world of Valisar, painted in gouache and ink on aged parchment with gold-leaf highlights, painterly, in the spirit of Studio Ghibli backgrounds and Zelda concept art with a FromSoftware melancholy. Deep indigo night sky with small warm stars, warm lantern and crystal light. Composed like a tarot card, with one clear central subject, frontal or three-quarter, a horizon line, symbolic objects placed deliberately, sky at the top, and the important content inside the middle 80 percent. Square 1024 by 1024. No text, no letters, no border, no frame, no watermark. Suit of Tides palette: dominant deep teal (#2f7f8f), sea foam, wet dark stone. The emblem is a cresting wave. Subject: small translucent water sprites leaping like fish beside a rowboat on a forest stream, one tipping the boat with both hands. This card is an Omen (a spell or an event), so the image is a moment or a place rather than a portrait. Compose as a tarot pip card: work exactly two cresting waves or cups of seawater into the scene, arranged deliberately so they can be counted at a glance.

#### tides-3

- Name: Zalian Fisherman (Three of Tides)
- File: `art/tides-3.jpg`
- Size: 1024x1024
- Prompt: Tarot card illustration from the fantasy world of Valisar, painted in gouache and ink on aged parchment with gold-leaf highlights, painterly, in the spirit of Studio Ghibli backgrounds and Zelda concept art with a FromSoftware melancholy. Deep indigo night sky with small warm stars, warm lantern and crystal light. Composed like a tarot card, with one clear central subject, frontal or three-quarter, a horizon line, symbolic objects placed deliberately, sky at the top, and the important content inside the middle 80 percent. Square 1024 by 1024. No text, no letters, no border, no frame, no watermark. Suit of Tides palette: dominant deep teal (#2f7f8f), sea foam, wet dark stone. The emblem is a cresting wave. Subject: a weathered fisherman hauling a net on a grey coast, the catch already spoiling, purple rot creeping along the tideline. Compose as a tarot pip card: work exactly three cresting waves or cups of seawater into the scene, arranged deliberately so they can be counted at a glance.

#### tides-4

- Name: Bimp Bossington (Four of Tides)
- File: `art/tides-4.jpg`
- Size: 1024x1024
- Prompt: Tarot card illustration from the fantasy world of Valisar, painted in gouache and ink on aged parchment with gold-leaf highlights, painterly, in the spirit of Studio Ghibli backgrounds and Zelda concept art with a FromSoftware melancholy. Deep indigo night sky with small warm stars, warm lantern and crystal light. Composed like a tarot card, with one clear central subject, frontal or three-quarter, a horizon line, symbolic objects placed deliberately, sky at the top, and the important content inside the middle 80 percent. Square 1024 by 1024. No text, no letters, no border, no frame, no watermark. Suit of Tides palette: dominant deep teal (#2f7f8f), sea foam, wet dark stone. The emblem is a cresting wave. Subject: a short figure in an oversized trenchcoat and top hat holding a tea tray on a shipyard dock, three raccoon tails visible at the hem. Compose as a tarot pip card: work exactly four cresting waves or cups of seawater into the scene, arranged deliberately so they can be counted at a glance.

#### tides-5

- Name: Bill Boggs, Cartel Runner (Five of Tides)
- File: `art/tides-5.jpg`
- Size: 1024x1024
- Prompt: Tarot card illustration from the fantasy world of Valisar, painted in gouache and ink on aged parchment with gold-leaf highlights, painterly, in the spirit of Studio Ghibli backgrounds and Zelda concept art with a FromSoftware melancholy. Deep indigo night sky with small warm stars, warm lantern and crystal light. Composed like a tarot card, with one clear central subject, frontal or three-quarter, a horizon line, symbolic objects placed deliberately, sky at the top, and the important content inside the middle 80 percent. Square 1024 by 1024. No text, no letters, no border, no frame, no watermark. Suit of Tides palette: dominant deep teal (#2f7f8f), sea foam, wet dark stone. The emblem is a cresting wave. Subject: a hulking paranoid brute in a swamp at night, a bolt of lightning striking him, the faint superimposed silhouette of a robed man over his body. Compose as a tarot pip card: work exactly five cresting waves or cups of seawater into the scene, arranged deliberately so they can be counted at a glance.

#### tides-6

- Name: The Serattan Oath-Coin (Six of Tides)
- File: `art/tides-6.jpg`
- Size: 1024x1024
- Prompt: Tarot card illustration from the fantasy world of Valisar, painted in gouache and ink on aged parchment with gold-leaf highlights, painterly, in the spirit of Studio Ghibli backgrounds and Zelda concept art with a FromSoftware melancholy. Deep indigo night sky with small warm stars, warm lantern and crystal light. Composed like a tarot card, with one clear central subject, frontal or three-quarter, a horizon line, symbolic objects placed deliberately, sky at the top, and the important content inside the middle 80 percent. Square 1024 by 1024. No text, no letters, no border, no frame, no watermark. Suit of Tides palette: dominant deep teal (#2f7f8f), sea foam, wet dark stone. The emblem is a cresting wave. Subject: an ancient silver coin spinning in the air, one face a kraken, the other engraved with old script, a library behind it dissolving into a vision. This card is a Relic (an object), so the object is the hero of the image, shown large and detailed. Compose as a tarot pip card: work exactly six cresting waves or cups of seawater into the scene, arranged deliberately so they can be counted at a glance.

#### tides-7

- Name: The Sunken Empire Rises (Seven of Tides)
- File: `art/tides-7.jpg`
- Size: 1024x1024
- Prompt: Tarot card illustration from the fantasy world of Valisar, painted in gouache and ink on aged parchment with gold-leaf highlights, painterly, in the spirit of Studio Ghibli backgrounds and Zelda concept art with a FromSoftware melancholy. Deep indigo night sky with small warm stars, warm lantern and crystal light. Composed like a tarot card, with one clear central subject, frontal or three-quarter, a horizon line, symbolic objects placed deliberately, sky at the top, and the important content inside the middle 80 percent. Square 1024 by 1024. No text, no letters, no border, no frame, no watermark. Suit of Tides palette: dominant deep teal (#2f7f8f), sea foam, wet dark stone. The emblem is a cresting wave. Subject: a drowned kingdom of coral-crusted towers rising out of a black sea under an impossibly close white moon, water pouring off the walls. This card is an Omen (a spell or an event), so the image is a moment or a place rather than a portrait. Compose as a tarot pip card: work exactly seven cresting waves or cups of seawater into the scene, arranged deliberately so they can be counted at a glance.

#### tides-8

- Name: Tidecaller: Low Tide (Eight of Tides)
- File: `art/tides-8.jpg`
- Size: 1024x1024
- Prompt: Tarot card illustration from the fantasy world of Valisar, painted in gouache and ink on aged parchment with gold-leaf highlights, painterly, in the spirit of Studio Ghibli backgrounds and Zelda concept art with a FromSoftware melancholy. Deep indigo night sky with small warm stars, warm lantern and crystal light. Composed like a tarot card, with one clear central subject, frontal or three-quarter, a horizon line, symbolic objects placed deliberately, sky at the top, and the important content inside the middle 80 percent. Square 1024 by 1024. No text, no letters, no border, no frame, no watermark. Suit of Tides palette: dominant deep teal (#2f7f8f), sea foam, wet dark stone. The emblem is a cresting wave. Subject: a longsword with a silver crossguard shaped like a cresting wave, blade wreathed in cold blue water, plunged into a moonlit lake. This card is a Relic (an object), so the object is the hero of the image, shown large and detailed. Compose as a tarot pip card: work exactly eight cresting waves or cups of seawater into the scene, arranged deliberately so they can be counted at a glance.

#### tides-9

- Name: The Garbage Boyz (Nine of Tides)
- File: `art/tides-9.jpg`
- Size: 1024x1024
- Prompt: Tarot card illustration from the fantasy world of Valisar, painted in gouache and ink on aged parchment with gold-leaf highlights, painterly, in the spirit of Studio Ghibli backgrounds and Zelda concept art with a FromSoftware melancholy. Deep indigo night sky with small warm stars, warm lantern and crystal light. Composed like a tarot card, with one clear central subject, frontal or three-quarter, a horizon line, symbolic objects placed deliberately, sky at the top, and the important content inside the middle 80 percent. Square 1024 by 1024. No text, no letters, no border, no frame, no watermark. Suit of Tides palette: dominant deep teal (#2f7f8f), sea foam, wet dark stone. The emblem is a cresting wave. Subject: a boxy tank-tread robot with forklift arms and an old CRT face, a tiny druid with an oversized oar and a hairy dwarf in green overalls riding on its shoulders, a canal town behind. Compose as a tarot pip card: work exactly nine cresting waves or cups of seawater into the scene, arranged deliberately so they can be counted at a glance.

#### tides-10

- Name: Marin, Spirit of Ocean Waves (Ten of Tides)
- File: `art/tides-10.jpg`
- Size: 1024x1024
- Prompt: Tarot card illustration from the fantasy world of Valisar, painted in gouache and ink on aged parchment with gold-leaf highlights, painterly, in the spirit of Studio Ghibli backgrounds and Zelda concept art with a FromSoftware melancholy. Deep indigo night sky with small warm stars, warm lantern and crystal light. Composed like a tarot card, with one clear central subject, frontal or three-quarter, a horizon line, symbolic objects placed deliberately, sky at the top, and the important content inside the middle 80 percent. Square 1024 by 1024. No text, no letters, no border, no frame, no watermark. Suit of Tides palette: dominant deep teal (#2f7f8f), sea foam, wet dark stone. The emblem is a cresting wave. Subject: a graceful woman made of clear shimmering seawater dancing on the crest of a wave with a long spear, simple robes flowing, ships small below. Compose as a tarot pip card: work exactly ten cresting waves or cups of seawater into the scene, arranged deliberately so they can be counted at a glance.

#### tides-page

- Name: Kaipo Nuvane (Page of Tides)
- File: `art/tides-page.jpg`
- Size: 1024x1024
- Prompt: Tarot card illustration from the fantasy world of Valisar, painted in gouache and ink on aged parchment with gold-leaf highlights, painterly, in the spirit of Studio Ghibli backgrounds and Zelda concept art with a FromSoftware melancholy. Deep indigo night sky with small warm stars, warm lantern and crystal light. Composed like a tarot card, with one clear central subject, frontal or three-quarter, a horizon line, symbolic objects placed deliberately, sky at the top, and the important content inside the middle 80 percent. Square 1024 by 1024. No text, no letters, no border, no frame, no watermark. Suit of Tides palette: dominant deep teal (#2f7f8f), sea foam, wet dark stone. The emblem is a cresting wave. Subject: a water genasi in white sea-silk robes and strings of sapphire beads on a rooftop at night, half his face lit, a pirate bandana in one hand. Compose as a tarot Page: a young standing figure holding one of the suit's objects (cresting waves or cups of seawater), looking at it.

#### tides-knight

- Name: Merrick Blackwater (Knight of Tides)
- File: `art/tides-knight.jpg`
- Size: 1024x1024
- Prompt: Tarot card illustration from the fantasy world of Valisar, painted in gouache and ink on aged parchment with gold-leaf highlights, painterly, in the spirit of Studio Ghibli backgrounds and Zelda concept art with a FromSoftware melancholy. Deep indigo night sky with small warm stars, warm lantern and crystal light. Composed like a tarot card, with one clear central subject, frontal or three-quarter, a horizon line, symbolic objects placed deliberately, sky at the top, and the important content inside the middle 80 percent. Square 1024 by 1024. No text, no letters, no border, no frame, no watermark. Suit of Tides palette: dominant deep teal (#2f7f8f), sea foam, wet dark stone. The emblem is a cresting wave. Subject: a sharp-dressed pirate captain at a ship’s wheel at dusk, a too-perfect smile, his shadow falling the wrong direction. Compose as a tarot Knight: a figure in motion, armed or mounted, caught mid-action, the suit emblem on their gear.

#### tides-queen

- Name: Calvera Blackwake, the Mad Pirate Queen (Queen of Tides)
- File: `art/tides-queen.jpg`
- Size: 1024x1024
- Prompt: Tarot card illustration from the fantasy world of Valisar, painted in gouache and ink on aged parchment with gold-leaf highlights, painterly, in the spirit of Studio Ghibli backgrounds and Zelda concept art with a FromSoftware melancholy. Deep indigo night sky with small warm stars, warm lantern and crystal light. Composed like a tarot card, with one clear central subject, frontal or three-quarter, a horizon line, symbolic objects placed deliberately, sky at the top, and the important content inside the middle 80 percent. Square 1024 by 1024. No text, no letters, no border, no frame, no watermark. Suit of Tides palette: dominant deep teal (#2f7f8f), sea foam, wet dark stone. The emblem is a cresting wave. Subject: a wild red-haired pirate queen on a throne of living coral atop a floating island at sunset, a broken crown on her head, grinning, anchor chains trailing moss below. Compose as a tarot Queen: a seated figure, calm, looking outward, with the suit's object (cresting waves or cups of seawater) beside or in hand.

#### tides-king

- Name: Serratta, Spirit of the Deep Current (King of Tides)
- File: `art/tides-king.jpg`
- Size: 1024x1024
- Prompt: Tarot card illustration from the fantasy world of Valisar, painted in gouache and ink on aged parchment with gold-leaf highlights, painterly, in the spirit of Studio Ghibli backgrounds and Zelda concept art with a FromSoftware melancholy. Deep indigo night sky with small warm stars, warm lantern and crystal light. Composed like a tarot card, with one clear central subject, frontal or three-quarter, a horizon line, symbolic objects placed deliberately, sky at the top, and the important content inside the middle 80 percent. Square 1024 by 1024. No text, no letters, no border, no frame, no watermark. Suit of Tides palette: dominant deep teal (#2f7f8f), sea foam, wet dark stone. The emblem is a cresting wave. Subject: a colossal kraken with a half-human face rising from a black abyss beneath a sunken city, one enormous eye catching a single shaft of light. Compose as a tarot King: an enthroned or towering figure of authority, symmetrical, the suit emblem repeated in the throne or the sky.

#### gears-ace

- Name: Eldertech Sphere (Ace of Gears)
- File: `art/gears-ace.jpg`
- Size: 1024x1024
- Prompt: Tarot card illustration from the fantasy world of Valisar, painted in gouache and ink on aged parchment with gold-leaf highlights, painterly, in the spirit of Studio Ghibli backgrounds and Zelda concept art with a FromSoftware melancholy. Deep indigo night sky with small warm stars, warm lantern and crystal light. Composed like a tarot card, with one clear central subject, frontal or three-quarter, a horizon line, symbolic objects placed deliberately, sky at the top, and the important content inside the middle 80 percent. Square 1024 by 1024. No text, no letters, no border, no frame, no watermark. Suit of Gears palette: dominant brass (#a8623a), sandstone, blue crystal glow. The emblem is a twelve-tooth gear. Subject: a fist-sized sphere of intricate brass gears and glowing blue crystal nodes resting in a stone socket, runes lighting up around it. This card is an Omen (a spell or an event), so the image is a moment or a place rather than a portrait. Compose as a tarot Ace: a single large brass gear held up by a hand emerging from cloud or mist, the landscape small below it.

#### gears-2

- Name: Mr. Boscoe (Two of Gears)
- File: `art/gears-2.jpg`
- Size: 1024x1024
- Prompt: Tarot card illustration from the fantasy world of Valisar, painted in gouache and ink on aged parchment with gold-leaf highlights, painterly, in the spirit of Studio Ghibli backgrounds and Zelda concept art with a FromSoftware melancholy. Deep indigo night sky with small warm stars, warm lantern and crystal light. Composed like a tarot card, with one clear central subject, frontal or three-quarter, a horizon line, symbolic objects placed deliberately, sky at the top, and the important content inside the middle 80 percent. Square 1024 by 1024. No text, no letters, no border, no frame, no watermark. Suit of Gears palette: dominant brass (#a8623a), sandstone, blue crystal glow. The emblem is a twelve-tooth gear. Subject: a translucent pale-blue floating baker whose head and hands hover separate from his body, reaching into a glass case of glowing pastries in a sunny courtyard. Compose as a tarot pip card: work exactly two brass gears into the scene, arranged deliberately so they can be counted at a glance.

#### gears-3

- Name: Yvette Mirthwell (Three of Gears)
- File: `art/gears-3.jpg`
- Size: 1024x1024
- Prompt: Tarot card illustration from the fantasy world of Valisar, painted in gouache and ink on aged parchment with gold-leaf highlights, painterly, in the spirit of Studio Ghibli backgrounds and Zelda concept art with a FromSoftware melancholy. Deep indigo night sky with small warm stars, warm lantern and crystal light. Composed like a tarot card, with one clear central subject, frontal or three-quarter, a horizon line, symbolic objects placed deliberately, sky at the top, and the important content inside the middle 80 percent. Square 1024 by 1024. No text, no letters, no border, no frame, no watermark. Suit of Gears palette: dominant brass (#a8623a), sandstone, blue crystal glow. The emblem is a twelve-tooth gear. Subject: a young silver-haired wizard in white robes crouched at a runic keypad in a sandstone tunnel, arcane code unspooling from her fingertips. Compose as a tarot pip card: work exactly three brass gears into the scene, arranged deliberately so they can be counted at a glance.

#### gears-4

- Name: Null-Zone Pylon (Four of Gears)
- File: `art/gears-4.jpg`
- Size: 1024x1024
- Prompt: Tarot card illustration from the fantasy world of Valisar, painted in gouache and ink on aged parchment with gold-leaf highlights, painterly, in the spirit of Studio Ghibli backgrounds and Zelda concept art with a FromSoftware melancholy. Deep indigo night sky with small warm stars, warm lantern and crystal light. Composed like a tarot card, with one clear central subject, frontal or three-quarter, a horizon line, symbolic objects placed deliberately, sky at the top, and the important content inside the middle 80 percent. Square 1024 by 1024. No text, no letters, no border, no frame, no watermark. Suit of Gears palette: dominant brass (#a8623a), sandstone, blue crystal glow. The emblem is a twelve-tooth gear. Subject: a tall obelisk of sapphire lattice and brass humming in a desert courtyard, a dead grey sphere of suppressed magic around it. Compose as a tarot pip card: work exactly four brass gears into the scene, arranged deliberately so they can be counted at a glance.

#### gears-5

- Name: Project Tamori (Five of Gears)
- File: `art/gears-5.jpg`
- Size: 1024x1024
- Prompt: Tarot card illustration from the fantasy world of Valisar, painted in gouache and ink on aged parchment with gold-leaf highlights, painterly, in the spirit of Studio Ghibli backgrounds and Zelda concept art with a FromSoftware melancholy. Deep indigo night sky with small warm stars, warm lantern and crystal light. Composed like a tarot card, with one clear central subject, frontal or three-quarter, a horizon line, symbolic objects placed deliberately, sky at the top, and the important content inside the middle 80 percent. Square 1024 by 1024. No text, no letters, no border, no frame, no watermark. Suit of Gears palette: dominant brass (#a8623a), sandstone, blue crystal glow. The emblem is a twelve-tooth gear. Subject: a glowing humanoid lattice of orange arc-light in the shape of a person being held by the scruff by an angry marshal in a brass laboratory. This card is an Omen (a spell or an event), so the image is a moment or a place rather than a portrait. Compose as a tarot pip card: work exactly five brass gears into the scene, arranged deliberately so they can be counted at a glance.

#### gears-6

- Name: Liquid Mana (Six of Gears)
- File: `art/gears-6.jpg`
- Size: 1024x1024
- Prompt: Tarot card illustration from the fantasy world of Valisar, painted in gouache and ink on aged parchment with gold-leaf highlights, painterly, in the spirit of Studio Ghibli backgrounds and Zelda concept art with a FromSoftware melancholy. Deep indigo night sky with small warm stars, warm lantern and crystal light. Composed like a tarot card, with one clear central subject, frontal or three-quarter, a horizon line, symbolic objects placed deliberately, sky at the top, and the important content inside the middle 80 percent. Square 1024 by 1024. No text, no letters, no border, no frame, no watermark. Suit of Gears palette: dominant brass (#a8623a), sandstone, blue crystal glow. The emblem is a twelve-tooth gear. Subject: a rack of volatile glowing blue canisters in an airship engine room, one leaking light, an engineer’s hand already changing shape. This card is an Omen (a spell or an event), so the image is a moment or a place rather than a portrait. Compose as a tarot pip card: work exactly six brass gears into the scene, arranged deliberately so they can be counted at a glance.

#### gears-7

- Name: The Sleepless Sentry (Seven of Gears)
- File: `art/gears-7.jpg`
- Size: 1024x1024
- Prompt: Tarot card illustration from the fantasy world of Valisar, painted in gouache and ink on aged parchment with gold-leaf highlights, painterly, in the spirit of Studio Ghibli backgrounds and Zelda concept art with a FromSoftware melancholy. Deep indigo night sky with small warm stars, warm lantern and crystal light. Composed like a tarot card, with one clear central subject, frontal or three-quarter, a horizon line, symbolic objects placed deliberately, sky at the top, and the important content inside the middle 80 percent. Square 1024 by 1024. No text, no letters, no border, no frame, no watermark. Suit of Gears palette: dominant brass (#a8623a), sandstone, blue crystal glow. The emblem is a twelve-tooth gear. Subject: a gold-armored skeleton standing perfectly still in a toxic green-lit vault, a spear upright, dust on its shoulders. Compose as a tarot pip card: work exactly seven brass gears into the scene, arranged deliberately so they can be counted at a glance.

#### gears-8

- Name: The Libra Stellae (Eight of Gears)
- File: `art/gears-8.jpg`
- Size: 1024x1024
- Prompt: Tarot card illustration from the fantasy world of Valisar, painted in gouache and ink on aged parchment with gold-leaf highlights, painterly, in the spirit of Studio Ghibli backgrounds and Zelda concept art with a FromSoftware melancholy. Deep indigo night sky with small warm stars, warm lantern and crystal light. Composed like a tarot card, with one clear central subject, frontal or three-quarter, a horizon line, symbolic objects placed deliberately, sky at the top, and the important content inside the middle 80 percent. Square 1024 by 1024. No text, no letters, no border, no frame, no watermark. Suit of Gears palette: dominant brass (#a8623a), sandstone, blue crystal glow. The emblem is a twelve-tooth gear. Subject: a vast beehive-shaped library carved into canyon stone, thousands of alcoves holding glowing crystals, floating platforms drifting between tiers. This card is an Omen (a spell or an event), so the image is a moment or a place rather than a portrait. Compose as a tarot pip card: work exactly eight brass gears into the scene, arranged deliberately so they can be counted at a glance.

#### gears-9

- Name: Mr. Zero (Nine of Gears)
- File: `art/gears-9.jpg`
- Size: 1024x1024
- Prompt: Tarot card illustration from the fantasy world of Valisar, painted in gouache and ink on aged parchment with gold-leaf highlights, painterly, in the spirit of Studio Ghibli backgrounds and Zelda concept art with a FromSoftware melancholy. Deep indigo night sky with small warm stars, warm lantern and crystal light. Composed like a tarot card, with one clear central subject, frontal or three-quarter, a horizon line, symbolic objects placed deliberately, sky at the top, and the important content inside the middle 80 percent. Square 1024 by 1024. No text, no letters, no border, no frame, no watermark. Suit of Gears palette: dominant brass (#a8623a), sandstone, blue crystal glow. The emblem is a twelve-tooth gear. Subject: a polite gentleman whose body is made of angled mirror panes, each reflecting a different screaming face, tipping a hat in a ruined observatory. Compose as a tarot pip card: work exactly nine brass gears into the scene, arranged deliberately so they can be counted at a glance.

#### gears-10

- Name: The Mirrored Dome (Ten of Gears)
- File: `art/gears-10.jpg`
- Size: 1024x1024
- Prompt: Tarot card illustration from the fantasy world of Valisar, painted in gouache and ink on aged parchment with gold-leaf highlights, painterly, in the spirit of Studio Ghibli backgrounds and Zelda concept art with a FromSoftware melancholy. Deep indigo night sky with small warm stars, warm lantern and crystal light. Composed like a tarot card, with one clear central subject, frontal or three-quarter, a horizon line, symbolic objects placed deliberately, sky at the top, and the important content inside the middle 80 percent. Square 1024 by 1024. No text, no letters, no border, no frame, no watermark. Suit of Gears palette: dominant brass (#a8623a), sandstone, blue crystal glow. The emblem is a twelve-tooth gear. Subject: a colossal mirrored dome beneath a canyon city, its inner surface a star map of an alien sky, a needle of light piercing the center. This card is an Omen (a spell or an event), so the image is a moment or a place rather than a portrait. Compose as a tarot pip card: work exactly ten brass gears into the scene, arranged deliberately so they can be counted at a glance.

#### gears-page

- Name: Pommeroy (Page of Gears)
- File: `art/gears-page.jpg`
- Size: 1024x1024
- Prompt: Tarot card illustration from the fantasy world of Valisar, painted in gouache and ink on aged parchment with gold-leaf highlights, painterly, in the spirit of Studio Ghibli backgrounds and Zelda concept art with a FromSoftware melancholy. Deep indigo night sky with small warm stars, warm lantern and crystal light. Composed like a tarot card, with one clear central subject, frontal or three-quarter, a horizon line, symbolic objects placed deliberately, sky at the top, and the important content inside the middle 80 percent. Square 1024 by 1024. No text, no letters, no border, no frame, no watermark. Suit of Gears palette: dominant brass (#a8623a), sandstone, blue crystal glow. The emblem is a twelve-tooth gear. Subject: a nervous sandy-haired young mage in oversized robes bowing too low in a sandstone corridor, papers slipping from under his arm. Compose as a tarot Page: a young standing figure holding one of the suit's objects (brass gears), looking at it.

#### gears-knight

- Name: Mordeaux, the Clockwork Man (Knight of Gears)
- File: `art/gears-knight.jpg`
- Size: 1024x1024
- Prompt: Tarot card illustration from the fantasy world of Valisar, painted in gouache and ink on aged parchment with gold-leaf highlights, painterly, in the spirit of Studio Ghibli backgrounds and Zelda concept art with a FromSoftware melancholy. Deep indigo night sky with small warm stars, warm lantern and crystal light. Composed like a tarot card, with one clear central subject, frontal or three-quarter, a horizon line, symbolic objects placed deliberately, sky at the top, and the important content inside the middle 80 percent. Square 1024 by 1024. No text, no letters, no border, no frame, no watermark. Suit of Gears palette: dominant brass (#a8623a), sandstone, blue crystal glow. The emblem is a twelve-tooth gear. Subject: a humanoid construct of brass, crystal, and smoked glass with gears turning visibly in his chest, a tiny brass cuckoo bird emerging from his open mouth. Compose as a tarot Knight: a figure in motion, armed or mounted, caught mid-action, the suit emblem on their gear.

#### gears-queen

- Name: Archivist Esmerelda Gotch (Queen of Gears)
- File: `art/gears-queen.jpg`
- Size: 1024x1024
- Prompt: Tarot card illustration from the fantasy world of Valisar, painted in gouache and ink on aged parchment with gold-leaf highlights, painterly, in the spirit of Studio Ghibli backgrounds and Zelda concept art with a FromSoftware melancholy. Deep indigo night sky with small warm stars, warm lantern and crystal light. Composed like a tarot card, with one clear central subject, frontal or three-quarter, a horizon line, symbolic objects placed deliberately, sky at the top, and the important content inside the middle 80 percent. Square 1024 by 1024. No text, no letters, no border, no frame, no watermark. Suit of Gears palette: dominant brass (#a8623a), sandstone, blue crystal glow. The emblem is a twelve-tooth gear. Subject: a rail-thin archivist with skin like faded marble in a charcoal shawl hung with dozens of thin chains ending in keys and teeth, reaching for a coin. Compose as a tarot Queen: a seated figure, calm, looking outward, with the suit's object (brass gears) beside or in hand.

#### gears-king

- Name: Archmage Severyn Caldreth (King of Gears)
- File: `art/gears-king.jpg`
- Size: 1024x1024
- Prompt: Tarot card illustration from the fantasy world of Valisar, painted in gouache and ink on aged parchment with gold-leaf highlights, painterly, in the spirit of Studio Ghibli backgrounds and Zelda concept art with a FromSoftware melancholy. Deep indigo night sky with small warm stars, warm lantern and crystal light. Composed like a tarot card, with one clear central subject, frontal or three-quarter, a horizon line, symbolic objects placed deliberately, sky at the top, and the important content inside the middle 80 percent. Square 1024 by 1024. No text, no letters, no border, no frame, no watermark. Suit of Gears palette: dominant brass (#a8623a), sandstone, blue crystal glow. The emblem is a twelve-tooth gear. Subject: a towering white-haired archmage in storm-grey and imperial red robes, a glowing sigil-etched eyepatch, lightning crawling up one arm, a clockwork man at his side. Compose as a tarot King: an enthroned or towering figure of authority, symmetrical, the suit emblem repeated in the throne or the sky.

### Batch 5: tokens

#### tok-gloomghast

- Name: Gloomghast (token)
- File: `art/tok-gloomghast.jpg`
- Size: 1024x1024
- Prompt: Tarot card illustration from the fantasy world of Valisar, painted in gouache and ink on aged parchment with gold-leaf highlights, painterly, in the spirit of Studio Ghibli backgrounds and Zelda concept art with a FromSoftware melancholy. Deep indigo night sky with small warm stars, warm lantern and crystal light. Composed like a tarot card, with one clear central subject, frontal or three-quarter, a horizon line, symbolic objects placed deliberately, sky at the top, and the important content inside the middle 80 percent. Square 1024 by 1024. No text, no letters, no border, no frame, no watermark. Suit of Antlers palette: dominant moss green (#4d7f57) against indigo night, pale blue-white wisplight. The emblem is a pair of antlers. Subject: a ragged wisp of dark smoke with two dim eyes drifting low over forest litter. Compose simply, one subject, small in a wide quiet scene.

#### tok-raccoon

- Name: Raccoon (token)
- File: `art/tok-raccoon.jpg`
- Size: 1024x1024
- Prompt: Tarot card illustration from the fantasy world of Valisar, painted in gouache and ink on aged parchment with gold-leaf highlights, painterly, in the spirit of Studio Ghibli backgrounds and Zelda concept art with a FromSoftware melancholy. Deep indigo night sky with small warm stars, warm lantern and crystal light. Composed like a tarot card, with one clear central subject, frontal or three-quarter, a horizon line, symbolic objects placed deliberately, sky at the top, and the important content inside the middle 80 percent. Square 1024 by 1024. No text, no letters, no border, no frame, no watermark. Suit of Tides palette: dominant deep teal (#2f7f8f), sea foam, wet dark stone. The emblem is a cresting wave. Subject: a single raccoon clutching a tiny tea tray, looking guilty on a dock. Compose simply, one subject, small in a wide quiet scene.

#### tok-drowned

- Name: Drowned Legionnaire (token)
- File: `art/tok-drowned.jpg`
- Size: 1024x1024
- Prompt: Tarot card illustration from the fantasy world of Valisar, painted in gouache and ink on aged parchment with gold-leaf highlights, painterly, in the spirit of Studio Ghibli backgrounds and Zelda concept art with a FromSoftware melancholy. Deep indigo night sky with small warm stars, warm lantern and crystal light. Composed like a tarot card, with one clear central subject, frontal or three-quarter, a horizon line, symbolic objects placed deliberately, sky at the top, and the important content inside the middle 80 percent. Square 1024 by 1024. No text, no letters, no border, no frame, no watermark. Suit of Tides palette: dominant deep teal (#2f7f8f), sea foam, wet dark stone. The emblem is a cresting wave. Subject: a coral-crusted soldier in ancient armor standing at attention on the ocean floor, a rusted spear, fish drifting past. Compose simply, one subject, small in a wide quiet scene.

#### tok-warhead

- Name: Tamori Warhead (token)
- File: `art/tok-warhead.jpg`
- Size: 1024x1024
- Prompt: Tarot card illustration from the fantasy world of Valisar, painted in gouache and ink on aged parchment with gold-leaf highlights, painterly, in the spirit of Studio Ghibli backgrounds and Zelda concept art with a FromSoftware melancholy. Deep indigo night sky with small warm stars, warm lantern and crystal light. Composed like a tarot card, with one clear central subject, frontal or three-quarter, a horizon line, symbolic objects placed deliberately, sky at the top, and the important content inside the middle 80 percent. Square 1024 by 1024. No text, no letters, no border, no frame, no watermark. Suit of Gears palette: dominant brass (#a8623a), sandstone, blue crystal glow. The emblem is a twelve-tooth gear. Subject: a glowing humanoid lattice of orange light walking calmly toward a shield wall, one hand extended for a handshake. Compose simply, one subject, small in a wide quiet scene.

#### tok-sunguard

- Name: Sun Guard (token)
- File: `art/tok-sunguard.jpg`
- Size: 1024x1024
- Prompt: Tarot card illustration from the fantasy world of Valisar, painted in gouache and ink on aged parchment with gold-leaf highlights, painterly, in the spirit of Studio Ghibli backgrounds and Zelda concept art with a FromSoftware melancholy. Deep indigo night sky with small warm stars, warm lantern and crystal light. Composed like a tarot card, with one clear central subject, frontal or three-quarter, a horizon line, symbolic objects placed deliberately, sky at the top, and the important content inside the middle 80 percent. Square 1024 by 1024. No text, no letters, no border, no frame, no watermark. Suit of Suns palette: dominant gold (#c9962b), ivory, white-gold light, warm shadows. The emblem is a sixteen-point sun. Subject: a faceless soldier in mirrored gold plate with a spear and sunburst shield descending a bridge of golden light. Compose simply, one subject, small in a wide quiet scene.

#### tok-lumina

- Name: Lumina (token)
- File: `art/tok-lumina.jpg`
- Size: 1024x1024
- Prompt: Tarot card illustration from the fantasy world of Valisar, painted in gouache and ink on aged parchment with gold-leaf highlights, painterly, in the spirit of Studio Ghibli backgrounds and Zelda concept art with a FromSoftware melancholy. Deep indigo night sky with small warm stars, warm lantern and crystal light. Composed like a tarot card, with one clear central subject, frontal or three-quarter, a horizon line, symbolic objects placed deliberately, sky at the top, and the important content inside the middle 80 percent. Square 1024 by 1024. No text, no letters, no border, no frame, no watermark. Major Arcana palette: dominant violet (#6e5ab8) with starlight and gold leaf. Grander and more symmetrical than a suit card, like a tarot trump. Subject: a fox made of pale starlight carrying a rolled star map in her mouth, stepping out of a fading celestial gate. Compose as a tarot trump: hieratic and frontal, the figure or force centered with its symbols arranged around it, gold leaf on the brightest points.

#### tok-brog

- Name: Brog (token)
- File: `art/tok-brog.jpg`
- Size: 1024x1024
- Prompt: Tarot card illustration from the fantasy world of Valisar, painted in gouache and ink on aged parchment with gold-leaf highlights, painterly, in the spirit of Studio Ghibli backgrounds and Zelda concept art with a FromSoftware melancholy. Deep indigo night sky with small warm stars, warm lantern and crystal light. Composed like a tarot card, with one clear central subject, frontal or three-quarter, a horizon line, symbolic objects placed deliberately, sky at the top, and the important content inside the middle 80 percent. Square 1024 by 1024. No text, no letters, no border, no frame, no watermark. Major Arcana palette: dominant violet (#6e5ab8) with starlight and gold leaf. Grander and more symmetrical than a suit card, like a tarot trump. Subject: a small round fuzzy blue-black blob with faint gears and feathers glimpsed inside it, sitting on a table next to a brass lamp. Compose as a tarot trump: hieratic and frontal, the figure or force centered with its symbols arranged around it, gold leaf on the brightest points.
