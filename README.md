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
├── index.html
├── vite.config.ts
├── package.json
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── styles/          # tema visual medieval (theme.css, global.css)
    ├── rules/           # lógica de reglas pura (tipos, reducer de batalla...)
    ├── context/         # estado de la batalla (React Context + useReducer)
    └── components/
        ├── layout/      # layout común de campo de batalla (Bando A / Bando B)
        └── setup/       # formulario de contendientes, bandos y unidades
```

## 9. Estado actual
- Fase: en desarrollo — scaffold (Vite + React + TypeScript) y pantalla de
  configuración de batalla (contendientes, bandos, unidades, nobles) ya
  funcionando.
- Próximo paso: implementar la fase de Proyectiles (7.2 del REGLAMENTO.md).

