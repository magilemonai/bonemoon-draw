// Writes docs/ART_PROMPTS.md: the art bible plus one image prompt per card and per site asset,
// ready to hand to an image model one prompt at a time.
// Drop results into public/art/<id>.jpg (or .png) and the game picks them up automatically.
// Run: pnpm art-prompts

import { writeFileSync } from 'node:fs'
import { ALL_CARDS, SIGNIFICATORS, rankLine } from '../src/data'
import type { CardDef, Suit } from '../src/engine/types'

// ---------------------------------------------------------------------------
// The house style. Pasted once at the top of a ChatGPT conversation, and
// repeated in compressed form inside every prompt so each image stands alone.
// ---------------------------------------------------------------------------

const HOUSE_STYLE_LONG = `You are painting the seventy-eight cards of a tarot deck from the world of Valisar, for a card game called The Bonemoon Draw. Read this whole brief before the first image, and hold to it for every image after.

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
- Major Arcana: a hieratic figure or scene, frontal, with its symbols arranged around it.`

// Short form carried inside each prompt so a single prompt works on its own.
const STYLE_SHORT =
  'Tarot card illustration from the fantasy world of Valisar, painted in gouache and ink on aged parchment with gold-leaf highlights, painterly, in the spirit of Studio Ghibli backgrounds and Zelda concept art with a FromSoftware melancholy. Deep indigo night sky with small warm stars, warm lantern and crystal light. Composed like a tarot card, with one clear central subject, frontal or three-quarter, a horizon line, symbolic objects placed deliberately, sky at the top, and the important content inside the middle 80 percent. Square 1024 by 1024. No text, no letters, no border, no frame, no watermark.'

const SUIT_KEY: Record<Suit, string> = {
  suns: 'Suit of Suns palette: dominant gold (#c9962b), ivory, white-gold light, warm shadows. The emblem is a sixteen-point sun.',
  antlers: 'Suit of Antlers palette: dominant moss green (#4d7f57) against indigo night, pale blue-white wisplight. The emblem is a pair of antlers.',
  tides: 'Suit of Tides palette: dominant deep teal (#2f7f8f), sea foam, wet dark stone. The emblem is a cresting wave.',
  gears: 'Suit of Gears palette: dominant brass (#a8623a), sandstone, blue crystal glow. The emblem is a twelve-tooth gear.',
  major: 'Major Arcana palette: dominant violet (#6e5ab8) with starlight and gold leaf. Grander and more symmetrical than a suit card, like a tarot trump.',
}

const EMBLEM_OBJECT: Record<Suit, string> = {
  suns: 'small suns or sunburst medallions',
  antlers: 'antlers or antler-shaped branches',
  tides: 'cresting waves or cups of seawater',
  gears: 'brass gears',
  major: '',
}

const ACE_OBJECT: Record<Suit, string> = {
  suns: 'sunburst medallion',
  antlers: 'pair of antlers',
  tides: 'cup of seawater with a wave cresting out of it',
  gears: 'brass gear',
  major: 'star',
}

const RANK_WORDS: Record<string, string> = {
  '2': 'two',
  '3': 'three',
  '4': 'four',
  '5': 'five',
  '6': 'six',
  '7': 'seven',
  '8': 'eight',
  '9': 'nine',
  '10': 'ten',
}

function compositionFor(c: CardDef): string {
  if (c.suit === 'major') return 'Compose as a tarot trump: hieratic and frontal, the figure or force centered with its symbols arranged around it, gold leaf on the brightest points.'
  if (c.token) return 'Compose simply, one subject, small in a wide quiet scene.'
  switch (c.rank) {
    case 'ace':
      return `Compose as a tarot Ace: a single large ${ACE_OBJECT[c.suit]} held up by a hand emerging from cloud or mist, the landscape small below it.`
    case 'page':
      return `Compose as a tarot Page: a young standing figure holding one of the suit's objects (${EMBLEM_OBJECT[c.suit]}), looking at it.`
    case 'knight':
      return 'Compose as a tarot Knight: a figure in motion, armed or mounted, caught mid-action, the suit emblem on their gear.'
    case 'queen':
      return `Compose as a tarot Queen: a seated figure, calm, looking outward, with the suit's object (${EMBLEM_OBJECT[c.suit]}) beside or in hand.`
    case 'king':
      return 'Compose as a tarot King: an enthroned or towering figure of authority, symmetrical, the suit emblem repeated in the throne or the sky.'
    default: {
      const n = RANK_WORDS[c.rank]
      return n ? `Compose as a tarot pip card: work exactly ${n} ${EMBLEM_OBJECT[c.suit]} into the scene, arranged deliberately so they can be counted at a glance.` : ''
    }
  }
}

function typeNote(c: CardDef): string {
  if (c.type === 'omen') return 'This card is an Omen (a spell or an event), so the image is a moment or a place rather than a portrait.'
  if (c.type === 'relic') return 'This card is a Relic (an object), so the object is the hero of the image, shown large and detailed.'
  return ''
}

function cardPrompt(c: CardDef): string {
  const parts = [STYLE_SHORT, SUIT_KEY[c.suit], `Subject: ${c.art}.`, typeNote(c), compositionFor(c)].filter(Boolean)
  return parts.join(' ')
}

// ---------------------------------------------------------------------------
// Site art: the pieces the game itself can use beyond the card faces.
// ---------------------------------------------------------------------------

const SITE_ASSETS: { id: string; file: string; where: string; prompt: string }[] = [
  {
    id: 'title',
    file: 'public/art/title.jpg',
    where: 'The painting behind the title screen. Wide, dark at the edges so it fades into the sky. Landscape 1536 by 1024.',
    prompt:
      'Wide painted landscape from the fantasy world of Valisar, gouache and ink with gold-leaf highlights, Studio Ghibli background painting meets Zelda concept art. An enormous cratered bone-white moon, far too large, rising over a dark valley: a small farm village with a few warm lantern windows, black-barked forest beyond, a ruined stone archway in a field with faint blue runes. Deep indigo night sky full of small warm stars. The moon is the subject, centered high; the land is a dark band along the bottom third. Melancholy and beautiful. No text, no border, no watermark. Landscape 1536 by 1024.',
  },
  {
    id: 'card-back',
    file: 'public/art/card-back.jpg',
    where: 'The back of every card (the opponent’s hand, the deck). Portrait 1024 by 1536, symmetrical top to bottom so it reads the same upside down.',
    prompt:
      'The back of a tarot card from the fantasy world of Valisar. Ink and gold leaf on deep indigo parchment. A perfectly symmetrical design that reads the same upside down: a brass orrery of concentric rings and small gem planets around a central eight-point star, a crescent moon mirrored above and below, a sixteen-point sun, a pair of antlers, a cresting wave and a twelve-tooth gear worked into the four corners as small emblems. Fine hairline ornament, no figures, no text, no letters, no outer border (the game adds the frame). Flat and graphic like a printed card back, with slight parchment texture. Portrait 1024 by 1536.',
  },
  {
    id: 'table',
    file: 'public/art/table.jpg',
    where: 'Optional. A texture for the reading cloth behind the lanes. Square 1024 by 1024, dark, low contrast, tileable if possible.',
    prompt:
      'A dark indigo velvet reading cloth seen from directly above, with a very faint gold-thread orrery pattern of concentric circles and tick marks woven into it, worn at the edges, a few tiny embroidered stars. Very low contrast, nothing bright, no text, no border, seamless and tileable. Square 1024 by 1024.',
  },
]

// ---------------------------------------------------------------------------
// Assemble the manifest, the markdown brief, and the driver prompt.
// ---------------------------------------------------------------------------

interface Item {
  id: string
  file: string
  size: string
  name: string
  group: string
  prompt: string
}

const items: Item[] = []

for (const s of SIGNIFICATORS) {
  items.push({
    id: s.id,
    file: `art/${s.id}.jpg`,
    size: '1024x1024',
    name: `${s.name}, ${s.title} (portrait)`,
    group: 'Batch 1: portraits and site',
    prompt: `${STYLE_SHORT} Portrait, head and shoulders, three-quarter view, face centered and lit warmly, looking slightly off-frame. ${SUIT_KEY[s.suits[0]]} Subject: ${s.art}. Behind the figure, a hint of the ${s.title} tarot card's traditional symbolism (${majorSymbol(s.title)}), kept quiet.`,
  })
}
for (const a of SITE_ASSETS) {
  items.push({ id: a.id, file: a.file.replace('public/', ''), size: a.id === 'title' ? '1536x1024' : a.id === 'card-back' ? '1024x1536' : '1024x1024', name: `${a.id} (site art: ${a.where})`, group: 'Batch 1: portraits and site', prompt: a.prompt })
}
const groupOf: Record<Suit, string> = {
  major: 'Batch 2: Major Arcana',
  suns: 'Batch 3: Suns and Antlers',
  antlers: 'Batch 3: Suns and Antlers',
  tides: 'Batch 4: Tides and Gears',
  gears: 'Batch 4: Tides and Gears',
}
for (const suit of ['major', 'suns', 'antlers', 'tides', 'gears'] as const) {
  for (const c of ALL_CARDS.filter((c) => c.suit === suit && !c.token)) {
    items.push({
      id: c.id,
      file: `art/${c.id}.jpg`,
      size: '1024x1024',
      name: `${c.name} (${rankLine(c)})`,
      group: groupOf[suit],
      prompt: cardPrompt(c) + (c.suit === 'major' ? ` Let the traditional symbolism of ${traditionalName(c)} (${majorSymbol(traditionalName(c))}) echo underneath the Valisar subject.` : ''),
    })
  }
}
for (const c of ALL_CARDS.filter((c) => c.token)) {
  items.push({ id: c.id, file: `art/${c.id}.jpg`, size: '1024x1024', name: `${c.name} (token)`, group: 'Batch 5: tokens', prompt: cardPrompt(c) })
}

const L: string[] = []
const push = (...s: string[]) => L.push(...s)

push('# The Bonemoon Draw: art production brief')
push('')
push(`A complete job for an image-generating agent: ${items.length} images for a tarot card game set in the fantasy world of Valisar. Read the Brief, then produce every item in the Manifest in order, checking each one against the quality list before saving it. Nobody will be answering questions between images; every decision needed is written here.`)
push('')
push('## Deliverable')
push('')
push(`- ${items.length} images, one per manifest item, named exactly as each item's \`file\` field (for example \`art/major-0.jpg\`). Lowercase, no spaces, no renaming.`)
push('- Format: JPG, quality 85 to 90, sRGB. Sizes are given per item: most are square 1024 by 1024; the card back is portrait 1024 by 1536; the title painting is landscape 1536 by 1024.')
push('- Package everything as one zip named `bonemoon-art.zip` with a single folder `art/` at its root containing all the files.')
push('- Include `art/report.md` in the zip: one line per item that needed more than one attempt or that failed a quality check, saying which check and what was done about it. If everything passed first time, say so in one line.')
push('- Work in the batch order given in the Manifest. Batch 1 and Batch 2 matter most; if the job has to stop early, stop after a complete batch.')
push('- Do not add borders, card frames, titles, captions, or any lettering. The game draws the frame and prints the names.')
push('')
push('## Brief')
push('')
push(HOUSE_STYLE_LONG)
push('')
push('## Quality check, applied to every image before saving')
push('')
push('1. No text, letters, numbers, signatures, or runes that read as writing, anywhere in the image.')
push('2. No border, frame, vignette edge, or card edge. The picture runs to the edge of the canvas.')
push('3. The dominant color is the suit ink named in the prompt, on an indigo night ground, with ivory and one warm accent.')
push('4. Up and down are unmistakable: sky or the lightest area at the top, ground at the bottom.')
push('5. The subject sits inside the middle 80 percent of the frame; nothing important touches the top or bottom edge.')
push('6. Pip cards (Two through Ten of a suit): the number of emblem-objects matches the rank and can be counted at a glance.')
push('7. Portraits: the face is centered and readable at 48 pixels across. The card back reads the same upside down.')
push('')
push('If an image fails a check, regenerate it, up to two more attempts. If it still fails, keep the best attempt, save it under the correct filename, and note it in `report.md`.')
push('')
push('## Manifest')
push('')
push('Each item gives the file name, the size, and the full prompt. Prompts repeat the house style in short form so each one stands alone; the Brief above is the authority when they seem to disagree.')
push('')
let currentGroup = ''
for (const it of items) {
  if (it.group !== currentGroup) {
    currentGroup = it.group
    push(`### ${currentGroup}`)
    push('')
  }
  push(`#### ${it.id}`)
  push('')
  push(`- Name: ${it.name}`)
  push(`- File: \`${it.file}\``)
  push(`- Size: ${it.size}`)
  push(`- Prompt: ${it.prompt}`)
  push('')
}

writeFileSync('docs/ART_PROMPTS.md', L.join('\n'))
writeFileSync('docs/art-manifest.json', JSON.stringify({ brief: HOUSE_STYLE_LONG, items }, null, 2) + '\n')

const DRIVER = `I'm attaching ART_PROMPTS.md, a complete production brief for ${items.length} images for a tarot card game set in my D&D world, Valisar. Please run the whole job without checking in with me between images.

Read the Brief section first and hold to it for every image. Then work through the Manifest in the order given (Batch 1, then 2, 3, 4, 5), generating one image per item at the size listed and saving it as JPG under the exact file name in the item's File field. Before saving each image, run the Quality check list from the document on it, and regenerate up to two more times if it fails any check.

When you are done, or if you have to stop, give me one zip called bonemoon-art.zip with a single folder art/ at the root holding every image, plus art/report.md listing anything that needed retries or still fails a check. If you can only deliver part of the job, deliver complete batches in order.

Two rules matter more than anything else: no text or lettering of any kind in any image, and no borders or frames, because the game draws its own frame and prints the card names itself.`

writeFileSync('docs/ASTRA_PROMPT.md', `# Prompt for the image agent\n\nPaste this as the message, with \`docs/ART_PROMPTS.md\` attached (attach \`docs/art-manifest.json\` too if the agent prefers structured input).\n\n---\n\n${DRIVER}\n`)

console.log(`wrote docs/ART_PROMPTS.md, docs/art-manifest.json, docs/ASTRA_PROMPT.md: ${items.length} items`)

// ---------------------------------------------------------------------------

function traditionalName(c: CardDef): string {
  // "The Fool: Daxon Lamn" -> "The Fool"
  return c.name.split(':')[0].trim()
}

function majorSymbol(title: string): string {
  const m: Record<string, string> = {
    'The Fool': 'a traveler stepping off a cliff edge with a small dog, a bundle on a stick, the sun behind',
    'The Magician': 'one hand raised and one lowered, as above so below, the four suit objects on a table, an infinity sign overhead',
    'The High Priestess': 'a veiled figure seated between two pillars, a crescent moon at her feet, a scroll in her lap',
    'The Empress': 'a crowned woman seated in a field of grain, a heart-shaped shield, flowing water behind',
    'The Emperor': 'a crowned figure on a stone throne with rams’ heads, an orb and scepter, barren mountains behind',
    'The Hierophant': 'a robed figure on a throne between two pillars, two keys crossed at the feet, two kneeling acolytes',
    'The Lovers': 'two figures beneath a radiant angel, a tree of flame and a tree of fruit, a mountain between them',
    'The Chariot': 'a crowned figure in a canopied chariot drawn by two sphinxes, a walled city behind',
    Strength: 'a woman calmly closing a lion’s jaws, a lemniscate above her head, garlands',
    'The Hermit': 'a hooded elder on a mountain peak holding a lantern with a star inside, a staff',
    'Wheel of Fortune': 'a great wheel with figures rising and falling, a sphinx on top, clouds at the corners',
    Justice: 'a seated figure with a raised sword and balanced scales between two pillars',
    'The Hanged Man': 'a figure suspended upside down by one foot from a living tree, a halo of light, serene',
    Death: 'a skeletal rider on a pale horse with a black banner, a rising sun between two towers',
    Temperance: 'an angel pouring water between two cups, one foot in water and one on land, a path to the sun',
    'The Devil': 'a horned figure on a pedestal with two chained figures below, an inverted star',
    'The Tower': 'a tower struck by lightning, its crown knocked off, figures falling',
    'The Star': 'a kneeling figure pouring water into a pool and onto the land beneath one great star and seven small ones',
    'The Moon': 'a face in the moon over a path between two towers, a dog and a wolf howling, a crayfish in the pool',
    'The Sun': 'a child on a white horse under a huge radiant sun, sunflowers over a wall',
    Judgement: 'an angel with a trumpet above, figures rising from tombs with arms raised',
    'The World': 'a dancing figure inside a laurel wreath with the four living creatures at the corners',
  }
  return m[title] ?? 'its classic tarot imagery'
}
