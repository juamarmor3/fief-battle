interface Step {
  key: string
  label: string
}

interface Props {
  steps: Step[]
  currentKey: string
}

// Breadcrumb secundario para las sub-fases dentro de una fase principal
// (p.ej. Trebuchets → Bombardas → Arqueros dentro de Proyectiles).
export function SubPhaseTracker({ steps, currentKey }: Props) {
  const currentIndex = steps.findIndex((step) => step.key === currentKey)

  return (
    <nav className="sub-phase-tracker" aria-label="Progreso dentro de la fase">
      <ol>
        {steps.map((step, index) => {
          const status = index < currentIndex ? 'done' : index === currentIndex ? 'current' : 'upcoming'
          return (
            <li key={step.key} className="sub-phase-step">
              <span className={`sub-phase-step__pill sub-phase-step__pill--${status}`}>
                {step.label}
              </span>
              {index < steps.length - 1 && <span className="sub-phase-step__arrow">→</span>}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
