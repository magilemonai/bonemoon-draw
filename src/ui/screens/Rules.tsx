import { useStore } from '../store'

// The player-facing rules. The long-form version with design notes lives in docs/RULES.md.
export function Rules() {
  const goto = useStore((s) => s.goto)
  return (
    <div className="rules">
      <div className="rules-head">
        <button type="button" className="btn-quiet" onClick={() => goto('title')}>
          Back
        </button>
        <h2>How to play</h2>
      </div>
      <div className="rules-body">
        <h3>The table</h3>
        <p>
          You and one opponent each pick a Significator, the card that stands for you. Each Significator has 20 Health and a 30-card deck built from two suits plus a few Major Arcana. Bring the other Significator to 0 and the reading is yours.
        </p>
        <p>
          Between you sit three lanes: Past, Present, and Future. Each lane holds one Figure per side. Figures attack the Figure across from them. If that lane is empty, they hit the Significator instead.
        </p>

        <h3>Two faces</h3>
        <p>
          Every card in the deck has an Upright face and a Reversed face, the way a tarot card does. When you play a card you choose which face is up. A Figure&apos;s Reversed face swaps its Attack and Health and usually reads differently. Some cards can only enter Reversed.
        </p>
        <p>
          Flipping is a weapon. Many cards flip a Figure to its other face. A wounded Figure keeps its wounds when it turns, so a 1/8 wall with one point of damage becomes an 8/1 with one point of damage, which is to say a dead one. Figures marked Fixed can&apos;t be flipped.
        </p>

        <h3>A turn</h3>
        <p>
          At the start of your turn you gain a Spark, up to ten, and refill. You draw a card, two on a Full Moon. Then you may play cards, attack with Figures, move a Figure to an adjacent empty lane, and use your Significator&apos;s ability once. End the turn by touching the moon.
        </p>
        <p>
          A Figure gets one action a turn: attack, or move to an adjacent empty lane. It can&apos;t attack on the turn it arrives unless it is Windborne. Combat is mutual: both Figures deal their Attack to each other at once.
        </p>

        <h3>The moon</h3>
        <p>
          The moon turns every round: new, waxing, full, waning. On the tenth round the Bone Moon rises, and from then on every Significator loses Health at the start of each turn, more each round. Nobody outlasts the Bone Moon. Some cards bring it early.
        </p>

        <h3>Card types</h3>
        <p>
          <b>Figures</b> stand in lanes and fight. <b>Omens</b> are cast once and resolve immediately. <b>Relics</b> attach to one of your Figures and stay with it until it leaves the table.
        </p>

        <h3>Keywords</h3>
        <dl className="rules-kw">
          <dt>Arrive</dt>
          <dd>Happens when the Figure is played (not when it flips).</dd>
          <dt>Last Rite</dt>
          <dd>Happens when the Figure dies.</dd>
          <dt>Guard</dt>
          <dd>Attacks aimed at your Significator from an adjacent empty lane hit this Figure instead.</dd>
          <dt>Windborne</dt>
          <dd>Can attack the turn it arrives.</dd>
          <dt>Gale</dt>
          <dd>Can attack into any enemy lane.</dd>
          <dt>Veiled</dt>
          <dd>Can&apos;t be targeted by the enemy&apos;s Omens or abilities until it attacks.</dd>
          <dt>Fixed</dt>
          <dd>Can&apos;t be flipped.</dd>
          <dt>Aegis</dt>
          <dd>Absorbs the next damage it would take. Granted Aegis is one shield; Aegis a Figure carries (a Relic, its face, Rorik&apos;s aura) recharges at the start of your turn.</dd>
          <dt>Rekindle</dt>
          <dd>The first time this would die, it returns Reversed with 1 Health.</dd>
          <dt>Feast</dt>
          <dd>Damage this deals also heals your Significator.</dd>
          <dt>Whisper</dt>
          <dd>Takes no damage back from Figures it attacks.</dd>
          <dt>Dormant</dt>
          <dd>Can&apos;t attack.</dd>
          <dt>Hush</dt>
          <dd>The Figure loses its text and keywords. Relics keep working.</dd>
          <dt>Read N</dt>
          <dd>Look at the top N cards of your deck. Keep one; the rest go to the bottom.</dd>
        </dl>

        <h3>Fine print</h3>
        <p>
          A Figure&apos;s text is its current face&apos;s text; turn it over and the old face is gone, end-of-turn clauses included. Wounds are checked the moment a face turns, and a Figure that dies from its own flip fires no flip triggers. Effects resolve one at a time and deaths are checked after each. A chosen target is that exact Figure; if it leaves, the effect fizzles. Mordeaux&apos;s copy costs nothing, is not a cast, and fizzles with its target. Spark gained this turn can go past your maximum. A Significator at 0 loses at once. The full list is in the rulebook.
        </p>

        <h3>The deck</h3>
        <p>
          Thirty cards. Two copies at most of any Minor Arcana, one copy of any Major Arcana, and never the Major that is your own Significator. Your hand holds eight; extra draws burn. When your deck runs out, every draw costs you Health instead.
        </p>
      </div>
    </div>
  )
}
