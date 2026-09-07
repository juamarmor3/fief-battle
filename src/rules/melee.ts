import { sumHits } from './dice'

// 7.3: el total de SP determina cuántos Battle Dice se tiran.
export function spToDiceCount(sp: number): number {
  if (sp <= 0) return 0
  if (sp <= 6) return 1
  if (sp <= 12) return 2
  return 3
}

// 7.4: penalización al atacante si el defensor está en Fortaleza (-1 dado)
// o Fortaleza Amurallada (-2 dados). Como el combate es simultáneo, cada
// bando aplica la penalización según el estado del bando CONTRARIO.
export function meleeDiceCount(
  sp: number,
  opponentInStronghold: boolean,
  opponentInFortifiedCity: boolean,
): number {
  const base = spToDiceCount(sp)
  const penalty = opponentInFortifiedCity ? 2 : opponentInStronghold ? 1 : 0
  return Math.max(0, base - penalty)
}

// 7.3: Excalibur añade +1f de daño al total de dados de Melé de su bando.
export function resolveMeleeAttack(rolls: number[], hasExcalibur: boolean): number {
  if (rolls.length === 0) return 0
  return sumHits(rolls) + (hasExcalibur ? 1 : 0)
}
