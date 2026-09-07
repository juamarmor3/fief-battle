# Fief Battle

## 1. Visión general
Es una UI en react.

El objetivo de la app es introducir los elementos intervinientes de cada uno de los contendientes y simular y calcular automáticamente las bajas de cada bando.

Features:
- Por defecto, batallas de dos usuarios.
- Existe un botón + por si se ven implicados más de dos jugadores en la batalla.
- A cada implicado de la batalla se le presenta un formulario para introducir los componentes que intervienen por cada una de las partes de los contrincantes.
- La app basada ene el REGLAMENTO.md irá resolviendo las distintas fases de la batalla.


WOrkflow de la app:
- introducir contendientes, dos por defecto, hasta 4
- rellenar formulario de unidades de combate
- Inicio fase proyectiles
- Calcular bajas fase proyectiles
- Cada jugador introduce las bajas seleccionadas.
- Iniciar fase cuerpo a cuerpo
- Calcular bajas cuerpo a cuerpo
- Introducir bajas de la fase
- Presentar resultados, ganador y consecuencias


## 2. Objetivo del proyecto
- [ ] Objetivo principal: Simular las batallas en base a lo que introduzcan los contendientes

## 3. Usuarios / Jugadores
- Tipo de usuario: Jugador de juegos de mesa
- Número de jugadores (1, 2, N, multijugador online...): 2 - 3- 4, 2 por defecto
- Plataforma objetivo (web, escritorio, móvil, CLI...): github pages (deploy), web.


## 6. Requisitos técnicos
- Lenguaje / stack: React
- Persistencia de datos (guardado de partidas, etc.): No es necesaria
- Dependencias externas: Ninguna, github pages para los deploys

## 7. Interfaz / experiencia
- Tipo de interfaz (texto/CLI, gráfica 2D, web...): WEB
- Estilo visual de referencia: La Inglaterra medieval

## 8. Estructura del proyecto
```
fief-battle/
├── README.md
├── REGLAMENTO.md
├── PLANIFICACION.md   # roadmap por fases + sistema de diseño en detalle
├── index.html
├── vite.config.ts
├── package.json
├── public/            # imágenes de unidades (arquero.png, sargento.png...)
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── styles/          # tema visual medieval (theme.css, global.css)
    ├── rules/           # lógica de reglas pura: tipos, reducer de batalla,
    │                    # dados, bajas, proyectiles, imágenes de unidad...
    ├── context/         # estado de la batalla (React Context + useReducer)
    ├── hooks/           # useSides, useScrollIntoView (compartidos)
    └── components/
        ├── layout/      # PhaseTracker, SubPhaseTracker, PlayerColumnsLayout
        ├── common/      # Stepper, ProgressBadge (controles genéricos)
        ├── setup/       # formulario de contendientes, bandos y unidades
        └── phases/      # una fase de batalla por sub-carpeta/archivo:
                         # LossSelector, LossPanels, FinalSummary, DiceInput,
                         # UnitLossPicker (genéricos) + ProjectilePhase, etc.
```

## 9. Cómo trabajar en este proyecto (léelo antes de tocar código)

Esto no es solo estilo: son las piezas y convenciones que **toda fase nueva
debe reutilizar tal cual**, no reinventar. El detalle completo, con el
porqué de cada decisión, está en `PLANIFICACION.md` → sección "Sistema de
diseño". Resumen:

- **Layout por columnas, siempre**: cualquier pantalla con 2+ bandos usa
  `PlayerColumnsLayout` / la clase `.player-columns`, una columna por
  jugador/bando. Si un bando no tiene nada que hacer en esa pantalla, su
  columna se muestra igual con un mensaje de espera — nunca se colapsa a
  una sola columna.
- **Todo en una pantalla por sub-fase**: no se navega a otra vista al
  confirmar una tirada. Se revela progresivamente hacia abajo (tirada →
  resultados → bajas → resumen final → botón "Siguiente"), con scroll
  automático (`useScrollIntoView`) a cada sección nueva.
- **Piezas reutilizables ya construidas** (no las dupliques):
  `LossSelector` + `LossPanels` (bajas simultáneas de ambos bandos),
  `FinalSummary` (resumen de piezas retiradas), `RoundResultsAndLosses`
  (resultado → bajas → resumen final, combinar con el hook `useRoundStage`
  para no repetir ese bloque en cada sub-fase), `DiceInput` (entrada manual
  de dados), `UnitLossPicker` (fichas de baja con imagen), `Stepper`
  (contador +/-), `ProgressBadge` (contador "capitular medieval" en la
  esquina superior derecha), `useSides`/`useScrollIntoView` (hooks).
- **Tiradas de dados manuales**: la app nunca genera aleatoriedad; indica
  cuántos dados tirar y el jugador introduce el resultado físico.
- **Bajas**: se bloquea tomar *menos* del mínimo obligatorio (7.5); tomar
  más es decisión del jugador. Si los hits superan la capacidad de las
  tropas, se marcan todas automáticamente.
- **Texto mínimo entendible**: nunca repetir en el texto lo que ya dice la
  columna (bando, color). Frases cortas (`idleText`/`hitsText` en
  `rules/battleText.ts`).
- **Color del jugador**: dentro de una columna `.player-{color}`, los
  títulos (`h3`/`h4`/`strong`) y la clase `.loss-line` heredan
  `--player-color` automáticamente vía CSS — no fijar colores a mano ahí.
- **Congela lo que se lee al entrar en una sub-fase** si esa misma sub-fase
  puede alterarlo (p.ej. conteos de unidades que mueren dentro del propio
  paso): usa `useState(() => ...)` con inicializador perezoso, no un
  `const` derivado que se recalcule en cada render. Ya causó un bug real
  (salto automático de sub-fase) — ver `PLANIFICACION.md`.

## 10. Estado actual
- Completadas: Fase 0-3 (scaffold, setup, motor de dados/bajas, Proyectiles).
- Próximo paso: Fase 4, Fase de Melé (7.3-7.4 del REGLAMENTO.md), reutilizando
  las piezas descritas arriba.

## 11. Despliegue a GitHub Pages
```
npm run deploy
```
Este comando compila la app (`predeploy` → `npm run build`) y publica el
contenido de `dist/` en la rama `gh-pages` del repositorio (vía el paquete
`gh-pages`). Solo hace falta, **una vez**, activar en GitHub: *Settings →
Pages → Source → Deploy from a branch → `gh-pages` / `/(root)`. La URL final
es `https://<usuario-github>.github.io/fief-battle/` (coincide con el
`base: '/fief-battle/'` de `vite.config.ts`).

