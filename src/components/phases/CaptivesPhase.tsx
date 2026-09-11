import { useBattle } from '../../context/battleStore'
import type { Side } from '../../rules/types'
import { sideColorClass } from '../../rules/sides'
import { capturedNobles, captorName, ransomValue } from '../../rules/captives'
import { useSides } from '../../hooks/useSides'

// Cautivos y Rescate (7.6-7.7), simplificado (ver PLANIFICACION.md): sin
// Fase de Compra ni Chelines acumulados, el Rescate se resuelve aquí mismo
// como una decisión manual por Noble cautivo, sin negociar el importe (se
// puede pagar el Rescate completo o dejarlo cautivo).
export function CaptivesPhase() {
  const { state, dispatch } = useBattle()
  const { sideA, sideB } = useSides()

  function release(playerId: string, nobleId: string) {
    dispatch({ type: 'RELEASE_CAPTIVE', playerId, nobleId })
  }

  function continueToSummary() {
    dispatch({ type: 'SET_PHASE', phase: 'summary' })
  }

  return (
    <div className="card">
      <h3>Cautivos y Rescate</h3>
      <p>Cada bando puede pagar el Rescate íntegro de sus Nobles cautivos para liberarlos.</p>
      <div className="player-columns">
        {(['A', 'B'] as Side[]).map((side) => {
          const players = side === 'A' ? sideA : sideB
          const entries = capturedNobles(players)
          return (
            <div key={side} className={`card player-column ${sideColorClass(players)}`}>
              <p className="side-tag">Bando {side}</p>
              {entries.length === 0 ? (
                <p>Sin Nobles cautivos.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {entries.map(({ player, noble }) => (
                    <div key={noble.id}>
                      <p className="loss-line">
                        {noble.name} · Rescate {ransomValue(noble)} chelines
                      </p>
                      <p>Cautivo de {captorName(state.players, noble.captorPlayerId)}</p>
                      <button type="button" onClick={() => release(player.id, noble.id)}>
                        Pagar Rescate y liberar
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
      <button type="button" onClick={continueToSummary} style={{ marginTop: '1rem' }}>
        Continuar al Resultado
      </button>
    </div>
  )
}
