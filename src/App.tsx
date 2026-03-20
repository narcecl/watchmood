import { useState } from 'react'
import { MoodId, Status, TMDBMovie, WatchlistEntry } from './types'
import { useLocalStorage } from './hooks/useLocalStorage'
import ApiKeyModal from './components/ApiKeyModal'
import SearchTab from './components/SearchTab'
import WatchlistTab from './components/WatchlistTab'

type Tab = 'search' | 'watchlist'

export default function App() {
  const [apiKey, setApiKey] = useLocalStorage<string>('tmdb_api_key', '')
  const [watchlist, setWatchlist] = useLocalStorage<WatchlistEntry[]>('watchmood_list', [])
  const [tab, setTab] = useState<Tab>('search')

  const handleAddMovie = (movie: TMDBMovie, moods: MoodId[], note: string) => {
    const entry: WatchlistEntry = {
      id: movie.id,
      title: movie.title,
      year: movie.release_date?.slice(0, 4) ?? '—',
      poster: movie.poster_path,
      rating: movie.vote_average,
      moods,
      note,
      status: 'pendiente',
      addedAt: Date.now(),
    }
    setWatchlist(prev => [entry, ...prev.filter(w => w.id !== movie.id)])
  }

  const handleUpdateStatus = (id: number, status: Status) => {
    setWatchlist(prev => prev.map(w => w.id === id ? { ...w, status } : w))
  }

  const handleDelete = (id: number) => {
    setWatchlist(prev => prev.filter(w => w.id !== id))
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {!apiKey && <ApiKeyModal onSave={setApiKey} />}

      {/* Header */}
      <header className="sticky top-0 z-40 bg-gray-950/90 backdrop-blur border-b border-gray-800">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎬</span>
            <h1 className="text-lg font-bold text-white">WatchMood</h1>
          </div>

          {/* Tabs */}
          <nav className="flex gap-1 bg-gray-900 rounded-xl p-1 border border-gray-800">
            <button
              onClick={() => setTab('search')}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition ${
                tab === 'search'
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              🔍 Buscar
            </button>
            <button
              onClick={() => setTab('watchlist')}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition flex items-center gap-1.5 ${
                tab === 'watchlist'
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              📋 Mi Lista
              {watchlist.length > 0 && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                  tab === 'watchlist' ? 'bg-indigo-500 text-white' : 'bg-gray-700 text-gray-300'
                }`}>
                  {watchlist.length}
                </span>
              )}
            </button>
          </nav>

          {/* Reset API key */}
          {apiKey && (
            <button
              onClick={() => { localStorage.removeItem('tmdb_api_key'); setApiKey('') }}
              className="text-xs text-gray-600 hover:text-gray-400 transition"
              title="Cambiar API key"
            >
              🔑
            </button>
          )}
        </div>
      </header>

      {/* Main */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        {tab === 'search' && apiKey && (
          <SearchTab apiKey={apiKey} watchlist={watchlist} onAdd={handleAddMovie} />
        )}
        {tab === 'watchlist' && (
          <WatchlistTab
            watchlist={watchlist}
            onUpdateStatus={handleUpdateStatus}
            onDelete={handleDelete}
          />
        )}
      </main>
    </div>
  )
}
