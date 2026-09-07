interface Props {
  current: number
  required: number
}

// Esquina superior derecha de la caja: la cifra de bajas actúa como una
// letra capital de manuscrito medieval (grande, en gris) hasta que se
// alcanza el mínimo exigido (la cifra objetivo, en el color del jugador).
export function ProgressBadge({ current, required }: Props) {
  const complete = current >= required
  return (
    <div className={`progress-badge ${complete ? 'progress-badge--complete' : ''}`}>
      <span className="progress-badge__current">{current}</span>
      <span className="progress-badge__slash" aria-hidden="true">
        /
      </span>
      <span className="progress-badge__required">{required}</span>
    </div>
  )
}
