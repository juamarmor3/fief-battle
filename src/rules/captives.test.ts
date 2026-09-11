import { describe, expect, it } from 'vitest'
import { anyCapturedNobles, capturedNobles, captorName, ransomValue } from './captives'
import type { Noble, PlayerArmy } from './types'

function makeNoble(patch: Partial<Noble> = {}): Noble {
  return {
    id: 'noble-1',
    name: 'Lord Test',
    gender: 'male',
    isTitledLord: false,
    titles: 0,
    status: 'active',
    ...patch,
  }
}

function makePlayer(patch: Partial<PlayerArmy> = {}): PlayerArmy {
  return {
    id: 'player-1',
    name: 'Jugador 1',
    side: 'A',
    color: 'red',
    units: {},
    nobles: [],
    inStronghold: false,
    inFortifiedCity: false,
    ...patch,
  }
}

describe('ransomValue (7.7)', () => {
  it('is 2 Shillings with no Titles', () => {
    expect(ransomValue(makeNoble({ titles: 0 }))).toBe(2)
  })

  it('adds 2 Shillings per Title', () => {
    expect(ransomValue(makeNoble({ titles: 2 }))).toBe(6)
  })
})

describe('capturedNobles / anyCapturedNobles (7.6)', () => {
  it('lists only captured Nobles, paired with their original owner', () => {
    const activeNoble = makeNoble({ id: 'n-active', status: 'active' })
    const capturedNoble = makeNoble({ id: 'n-captured', status: 'captured', captorPlayerId: 'captor-1' })
    const player = makePlayer({ nobles: [activeNoble, capturedNoble] })

    const entries = capturedNobles([player])
    expect(entries).toHaveLength(1)
    expect(entries[0].noble.id).toBe('n-captured')
    expect(entries[0].player.id).toBe(player.id)
  })

  it('reports false when nobody is captive', () => {
    const player = makePlayer({ nobles: [makeNoble({ status: 'active' })] })
    expect(anyCapturedNobles([player])).toBe(false)
  })

  it('reports true when at least one Noble is captive', () => {
    const player = makePlayer({ nobles: [makeNoble({ status: 'captured' })] })
    expect(anyCapturedNobles([player])).toBe(true)
  })
})

describe('captorName', () => {
  it('resolves the captor player by id', () => {
    const captor = makePlayer({ id: 'captor-1', name: 'Dave' })
    expect(captorName([captor], 'captor-1')).toBe('Dave')
  })

  it('falls back when the captor id is unknown or missing', () => {
    expect(captorName([], 'missing')).toBe('Desconocido')
    expect(captorName([], undefined)).toBe('Desconocido')
  })
})
