import { useMemo, useState } from 'react'
import type { PlayerArmy, UnitCounts } from '../../rules/types'
import { ProgressBadge } from '../common/ProgressBadge'
import { UnitLossPicker } from './UnitLossPicker'
import {
  TROOP_KINDS,
  computeMaxRemovableHits,
  pooledActiveNobles,
  pooledTroopCounts,
  totalTroopCount,
  unitsHitTotal,
} from '../../rules/losses'

interface Props {
  title: string
  players: PlayerArmy[]
  hitsAvailable: number
  colorClass?: string
  onConfirm: (
    removals: { playerId: string; units: UnitCounts }[],
    nobleSlainIds: string[],
    nobleCapturedIds: string[],
  ) => void
}

export function LossSelector({ title, players, hitsAvailable, colorClass, onConfirm }: Props) {
  const [selection, setSelection] = useState<Record<string, UnitCounts>>(() =>
    Object.fromEntries(players.map((p) => [p.id, {}])),
  )
  const [nobleSlainIds, setNobleSlainIds] = useState<string[]>([])

  const pooled = useMemo(() => pooledTroopCounts(players), [players])
  const maxTroopHits = useMemo(
    () => computeMaxRemovableHits(pooled, hitsAvailable),
    [pooled, hitsAvailable],
  )
  const activeNobles = useMemo(() => pooledActiveNobles(players), [players])

  // Si los hits superan lo que las tropas disponibles pueden absorber, no
  // hay elección posible: todas caen automáticamente.
  const totalPossibleHits = unitsHitTotal(pooled)
  const allUnitsForced = totalPossibleHits > 0 && maxTroopHits === totalPossibleHits
  const effectiveSelection: Record<string, UnitCounts> = allUnitsForced
    ? Object.fromEntries(players.map((p) => [p.id, p.units]))
    : selection

  const selectedTroopHits = players.reduce(
    (sum, p) => sum + unitsHitTotal(effectiveSelection[p.id] ?? {}),
    0,
  )
  const selectedTroopCount = players.reduce(
    (sum, p) =>
      sum + TROOP_KINDS.reduce((s, kind) => s + (effectiveSelection[p.id]?.[kind] ?? 0), 0),
    0,
  )
  const allTroopsDead = selectedTroopCount === totalTroopCount(pooled)
  const leftoverHits = Math.max(0, hitsAvailable - selectedTroopHits)
  const maxNobleSlain = allTroopsDead ? Math.min(leftoverHits, activeNobles.length) : 0
  // Se permite tomar más bajas de las estrictamente necesarias; solo se
  // bloquea tomar menos de las obligatorias.
  const troopHitsValid = selectedTroopHits >= maxTroopHits
  const nobleCountValid = nobleSlainIds.length === maxNobleSlain
  const canConfirm = troopHitsValid && nobleCountValid

  function setUnitCount(playerId: string, kind: (typeof TROOP_KINDS)[number], value: number) {
    const player = players.find((p) => p.id === playerId)
    const available = player?.units[kind] ?? 0
    const clamped = Math.max(0, Math.min(value, available))
    setSelection((prev) => ({ ...prev, [playerId]: { ...prev[playerId], [kind]: clamped } }))
  }

  function toggleNoble(nobleId: string) {
    setNobleSlainIds((prev) =>
      prev.includes(nobleId) ? prev.filter((id) => id !== nobleId) : [...prev, nobleId],
    )
  }

  function handleConfirm() {
    const removals = players.map((p) => ({ playerId: p.id, units: effectiveSelection[p.id] ?? {} }))
    const nobleCapturedIds = allTroopsDead
      ? activeNobles.filter((n) => !nobleSlainIds.includes(n.id)).map((n) => n.id)
      : []
    onConfirm(removals, allTroopsDead ? nobleSlainIds : [], nobleCapturedIds)
  }

  return (
    <div className={`card${colorClass ? ` ${colorClass}` : ''}`}>
      <ProgressBadge
        current={selectedTroopHits + nobleSlainIds.length}
        required={maxTroopHits + maxNobleSlain}
      />
      <h4>{title}</h4>

      {allUnitsForced && <p className="loss-line">Todas tus unidades caen.</p>}

      <div className="player-columns">
        {players.map((player) => (
          <div key={player.id} className="player-column">
            <strong>{player.name}</strong>
            <div className="unit-loss-grid">
              {TROOP_KINDS.filter((kind) => (player.units[kind] ?? 0) > 0).map((kind) => (
                <UnitLossPicker
                  key={kind}
                  kind={kind}
                  total={player.units[kind] ?? 0}
                  selected={effectiveSelection[player.id]?.[kind] ?? 0}
                  disabled={allUnitsForced}
                  onChange={(count) => setUnitCount(player.id, kind, count)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {allTroopsDead && activeNobles.length > 0 && (
        <div>
          <p className="loss-line">{leftoverHits} hit(s) para Nobles (resto capturados):</p>
          {activeNobles.map((noble) => (
            <label key={noble.id} style={{ marginRight: '1rem' }}>
              <input
                type="checkbox"
                checked={nobleSlainIds.includes(noble.id)}
                onChange={() => toggleNoble(noble.id)}
                disabled={!nobleSlainIds.includes(noble.id) && nobleSlainIds.length >= maxNobleSlain}
              />{' '}
              Asesinar a {noble.name}
            </label>
          ))}
        </div>
      )}

      {!troopHitsValid && (
        <p style={{ color: 'var(--color-accent)' }}>Faltan bajas (mín. {maxTroopHits}).</p>
      )}

      <button type="button" disabled={!canConfirm} onClick={handleConfirm}>
        Confirmar bajas
      </button>
    </div>
  )
}
