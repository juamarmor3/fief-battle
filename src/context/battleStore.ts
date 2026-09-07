import { createContext, useContext, type Dispatch } from 'react'
import type { BattleAction, BattleState } from '../rules/battleReducer'

export interface BattleContextValue {
  state: BattleState
  dispatch: Dispatch<BattleAction>
}

export const BattleContext = createContext<BattleContextValue | null>(null)

export function useBattle(): BattleContextValue {
  const context = useContext(BattleContext)
  if (!context) {
    throw new Error('useBattle must be used within a BattleProvider')
  }
  return context
}
