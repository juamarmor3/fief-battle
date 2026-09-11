import type { BattleOutcome, Noble, PlayerArmy } from './types'
import { pooledTroopCounts, pooledActiveNobles, totalTroopCount } from './losses'
import { sideLabel } from './sides'

export interface SideStatus {
  troops: number
  nobles: Noble[]
  wiped: boolean
}

export function computeSideStatus(players: PlayerArmy[]): SideStatus {
  const troops = totalTroopCount(pooledTroopCounts(players))
  const nobles = pooledActiveNobles(players)
  return { troops, nobles, wiped: troops === 0 && nobles.length === 0 }
}

// Desenlaces automáticos de Fin de Batalla (7.8) que no dependen de una
// decisión: Victoria (un bando o ambos quedan sin tropas ni Nobles
// activos) y Aniquilación (solo quedan Nobles en ambos bandos). El
// Estancamiento depende de `state.noLossStreak`, que es un concepto propio
// de la ronda normal (no aplica a una Salida durante un Asedio), así que
// se resuelve aparte en `RoundOutcomePhase`.
export function computeAutoBattleOutcome(
  sideA: PlayerArmy[],
  sideB: PlayerArmy[],
): BattleOutcome | null {
  const statusA = computeSideStatus(sideA)
  const statusB = computeSideStatus(sideB)

  if (statusA.wiped && statusB.wiped) {
    return {
      type: 'victory',
      description: 'Ambos bandos quedan sin tropas ni Nobles activos. Batalla sin vencedor.',
    }
  }
  if (statusA.wiped) {
    return {
      type: 'victory',
      winnerSide: 'B',
      description: `${sideLabel('B')} gana la batalla: ${sideLabel('A')} se queda sin tropas ni Nobles activos.`,
    }
  }
  if (statusB.wiped) {
    return {
      type: 'victory',
      winnerSide: 'A',
      description: `${sideLabel('A')} gana la batalla: ${sideLabel('B')} se queda sin tropas ni Nobles activos.`,
    }
  }
  if (statusA.troops === 0 && statusB.troops === 0) {
    return {
      type: 'annihilation',
      description: 'Solo quedan Nobles en ambos bandos. La batalla termina sin cambios de control.',
    }
  }
  return null
}
