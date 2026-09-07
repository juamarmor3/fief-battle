import type { RefObject } from 'react'
import type { PlayerArmy, Side } from '../../rules/types'
import { sideColorClass } from '../../rules/sides'
import type { RoundStage } from '../../hooks/useRoundStage'
import { LossPanels, type AppliedLoss, type LossTask } from './LossPanels'
import { FinalSummary } from './FinalSummary'

interface Props {
  sideA: PlayerArmy[]
  sideB: PlayerArmy[]
  stage: RoundStage
  setStage: (stage: RoundStage) => void
  resultText: { a: string; b: string }
  resultsRef: RefObject<HTMLDivElement | null>
  tasks: LossTask[]
  applied: Partial<Record<Side, AppliedLoss>>
  recordApplied: (side: Side, result: AppliedLoss) => void
  onComplete: () => void
  nextLabel?: string
}

// Segunda mitad de cualquier sub-fase de envite: "Resultado del envite" →
// bajas simultáneas (o "Continuar" si nadie las recibió) → resumen final.
// Combínalo con `useRoundStage` para no repetir este bloque en cada fase
// nueva (Melé, Sally...) como ocurría en Proyectiles antes de extraerlo.
export function RoundResultsAndLosses({
  sideA,
  sideB,
  stage,
  setStage,
  resultText,
  resultsRef,
  tasks,
  applied,
  recordApplied,
  onComplete,
  nextLabel,
}: Props) {
  if (stage === 'rolling') return null

  return (
    <>
      <div ref={resultsRef} className="card">
        <h4>Resultado del envite</h4>
        <div className="player-columns">
          <div className={`card player-column ${sideColorClass(sideA)}`}>
            <p className="side-tag">Bando A</p>
            <p>{resultText.a}</p>
          </div>
          <div className={`card player-column ${sideColorClass(sideB)}`}>
            <p className="side-tag">Bando B</p>
            <p>{resultText.b}</p>
          </div>
        </div>
      </div>

      {stage === 'rolled' && tasks.length > 0 && (
        <LossPanels
          queue={tasks}
          sideA={sideA}
          sideB={sideB}
          onApplied={recordApplied}
          onDone={() => setStage('final')}
        />
      )}
      {stage === 'rolled' && tasks.length === 0 && (
        <button type="button" onClick={() => setStage('final')}>
          Continuar
        </button>
      )}

      {stage === 'final' && (
        <FinalSummary
          sideA={sideA}
          sideB={sideB}
          tasks={tasks}
          applied={applied}
          onNext={onComplete}
          nextLabel={nextLabel}
        />
      )}
    </>
  )
}
