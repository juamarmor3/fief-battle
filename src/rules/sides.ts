import type { PlayerArmy, Side, UnitKind } from './types'

export function playersOnSide(players: PlayerArmy[], side: Side): PlayerArmy[] {
  return players.filter((p) => p.side === side)
}

export function otherSide(side: Side): Side {
  return side === 'A' ? 'B' : 'A'
}

export function pooledUnitCount(players: PlayerArmy[], kind: UnitKind): number {
  return players.reduce((sum, p) => sum + (p.units[kind] ?? 0), 0)
}

export function sideLabel(side: Side): string {
  return side === 'A' ? 'Bando A' : 'Bando B'
}

export function sideInStronghold(players: PlayerArmy[]): boolean {
  return players.some((p) => p.inStronghold)
}

export function sideInFortifiedCity(players: PlayerArmy[]): boolean {
  return players.some((p) => p.inFortifiedCity)
}

export function sideColorClass(players: PlayerArmy[]): string {
  const color = players[0]?.color
  return color ? `player-${color}` : ''
}
