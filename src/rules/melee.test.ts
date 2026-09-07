import { describe, expect, it } from 'vitest'
import { meleeDiceCount, resolveMeleeAttack, spToDiceCount } from './melee'

describe('spToDiceCount', () => {
  it('maps SP brackets to dice (7.3)', () => {
    expect(spToDiceCount(0)).toBe(0)
    expect(spToDiceCount(1)).toBe(1)
    expect(spToDiceCount(6)).toBe(1)
    expect(spToDiceCount(7)).toBe(2)
    expect(spToDiceCount(11)).toBe(2)
    expect(spToDiceCount(12)).toBe(2)
    expect(spToDiceCount(13)).toBe(3)
    expect(spToDiceCount(15)).toBe(3)
  })
})

describe('meleeDiceCount', () => {
  it('example 7-3: 15 SP vs a defender in a Stronghold -> 2 dice', () => {
    expect(meleeDiceCount(15, true, false)).toBe(2)
  })

  it('example 7-3 continued: 11 SP, no penalty -> 2 dice', () => {
    expect(meleeDiceCount(11, false, false)).toBe(2)
  })

  it('Fortified City imposes a 2-die penalty', () => {
    expect(meleeDiceCount(15, false, true)).toBe(1)
  })

  it('never goes below 0 dice', () => {
    expect(meleeDiceCount(3, false, true)).toBe(0)
  })
})

describe('resolveMeleeAttack', () => {
  it('sums rolled hits', () => {
    expect(resolveMeleeAttack([1, 3], false)).toBe(4)
  })

  it('adds +1f when the side has Excalibur', () => {
    expect(resolveMeleeAttack([1, 3], true)).toBe(5)
  })

  it('deals no hits with 0 dice', () => {
    expect(resolveMeleeAttack([], true)).toBe(0)
  })
})
