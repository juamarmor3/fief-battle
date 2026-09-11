import { describe, expect, it } from 'vitest'
import { computeAutoBattleOutcome } from './battleStatus'
import type { Noble, PlayerArmy, UnitCounts } from './types'

function makeNoble(status: Noble['status']): Noble {
  return { id: 'n', name: 'Noble', gender: 'male', isTitledLord: false, titles: 0, status }
}

function makePlayer(side: 'A' | 'B', units: UnitCounts, nobles: Noble[] = []): PlayerArmy {
  return {
    id: `p-${side}`,
    name: side,
    side,
    color: 'red',
    units,
    nobles,
    inStronghold: false,
    inFortifiedCity: false,
  }
}

describe('computeAutoBattleOutcome (7.8)', () => {
  it('declares Victory for the side left standing', () => {
    const sideA = [makePlayer('A', { menAtArms: 1 })]
    const sideB = [makePlayer('B', {})]
    const outcome = computeAutoBattleOutcome(sideA, sideB)
    expect(outcome).toMatchObject({ type: 'victory', winnerSide: 'A' })
  })

  it('declares Victory with no winner when both sides are wiped out', () => {
    const sideA = [makePlayer('A', {})]
    const sideB = [makePlayer('B', {})]
    const outcome = computeAutoBattleOutcome(sideA, sideB)
    expect(outcome).toMatchObject({ type: 'victory' })
    expect(outcome?.winnerSide).toBeUndefined()
  })

  it('declares Annihilation when only Nobles remain on both sides', () => {
    const sideA = [makePlayer('A', {}, [makeNoble('active')])]
    const sideB = [makePlayer('B', {}, [makeNoble('active')])]
    const outcome = computeAutoBattleOutcome(sideA, sideB)
    expect(outcome).toMatchObject({ type: 'annihilation' })
  })

  it('returns null while both sides still have Troops', () => {
    const sideA = [makePlayer('A', { menAtArms: 1 })]
    const sideB = [makePlayer('B', { menAtArms: 1 })]
    expect(computeAutoBattleOutcome(sideA, sideB)).toBeNull()
  })
})
