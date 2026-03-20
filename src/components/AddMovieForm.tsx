import { useState } from 'react'
import { MOODS, MoodId, TMDBMovie } from '../types'

interface Props {
  movie: TMDBMovie
  onAdd: (moods: MoodId[], note: string) => void
  onCancel: () => void
}

export default function AddMovieForm({ movie: _movie, onAdd, onCancel }: Props) {
  const [selectedMoods, setSelectedMoods] = useState<MoodId[]>([])
  const [note, setNote] = useState('')

  const toggleMood = (id: MoodId) => {
    setSelectedMoods(prev =>
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAdd(selectedMoods, note.trim())
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-3 p-3 bg-gray-800 rounded-xl border border-gray-700 flex flex-col gap-3"
    >
      <p className="text-xs text-gray-400 font-medium">¿Con qué mood lo verías?</p>
      <div className="flex flex-wrap gap-1.5">
        {MOODS.map(mood => (
          <button
            key={mood.id}
            type="button"
            onClick={() => toggleMood(mood.id)}
            className={`text-xs px-2.5 py-1 rounded-full border transition font-medium ${
              selectedMoods.includes(mood.id)
                ? 'bg-indigo-600 border-indigo-500 text-white'
                : 'bg-gray-700 border-gray-600 text-gray-300 hover:border-gray-400'
            }`}
          >
            {mood.label}
          </button>
        ))}
      </div>
      <input
        type="text"
        placeholder="Nota opcional (¿por qué la guardas?)"
        value={note}
        onChange={e => setNote(e.target.value)}
        className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition"
      />
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={selectedMoods.length === 0}
          className="flex-1 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold py-2 rounded-lg transition"
        >
          Guardar en lista
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 text-sm text-gray-400 hover:text-white border border-gray-600 rounded-lg transition"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}
