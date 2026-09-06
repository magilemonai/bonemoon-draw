// Rules switches for controlled experiments. Defaults are the shipped rules.
// scripts/experiment.ts flips these per variant; the game itself never changes them.
export const RULES = {
  // Rorik's passive heals at end of turn only if one of his Figures died this turn.
  rorikConditional: false,
  // Partial mulligan before the first turn (AI policy in the sim; no UI yet).
  mulligan: false,
  // Seat compensation experiments (exactly one at a time).
  firstPlayerSkipsFirstDraw: false, // the first player draws no card on turn one
  secondPlayerSparkToken: false, // the second player opens with a one-shot Spark token (Eldertech Sphere, cost 0)
  secondPlayerFirstTurnSpark: false, // the second player has +1 Spark on their first turn only
}
