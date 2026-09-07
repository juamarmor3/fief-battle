import type { PlayerArmy, Side } from '../../rules/types'
import { INVADER_TROOP_KINDS, OWN_TROOP_KINDS, PROJECTILE_KINDS, UNIT_LABELS } from '../../rules/types'
import { useBattle } from '../../context/battleStore'

interface Props {
  player: PlayerArmy
  canRemove: boolean
}

export function PlayerSetupForm({ player, canRemove }: Props) {
  const { dispatch } = useBattle()

  return (
    <section className={`card side-${player.side.toLowerCase()}`}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}>
        <input
          value={player.name}
          onChange={(e) => dispatch({ type: 'SET_PLAYER_NAME', playerId: player.id, name: e.target.value })}
          aria-label="Nombre del jugador"
        />
        {canRemove && (
          <button type="button" onClick={() => dispatch({ type: 'REMOVE_PLAYER', playerId: player.id })}>
            Quitar
          </button>
        )}
      </header>

      <div style={{ margin: '0.75rem 0' }}>
        <label>
          Bando:{' '}
          <select
            value={player.side}
            onChange={(e) =>
              dispatch({ type: 'SET_PLAYER_SIDE', playerId: player.id, side: e.target.value as Side })
            }
          >
            <option value="A">Bando A</option>
            <option value="B">Bando B</option>
          </select>
        </label>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.75rem' }}>
        <label>
          <input
            type="checkbox"
            checked={player.inStronghold}
            onChange={(e) => dispatch({ type: 'SET_STRONGHOLD', playerId: player.id, value: e.target.checked })}
          />{' '}
          En Fortaleza
        </label>
        <label>
          <input
            type="checkbox"
            checked={player.inFortifiedCity}
            onChange={(e) =>
              dispatch({ type: 'SET_FORTIFIED_CITY', playerId: player.id, value: e.target.checked })
            }
          />{' '}
          En Fortaleza Amurallada
        </label>
      </div>

      <h4>Tropas propias</h4>
      <div className="unit-grid">
        {OWN_TROOP_KINDS.map((unit) => (
          <label key={unit}>
            {UNIT_LABELS[unit]}
            <input
              type="number"
              min={0}
              value={player.units[unit] ?? 0}
              onChange={(e) =>
                dispatch({
                  type: 'SET_UNIT_COUNT',
                  playerId: player.id,
                  unit,
                  count: Number(e.target.value),
                })
              }
            />
          </label>
        ))}
      </div>

      <h4>Proyectiles</h4>
      <div className="unit-grid">
        {PROJECTILE_KINDS.map((unit) => (
          <label key={unit}>
            {UNIT_LABELS[unit]}
            <input
              type="number"
              min={0}
              value={player.units[unit] ?? 0}
              onChange={(e) =>
                dispatch({
                  type: 'SET_UNIT_COUNT',
                  playerId: player.id,
                  unit,
                  count: Number(e.target.value),
                })
              }
            />
          </label>
        ))}
      </div>

      <h4>Tropas de Invasor</h4>
      <div className="unit-grid">
        {INVADER_TROOP_KINDS.map((unit) => (
          <label key={unit}>
            {UNIT_LABELS[unit]}
            <input
              type="number"
              min={0}
              value={player.units[unit] ?? 0}
              onChange={(e) =>
                dispatch({
                  type: 'SET_UNIT_COUNT',
                  playerId: player.id,
                  unit,
                  count: Number(e.target.value),
                })
              }
            />
          </label>
        ))}
      </div>

      <h4>Nobles</h4>
      {player.nobles.map((noble) => (
        <div key={noble.id} className="noble-row">
          <input
            value={noble.name}
            onChange={(e) =>
              dispatch({
                type: 'UPDATE_NOBLE',
                playerId: player.id,
                nobleId: noble.id,
                patch: { name: e.target.value },
              })
            }
          />
          <select
            value={noble.gender}
            onChange={(e) =>
              dispatch({
                type: 'UPDATE_NOBLE',
                playerId: player.id,
                nobleId: noble.id,
                patch: { gender: e.target.value as 'male' | 'female' },
              })
            }
          >
            <option value="male">Hombre</option>
            <option value="female">Mujer</option>
          </select>
          <label>
            Títulos:{' '}
            <input
              type="number"
              min={0}
              style={{ width: '3rem' }}
              value={noble.titles}
              onChange={(e) =>
                dispatch({
                  type: 'UPDATE_NOBLE',
                  playerId: player.id,
                  nobleId: noble.id,
                  patch: { titles: Number(e.target.value) },
                })
              }
            />
          </label>
          <label>
            <input
              type="checkbox"
              checked={noble.isTitledLord}
              onChange={(e) =>
                dispatch({
                  type: 'UPDATE_NOBLE',
                  playerId: player.id,
                  nobleId: noble.id,
                  patch: { isTitledLord: e.target.checked },
                })
              }
            />{' '}
            Titled Lord
          </label>
          <label>
            <input
              type="checkbox"
              checked={noble.hasExcalibur ?? false}
              onChange={(e) =>
                dispatch({
                  type: 'UPDATE_NOBLE',
                  playerId: player.id,
                  nobleId: noble.id,
                  patch: { hasExcalibur: e.target.checked },
                })
              }
            />{' '}
            Excalibur
          </label>
          <button
            type="button"
            onClick={() => dispatch({ type: 'REMOVE_NOBLE', playerId: player.id, nobleId: noble.id })}
          >
            Quitar
          </button>
        </div>
      ))}
      <button type="button" onClick={() => dispatch({ type: 'ADD_NOBLE', playerId: player.id })}>
        + Añadir Noble
      </button>
    </section>
  )
}
