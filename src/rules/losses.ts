import type { Noble, PlayerArmy, UnitCounts, UnitKind } from './types'

export const TROOP_KINDS: UnitKind[] = [
  'menAtArms',
  'archer',
  'crossbowman',
  'knight',
  'footSoldier',
  'leader',
]

// Hits required to defeat each Troop (7.5). Nobles cost 1 Hit too, but are
// only ever targeted once every Troop is gone (handled separately below).
export const HIT_COST: Record<UnitKind, number> = {
  menAtArms: 1,
  archer: 1,
  crossbowman: 2,
  knight: 3,
  footSoldier: 2,
  leader: 3,
  trebuchet: 0,
  bombard: 0,
}

export function pooledTroopCounts(players: PlayerArmy[]): UnitCounts {
  const pooled: UnitCounts = {}
  for (const player of players) {
    for (const kind of TROOP_KINDS) {
      pooled[kind] = (pooled[kind] ?? 0) + (player.units[kind] ?? 0)
    }
  }
  return pooled
}

export function pooledActiveNobles(players: PlayerArmy[]): Noble[] {
  return players.flatMap((p) => p.nobles.filter((n) => n.status === 'active'))
}

/**
 * Maximum total Hits that can be absorbed by these Troops without exceeding
 * `hitsAvailable` (7.5: "must remove as many SPs as possible up to the
 * number of Hits taken"). A Knight only counts if all 3 of its Hits fit.
 */
export function computeMaxRemovableHits(units: UnitCounts, hitsAvailable: number): number {
  const dp = new Array(hitsAvailable + 1).fill(0)
  for (const kind of TROOP_KINDS) {
    const cost = HIT_COST[kind]
    const count = units[kind] ?? 0
    for (let n = 0; n < count; n++) {
      for (let c = hitsAvailable; c >= cost; c--) {
        dp[c] = Math.max(dp[c], dp[c - cost] + cost)
      }
    }
  }
  return dp[hitsAvailable]
}

export function totalTroopCount(units: UnitCounts): number {
  return TROOP_KINDS.reduce((sum, kind) => sum + (units[kind] ?? 0), 0)
}

export function unitsHitTotal(units: UnitCounts): number {
  return TROOP_KINDS.reduce((sum, kind) => sum + (units[kind] ?? 0) * HIT_COST[kind], 0)
}
