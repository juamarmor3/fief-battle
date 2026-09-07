import { describe, expect, it } from 'vitest'
import {
  getArcherAttackRequirement,
  resolveArcherAttack,
  resolveBombardAttack,
  resolveTrebuchetAttack,
} from './projectiles'

describe('resolveTrebuchetAttack', () => {
  it('no attack with 0 trebuchets', () => {
    expect(resolveTrebuchetAttack(0, [3, 3]).hits).toBe(0)
  })

  it('sums the 2 dice with a single trebuchet, no bonus', () => {
    const result = resolveTrebuchetAttack(1, [2, 1])
    expect(result.hits).toBe(3)
    expect(result.secondTrebuchetBonus).toBe(false)
  })

  it('adds a flat +1f when a second trebuchet fires alongside', () => {
    const result = resolveTrebuchetAttack(2, [1, 1])
    expect(result.hits).toBe(3) // 1+1 + 1 bonus
    expect(result.secondTrebuchetBonus).toBe(true)
  })
})

describe('resolveBombardAttack', () => {
  it('sums one die per bombard and counts explosions on Blank', () => {
    const result = resolveBombardAttack(3, [0, 1, 3])
    expect(result.hits).toBe(4)
    expect(result.exploded).toBe(1)
  })

  it('no attack with 0 bombards', () => {
    expect(resolveBombardAttack(0, []).hits).toBe(0)
  })
})

describe('getArcherAttackRequirement', () => {
  it('requires at least 2 shooters against a Stronghold', () => {
    expect(getArcherAttackRequirement(1, false, true).canFire).toBe(false)
    expect(getArcherAttackRequirement(2, false, true).canFire).toBe(true)
  })

  it('requires at least 3 shooters against a Fortified City', () => {
    expect(getArcherAttackRequirement(2, true, false).canFire).toBe(false)
    expect(getArcherAttackRequirement(3, true, false).canFire).toBe(true)
  })
})

describe('resolveArcherAttack', () => {
  it('applies the +1f bonus with 3+ shooters in the open', () => {
    const result = resolveArcherAttack({
      archerCount: 3,
      targetFortifiedCity: false,
      targetStronghold: false,
      targetNoble: false,
      rolls: [2],
    })
    expect(result.hits).toBe(3) // 2 + 1 bonus
    expect(result.bonusApplied).toBe(true)
  })

  it('does not apply the bonus versus a Fortified City', () => {
    const result = resolveArcherAttack({
      archerCount: 3,
      targetFortifiedCity: true,
      targetStronghold: false,
      targetNoble: false,
      rolls: [2],
    })
    expect(result.hits).toBe(2)
    expect(result.bonusApplied).toBe(false)
  })

  it('targeting a Noble only succeeds on an fff roll and deals no other damage', () => {
    const miss = resolveArcherAttack({
      archerCount: 1,
      targetFortifiedCity: false,
      targetStronghold: false,
      targetNoble: true,
      rolls: [2],
    })
    expect(miss.hits).toBe(0)
    expect(miss.nobleSlain).toBe(false)

    const hit = resolveArcherAttack({
      archerCount: 1,
      targetFortifiedCity: false,
      targetStronghold: false,
      targetNoble: true,
      rolls: [3],
    })
    expect(hit.nobleSlain).toBe(true)
  })
})
