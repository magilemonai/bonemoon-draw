# The Bonemoon Draw

A tarot-flavored card battler set in Valisar. Two players, three lanes, seventy-eight cards, and every card has two faces.

Play it: https://magilemonai.github.io/bonemoon-draw/

## Run it

```
pnpm install
pnpm dev          # http://localhost:5173
pnpm test         # engine tests (vitest)
pnpm sim 200      # AI vs AI balance sim, 200 games
pnpm art-prompts  # regenerate docs/ART_PROMPTS.md
pnpm review-packet # regenerate docs/DESIGN_REVIEW_PACKET.md (rules + cards + sim + questions)
pnpm baseline     # 600-game AI baseline with telemetry -> docs/BASELINE.md
pnpm experiment <variant>  # one-variable experiment from scripts/variants.ts -> docs/experiments/
pnpm build        # production build to dist/
pnpm build:single # one-file build to dist-single/ (for sharing)
```

## Where things live

- `src/data/` the cards. One file per suit, one for the Majors, tokens, Significators and their decks. Rules text and effects live side by side on each card.
- `src/engine/` the rules. `engine.ts` runs actions and emits one state snapshot per event. `queries.ts` is read-only helpers (stats, costs, targeting). `types.ts` is the effect language.
- `src/ai/` the opponent. A two-step planner over the real engine with a heuristic that knows lethal, threats, and deferred text.
- `src/engine/rules.ts` switches for controlled experiments; the game itself never flips them.
- `src/ui/` React + Motion. `store.ts` holds truth, display, and the animation queue.
- `docs/RULES.md` the rulebook. `docs/DESIGN.md` the look and why. `docs/ART_PROMPTS.md` the art production brief (94 images), `docs/art-manifest.json` the same as data, `docs/ASTRA_PROMPT.md` the message that hands the whole job to an image agent. `docs/DESIGN_REVIEW_PACKET.md` the read-only snapshot for an outside mechanics critique. `docs/UI_REVIEW_PACKET.md` and `docs/UI_KIT_PROMPTS.md` the interface critique brief and the ornament kit spec. `docs/ART_REVIEW.md` the review of the delivered paintings with a touch-up list. `docs/REVIEW_RESPONSE.md` the evaluation of the outside design critique, with the baseline and experiments. `docs/UX_RESPONSE.md` the answer to the hands-on interface review. `docs/POLISH_RESPONSE.md` the answer to the AI and compact-card follow-up. `docs/METAGAME_RESPONSE.md` the record, Renown, and what of the progression proposal is built. `docs/reviews/` the critiques as received.
- `public/art/` the 94 delivered images (full resolution). `pnpm build:single` embeds downscaled copies so the one-file build carries its own art. Drop new art here as `<card-id>.jpg` (or `.png`) and it replaces the procedural sigil. `docs/ART_PROMPTS.md` is the art bible to hand to an image model.

The two source documents for the world (the worldbuilding master doc and the campaign notes) sit in the project root as Cody exported them, and they are git-ignored: they are private DM notes. `docs/ART_REPORT.md` is the image agent's production report for the art in `public/art`.
