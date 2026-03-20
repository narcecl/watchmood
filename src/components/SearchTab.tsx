import { useState, useRef } from 'react'
import { MoodId, TMDBMovie, WatchlistEntry } from '../types'
import AddMovieForm from './AddMovieForm'

const IMG_BASE = 'https://image.tmdb.org/t/p/w500'

interface Props {
  apiKey: string
  watchlist: WatchlistEntry[]
  onAdd: (movie: TMDBMovie, moods: MoodId[], note: string) => void
}

export default function SearchTab({ apiKey, watchlist, onAdd }: Props) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<TMDBMovie[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const search = async (q: string) => {
    if (!q.trim()) { setResults([]); return }
    setLoading(true)
    setError('')
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(q)}&language=es-MX`
      )
      if (!res.ok) throw new Error('Error al buscar')
      const data = await res.json() as { results: TMDBMovie[] }
      setResults(data.results.slice(0, 12))
    } catch {
      setError('No se pudo conectar con TMDB. Verifica tu API key.')
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setQuery(val)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => search(val), 500)
  }

  const inWatchlist = (id: number) => watchlist.some(w => w.id === id)

  return (
    <div className="flex flex-col gap-6">
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">🔍</span>
        <input
          type="text"
          placeholder="Busca una película..."
          value={query}
          onChange={handleChange}
          className="w-full bg-gray-800 border border-gray-700 rounded-xl pl-11 pr-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition text-sm"
          autoFocus
        />
        {loading && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm animate-pulse">
            Buscando...
          </span>
        )}
      </div>

      {error && (
        <p className="text-red-400 text-sm bg-red-900/20 border border-red-800 rounded-lg px-4 py-3">
          {error}
        </p>
      )}

      {results.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {results.map(movie => {
            const year = movie.release_date?.slice(0, 4) ?? '—'
            const already = inWatchlist(movie.id)
            const open = expandedId === movie.id

            return (
              <div key={movie.id} className="flex flex-col bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-gray-600 transition">
                {movie.poster_path ? (
                  <img
                    src={`${IMG_BASE}${movie.poster_path}`}
                    alt={movie.title}
                    className="w-full aspect-[2/3] object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full aspect-[2/3] bg-gray-800 flex items-center justify-center text-4xl">
                    🎬
                  </div>
                )}
                <div className="p-3 flex flex-col gap-2 flex-1">
                  <p className="text-white text-xs font-semibold leading-tight line-clamp-2">{movie.title}</p>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>{year}</span>
                    <span>⭐ {movie.vote_average.toFixed(1)}</span>
                  </div>
                  {already ? (
                    <span className="text-xs text-green-400 font-medium">✓ En tu lista</span>
                  ) : (
                    <button
                      onClick={() => setExpandedId(open ? null : movie.id)}
                      className="mt-auto text-xs bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-1.5 rounded-lg transition"
                    >
                      {open ? 'Cancelar' : '+ Añadir'}
                    </button>
                  )}
                  {open && !already && (
                    <AddMovieForm
                      movie={movie}
                      onAdd={(moods, note) => {
                        onAdd(movie, moods, note)
                        setExpandedId(null)
                      }}
                      onCancel={() => setExpandedId(null)}
                    />
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {!loading && query && results.length === 0 && !error && (
        <p className="text-gray-500 text-sm text-center py-8">Sin resultados para "{query}"</p>
      )}

      {!query && (
        <p className="text-gray-600 text-sm text-center py-12">
          Escribe el nombre de una película para empezar
        </p>
      )}
    </div>
  )
}
