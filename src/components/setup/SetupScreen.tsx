import { useBattle } from '../../context/battleStore'
import { BattlefieldLayout } from '../layout/BattlefieldLayout'
import { PlayerSetupForm } from './PlayerSetupForm'
import { AddContenderButton } from './AddContenderButton'

function hasAnyForce(players: ReturnType<typeof useBattle>['state']['players'], side: 'A' | 'B') {
  return players
    .filter((p) => p.side === side)
    .some((p) => p.nobles.length > 0 || Object.values(p.units).some((count) => (count ?? 0) > 0))
}

export function SetupScreen() {
  const { state, dispatch } = useBattle()
  const sideAPlayers = state.players.filter((p) => p.side === 'A')
  const sideBPlayers = state.players.filter((p) => p.side === 'B')
  const canStart = hasAnyForce(state.players, 'A') && hasAnyForce(state.players, 'B')

  return (
    <div>
      <p>
        Introduce los contendientes de la batalla (2 por defecto, hasta 4), su bando y las unidades
        que aportan.
      </p>

      <BattlefieldLayout
        sideA={sideAPlayers.map((player) => (
          <PlayerSetupForm key={player.id} player={player} canRemove={state.players.length > 2} />
        ))}
        sideB={sideBPlayers.map((player) => (
          <PlayerSetupForm key={player.id} player={player} canRemove={state.players.length > 2} />
        ))}
      />

      <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between' }}>
        <AddContenderButton />
        <button type="button" disabled={!canStart} onClick={() => dispatch({ type: 'START_BATTLE' })}>
          Comenzar Batalla
        </button>
      </div>
      {!canStart && (
        <p style={{ color: 'var(--color-accent)' }}>
          Cada bando necesita al menos una unidad o un noble para poder comenzar.
        </p>
      )}
    </div>
  )
}
