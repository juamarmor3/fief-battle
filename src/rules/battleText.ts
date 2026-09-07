import type { Side } from './types'

// Frases mínimas y entendibles para resultados de envite. La columna ya
// indica el bando (color + etiqueta), así que estos textos nunca repiten
// "Bando X" como sujeto.
export function idleText(weapon: string): string {
  return `Sin ${weapon}.`
}

export function hitsText(hits: number, targetLetter: Side, note?: string): string {
  return `${hits} hit(s) → ${targetLetter}${note ? ` (${note})` : ''}`
}
