import { useBattle } from '../../context/battleStore'
import { sideLabel } from '../../rules/sides'

// Fase 9 (pendiente): de momento solo muestra el desenlace calculado en Fin
// de Ronda (7.8). Bajas totales y consecuencias de Asedio/Cautivos/Pillaje
// se añadirán cuando se construyan esas fases.
export function SummaryPhase() {
  const { state } = useBattle()
  const outcome = state.outcome

  return (
    <div className="card">
      <h3>Resultado</h3>
      {outcome ? (
        <>
          {outcome.winnerSide && (
            <p className="loss-line">{sideLabel(outcome.winnerSide)} vence la batalla.</p>
          )}
          <p>{outcome.description}</p>
        </>
      ) : (
        <p>Sin resultado registrado.</p>
      )}
    </div>
  )
}
