// Battle Die faces (7.1): 1x Blank, 2x 'f', 2x 'ff', 1x 'fff'.
// Los jugadores tiran los dados físicos y la app solo necesita el resultado
// (nº de hits) de cada dado, no simula la tirada.
export const DIE_FACE_VALUES = [0, 1, 2, 3] as const
export type DieFaceValue = (typeof DIE_FACE_VALUES)[number]

export const DIE_FACE_LABELS: Record<DieFaceValue, string> = {
  0: 'Blank (0 hits)',
  1: 'f (1 hit)',
  2: 'ff (2 hits)',
  3: 'fff (3 hits)',
}

export function sumHits(rolls: number[]): number {
  return rolls.reduce((sum, hit) => sum + hit, 0)
}
