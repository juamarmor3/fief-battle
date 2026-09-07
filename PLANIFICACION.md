# Planificación — Fief Battle

Roadmap incremental de construcción de la app, basado en el flujo descrito en
`README.md` y las reglas de `REGLAMENTO.md` (sección 7 "Battle"). Cada fase es
un hito revisable. Se actualiza a medida que se completan.

## Alcance y decisiones de partida

- **Alcance**: reglamento completo de la sección 7 (proyectiles, melé,
  penalizaciones, cautivos/rescate, asedio/sally, pillaje, alianzas).
- **Modelo N jugadores**: 2-4 contendientes agrupados en **Bando A** / **Bando
  B**; los jugadores de un mismo bando combinan sus unidades/SP como aliados
  (regla 7.0).
- **Stack**: Vite + React + TypeScript, sin backend, sin persistencia.
- **Estilo**: CSS plano, paleta/tipografía "Inglaterra medieval".
- **Simplificación necesaria**: la app no simula el juego completo (rondas,
  fase de compra, Stockpiles, Shillings acumulados). Asedio, rescate y
  pillaje se resuelven como decisiones inmediatas dentro de la misma sesión
  de batalla en vez de repartirse en turnos reales del juego de mesa.
- **Tiradas de dados manuales**: los jugadores tiran sus dados físicos; la
  app indica cuántos dados tirar y de qué tipo, y el usuario introduce el
  resultado de cada uno (no hay generación aleatoria en la app).
- **Selección de bajas**: la app muestra el daño a cubrir y las unidades
  disponibles; el usuario elige cuáles caen. Solo se bloquea tomar *menos*
  bajas de las obligatorias (7.5); tomar más de las estrictamente
  necesarias es decisión del usuario. Si los hits superan lo que las tropas
  disponibles pueden absorber, se marcan todas como caídas automáticamente.
- **Layout común (regla de toda la app, no solo Proyectiles)**: cada
  jugador/bando tiene su propia columna (color rojo/azul/verde/amarillo a
  elegir) en TODAS las pantallas de la batalla, sin excepción. Si un
  jugador/bando no tiene ninguna acción que realizar en una pantalla o
  sub-fase, su columna se muestra igualmente como una "pantalla de espera"
  (p.ej. "Sin bajas que resolver, espera a que el otro bando confirme")
  en lugar de omitirse. Nunca se debe colapsar a una sola columna cuando
  hay 2+ bandos/jugadores implicados, aunque solo uno tenga que actuar.
  Aplicar este patrón al construir cada fase nueva (Melé, Fin de Ronda,
  Asedio, Cautivos, Pillaje...).
- **Navegación**: breadcrumb de fases principales bajo el título, y un
  sub-breadcrumb dentro de fases con sub-pasos (p.ej. Proyectiles).
- **Todo en una pantalla por sub-fase**: tirada → resultados → bajas →
  resumen final (piezas retiradas) → botón "Siguiente", revelado progresivo
  con scroll automático a cada nueva sección, sin sustituir lo anterior.

## Sistema de diseño (modelo para toda la app)

- **Texto mínimo entendible**: frases cortas, sin repetir lo que ya dice la
  columna/breadcrumb (p.ej. "5 hit(s) → B (+1f)" en vez de "Bando A inflige
  5 hits a Bando B (incluye +1f de bonus)").
- **Títulos con el color del jugador**: dentro de una columna `.player-red`
  / `.player-blue` / `.player-green` / `.player-yellow`, los `h3`/`h4`/
  `strong`/`.loss-line` heredan `--player-color` automáticamente (ver
  `global.css`). No fijar colores de texto a mano dentro de esas columnas.
- **Info de bajas grande y en negrita**: clase `.loss-line` (1.15rem, 700)
  para cualquier línea que indique una baja concreta.
- **Contador de bajas** (`ProgressBadge`, esquina superior derecha de la
  caja): la cifra actual actúa como capitular medieval (grande, gris) hasta
  alcanzar la cifra objetivo (pequeña, color del jugador); al cumplirse la
  condición la cifra grande pasa también al color del jugador. Mismo
  lenguaje visual que los botones disabled→enabled (gris apagado → color).
- **Imágenes de unidad** (`src/rules/unitImages.ts`, archivos en
  `public/`): Sargento, Arquero, Ballestero, Caballero, Catapulta, Bombarda,
  Fortaleza, Fortaleza Amurallada y Excalibur ya tienen imagen. Faltan
  Soldado de Infantería (Invasor) y Líder (Invasor) — pendientes de que el
  usuario las aporte. Se usan como icono junto al Stepper en Setup y como
  ficha seleccionable (`UnitLossPicker`) en la pantalla de bajas.
- **Selector de bajas por fichas**: en vez de un contador numérico, una
  ficha por unidad disponible (todas las de un jugador en una única
  `.unit-loss-grid`, no una cuadrícula por tipo); pulsarla la marca/desmarca
  como baja.
- **Steppers +/-** (`src/components/common/Stepper.tsx`) en vez de inputs
  numéricos para cualquier conteo editable (unidades, títulos de nobles).
- **Layout por columnas**: ver regla de "Layout común" arriba.

## Fases

- [x] **Fase 0 — Scaffold**: Vite + React + TypeScript, ESLint, Vitest,
      estructura de carpetas, tema visual medieval (`theme.css`).
- [x] **Fase 1 — Setup de batalla**: alta de 2-4 contendientes, asignación de
      bando, formulario de unidades/nobles/Fortaleza-Fortaleza Amurallada.
- [x] **Fase 2 — Motor de dados y de bajas** (`dice.ts`, `losses.ts`,
      `strength.ts`): entrada manual de resultados de Battle Dice,
      validación de "máximas bajas posibles" (7.5), captura/asesinato de
      Nobles cuando se agotan las tropas.
- [x] **Fase 3 — Fase de Proyectiles** (`projectiles.ts` +
      `ProjectilePhase.tsx`): Trebuchets → Bombards → Archers/Crossbowmen,
      bonus de +1f, explosión de Bombards, disparo dirigido a Nobles,
      requisitos mínimos contra Fortaleza/Fortaleza Amurallada.
- [x] **Fase 4 — Fase de Melé** (`melee.ts` + `MeleePhase.tsx`): SP
      combinados por bando, tabla SP→dados, penalizaciones de Fortaleza,
      Excalibur. Reutiliza `useRoundStage` + `RoundResultsAndLosses` de
      Proyectiles sin duplicar el flujo tirada→resultados→bajas→resumen.
- [ ] **Fase 5 — Fin de ronda / Fin de batalla**: continuar, rendición,
      tregua, retirada, aniquilación, asesinato, estancamiento (3 tiradas sin
      bajas).
- [ ] **Fase 6 — Asedio y Sally**: declarar asedio, construir Trebuchet,
      combate de salida del sitiado.
- [ ] **Fase 7 — Cautivos y Rescate**: pantalla de rescate (2 + 2×títulos),
      negociación simplificada.
- [ ] **Fase 8 — Pillaje**: destrucción de Mills/Abbeys, reparto/destrucción
      de Trebuchets y Bombards del bando derrotado.
- [ ] **Fase 9 — Pantalla de resultados**: ganador, bajas totales,
      consecuencias.
- [x] **Fase 10 — Deploy a GitHub Pages**: `npm run deploy` (paquete
      `gh-pages`, publica `dist/` en la rama `gh-pages`). Requiere, una sola
      vez, activar en GitHub Settings → Pages → Source → rama `gh-pages`.

## Estado actual

Completadas: Fase 0-4 (scaffold, setup, motor de dados/bajas, Proyectiles,
Melé) y Fase 10 (script de deploy).
Próximo paso: Fase 5 (Fin de ronda / Fin de batalla).
