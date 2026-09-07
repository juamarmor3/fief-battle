import { useBattle } from '../../context/battleStore'

export function AddContenderButton() {
  const { state, dispatch } = useBattle()
  const atMax = state.players.length >= 4

  return (
    <button type="button" onClick={() => dispatch({ type: 'ADD_PLAYER' })} disabled={atMax}>
      {atMax ? 'Máximo 4 contendientes' : '+ Añadir contendiente'}
    </button>
  )
}
