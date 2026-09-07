import { useEffect, useState } from 'react'
import { useBattle } from '../../context/battleStore'
import type { PlayerArmy, Side, UnitCounts } from '../../rules/types'
import { otherSide, sideColorClass } from '../../rules/sides'
import { LossSelector } from './LossSelector'

export interface LossTask {
  side: Side
  hits: number
}

export interface AppliedLoss {
  removals: { playerId: string; units: UnitCounts }[]
  nobleSlainIds: string[]
  nobleCapturedIds: string[]
}

interface Props {
  queue: LossTask[]
  sideA: PlayerArmy[]
  sideB: PlayerArmy[]
  onApplied: (side: Side, applied: AppliedLoss) => void
  onDone: () => void
}

// Pieza reutilizable para CUALQUIER fase que reparta bajas simultáneas entre
// bandos (7.2/7.3: "losses are taken by both sides simultaneously"): cada
// bando ve su columna a la vez (o una de espera si no le tocan bajas) y solo
// se llama a onDone cuando ambos han confirmado. Úsala en Melé, Sally, etc.
// en vez de reimplementar este flujo.
export function LossPanels({ queue, sideA, sideB, onApplied, onDone }: Props) {
  const { dispatch } = useBattle()
  const [confirmed, setConfirmed] = useState<boolean[]>(() => queue.map(() => false))
  const allConfirmed = confirmed.every(Boolean)

  useEffect(() => {
    if (allConfirmed) onDone()
  }, [allConfirmed, onDone])

  function handleConfirm(
    taskIndex: number,
    removals: { playerId: string; units: UnitCounts }[],
    nobleSlainIds: string[],
    nobleCapturedIds: string[],
  ) {
    const task = queue[taskIndex]
    const attackerSide = otherSide(task.side)
    const attackerPlayers = attackerSide === 'A' ? sideA : sideB
    dispatch({
      type: 'APPLY_LOSSES',
      removals,
      nobleSlainIds,
      nobleCapturedIds,
      captorPlayerId: attackerPlayers[0]?.id,
    })
    onApplied(task.side, { removals, nobleSlainIds, nobleCapturedIds })
    setConfirmed((prev) => prev.map((c, i) => (i === taskIndex ? true : c)))
  }

  function renderSide(side: Side) {
    const players = side === 'A' ? sideA : sideB
    const taskIndex = queue.findIndex((t) => t.side === side)

    if (taskIndex === -1) {
      return (
        <div key={side} className={`card player-column ${sideColorClass(players)}`}>
          <p className="side-tag">Bando {side}</p>
          <p>Sin bajas.</p>
        </div>
      )
    }

    const task = queue[taskIndex]
    if (confirmed[taskIndex]) {
      return (
        <div key={side} className={`card player-column ${sideColorClass(players)}`}>
          <p className="loss-line">Bajas aplicadas.</p>
        </div>
      )
    }

    return (
      <LossSelector
        key={side}
        title={`De Bando ${otherSide(side)}`}
        players={players}
        hitsAvailable={task.hits}
        colorClass={`player-column ${sideColorClass(players)}`}
        onConfirm={(removals, nobleSlainIds, nobleCapturedIds) =>
          handleConfirm(taskIndex, removals, nobleSlainIds, nobleCapturedIds)
        }
      />
    )
  }

  return (
    <div className="player-columns">
      {renderSide('A')}
      {renderSide('B')}
    </div>
  )
}
