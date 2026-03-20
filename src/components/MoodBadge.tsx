import { MOODS, MoodId } from '../types'

const colors: Record<string, string> = {
  tranqui: 'bg-teal-900/60 text-teal-300 border-teal-700',
  plan: 'bg-yellow-900/60 text-yellow-300 border-yellow-700',
  reir: 'bg-orange-900/60 text-orange-300 border-orange-700',
  llorar: 'bg-blue-900/60 text-blue-300 border-blue-700',
  cerebro: 'bg-red-900/60 text-red-300 border-red-700',
  pensar: 'bg-purple-900/60 text-purple-300 border-purple-700',
}

interface Props {
  id: MoodId
  size?: 'sm' | 'md'
}

export default function MoodBadge({ id, size = 'sm' }: Props) {
  const mood = MOODS.find(m => m.id === id)
  if (!mood) return null
  const base = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1'
  return (
    <span className={`inline-block border rounded-full font-medium ${base} ${colors[id] ?? 'bg-gray-800 text-gray-300 border-gray-600'}`}>
      {mood.label}
    </span>
  )
}
