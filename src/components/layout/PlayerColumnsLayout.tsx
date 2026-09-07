import type { ReactNode } from 'react'
import type { PlayerArmy } from '../../rules/types'

interface Props<T extends PlayerArmy> {
  players: T[]
  renderPlayer: (player: T) => ReactNode
}

// Layout común de la app: cada jugador ve/introduce su información en su
// propia columna, sean 1, 2, 3 o 4 contendientes.
export function PlayerColumnsLayout<T extends PlayerArmy>({ players, renderPlayer }: Props<T>) {
  return (
    <div className="player-columns">
      {players.map((player) => (
        <div key={player.id} className="player-column">
          {renderPlayer(player)}
        </div>
      ))}
    </div>
  )
}
