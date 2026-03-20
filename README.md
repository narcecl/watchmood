# WatchMood

Lista de películas y series etiquetada por mood. Sin backend, sin cuenta — todo vive en tu navegador.

## Qué hace

- Busca películas y series en tiempo real via TMDB
- Etiqueta cada título con uno o más moods antes de guardarlo
- Filtra tu lista por mood para decidir qué ver según cómo te sientes
- Cicla el estado de cada título: Pendiente → Vista → Descartada
- Edita los moods de cualquier entrada desde la búsqueda o desde tu lista

## Stack

- **React 18** + **TypeScript** strict
- **Vite 6** + **Tailwind CSS v4** (sin `tailwind.config.js`)
- **shadcn/ui** sobre `@base-ui/react`
- **TanStack Query v5** para el fetch con caché
- **localStorage** — sin base de datos ni autenticación

## Setup

### 1. Instala dependencias

```bash
npm install
```

### 2. Consigue una API key de TMDB

Crea una cuenta en [themoviedb.org](https://www.themoviedb.org/) y genera una API key en _Settings → API_.

### 3. Corre el proyecto

```bash
npm run dev
```

La primera vez que abras la app te pedirá la API key. Se guarda en `localStorage` y no sale de tu navegador.

## Scripts

| Comando         | Descripción                        |
| --------------- | ---------------------------------- |
| `npm run dev`   | Servidor de desarrollo             |
| `npm run build` | Build de producción (`dist/`)      |
| `npm run lint`  | ESLint                             |
| `npm run format`| Prettier                           |

## Estructura

```
src/
├── lib/
│   ├── tmdb.ts          — Lógica de búsqueda TMDB
│   └── storage.ts       — Claves versionadas de localStorage
├── hooks/
│   ├── useLocalStorage.ts
│   └── useDebounce.ts
├── components/
│   ├── ui/              — Componentes shadcn/ui
│   ├── MediaCard        — Card unificada (búsqueda y lista)
│   ├── AddMovieForm     — Selector de moods con checkboxes
│   ├── SearchTab        — Búsqueda con debounce y caché
│   └── WatchlistTab     — Lista filtrable por mood
└── App.tsx              — Estado global y persistencia
```
