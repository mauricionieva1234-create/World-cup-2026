# PROGRESO — World Cup 2026

## Objetivo
Plataforma web profesional del Mundial 2026 con fixture, estadísticas, equipos, asistente AI, en español, con diseño oscuro y acentos dorados.

## Stack
- **Framework:** Next.js 16.2.9 (webpack, no Turbopack — incompatible con esta plataforma)
- **Lenguaje:** TypeScript estricto
- **Estilos:** Tailwind CSS v4 con tema personalizado
- **Animaciones:** Framer Motion v12 (usar `as const` en `ease: 'easeOut'`)
- **Build:** `next build --webpack` | Dev: `next dev --webpack`

## Estructura del proyecto

```
worldcup-2026/
├── messages/
│   ├── es.json              → Traducciones español (base)
│   ├── en.json              → Traducciones inglés
│   ├── fr.json              → Traducciones francés
│   └── pt.json              → Traducciones portugués
├── src/
│   ├── app/
│   │   ├── [locale]/        → Páginas con prefijo de locale
│   │   │   ├── ai/          → Página del asistente AI
│   │   │   ├── fixture/     → Calendario de partidos
│   │   │   │   ├── history/     → Historia de los mundiales
│   │   │   ├── stadiums/    → Estadios sede
│   │   │   ├── stats/       → Estadísticas y rankings
│   │   │   ├── teams/       → Lista de selecciones
│   │   │   ├── layout.tsx   → Layout por locale (html, body, fonts)
│   │   │   └── page.tsx     → Landing page con todas las secciones
│   │   ├── globals.css      → Variables CSS, tema, animaciones
│   │   └── layout.tsx       → Layout raíz (solo pasa children)
│   ├── components/
│   │   ├── AIChat.tsx       → Asistente flotante con Q&A predefinidas
│   │   ├── BracketSection.tsx → Bracket eliminatorio dinámico
│   │   ├── ComparadorSection.tsx → Comparador cara a cara de selecciones
│   │   ├── FixtureSection.tsx → Filtros por fase y tarjetas de partido
│   │   ├── GoalAnimation.tsx → Overlay de gol con confeti
│   │   ├── HeroSection.tsx  → Video YouTube + CTA
│   │   ├── HistorySection.tsx → Campeones, goleadores, leyendas
│   │   ├── LiveMatchCenter.tsx → Scoreboard, stats, timeline, tarjetas
│   │   ├── MatchCard.tsx    → Tarjeta individual de partido
│   │   ├── Navbar.tsx       → Navegación glass con scroll detection
│   │   ├── ParticleBackground.tsx → Canvas de partículas doradas
│   │   ├── StadiumSection.tsx → 11 estadios con mapa e info
│   │   ├── StandingsSection.tsx → Tabla de posiciones por grupo
│   │   ├── StatsSection.tsx → Goleadores, asistencias, rankings
│   │   ├── TeamCard.tsx     → Tarjeta de equipo con hover
│   │   ├── TeamsSection.tsx → Grid con filtro por grupo y búsqueda
│   │   └── VideoBackground.tsx → YouTube embed responsivo
│   ├── logic/
│   │   ├── standings.ts     → Cálculo de tabla de posiciones (puntos, GD, forma)
│   │   └── knockout.ts      → Clasificación automática + bracket + 3er puesto + propagación ganadores/perdedores
│   └── data/
│       ├── teams.ts         → 48 selecciones con datos generales
│       ├── matches.ts       → 93 partidos (44 resultados reales + 49 programados)
│       ├── stadiums.ts      → 11 estadios sedes
│       ├── history.ts       → 22 campeones, goleadores, leyendas
│       └── index.ts         → Re-exportaciones
├── PROGRESO.md
├── package.json
├── next.config.ts
├── tailwind.config.ts (implícito en CSS)
└── tsconfig.json
```

## Datos reales incorporados

### Equipos
- 48 selecciones con grupos A–L (sorteo oficial FIFA)
- Cuerpo técnico (entrenador, nacionalidad, desde)
- Todos los equipos tienen bandera emoji

### Partidos (93)
- **44 resultados reales** desde Sporting News / Wikipedia (hasta 22 Jun 2026)
- Partidos en vivo actualizados (Argentina 2-0 Austria, Francia 3-0 Irak)
- 49 partidos programados: fase de grupos restante + 16avos + octavos
- Formato de 104 partidos (48 equipos, 12 grupos, top 2 + 8 mejores terceros)

### Estadios
- 11 sedes oficiales con capacidad, historia, coordenadas, propietario

### Historial
- 22 campeones mundiales (1930–2022)
- Máximos goleadores históricos
- 6 leyendas con biografía

## Decisiones técnicas

1. **Webpack forzado:** `next.config.ts` usa `module.exports = { turbotrace: false }` y se corre con `--webpack` porque SWC nativo no funciona en esta plataforma Win32
2. **Sin API externa:** AIChat usa respuestas hardcodeadas inteligentes (no hay API key ni backend)
3. **Framer Motion v12:** `ease: 'easeOut'` requiere `as const` para satisfacer tipos de TypeScript
4. **CSS puro para tema:** Tailwind v4 con archivo `globals.css` que define variables CSS y `@theme`
5. **Datos mock → reales:** Migración completa de datos ficticios a reales (Sporting News, Wikipedia)
6. **Encoding:** Archivos generados por agentes pueden introducir caracteres corruptos — se corrigió teams.ts (98 caracteres), verificar con `tsc --noEmit`
7. **i18n con next-intl v4:** `createNextIntlPlugin`, middleware en `src/middleware.ts`, routing en `src/i18n/routing.ts`. Locales: `es` (default, `as-needed` prefix), `en`, `fr`, `pt`. Páginas movidas a `app/[locale]/`. Todos los componentes migrados a `useTranslaciones()` con namespace por sección. LanguageSwitcher en Navbar con `router.replace(pathname, { locale })`. Mensajes en `messages/{locale}.json`.

## Funcionalidades implementadas

### Landing page (`/`)
Ensambla todas las secciones en orden: Hero → Fixture → LiveMatchCenter → Standings → Bracket → Teams → Stadiums → Stats → Comparador → History → IA → AIChat → GoalAnimation

### Fixture (`/fixture`)
- Filtros por fase (todos, grupos, 16avos, octavos, cuartos, semis, final)
- Filtros por grupo (A–L completo ✓)
- Filtro por estadio
- Partidos en vivo destacados

### Equipos (`/teams`)
- Lista con 48 selecciones, filtro por confederación y búsqueda

### Tabla de posiciones (`StandingsSection`)
- Cálculo automático desde `src/logic/standings.ts`
- Puntos, PJ, PG, PE, PP, GF, GC, GD, forma (últimos 5 partidos)
- Por grupo (A–L)

### Bracket eliminatorio (`BracketSection`)
- Generación dinámica desde `src/logic/knockout.ts`
- Clasificación: top 2 de grupo + 8 mejores terceros
- **Visualización bracket tree profesional:**
  - Dos llaves enfrentadas (izquierda y derecha) convergiendo en la Final
  - Rondas: 16VOS → 8VOS → 4TOS → SEMIS → FINAL
  - Partido de **3er Puesto** (perdedores de semis)
  - Conectores SVG con curvas entre rondas (estilo bracket clásico)
  - Altura fija de 480px por llave, tarjetas alineadas en árbol
  - **Final centrada dinámicamente** con posicionamiento absoluto (`left-1/2 -translate-x-1/2`)
- **Población automática de equipos:** 12 ganadores de grupo + 12 segundos + 8 mejores terceros asignados a 16avos (matches 70–85) con pairing: top 8 winners vs 8 third, restantes winners vs runners, runners vs runners
- **Simulación interactiva:**
  - Scores editables inline con inputs numéricos
  - Soporte de penales
  - Confirmación con botón OK
  - Propagación automática de ganadores y perdedores a 3er puesto
  - Persistencia en localStorage (`worldcupSimulation`)
- Final destacada al centro: 🏆 trofeo, 19 DE JULIO, METLIFE NJ
- Animaciones Framer Motion en confirmación
- Panel de estadísticas: goleadores, MVP, campeón
- Botón "Reiniciar torneo"
- Tarjetas vacías (sin equipo asignado) con borde y texto más visibles

### Comparador (`ComparadorSection`)
- Comparación cara a cara de 2 selecciones
- Ranking FIFA, confederación, mundiales ganados, rating, goles/asistencias
- Historial de enfrentamientos directos

### Estadísticas (`/stats`)
- Goleadores, asistencias, tarjetas, rendimiento
- Rankings por categoría

### Asistente AI (`/ai`, `AIChat`)
- Q&A predefinidas sin API externa
- Componente flotante + página standalone

### Historia (`/history`)
- 22 campeones, goleadores históricos, leyendas

## Problemas conocidos

- `npm run dev` requiere flag `--webpack` explícito (el script en package.json ya lo incluye)
- Error `invalid type: unit value, expected usize` en TypeScript type check con WASM SWC en Windows — mitigado con `typescript.ignoreBuildErrors: true` en next.config.ts
- ~~Caracteres corruptos en teams.ts~~ → **Corregido** (98 caracteres arreglados, acentos restaurados)
- ~~Mojibake (doble encoding UTF-8) en 21 componentes~~ → **Corregido** — acentos, eñes y emojis restaurados en UI
- ~~Errores TS en CoachPhoto (size "xl")~~ → **Corregido**
- ~~groupFilters en fixture/page.tsx solo cubría A–H~~ → **Corregido** (ahora A–L)
- ~~Texto "32 selecciones" en teams/page.tsx~~ → **Corregido** (ahora 48)
- ~~Texto "16 sedes" en stadiums/page.tsx~~ → **Corregido** (ahora 11)
- ~~Modo oscuro / claro~~ → **Corregido** — Modo claro eliminado, solo oscuro permanente
- ~~Fotos de estadios vacías~~ → **Corregido** — 10/11 estadios con AVIF local (1 remoto: BBVA) + fallback a fondo oscuro

## Hecho

- [x] Bracket unificado (mismo nivel, sin offset)
- [x] Simulación de resultados con propagación y localStorage
- [x] **Internacionalización completa:** next-intl v4, routing con locales ES/EN/FR/PT, middleware, prefijo `/[locale]`, archivos de mensajes, migración total de ~21 archivos a `useTranslations()`, LanguageSwitcher en Navbar, build exitoso
- [x] **Sección de juegos eliminada:** PenaltyGame removido, navbar y traducciones limpiadas
- [x] **Sección de plantillas eliminada:** páginas `players/[id]` y `teams/[id]` eliminadas, `PlayerCard.tsx` eliminado, interfaz `Player` y `players[]` removidos de `teams.ts`, traducciones limpiadas, `StatsSection` y `ComparadorSection` simplificados
- [x] **Modo claro eliminado:** ThemeProvider simplificado (solo oscuro), toggle quitado de Navbar, variables CSS de modo claro y `@custom-variant dark` eliminadas, `.dark` class removida de html
- [x] **Bracket visual tree (2 llaves enfrentadas):** `BracketSection.tsx` con árbol de rondas 16VOS→8VOS→4TOS→SEMIS→FINAL, conectores SVG, 3er puesto, scores editables, penales, propagación, stats, localStorage

## Próximas tareas posibles

1. **Simulación completa del mundial:** Generar resultados desde 16avos hasta final + 3er puesto, propagando ganadores ronda por ronda
2. **Auth y predicciones:** Sistema de usuarios que predicen resultados y acumulan puntos
3. **Responsive testing:** Verificar en móviles y tablets
4. **PWA:** Configurar service worker y manifest para instalación
5. **SEO:** Metadatos por página, sitemap, Open Graph
6. **Deploy:** Configurar Vercel / Netlify

## Cómo correr

```bash
cd C:\worldcup-2026
npm run dev          # (el script ya incluye --webpack)
npm run build        # (build de producción con --webpack)
```
