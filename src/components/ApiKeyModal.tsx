import { useState } from 'react'

interface Props {
  onSave: (key: string) => void
}

export default function ApiKeyModal({ onSave }: Props) {
  const [input, setInput] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = input.trim()
    if (trimmed) onSave(trimmed)
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl p-8 max-w-md w-full shadow-2xl border border-gray-700">
        <h2 className="text-2xl font-bold text-white mb-2">🎬 WatchMood</h2>
        <p className="text-gray-400 mb-6 text-sm">
          Para buscar películas necesitamos tu API key de TMDB. Se guarda solo en tu navegador.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Pega tu TMDB API key aquí..."
            value={input}
            onChange={e => setInput(e.target.value)}
            className="bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition"
            autoFocus
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition"
          >
            Guardar y continuar
          </button>
        </form>
        <p className="text-gray-600 text-xs mt-4">
          Consigue tu key gratis en{' '}
          <span className="text-indigo-400">themoviedb.org → Settings → API</span>
        </p>
      </div>
    </div>
  )
}
