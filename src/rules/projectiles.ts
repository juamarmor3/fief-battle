import { sumHits } from './dice'

export interface TrebuchetResult {
  hits: number
  secondTrebuchetBonus: boolean
}

// 7.2 Trebuchets: se tiran 2 Battle Dice; un segundo Trebuchet añade un
// +1f fijo. `rolls` son los resultados (en hits) que introduce el usuario.
export function resolveTrebuchetAttack(trebuchetCount: number, rolls: number[]): TrebuchetResult {
  if (trebuchetCount <= 0) return { hits: 0, secondTrebuchetBonus: false }
  const secondTrebuchetBonus = trebuchetCount >= 2
  const hits = sumHits(rolls) + (secondTrebuchetBonus ? 1 : 0)
  return { hits, secondTrebuchetBonus }
}

export interface BombardResult {
  hits: number
  exploded: number
}

// 7.2 Bombards: 1 dado por Bombard; cada 'Blank' hace explotar ese Bombard,
// destruyéndolo junto a un Men-at-Arms propio (baja autoinfligida).
export function resolveBombardAttack(bombardCount: number, rolls: number[]): BombardResult {
  if (bombardCount <= 0) return { hits: 0, exploded: 0 }
  const hits = sumHits(rolls)
  const exploded = rolls.filter((roll) => roll === 0).length
  return { hits, exploded }
}

export interface ArcherAttackRequirement {
  canFire: boolean
  diceToRoll: number
}

// Nº de dados que hay que tirar (o si ni siquiera se puede disparar) antes
// de conocer el resultado, según los requisitos mínimos de 7.2.
export function getArcherAttackRequirement(
  archerCount: number,
  targetFortifiedCity: boolean,
  targetStronghold: boolean,
): ArcherAttackRequirement {
  if (archerCount <= 0) return { canFire: false, diceToRoll: 0 }
  if (targetFortifiedCity && archerCount < 3) return { canFire: false, diceToRoll: 0 }
  if (targetStronghold && archerCount < 2) return { canFire: false, diceToRoll: 0 }
  return { canFire: true, diceToRoll: 1 }
}

export interface ArcherAttackOptions {
  archerCount: number
  targetFortifiedCity: boolean
  targetStronghold: boolean
  targetNoble: boolean
  rolls: number[]
}

export interface ArcherResult {
  hits: number
  bonusApplied: boolean
  targetingNoble: boolean
  nobleSlain: boolean
}

// 7.2 Archers/Crossbowmen: un único dado para todo el grupo, +1f con 3+
// tiradores (salvo contra Fortaleza/Fortaleza Amurallada), y modo alterno
// de disparo a un Noble que solo tiene éxito con 'fff'.
export function resolveArcherAttack(opts: ArcherAttackOptions): ArcherResult {
  const { archerCount, targetFortifiedCity, targetStronghold, targetNoble, rolls } = opts

  if (targetNoble) {
    return { hits: 0, bonusApplied: false, targetingNoble: true, nobleSlain: rolls[0] === 3 }
  }

  const bonusEligible = !targetFortifiedCity && !targetStronghold && archerCount >= 3
  const hits = sumHits(rolls) + (bonusEligible ? 1 : 0)
  return { hits, bonusApplied: bonusEligible, targetingNoble: false, nobleSlain: false }
}
