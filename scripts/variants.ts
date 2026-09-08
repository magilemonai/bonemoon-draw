// Named experiment variants for the sim. Each changes exactly one thing against the
// shipped rules and cards. Applying a variant mutates the in-memory card and rules data
// for this process only; the game itself never loads this file.

import { card, significator } from '../src/data'
import { RULES } from '../src/engine/rules'

export const VARIANTS: Record<string, { summary: string; apply: () => void }> = {
  baseline: { summary: 'Shipped rules and decks.', apply: () => {} },

  'rorik-conditional': {
    summary: 'Rorik: Forge of Kojin heals 1 at end of turn only if a friendly Figure died this turn.',
    apply: () => {
      RULES.rorikConditional = true
      significator('sig-rorik').passive = 'Forge of Kojin: at the end of your turn, if a friendly Figure died this turn, restore 1 Health to your Significator.'
    },
  },

  mulligan: {
    summary: 'Partial mulligan before the first turn (AI sets aside all but one card costing 5 or more).',
    apply: () => {
      RULES.mulligan = true
    },
  },

  'seat-nodraw': {
    summary: 'Seat: the first player draws no card on turn one (opening hands 4 and 5, then draws as usual).',
    apply: () => {
      RULES.firstPlayerSkipsFirstDraw = true
    },
  },

  'seat-token': {
    summary: 'Seat: the second player opens with a Spent Sphere, a one-shot 0-cost Omen that gives 1 Spark this turn (usable any turn).',
    apply: () => {
      RULES.secondPlayerSparkToken = true
    },
  },

  'seat-spark': {
    summary: 'Seat: the second player has 1 extra Spark on their first turn only.',
    apply: () => {
      RULES.secondPlayerFirstTurnSpark = true
    },
  },

  'mana-draw': {
    summary: 'Liquid Mana Upright: gain 3 Spark this turn and draw a card.',
    apply: () => {
      const c = card('gears-6')
      c.upright.text = 'Gain 3 Spark this turn. Draw a card.'
      c.upright.effects = [{ trigger: 'cast', ops: [{ op: 'spark', n: 3 }, { op: 'draw', n: 1 }] }]
    },
  },

  'tidecaller-gale': {
    summary: 'Tidecaller Reversed: +2/+1, Windborne, Gale (was +3/+1 Windborne).',
    apply: () => {
      const c = card('tides-8')
      c.reversed.text = 'Attach: +2/+1, **Windborne**, and **Gale**.'
      c.relic!.reversed = { atk: 2, hp: 1, keywords: ['windborne', 'gale'] }
    },
  },

  'lirielle-thorn': {
    summary: "Lirielle's deck: Inspector Bramble becomes a second Thorn of the Bladed Wind.",
    apply: () => {
      const s = significator('sig-lirielle')
      const i = s.deck.indexOf('antlers-8')
      if (i >= 0) s.deck[i] = 'antlers-knight'
    },
  },

  'shazz-lowcurve': {
    summary: "Shazz's deck: the nine cards costing 6 or more become second copies of the Oondray, Yvette, Mr. Boscoe, the Pylon, Taranis, Mordeaux, the Sentry, and two Portals of Autumn Leaves.",
    apply: () => {
      const s = significator('sig-shazz')
      const swaps: [string, string][] = [
        ['antlers-9', 'antlers-3'],
        ['gears-9', 'gears-3'],
        ['gears-queen', 'gears-2'],
        ['gears-10', 'gears-4'],
        ['major-4', 'antlers-7'],
        ['major-16', 'gears-knight'],
        ['major-13', 'gears-7'],
        ['major-2', 'antlers-4'],
        ['major-8', 'antlers-4'],
      ]
      for (const [out, into] of swaps) {
        const i = s.deck.indexOf(out)
        if (i >= 0) s.deck[i] = into
      }
    },
  },

  'shazz-boscoe': {
    summary: "Shazz's deck: The Mirrored Dome becomes a second Mr. Boscoe.",
    apply: () => {
      const s = significator('sig-shazz')
      const i = s.deck.indexOf('gears-10')
      if (i >= 0) s.deck[i] = 'gears-2'
    },
  },
}
