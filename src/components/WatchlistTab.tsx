import { useState } from 'react'
import { MOODS, MoodId, Status, WatchlistEntry } from '../types'
import MoodBadge from './MoodBadge'

const IMG_BASE = 'https://image.tmdb.org/t/p/w500'

const STATUS_CYCLE: Record<Status, Status> = {
  pendiente: 'vista',
  vista: 'descartada',
  descartada: 'pendiente',
}

const STATUS_LABEL: Record<Status, string> = {
  pendiente: '⏳ Pendiente',
  vista: '✅ Vista',
  descartada: '🗑 Descartada',
}

const STATUS_STYLE: Record<Status, string> = {
  pendiente: 'bg-gray-700 text-gray-300 border-gray-600',
  vista: 'bg-green-900/50 text-green-300 border-green-700',
  descartada: 'bg-red-900/30 text-red-400 border-red-800',
}

interface Props {
  watchlist: WatchlistEntry[]
  onUpdateStatus: (id: number, status: Status) => void
  onDelete: (id: number) => void
}

export default function WatchlistTab({ watchlist, onUpdateStatus, onDelete }: Props) {
  const [activeFilters, setActiveFilters] = useState<MoodId[]>([])

  const toggleFilter = (id: MoodId) => {
    setActiveFilters(prev =>
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    )
  }

  const filtered =
    activeFilters.length === 0
      ? watchlist
      : watchlist.filter(w => activeFilters.some(f => w.moods.includes(f)))

  if (watchlist.length === 0) {
    return (
      <div className="text-center py-20 text-gray-500">
        <p className="text-4xl mb-4">🎬</p>
        <p className="text-lg font-medium text-gray-400">Tu lista está vacía</p>
        <p className="text-sm mt-1">Busca películas en la pestaña "Buscar" para añadirlas</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Mood filter bar */}
      <div className="flex flex-wrap gap-2">
        {MOODS.map(mood => (
          <button
            key={mood.id}
            onClick={() => toggleFilter(mood.id)}
            className={`text-sm px-3 py-1.5 rounded-full border font-medium transition ${
              activeFilters.includes(mood.id)
                ? 'bg-indigo-600 border-indigo-500 text-white'
                : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-500 hover:text-gray-200'
            }`}
          >
            {mood.label}
          </button>
        ))}
        {activeFilters.length > 0 && (
          <button
            onClick={() => setActiveFilters([])}
            className="text-sm px-3 py-1.5 rounded-full border border-gray-700 text-gray-500 hover:text-gray-300 transition"
          >
            × Limpiar
          </button>
        )}
      </div>

      {filtered.length === 0 && (
        <p className="text-gray-500 text-sm text-center py-8">
          Ninguna película coincide con los filtros seleccionados
        </p>
      )}

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filtered.map(entry => {
          const isDescartada = entry.status === 'descartada'
          return (
            <div
              key={entry.id}
              className={`flex flex-col bg-gray-900 rounded-xl overflow-hidden border transition ${
                isDescartada ? 'border-gray-800 opacity-50' : 'border-gray-800 hover:border-gray-600'
              }`}
            >
              <div className="relative">
                {entry.poster ? (
                  <img
                    src={`${IMG_BASE}${entry.poster}`}
                    alt={entry.title}
                    className={`w-full aspect-[2/3] object-cover ${isDescartada ? 'grayscale' : ''}`}
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full aspect-[2/3] bg-gray-800 flex items-center justify-center text-4xl">
                    🎬
                  </div>
                )}
                <button
                  onClick={() => onDelete(entry.id)}
                  title="Eliminar"
                  className="absolute top-2 right-2 bg-black/60 hover:bg-red-900/80 text-gray-300 hover:text-white rounded-full w-7 h-7 flex items-center justify-center text-xs transition"
                >
                  ✕
                </button>
              </div>

              <div className="p-3 flex flex-col gap-2 flex-1">
                <p className={`text-xs font-semibold leading-tight line-clamp-2 ${isDescartada ? 'line-through text-gray-500' : 'text-white'}`}>
                  {entry.title}
                </p>
                <p className="text-xs text-gray-500">{entry.year} · ⭐ {entry.rating.toFixed(1)}</p>

                {/* Moods */}
                <div className="flex flex-wrap gap-1">
                  {entry.moods.map(m => (
                    <MoodBadge key={m} id={m} />
                  ))}
                </div>

                {/* Note */}
                {entry.note && (
                  <p className="text-xs text-gray-400 italic line-clamp-2">"{entry.note}"</p>
                )}

                {/* Status toggle */}
                <button
                  onClick={() => onUpdateStatus(entry.id, STATUS_CYCLE[entry.status])}
                  className={`mt-auto text-xs font-semibold py-1.5 rounded-lg border transition ${STATUS_STYLE[entry.status]}`}
                >
                  {STATUS_LABEL[entry.status]}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
