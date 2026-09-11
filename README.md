# Mundial 2026 — Gestor de Fixture Interactivo

Aplicación web interactiva para gestionar y visualizar el fixture completo del Mundial 2026, desde la fase de grupos hasta la gran final. Permite cargar resultados, calcular tablas de posiciones en tiempo real, simular llaves eliminatorias y consultar estadísticas del torneo.

## Tecnologías utilizadas

| Tecnología | Versión |
|---|---|
| Next.js | 16.2.9 |
| React | 19.2.4 |
| TypeScript | 5.x |
| Tailwind CSS | 4.x |
| Framer Motion | 12.40.0 |
| next-intl | 4.13.0 |
| Node.js | 20+ |

## Requisitos

- Node.js 20 o superior
- npm 9+ o yarn/pnpm

## Instalación y ejecución

```bash
# 1. Clonar el repositorio
git clone <url-del-repositorio>
cd worldcup-2026

# 2. Instalar dependencias
npm install

# 3. Iniciar servidor de desarrollo
npm run dev

# 4. Abrir en el navegador
http://localhost:3000
```

Para construir para producción:

```bash
npm run build
npm start
```

## Estructura del proyecto

```
src/
├── app/              # Páginas y layout (Next.js App Router)
│   └── [locale]/     # Rutas internacionalizadas (es/en/fr/pt)
├── components/       # Componentes de UI (20 componentes)
├── data/             # Datos estáticos (equipos, partidos, estadios)
├── logic/            # Lógica de negocio (posiciones, llaves)
├── i18n/             # Configuración de internacionalización
├── middleware.ts     # Redirección por idioma
messages/             # Traducciones (ES/EN/FR/PT)
public/
├── images/
│   ├── players/      # Fotos de jugadores
│   └── stadiums/     # Fotos de estadios
```

## Decisiones de diseño

- **48 selecciones**: Se utilizaron los 48 equipos clasificados al Mundial 2026, con los 12 grupos de 4 equipos.
- **Modo oscuro permanente**: Diseño dark mode con acentos dorados para una experiencia visual moderna y consistente.
- **Internacionalización**: Soporte para español, inglés, francés y portugués mediante next-intl.
- **Persistencia local**: Los resultados ingresados por el usuario se guardan en localStorage para no perderse al recargar la página.
- **Datos reales**: Los partidos disputados hasta el 25 de junio de 2026 incluyen resultados, eventos, estadísticas y MVPs reales.
- **Sin backend**: Toda la lógica se ejecuta en el cliente, sin necesidad de servidor adicional.
- **Fotos locales**: Las imágenes de jugadores y estadios se sirven desde el propio proyecto para evitar dependencias externas.

## Funcionalidades principales

- Lista completa de equipos con banderas y grupos
- Tabla de posiciones por grupo con orden automático (puntos > diferencia de gol > goles a favor > enfrentamiento directo)
- Carga interactiva de resultados (fase de grupos y eliminatorias)
- Llaves de eliminación directa con propagación automática de ganadores
- Simulación aleatoria de resultados
- Estadísticas de goleadores y asistentes
- Comparador de equipos
- Asistente AI integrado
- Información de estadios con fotos y datos
- 4 idiomas (ES/EN/FR/PT)

## Integrantes

| Nombre | Legajo |
|---|---|
| [Nombre Apellido] | [Legajo] |
| [Nombre Apellido] | [Legajo] |
| [Nombre Apellido] | [Legajo] |
