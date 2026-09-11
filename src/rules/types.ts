export type Side = 'A' | 'B'

export type PlayerColor = 'red' | 'blue' | 'green' | 'yellow'

export const PLAYER_COLORS: PlayerColor[] = ['red', 'blue', 'green', 'yellow']

export type UnitKind =
  | 'menAtArms'
  | 'archer'
  | 'crossbowman'
  | 'knight'
  | 'footSoldier'
  | 'leader'
  | 'trebuchet'
  | 'bombard'

export const OWN_TROOP_KINDS: UnitKind[] = [
  'menAtArms',
  'archer',
  'crossbowman',
  'knight',
]

export const INVADER_TROOP_KINDS: UnitKind[] = ['footSoldier', 'leader']

export const PROJECTILE_KINDS: UnitKind[] = ['trebuchet', 'bombard']

export const UNIT_LABELS: Record<UnitKind, string> = {
  menAtArms: 'Sargento',
  archer: 'Arquero',
  crossbowman: 'Ballestero',
  knight: 'Caballero',
  footSoldier: 'Soldado de Infantería (Invasor)',
  leader: 'Líder (Invasor)',
  trebuchet: 'Catapulta',
  bombard: 'Bombarda',
}

export type UnitCounts = Partial<Record<UnitKind, number>>

export interface Noble {
  id: string
  name: string
  gender: 'male' | 'female'
  isTitledLord: boolean
  titles: number
  hasExcalibur?: boolean
  status: 'active' | 'captured' | 'slain'
  captorPlayerId?: string
}

export interface PlayerArmy {
  id: string
  name: string
  side: Side
  color: PlayerColor
  units: UnitCounts
  nobles: Noble[]
  inStronghold: boolean
  inFortifiedCity: boolean
}

export type BattlePhase =
  | 'setup'
  | 'projectiles-trebuchet'
  | 'projectiles-bombard'
  | 'projectiles-archer'
  | 'melee-roll'
  | 'melee-losses'
  | 'round-outcome'
  | 'siege'
  | 'captives-ransom'
  | 'pillage'
  | 'summary'

// Formas en que una Batalla puede terminar (7.8).
export type BattleOutcomeType =
  | 'victory'
  | 'surrender'
  | 'truce'
  | 'withdraw'
  | 'assassination'
  | 'annihilation'
  | 'deadlock'
  | 'siege'

export interface BattleOutcome {
  type: BattleOutcomeType
  winnerSide?: Side
  description: string
}
