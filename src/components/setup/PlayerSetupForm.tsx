import type { PlayerArmy, Side, UnitKind } from '../../rules/types'
import {
  INVADER_TROOP_KINDS,
  OWN_TROOP_KINDS,
  PLAYER_COLORS,
  PROJECTILE_KINDS,
  UNIT_LABELS,
} from '../../rules/types'
import { useBattle } from '../../context/battleStore'
import { Stepper } from '../common/Stepper'
import { EXCALIBUR_IMAGE, FORTIFIED_CITY_IMAGE, STRONGHOLD_IMAGE, UNIT_IMAGES } from '../../rules/unitImages'

interface Props {
  player: PlayerArmy
  canRemove: boolean
}

export function PlayerSetupForm({ player, canRemove }: Props) {
  const { dispatch } = useBattle()

  function renderUnitGroup(title: string, kinds: UnitKind[]) {
    return (
      <>
        <h4>{title}</h4>
        <div className="unit-grid">
          {kinds.map((unit) => (
            <label key={unit}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                {UNIT_IMAGES[unit] && <img className="unit-icon" src={UNIT_IMAGES[unit]} alt="" />}
                {UNIT_LABELS[unit]}
              </span>
              <Stepper
                value={player.units[unit] ?? 0}
                onChange={(count) => dispatch({ type: 'SET_UNIT_COUNT', playerId: player.id, unit, count })}
              />
            </label>
          ))}
        </div>
      </>
    )
  }

  return (
    <section className={`card player-${player.color}`}>
      <p className="side-tag">Bando {player.side}</p>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}>
        <input
          value={player.name}
          onChange={(e) => dispatch({ type: 'SET_PLAYER_NAME', playerId: player.id, name: e.target.value })}
          aria-label="Nombre del jugador"
        />
        <div className="color-swatches" role="radiogroup" aria-label="Color del jugador">
          {PLAYER_COLORS.map((color) => (
            <button
              key={color}
              type="button"
              role="radio"
              aria-checked={player.color === color}
              aria-label={color}
              className={`color-swatch color-swatch--${color}${player.color === color ? ' color-swatch--selected' : ''}`}
              onClick={() => dispatch({ type: 'SET_PLAYER_COLOR', playerId: player.id, color })}
            />
          ))}
        </div>
        {canRemove && (
          <button type="button" onClick={() => dispatch({ type: 'REMOVE_PLAYER', playerId: player.id })}>
            Quitar
          </button>
        )}
      </header>

      <div style={{ margin: '0.75rem 0' }}>
        <select
          aria-label="Bando"
          value={player.side}
          onChange={(e) =>
            dispatch({ type: 'SET_PLAYER_SIDE', playerId: player.id, side: e.target.value as Side })
          }
        >
          <option value="A">Bando A</option>
          <option value="B">Bando B</option>
        </select>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.75rem' }}>
        <label>
          <input
            type="checkbox"
            checked={player.inStronghold}
            onChange={(e) => dispatch({ type: 'SET_STRONGHOLD', playerId: player.id, value: e.target.checked })}
          />{' '}
          <img className="unit-icon" src={STRONGHOLD_IMAGE} alt="" /> Fortaleza
        </label>
        <label>
          <input
            type="checkbox"
            checked={player.inFortifiedCity}
            onChange={(e) =>
              dispatch({ type: 'SET_FORTIFIED_CITY', playerId: player.id, value: e.target.checked })
            }
          />{' '}
          <img className="unit-icon" src={FORTIFIED_CITY_IMAGE} alt="" /> Amurallada
        </label>
      </div>

      {renderUnitGroup('Tropas propias', OWN_TROOP_KINDS)}
      {renderUnitGroup('Proyectiles', PROJECTILE_KINDS)}
      {renderUnitGroup('Tropas de Invasor', INVADER_TROOP_KINDS)}

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
          <Stepper
            value={noble.titles}
            onChange={(titles) =>
              dispatch({ type: 'UPDATE_NOBLE', playerId: player.id, nobleId: noble.id, patch: { titles } })
            }
          />
          <label>
            <input
              type="checkbox"
              checked={noble.isTitledLord}
              onChange={(e) =>
                dispatch({
                  type: 'UPDATE_NOBLE',
                  playerId: player.id,
                  nobleId: noble.id,
                  patch: {
                    isTitledLord: e.target.checked,
                    titles: e.target.checked && noble.titles === 0 ? 1 : noble.titles,
                  },
                })
              }
            />{' '}
            Título Feudal
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
            <img className="unit-icon" src={EXCALIBUR_IMAGE} alt="" /> Excalibur
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
        + Noble
      </button>
    </section>
  )
}
