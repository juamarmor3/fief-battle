import { useBattle } from '../../context/battleStore'
import type { BattleOutcome, Side } from '../../rules/types'
import { sideColorClass, sideInFortifiedCity, sideInStronghold } from '../../rules/sides'
import { computeAutoBattleOutcome, computeSideStatus } from '../../rules/battleStatus'
import { useSides } from '../../hooks/useSides'
import { EndBattleButtons } from './EndBattleButtons'

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

  const statusA = computeSideStatus(sideA)
  const statusB = computeSideStatus(sideB)
  const troopsA = statusA.troops
  const troopsB = statusB.troops
  const noblesA = statusA.nobles
  const noblesB = statusB.nobles

  let autoOutcome: BattleOutcome | null = computeAutoBattleOutcome(sideA, sideB)
  if (!autoOutcome && state.noLossStreak >= DEADLOCK_STREAK) {
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

  function declareSiege(besiegedSide: Side) {
    dispatch({ type: 'DECLARE_SIEGE', besiegedSide })
  }

  return (
    <div className="card">
      <h3>Fin de Ronda</h3>
      <p>Ronda {state.roundNumber} completada. ¿Qué decide cada bando?</p>
      <div className="player-columns">
        {(['A', 'B'] as Side[]).map((side) => {
          const players = side === 'A' ? sideA : sideB
          const opponentPlayers = side === 'A' ? sideB : sideA
          const troops = side === 'A' ? troopsA : troopsB
          const nobles = side === 'A' ? noblesA : noblesB
          const canAssassinate = side === 'A' ? assassinableA : assassinableB
          const opponentFortified =
            sideInStronghold(opponentPlayers) || sideInFortifiedCity(opponentPlayers)
          return (
            <div key={side} className={`card player-column ${sideColorClass(players)}`}>
              <p className="side-tag">Bando {side}</p>
              <p>
                {troops} tropa(s) · {nobles.length} Noble(s) activo(s)
              </p>
              <EndBattleButtons side={side} opponentHasNobles={!canAssassinate} onEnd={endBattle} />
              {opponentFortified && (
                <button type="button" onClick={() => declareSiege(side === 'A' ? 'B' : 'A')} style={{ marginTop: '0.5rem' }}>
                  Declarar Asedio
                </button>
              )}
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
