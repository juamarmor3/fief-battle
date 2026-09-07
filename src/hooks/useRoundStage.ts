import { useState } from 'react'
import type { Side } from '../rules/types'
import type { AppliedLoss, LossTask } from '../components/phases/LossPanels'
import { useScrollIntoView } from './useScrollIntoView'

export type RoundStage = 'rolling' | 'rolled' | 'final'

// Estado común a cualquier sub-fase con el flujo "tirada → resultados →
// bajas → resumen final" (7.1: Proyectiles y Melé comparten esta forma).
// Úsalo en vez de declarar stage/tasks/applied/resultText a mano en cada
// sub-fase nueva.
export function useRoundStage() {
  const [stage, setStage] = useState<RoundStage>('rolling')
  const [tasks, setTasks] = useState<LossTask[]>([])
  const [applied, setApplied] = useState<Partial<Record<Side, AppliedLoss>>>({})
  const [resultText, setResultText] = useState<{ a: string; b: string }>({ a: '', b: '' })
  const resultsRef = useScrollIntoView<HTMLDivElement>(stage === 'rolled')

  function recordApplied(side: Side, result: AppliedLoss) {
    setApplied((prev) => ({ ...prev, [side]: result }))
  }

  return { stage, setStage, tasks, setTasks, applied, recordApplied, resultText, setResultText, resultsRef }
}
