import { useBattle } from '../../context/battleStore'
import { PlayerColumnsLayout } from '../layout/PlayerColumnsLayout'
import { PlayerSetupForm } from './PlayerSetupForm'
import { AddContenderButton } from './AddContenderButton'

function hasAnyForce(players: ReturnType<typeof useBattle>['state']['players'], side: 'A' | 'B') {
  return players
    .filter((p) => p.side === side)
    .some((p) => p.nobles.length > 0 || Object.values(p.units).some((count) => (count ?? 0) > 0))
}

export function SetupScreen() {
  const { state, dispatch } = useBattle()
  const canStart = hasAnyForce(state.players, 'A') && hasAnyForce(state.players, 'B')
  const orderedPlayers = [...state.players].sort((a, b) => a.side.localeCompare(b.side))

  return (
    <div>
      <PlayerColumnsLayout
        players={orderedPlayers}
        renderPlayer={(player) => (
          <PlayerSetupForm player={player} canRemove={state.players.length > 2} />
        )}
      />

      <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between' }}>
        <AddContenderButton />
        <button type="button" disabled={!canStart} onClick={() => dispatch({ type: 'START_BATTLE' })}>
          Comenzar Batalla
        </button>
      </div>
      {!canStart && (
        <p style={{ color: 'var(--color-accent)' }}>Cada bando necesita ≥1 unidad o noble.</p>
      )}
    </div>
  )
}
