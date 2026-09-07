import type { UnitKind } from '../../rules/types'
import { UNIT_LABELS } from '../../rules/types'
import { UNIT_IMAGES } from '../../rules/unitImages'

interface Props {
  kind: UnitKind
  total: number
  selected: number
  disabled?: boolean
  onChange: (count: number) => void
}

// Fichas seleccionables de un tipo de unidad; el padre las combina en una
// única cuadrícula junto con las de los demás tipos.
export function UnitLossPicker({ kind, total, selected, disabled, onChange }: Props) {
  const src = UNIT_IMAGES[kind]

  return (
    <>
      {Array.from({ length: total }).map((_, index) => {
        const dead = index < selected
        return (
          <button
            key={index}
            type="button"
            disabled={disabled}
            aria-pressed={dead}
            aria-label={`${UNIT_LABELS[kind]} ${index + 1}${dead ? ' (baja)' : ''}`}
            className={`unit-tile${dead ? ' unit-tile--dead' : ''}`}
            onClick={() => onChange(dead ? index : index + 1)}
          >
            {src ? <img src={src} alt="" /> : <span>{UNIT_LABELS[kind]}</span>}
          </button>
        )
      })}
    </>
  )
}
