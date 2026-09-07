import type { BattlePhase, Noble, PlayerArmy, Side, UnitKind } from './types'

export interface BattleState {
  phase: BattlePhase
  players: PlayerArmy[]
}

export type BattleAction =
  | { type: 'ADD_PLAYER' }
  | { type: 'REMOVE_PLAYER'; playerId: string }
  | { type: 'SET_PLAYER_NAME'; playerId: string; name: string }
  | { type: 'SET_PLAYER_SIDE'; playerId: string; side: Side }
  | { type: 'SET_UNIT_COUNT'; playerId: string; unit: UnitKind; count: number }
  | { type: 'SET_STRONGHOLD'; playerId: string; value: boolean }
  | { type: 'SET_FORTIFIED_CITY'; playerId: string; value: boolean }
  | { type: 'ADD_NOBLE'; playerId: string }
  | { type: 'REMOVE_NOBLE'; playerId: string; nobleId: string }
  | { type: 'UPDATE_NOBLE'; playerId: string; nobleId: string; patch: Partial<Noble> }
  | { type: 'START_BATTLE' }

let nextId = 1
function makeId(prefix: string): string {
  return `${prefix}-${nextId++}`
}

function createPlayer(side: Side, index: number): PlayerArmy {
  return {
    id: makeId('player'),
    name: `Jugador ${index}`,
    side,
    units: {},
    nobles: [],
    inStronghold: false,
    inFortifiedCity: false,
  }
}

function createNoble(): Noble {
  return {
    id: makeId('noble'),
    name: 'Noble',
    gender: 'male',
    isTitledLord: false,
    titles: 0,
    status: 'active',
  }
}

export function createInitialBattleState(): BattleState {
  return {
    phase: 'setup',
    players: [createPlayer('A', 1), createPlayer('B', 2)],
  }
}

function updatePlayer(
  players: PlayerArmy[],
  playerId: string,
  update: (player: PlayerArmy) => PlayerArmy,
): PlayerArmy[] {
  return players.map((player) => (player.id === playerId ? update(player) : player))
}

export function battleReducer(state: BattleState, action: BattleAction): BattleState {
  switch (action.type) {
    case 'ADD_PLAYER': {
      if (state.players.length >= 4) return state
      const sideACount = state.players.filter((p) => p.side === 'A').length
      const sideBCount = state.players.filter((p) => p.side === 'B').length
      const side: Side = sideACount <= sideBCount ? 'A' : 'B'
      const newPlayer = createPlayer(side, state.players.length + 1)
      return { ...state, players: [...state.players, newPlayer] }
    }

    case 'REMOVE_PLAYER': {
      if (state.players.length <= 2) return state
      return { ...state, players: state.players.filter((p) => p.id !== action.playerId) }
    }

    case 'SET_PLAYER_NAME': {
      return {
        ...state,
        players: updatePlayer(state.players, action.playerId, (p) => ({
          ...p,
          name: action.name,
        })),
      }
    }

    case 'SET_PLAYER_SIDE': {
      return {
        ...state,
        players: updatePlayer(state.players, action.playerId, (p) => ({
          ...p,
          side: action.side,
        })),
      }
    }

    case 'SET_UNIT_COUNT': {
      return {
        ...state,
        players: updatePlayer(state.players, action.playerId, (p) => ({
          ...p,
          units: { ...p.units, [action.unit]: Math.max(0, action.count) },
        })),
      }
    }

    case 'SET_STRONGHOLD': {
      return {
        ...state,
        players: updatePlayer(state.players, action.playerId, (p) => ({
          ...p,
          inStronghold: action.value,
          inFortifiedCity: action.value ? false : p.inFortifiedCity,
        })),
      }
    }

    case 'SET_FORTIFIED_CITY': {
      return {
        ...state,
        players: updatePlayer(state.players, action.playerId, (p) => ({
          ...p,
          inFortifiedCity: action.value,
          inStronghold: action.value ? false : p.inStronghold,
        })),
      }
    }

    case 'ADD_NOBLE': {
      return {
        ...state,
        players: updatePlayer(state.players, action.playerId, (p) => ({
          ...p,
          nobles: [...p.nobles, createNoble()],
        })),
      }
    }

    case 'REMOVE_NOBLE': {
      return {
        ...state,
        players: updatePlayer(state.players, action.playerId, (p) => ({
          ...p,
          nobles: p.nobles.filter((n) => n.id !== action.nobleId),
        })),
      }
    }

    case 'UPDATE_NOBLE': {
      return {
        ...state,
        players: updatePlayer(state.players, action.playerId, (p) => ({
          ...p,
          nobles: p.nobles.map((n) =>
            n.id === action.nobleId ? { ...n, ...action.patch } : n,
          ),
        })),
      }
    }

    case 'START_BATTLE': {
      return { ...state, phase: 'projectiles-trebuchet' }
    }

    default:
      return state
  }
}
