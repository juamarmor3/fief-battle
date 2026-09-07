import type { UnitKind } from './types'

const BASE = import.meta.env.BASE_URL

export const UNIT_IMAGES: Partial<Record<UnitKind, string>> = {
  menAtArms: `${BASE}sargento.png`,
  archer: `${BASE}arquero.png`,
  crossbowman: `${BASE}ballestero.png`,
  knight: `${BASE}caballero.png`,
  bombard: `${BASE}bombarda.png`,
  trebuchet: `${BASE}trebuchet.png`,
}

export const STRONGHOLD_IMAGE = `${BASE}fortaleza.png`
export const FORTIFIED_CITY_IMAGE = `${BASE}ciudad-amurallada.png`
export const EXCALIBUR_IMAGE = `${BASE}excalibur.png`
