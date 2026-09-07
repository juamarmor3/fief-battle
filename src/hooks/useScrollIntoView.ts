import { useEffect, useRef } from 'react'

// Devuelve un ref que hace scroll suave hasta sí mismo en cuanto `active`
// pasa a true. Usar para revelar progresivamente cada nueva sección de una
// sub-fase (resultados, bajas, resumen final) sin sustituir lo anterior.
export function useScrollIntoView<T extends HTMLElement>(active: boolean) {
  const ref = useRef<T>(null)
  useEffect(() => {
    if (active) ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [active])
  return ref
}
