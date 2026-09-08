import { useBattle } from '../../context/battleStore'
import type { BattleOutcome, Side } from '../../rules/types'
import { otherSide, sideColorClass, sideLabel } from '../../rules/sides'
import { pooledTroopCounts, pooledActiveNobles, totalTroopCount } from '../../rules/losses'
import { useSides } from '../../hooks/useSides'

const DEADLOCK_STREAK = 3

// Fin de Ronda / Fin de Batalla (7.8). Detecta en automático los desenlaces
// que no dependen de una decisión (Victoria, Aniquilación, Estancamiento) y
// ofrece los que sí la requieren (Rendición, Retirada, Asesinato, Tregua,
// Continuar). Retirada y Asesinato se simplifican respecto al reglamento:
// sin Carta Passage ni requisito de Fortaleza (la app no modela cartas ni
// mapa), ver PLANIFICACION.md.
export function RoundOutcomePhase() {
  const { state, dispatch } = useBattle()
  const { sideA, sideB } = useSides()

  const troopsA = totalTroopCount(pooledTroopCounts(sideA))
  const troopsB = totalTroopCount(pooledTroopCounts(sideB))
  const noblesA = pooledActiveNobles(sideA)
  const noblesB = pooledActiveNobles(sideB)
  const wipedA = troopsA === 0 && noblesA.length === 0
  const wipedB = troopsB === 0 && noblesB.length === 0

  let autoOutcome: BattleOutcome | null = null
  if (wipedA && wipedB) {
    autoOutcome = {
      type: 'victory',
      description: 'Ambos bandos quedan sin tropas ni Nobles activos. Batalla sin vencedor.',
    }
  } else if (wipedA) {
    autoOutcome = {
      type: 'victory',
      winnerSide: 'B',
      description: `${sideLabel('B')} gana la batalla: ${sideLabel('A')} se queda sin tropas ni Nobles activos.`,
    }
  } else if (wipedB) {
    autoOutcome = {
      type: 'victory',
      winnerSide: 'A',
      description: `${sideLabel('A')} gana la batalla: ${sideLabel('B')} se queda sin tropas ni Nobles activos.`,
    }
  } else if (troopsA === 0 && troopsB === 0) {
    autoOutcome = {
      type: 'annihilation',
      description: 'Solo quedan Nobles en ambos bandos. La batalla termina sin cambios de control.',
    }
  } else if (state.noLossStreak >= DEADLOCK_STREAK) {
    autoOutcome = {
      type: 'deadlock',
      description: `${DEADLOCK_STREAK} rondas seguidas sin bajas. La batalla termina en estancamiento; el control no cambia.`,
    }
  }

  function endBattle(outcome: BattleOutcome, surrenderSide?: Side) {
    dispatch({ type: 'END_ROUND', decision: 'end', outcome, surrenderSide })
  }

  function continueBattle() {
    dispatch({ type: 'END_ROUND', decision: 'continue' })
  }

  if (autoOutcome) {
    const outcome = autoOutcome
    return (
      <div className="card">
        <h3>Fin de Ronda</h3>
        <p className="loss-line">{outcome.description}</p>
        <button type="button" onClick={() => endBattle(outcome)}>
          Ver resultado
        </button>
      </div>
    )
  }

  const assassinableA = noblesB.length === 0
  const assassinableB = noblesA.length === 0

  return (
    <div className="card">
      <h3>Fin de Ronda</h3>
      <p>Ronda {state.roundNumber} completada. ¿Qué decide cada bando?</p>
      <div className="player-columns">
        {(['A', 'B'] as Side[]).map((side) => {
          const players = side === 'A' ? sideA : sideB
          const troops = side === 'A' ? troopsA : troopsB
          const nobles = side === 'A' ? noblesA : noblesB
          const canAssassinate = side === 'A' ? assassinableA : assassinableB
          const opponent = otherSide(side)
          return (
            <div key={side} className={`card player-column ${sideColorClass(players)}`}>
              <p className="side-tag">Bando {side}</p>
              <p>
                {troops} tropa(s) · {nobles.length} Noble(s) activo(s)
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-start' }}>
                <button
                  type="button"
                  onClick={() =>
                    endBattle(
                      {
                        type: 'surrender',
                        winnerSide: opponent,
                        description: `${sideLabel(side)} se rinde. Sus tropas se retiran y sus Nobles activos son capturados por ${sideLabel(opponent)}.`,
                      },
                      side,
                    )
                  }
                >
                  Rendición
                </button>
                <button
                  type="button"
                  onClick={() =>
                    endBattle({
                      type: 'withdraw',
                      description: `${sideLabel(side)} se retira de la batalla junto con sus tropas y Nobles, a salvo. Sin vencedor declarado.`,
                    })
                  }
                >
                  Retirada
                </button>
                {canAssassinate && (
                  <button
                    type="button"
                    onClick={() =>
                      endBattle({
                        type: 'assassination',
                        description: `${sideLabel(opponent)} se queda sin Nobles activos. ${sideLabel(side)} decide poner fin a la batalla en solitario.`,
                      })
                    }
                  >
                    Asesinato ({sideLabel(opponent)} sin líder)
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
      <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
        <button type="button" onClick={continueBattle}>
          Continuar a la siguiente ronda
        </button>
        <button
          type="button"
          onClick={() =>
            endBattle({
              type: 'truce',
              description: 'Ambos bandos declaran una Tregua. Cada uno conserva sus tropas y Nobles; el control no cambia.',
            })
          }
        >
          Tregua
        </button>
      </div>
    </div>
  )
}
