import type { Noble, PlayerArmy } from './types'

// Rescate (7.7): 2 Chelines + 2 Chelines por cada Título del Noble cautivo.
export function ransomValue(noble: Noble): number {
  return 2 + 2 * noble.titles
}

export interface CapturedEntry {
  player: PlayerArmy
  noble: Noble
}

// Nobles cautivos entre estos jugadores (propios, no los que ellos retienen
// de un rival), para mostrarlos en la pantalla de Rescate (7.6-7.7).
export function capturedNobles(players: PlayerArmy[]): CapturedEntry[] {
  return players.flatMap((player) =>
    player.nobles
      .filter((noble) => noble.status === 'captured')
      .map((noble) => ({ player, noble })),
  )
}

export function anyCapturedNobles(players: PlayerArmy[]): boolean {
  return players.some((p) => p.nobles.some((n) => n.status === 'captured'))
}

export function captorName(allPlayers: PlayerArmy[], captorPlayerId: string | undefined): string {
  return allPlayers.find((p) => p.id === captorPlayerId)?.name ?? 'Desconocido'
}
