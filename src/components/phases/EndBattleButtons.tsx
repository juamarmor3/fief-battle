import type { BattleOutcome, Side } from '../../rules/types'
import { otherSide, sideLabel } from '../../rules/sides'

interface EndBattleButtonsProps {
  side: Side
  opponentHasNobles: boolean
  onEnd: (outcome: BattleOutcome, surrenderSide?: Side) => void
}

// Rendición / Retirada / Asesinato (7.8), compartidos entre Fin de Ronda y
// Asedio: en ambas pantallas cualquier bando puede optar por terminar la
// Batalla de estas formas.
export function EndBattleButtons({ side, opponentHasNobles, onEnd }: EndBattleButtonsProps) {
  const opponent = otherSide(side)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-start' }}>
      <button
        type="button"
        onClick={() =>
          onEnd(
            {
              type: 'surrender',
              winnerSide: opponent,
              description: `${sideLabel(side)} se rinde. Sus tropas se retiran y sus Nobles activos son capturados por ${sideLabel(opponent)}.`,
            },
            side,
          )
        }
      >
        Rendición
      </button>
      <button
        type="button"
        onClick={() =>
          onEnd({
            type: 'withdraw',
            description: `${sideLabel(side)} se retira de la batalla junto con sus tropas y Nobles, a salvo. Sin vencedor declarado.`,
          })
        }
      >
        Retirada
      </button>
      {!opponentHasNobles && (
        <button
          type="button"
          onClick={() =>
            onEnd({
              type: 'assassination',
              description: `${sideLabel(opponent)} se queda sin Nobles activos. ${sideLabel(side)} decide poner fin a la batalla en solitario.`,
            })
          }
        >
          Asesinato ({sideLabel(opponent)} sin líder)
        </button>
      )}
    </div>
  )
}
