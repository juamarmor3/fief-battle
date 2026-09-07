import { DIE_FACE_LABELS, DIE_FACE_VALUES } from '../../rules/dice'

interface Props {
  label: string
  count: number
  values: number[]
  onChange: (values: number[]) => void
  disabled?: boolean
}

export function DiceInput({ label, count, values, onChange, disabled }: Props) {
  function setDie(index: number, value: number) {
    const next = [...values]
    next[index] = value
    onChange(next)
  }

  return (
    <div>
      <p>
        {label}: tira {count} dado{count > 1 ? 's' : ''}
      </p>
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        {Array.from({ length: count }).map((_, index) => (
          <label key={index}>
            Dado {index + 1}
            <select
              value={values[index] ?? 0}
              disabled={disabled}
              onChange={(e) => setDie(index, Number(e.target.value))}
            >
              {DIE_FACE_VALUES.map((face) => (
                <option key={face} value={face}>
                  {DIE_FACE_LABELS[face]}
                </option>
              ))}
            </select>
          </label>
        ))}
      </div>
    </div>
  )
}
