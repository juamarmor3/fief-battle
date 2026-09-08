import { describe, expect, it } from 'vitest'
import { battleReducer, createInitialBattleState, type BattleState } from './battleReducer'

function goToRoundOutcome(state: BattleState): BattleState {
  return battleReducer(state, { type: 'SET_PHASE', phase: 'round-outcome' })
}

describe('END_ROUND / round-outcome streak (7.8)', () => {
  it('counts consecutive rounds with no losses towards Estancamiento', () => {
    let state = createInitialBattleState()
    state = goToRoundOutcome(state)
    expect(state.noLossStreak).toBe(1)

    state = battleReducer(state, { type: 'END_ROUND', decision: 'continue' })
    state = goToRoundOutcome(state)
    expect(state.noLossStreak).toBe(2)

    state = battleReducer(state, { type: 'END_ROUND', decision: 'continue' })
    state = goToRoundOutcome(state)
    expect(state.noLossStreak).toBe(3)
  })

  it('resets the streak when a round had losses', () => {
    let state = createInitialBattleState()
    state = goToRoundOutcome(state)
    expect(state.noLossStreak).toBe(1)

    state = battleReducer(state, { type: 'END_ROUND', decision: 'continue' })
    state = battleReducer(state, {
      type: 'APPLY_LOSSES',
      removals: [{ playerId: state.players[0].id, units: { menAtArms: 1 } }],
    })
    state = goToRoundOutcome(state)
    expect(state.noLossStreak).toBe(0)
  })

  it('bumps roundNumber on continue', () => {
    let state = createInitialBattleState()
    state = battleReducer(state, { type: 'END_ROUND', decision: 'continue' })
    expect(state.roundNumber).toBe(2)
    expect(state.phase).toBe('projectiles-trebuchet')
  })
})

describe('END_ROUND surrender (7.8)', () => {
  it('clears the surrendering side troops and captures its active Nobles', () => {
    let state = createInitialBattleState()
    const [playerA, playerB] = state.players
    state = battleReducer(state, {
      type: 'SET_UNIT_COUNT',
      playerId: playerA.id,
      unit: 'menAtArms',
      count: 3,
    })
    state = battleReducer(state, { type: 'ADD_NOBLE', playerId: playerA.id })
    const nobleId = state.players[0].nobles[0].id

    state = battleReducer(state, {
      type: 'END_ROUND',
      decision: 'end',
      outcome: { type: 'surrender', winnerSide: 'B', description: 'test' },
      surrenderSide: 'A',
    })

    const updatedA = state.players.find((p) => p.id === playerA.id)!
    expect(updatedA.units.menAtArms ?? 0).toBe(0)
    expect(updatedA.nobles[0].status).toBe('captured')
    expect(updatedA.nobles[0].captorPlayerId).toBe(playerB.id)
    expect(state.phase).toBe('summary')
    expect(state.outcome?.type).toBe('surrender')
    // Sanity check for unused var lint
    expect(nobleId).toBe(updatedA.nobles[0].id)
  })
})
