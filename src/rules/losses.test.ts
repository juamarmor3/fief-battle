import { describe, expect, it } from 'vitest'
import { computeMaxRemovableHits } from './losses'
import type { UnitCounts } from './types'

describe('computeMaxRemovableHits', () => {
  it('example 7-4: 1 Men-at-Arms (1 hit) + 1 Knight (3 hits)', () => {
    const units: UnitCounts = { menAtArms: 1, knight: 1 }
    expect(computeMaxRemovableHits(units, 1)).toBe(1) // Men-at-Arms dies
    expect(computeMaxRemovableHits(units, 2)).toBe(1) // still just Men-at-Arms, Knight needs 3
    expect(computeMaxRemovableHits(units, 3)).toBe(3) // Knight alone beats Men-at-Arms alone
    expect(computeMaxRemovableHits(units, 4)).toBe(4) // both die
    expect(computeMaxRemovableHits(units, 5)).toBe(4) // capped at total available hits
  })

  it('example 7-3: 2 Men-at-Arms + 3 Knights, 4 hits', () => {
    const units: UnitCounts = { menAtArms: 2, knight: 3 }
    // Must remove 1 Men-at-Arms + 1 Knight = 4 hits exactly
    expect(computeMaxRemovableHits(units, 4)).toBe(4)
  })

  it('returns 0 when there are no troops', () => {
    expect(computeMaxRemovableHits({}, 5)).toBe(0)
  })

  it('never exceeds hitsAvailable', () => {
    const units: UnitCounts = { crossbowman: 10 }
    expect(computeMaxRemovableHits(units, 7)).toBe(6) // 3 crossbowmen = 6 hits, 4th needs 2 more (would be 8)
  })
})
