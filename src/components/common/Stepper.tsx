interface Props {
  value: number
  min?: number
  max?: number
  disabled?: boolean
  onChange: (value: number) => void
}

export function Stepper({ value, min = 0, max, disabled, onChange }: Props) {
  function decrement() {
    onChange(Math.max(min, value - 1))
  }

  function increment() {
    const next = value + 1
    onChange(max !== undefined ? Math.min(max, next) : next)
  }

  return (
    <div className="stepper">
      <button
        type="button"
        className="stepper__button"
        onClick={decrement}
        disabled={disabled || value <= min}
        aria-label="Disminuir"
      >
        −
      </button>
      <span className="stepper__value">{value}</span>
      <button
        type="button"
        className="stepper__button"
        onClick={increment}
        disabled={disabled || (max !== undefined && value >= max)}
        aria-label="Aumentar"
      >
        +
      </button>
    </div>
  )
}
