import { useBattle } from '../../context/battleStore'
import type { BattleOutcome, Side } from '../../rules/types'
import { sideColorClass } from '../../rules/sides'
import { computeAutoBattleOutcome, computeSideStatus } from '../../rules/battleStatus'
import { useSides } from '../../hooks/useSides'
import { EndBattleButtons } from './EndBattleButtons'

// Asedio y Sally (7.9), simplificado (ver PLANIFICACION.md): sin
// Stockpile/Shillings/Fase de Compra, el Asedio se declara y se levanta al
// instante. El sitiado puede intentar una Salida (una ronda de Melé sin
// Proyectiles, MeleePhase vuelve aquí al terminarla); el sitiador puede
// levantar el Asedio para retomar rondas normales. Ambos bandos conservan
// las mismas salidas de Fin de Batalla que en Fin de Ronda, más un
// desenlace nuevo para cerrar la sesión si el Asedio sigue sin resolverse.
export function SiegePhase() {
  const { state, dispatch } = useBattle()
  const { sideA, sideB } = useSides()

  const besiegedSide = state.siege?.besiegedSide ?? 'A'

  const statusA = computeSideStatus(sideA)
  const statusB = computeSideStatus(sideB)
  const noblesA = statusA.nobles
  const noblesB = statusB.nobles
  const assassinableA = noblesB.length === 0
  const assassinableB = noblesA.length === 0

  const autoOutcome: BattleOutcome | null = computeAutoBattleOutcome(sideA, sideB)

  function endBattle(outcome: BattleOutcome, surrenderSide?: Side) {
    dispatch({ type: 'END_ROUND', decision: 'end', outcome, surrenderSide })
  }

  if (autoOutcome) {
    const outcome = autoOutcome
    return (
      <div className="card">
        <h3>Asedio</h3>
        <p className="loss-line">{outcome.description}</p>
        <button type="button" onClick={() => endBattle(outcome)}>
          Ver resultado
        </button>
      </div>
    )
  }

  function sally() {
    dispatch({ type: 'SET_PHASE', phase: 'melee-roll' })
  }

  function liftSiege() {
    dispatch({ type: 'LIFT_SIEGE' })
  }

  return (
    <div className="card">
      <h3>Asedio</h3>
      <p>La guarnición sitiada puede intentar una Salida; el sitiador puede levantar el Asedio.</p>
      <div className="player-columns">
        {(['A', 'B'] as Side[]).map((side) => {
          const players = side === 'A' ? sideA : sideB
          const troops = side === 'A' ? statusA.troops : statusB.troops
          const nobles = side === 'A' ? noblesA : noblesB
          const canAssassinate = side === 'A' ? assassinableA : assassinableB
          const isBesieged = side === besiegedSide
          return (
            <div key={side} className={`card player-column ${sideColorClass(players)}`}>
              <p className="side-tag">Bando {side} · {isBesieged ? 'Sitiado' : 'Sitiador'}</p>
              <p>
                {troops} tropa(s) · {nobles.length} Noble(s) activo(s)
              </p>
              {isBesieged ? (
                <button type="button" onClick={sally}>
                  Hacer una Salida (Sally)
                </button>
              ) : (
                <button type="button" onClick={liftSiege}>
                  Levantar el Asedio
                </button>
              )}
              <div style={{ marginTop: '0.5rem' }}>
                <EndBattleButtons side={side} opponentHasNobles={!canAssassinate} onEnd={endBattle} />
              </div>
            </div>
          )
        })}
      </div>
      <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
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
        <button
          type="button"
          onClick={() =>
            endBattle({
              type: 'siege',
              description: 'El Asedio continúa sin resolverse; queda fuera de esta sesión de Batalla.',
            })
          }
        >
          Terminar sesión (Asedio sin resolver)
        </button>
      </div>
    </div>
  )
}
