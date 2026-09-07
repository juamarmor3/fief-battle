import type { PlayerArmy, Side } from '../../rules/types'
import { UNIT_LABELS } from '../../rules/types'
import { TROOP_KINDS } from '../../rules/losses'
import { sideColorClass } from '../../rules/sides'
import { useScrollIntoView } from '../../hooks/useScrollIntoView'
import type { AppliedLoss, LossTask } from './LossPanels'

function removalSummaryLines(players: PlayerArmy[], removals: AppliedLoss['removals']): string[] {
  const lines: string[] = []
  for (const removal of removals) {
    const player = players.find((p) => p.id === removal.playerId)
    if (!player) continue
    for (const kind of TROOP_KINDS) {
      const count = removal.units[kind] ?? 0
      if (count > 0) lines.push(`${player.name}: −${count} ${UNIT_LABELS[kind]}`)
    }
  }
  return lines
}

function nobleName(players: PlayerArmy[], nobleId: string): string {
  for (const player of players) {
    const noble = player.nobles.find((n) => n.id === nobleId)
    if (noble) return noble.name
  }
  return nobleId
}

interface Props {
  sideA: PlayerArmy[]
  sideB: PlayerArmy[]
  tasks: LossTask[]
  applied: Partial<Record<Side, AppliedLoss>>
  onNext: () => void
  nextLabel?: string
}

// Resumen final de un envite (piezas retiradas por bando), pieza reutilizable
// para cerrar cualquier sub-fase con bajas antes de pasar a la siguiente.
export function FinalSummary({ sideA, sideB, tasks, applied, onNext, nextLabel = 'Siguiente' }: Props) {
  const finalRef = useScrollIntoView<HTMLDivElement>(true)
  const allPlayers = [...sideA, ...sideB]

  return (
    <div ref={finalRef} className="card">
      <h4>Bajas</h4>
      {tasks.length === 0 && <p>Sin bajas.</p>}
      <div className="player-columns">
        {(['A', 'B'] as Side[]).map((side) => {
          const players = side === 'A' ? sideA : sideB
          const task = tasks.find((t) => t.side === side)
          const result = task ? applied[side] : undefined
          return (
            <div key={side} className={`card player-column ${sideColorClass(players)}`}>
              <p className="side-tag">Bando {side}</p>
              {!task && <p>Sin bajas.</p>}
              {task && !result && <p>Pendiente.</p>}
              {result && (
                <>
                  {removalSummaryLines(players, result.removals).map((line) => (
                    <p key={line} className="loss-line">
                      {line}
                    </p>
                  ))}
                  {result.nobleSlainIds.map((id) => (
                    <p key={id} className="loss-line">
                      {nobleName(allPlayers, id)}: asesinado
                    </p>
                  ))}
                  {result.nobleCapturedIds.map((id) => (
                    <p key={id} className="loss-line">
                      {nobleName(allPlayers, id)}: capturado
                    </p>
                  ))}
                  {removalSummaryLines(players, result.removals).length === 0 &&
                    result.nobleSlainIds.length === 0 &&
                    result.nobleCapturedIds.length === 0 && <p>Sin bajas.</p>}
                </>
              )}
            </div>
          )
        })}
      </div>
      <button type="button" onClick={onNext}>
        {nextLabel}
      </button>
    </div>
  )
}
