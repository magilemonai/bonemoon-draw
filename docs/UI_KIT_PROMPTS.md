# The Bonemoon Draw: interface art kit

A second, smaller art job. The card paintings are done; this is the ornament the interface itself wears: card frames, lane markers, a banner ribbon, and suit emblems. Every piece is a transparent PNG that the game lays over its own drawn interface, so transparency is the whole point. The game already knows where each file goes and ignores any file that is missing, so the kit can arrive in pieces.

## Deliverable

- 13 transparent PNGs, named exactly as listed, packaged as `bonemoon-ui-kit.zip` with one folder `ui/` at the root.
- Everything outside the drawn ornament must be fully transparent (alpha 0), including the entire center of every frame. Semi-transparent edges on the ornament itself are fine.
- No text, letters, or numbers anywhere. No solid backgrounds. No drop shadows baked in.
- Match the world's palette: gold leaf (#c9962b, highlights #e8c76c), suit inks (Suns gold #c9962b, Antlers moss #4d7f57, Tides teal #2f7f8f, Gears brass #a8623a, Majors violet #6e5ab8), and for the Reversed frame the bruise purple #7c3159. Everything sits on deep indigo (#17143a) in the game, so test each piece against that color.
- Style: hand-inked filigree with gold-leaf highlights, the way a printed tarot deck's border is engraved. Fine lines, a little irregular, the way an engraver's hand wanders. Nothing photographic.

## The pieces

### Card frames (6)

`ui/frame-suns.png`, `ui/frame-antlers.png`, `ui/frame-tides.png`, `ui/frame-gears.png`, `ui/frame-major.png`, `ui/frame-dusk.png`

500 by 800 pixels (a 5:8 card). Ornament lives only in the outer 8 percent of the canvas: a thin engraved border with corner flourishes and a small emblem at the top center and bottom center. The middle is fully transparent, because the card's art, name, text, and numbers are drawn underneath. Keep the border thin enough that it never covers the cost badge at top-left or the stat badges at bottom-left and bottom-right (leave those three corners lighter than the top-right corner).

- Suns: gold with tiny sunburst corners.
- Antlers: moss green and gold, antler tines curling in the corners, a leaf or two.
- Tides: teal and gold, wave crests in the corners, a pearl at top center.
- Gears: brass and gold, small gear teeth along the border, a gear at top center.
- Major: violet and gold, richer than the others, an eight-point star at top center and bottom center.
- Dusk: bruise purple (#7c3159) and tarnished gold, the same structure as the Major frame but with the ornament subtly cracked or thorned. This one goes on every card's Reversed face.

### Lane marker (1)

`ui/lane-mark.png`

500 by 800, transparent. A faint gold hairline outline of a tarot spread position: a rounded rectangle inset from the edges, a small eight-point star at its center, four tiny marks at the corners. Very low contrast; the game shows it at 35 percent opacity inside empty lanes.

### Banner ribbon (1)

`ui/banner.png`

1200 by 360, transparent. An unfurled ribbon or scroll in deep indigo with gold-leaf edging and small ornaments at both ends. The middle 70 percent of the ribbon's face is plain indigo, because the game prints the turn announcement ("Your reading", "The Bone Moon rises") on top of it in gold type. Symmetrical left to right.

### Suit emblems (5)

`ui/emblem-suns.png`, `ui/emblem-antlers.png`, `ui/emblem-tides.png`, `ui/emblem-gears.png`, `ui/emblem-major.png`

256 by 256, transparent. One engraved line emblem each in its suit ink with gold highlights: a sixteen-point sun; a pair of antlers; a cresting wave; a twelve-tooth gear; an eight-point star. Centered, filling about 80 percent of the canvas, readable at 24 pixels.

## Prompts

Paste the block above as the brief, then these one at a time, or hand over the whole file and ask for the zip.

- **frame-suns**: Transparent PNG, 500 by 800, engraved tarot card border only in the outer 8 percent of the canvas, fully transparent center, gold-leaf filigree with tiny sixteen-point sunburst corner flourishes and a small sun at top center and bottom center, hand-inked, slightly irregular lines, no text, no background.
- **frame-antlers**: Same structure in moss green and gold, antler tines curling in the corners, a small leaf at top center and bottom center.
- **frame-tides**: Same structure in deep teal and gold, wave crests in the corners, a pearl at top center, a small cresting wave at bottom center.
- **frame-gears**: Same structure in brass and gold, tiny gear teeth along the border, a twelve-tooth gear at top center and bottom center.
- **frame-major**: Same structure in violet and gold, richer filigree, an eight-point star at top center and bottom center.
- **frame-dusk**: Same structure in bruise purple (#7c3159) and tarnished gold, the ornament subtly cracked and thorned, a small inverted crescent at top center and bottom center.
- **lane-mark**: Transparent PNG, 500 by 800, a faint gold hairline rounded rectangle inset from the edges, a small eight-point star at center, four tiny corner marks, nothing else, no background.
- **banner**: Transparent PNG, 1200 by 360, an unfurled ribbon in deep indigo (#17143a) with gold-leaf edging and small ornaments at both ends, the middle 70 percent plain, symmetrical, no text, no background.
- **emblem-suns**: Transparent PNG, 256 by 256, an engraved sixteen-point sun in gold ink with gold-leaf highlights, centered, no background, no text.
- **emblem-antlers**: Transparent PNG, 256 by 256, an engraved pair of antlers in moss green ink with gold highlights, centered, no background, no text.
- **emblem-tides**: Transparent PNG, 256 by 256, an engraved cresting wave in deep teal ink with gold highlights, centered, no background, no text.
- **emblem-gears**: Transparent PNG, 256 by 256, an engraved twelve-tooth gear in brass ink with gold highlights, centered, no background, no text.
- **emblem-major**: Transparent PNG, 256 by 256, an engraved eight-point star in violet ink with gold-leaf highlights, centered, no background, no text.

## Where they go

Unzip into `public/art/` so the files land at `public/art/ui/<name>.png`. Reload; the game finds the kit and starts wearing it.
