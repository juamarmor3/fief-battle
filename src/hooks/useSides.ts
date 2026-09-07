import { useBattle } from '../context/battleStore'
import { playersOnSide } from '../rules/sides'

// Deriva los dos bandos (A/B) del estado global. Usar siempre esto en vez
// de filtrar `state.players` a mano, para que todas las fases lean los
// bandos de la misma forma.
export function useSides() {
  const { state } = useBattle()
  const sideA = playersOnSide(state.players, 'A')
  const sideB = playersOnSide(state.players, 'B')
  return { sideA, sideB }
}
