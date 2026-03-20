# WatchMood — Claude Guide

Personal mood-tagged watchlist. React + Vite + TypeScript + Tailwind CSS v4 + shadcn/ui. No backend, no auth — localStorage only.

## Stack

| Layer       | Tech                                                                              |
| ----------- | --------------------------------------------------------------------------------- |
| Build       | Vite 6 + `@tailwindcss/vite` (no PostCSS)                                        |
| UI          | React 18, TypeScript strict, shadcn/ui (`@base-ui/react` primitives)             |
| Styles      | Tailwind CSS v4 — `@import "tailwindcss"` in `index.css`, no `tailwind.config.js`|
| Data fetch  | TanStack Query v5 — `QueryClientProvider` in `main.tsx`, `useQuery` in `SearchTab` |
| Persistence | `localStorage` via `useLocalStorage` hook                                         |
| External    | TMDB API (movies + TV) — key stored in localStorage                               |

## Project Structure

```
src/
├── lib/
│   ├── tmdb.ts       — TMDB fetch logic: searchAll(), IMG_BASE constant
│   ├── storage.ts    — Versioned localStorage key constants (STORAGE_KEYS)
│   └── utils.ts      — cn() helper
├── hooks/
│   ├── useLocalStorage.ts  — Generic typed hook with try-catch on read and write
│   └── useDebounce.ts      — Generic debounce hook used by SearchTab
├── components/
│   ├── ui/           — shadcn/ui components (Button, Card, Badge, Dialog, Input, Tabs)
│   ├── ApiKeyModal   — First-load gate; blocked until key is saved
│   ├── SettingsModal — Gear icon in header; currently: change API key
│   ├── MediaCard     — Unified card for search results and watchlist entries (variant prop)
│   ├── AddMovieForm  — Checkbox mood multi-select + note; used inside Dialog
│   ├── MoodBadge     — Colored Badge per MoodId
│   ├── SearchTab     — Debounced search via useQuery, parallel movie+TV fetch, result grid
│   └── WatchlistTab  — Mood-filter bar (incl. "Todos"), filtered grid with status cycle and delete
└── App.tsx           — Tab routing, all shared state, persistence wiring
```

## Key Conventions

**localStorage keys** are defined in `src/lib/storage.ts` as `STORAGE_KEYS`. Bump the version suffix (e.g. `v1 → v2`) when the stored schema changes. Never hardcode key strings elsewhere.

**TMDB logic** lives exclusively in `src/lib/tmdb.ts`. Searches hit `/search/movie` and `/search/tv` in parallel via `Promise.all`. Add new TMDB calls there, not in components.

**TanStack Query** — `QueryClient` is created once in `main.tsx` with `staleTime: 5min, retry: 1`. Search queries use `queryKey: ['search', debouncedQuery, apiKey]` so results are cached per query+key pair. The `enabled` flag prevents fetching on empty input.

**`MediaCard`** is a single component serving both contexts via a discriminated union:
- `variant="search"` — shows "+ Añadir" or "Editar moods" button; dialog with `AddMovieForm` is managed internally
- `variant="watchlist"` — shows status cycle button + "Editar moods" button; dialog managed internally

**`AddMovieForm`** accepts `initialMoods` and `initialNote` for pre-filling when editing an existing entry. The `result` prop is optional and currently unused.

**Editing moods** — `handleAddMovie` in `App.tsx` does an upsert (filter + prepend) for entries coming from search. `handleEditEntry` only updates `moods` and `note` without touching `status` or `addedAt`.

**shadcn/ui version** uses `@base-ui/react` primitives (not Radix UI). The Dialog API differs: use `disablePointerDismissal` instead of `onInteractOutside`, and there is no `dismissible` prop.

**Tailwind v4** — no config file. Utilities are auto-detected. Custom CSS variables live in `src/index.css` under `:root` / `.dark`. The `dark` class is set on `<html>` in `index.html`. Custom animations (`fade-in-up`, `fade-in-down`, `fade-in`) are defined in the `@theme inline` block in `index.css`.

**`mediaType`** — movies and TV shows share the watchlist. Keys and duplicate checks always use `id + mediaType` together, since TMDB IDs are not unique across types.

## Active Skills

Skills in `.claude/skills/` that apply to this project:

### `solid`

Applies when writing or refactoring any code. Key rules enforced here:

- **SRP**: fetch/normalize logic in `lib/tmdb.ts`, storage keys in `lib/storage.ts`, UI in components
- **Early returns over else** — used throughout
- **No inline component definitions** — all components are module-level functions
- **Functional setState** — all `setState` calls that depend on previous state use `prev =>` form

### `vite`

Reference for `vite.config.ts` changes, plugin API, and build configuration. Current config uses `@tailwindcss/vite` and a `@/` path alias pointing to `src/`.

### `vercel-react-best-practices`

64 React performance rules. The ones most relevant to this codebase:

| Rule                               | Status     | Where                                                              |
| ---------------------------------- | ---------- | ------------------------------------------------------------------ |
| `async-parallel`                   | ✅ Applied | `tmdb.ts` — `Promise.all` for movie+TV search                      |
| `rerender-functional-setstate`     | ✅ Applied | All `setWatchlist`, `setSelectedMoods`, `setActiveFilters`         |
| `rerender-lazy-state-init`         | ✅ Applied | `useLocalStorage` — initializer is a function passed to `useState` |
| `rerender-no-inline-components`    | ✅ Applied | No component definitions inside other components                   |
| `rerender-derived-state-no-effect` | ✅ Applied | `filtered` list in `WatchlistTab` is derived during render         |
| `client-localstorage-schema`       | ✅ Applied | Versioned keys in `storage.ts`; try-catch on both read and write   |
