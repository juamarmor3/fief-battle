import { useReducer, type ReactNode } from 'react'
import { battleReducer, createInitialBattleState } from '../rules/battleReducer'
import { BattleContext } from './battleStore'

export function BattleProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(battleReducer, undefined, createInitialBattleState)
  return (
    <BattleContext.Provider value={{ state, dispatch }}>{children}</BattleContext.Provider>
  )
}
