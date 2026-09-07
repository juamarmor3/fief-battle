import { useBattle } from '../../context/battleStore'
import type { BattlePhase } from '../../rules/types'

interface Stage {
  key: string
  label: string
  phases: BattlePhase[]
}

const STAGES: Stage[] = [
  { key: 'setup', label: 'Configuración', phases: ['setup'] },
  {
    key: 'projectiles',
    label: 'Proyectiles',
    phases: ['projectiles-trebuchet', 'projectiles-bombard', 'projectiles-archer'],
  },
  { key: 'melee', label: 'Melé', phases: ['melee-roll', 'melee-losses'] },
  { key: 'outcome', label: 'Fin de Ronda', phases: ['round-outcome', 'siege'] },
  { key: 'captives', label: 'Cautivos', phases: ['captives-ransom'] },
  { key: 'pillage', label: 'Pillaje', phases: ['pillage'] },
  { key: 'summary', label: 'Resultado', phases: ['summary'] },
]

export function PhaseTracker() {
  const { state } = useBattle()
  const currentIndex = STAGES.findIndex((stage) => stage.phases.includes(state.phase))

  return (
    <nav className="phase-tracker" aria-label="Progreso de la batalla">
      <ol>
        {STAGES.map((stage, index) => {
          const status = index < currentIndex ? 'done' : index === currentIndex ? 'current' : 'upcoming'
          return (
            <li key={stage.key} className={`phase-step phase-step--${status}`}>
              <span className="phase-step__index">{index + 1}</span>
              <span className="phase-step__label">{stage.label}</span>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
