import type { PlayerArmy } from './types'

// Strength Points (7.3)
export function computeStrengthPoints(player: PlayerArmy): number {
  let sp = 0
  sp += (player.units.menAtArms ?? 0) * 1
  sp += (player.units.archer ?? 0) * 1
  sp += (player.units.crossbowman ?? 0) * 2
  sp += (player.units.knight ?? 0) * 3
  sp += (player.units.footSoldier ?? 0) * 2
  sp += (player.units.leader ?? 0) * 3
  for (const noble of player.nobles) {
    if (noble.status !== 'active') continue
    if (noble.gender === 'male') sp += 1
    else if (noble.isTitledLord) sp += 1
  }
  return sp
}

export function computeSideStrengthPoints(players: PlayerArmy[]): number {
  return players.reduce((sum, p) => sum + computeStrengthPoints(p), 0)
}
