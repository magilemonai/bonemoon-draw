// Small seeded PRNG (mulberry32). The whole game is deterministic from its seed.
export function nextRandom(seed: number): { value: number; seed: number } {
  let t = (seed + 0x6d2b79f5) | 0
  t = Math.imul(t ^ (t >>> 15), t | 1)
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
  const value = ((t ^ (t >>> 14)) >>> 0) / 4294967296
  return { value, seed: (seed + 0x6d2b79f5) | 0 }
}

export function shuffleWithSeed<T>(arr: T[], seed: number): { arr: T[]; seed: number } {
  const out = arr.slice()
  let s = seed
  for (let i = out.length - 1; i > 0; i--) {
    const r = nextRandom(s)
    s = r.seed
    const j = Math.floor(r.value * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return { arr: out, seed: s }
}
