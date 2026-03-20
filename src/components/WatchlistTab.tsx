import { useState } from 'react';
import { MOODS, MoodId, MediaType, Status, WatchlistEntry } from '@/types';
import { Badge } from '@/components/ui/badge';
import MediaCard from './MediaCard';

interface WatchlistTabProps {
    watchlist: WatchlistEntry[];
    onUpdateStatus: (id: number, mediaType: MediaType, status: Status) => void;
    onDelete: (id: number, mediaType: MediaType) => void;
    onEdit: (id: number, mediaType: MediaType, moods: MoodId[], note: string) => void;
}

export default function WatchlistTab({
    watchlist,
    onUpdateStatus,
    onDelete,
    onEdit,
}: WatchlistTabProps) {
    const [activeFilters, setActiveFilters] = useState<MoodId[]>([]);

    const toggleFilter = (id: MoodId) =>
        setActiveFilters((prev) =>
            prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id],
        );

    const filtered =
        activeFilters.length === 0
            ? watchlist
            : watchlist.filter((w) => activeFilters.some((f) => w.moods.includes(f)));

    if (watchlist.length === 0) {
        return (
            <div className="px-4 py-8 text-center text-muted-foreground border-2 border-dashed rounded-lg">
                <p className="text-lg text-white font-medium">Tu lista está vacía</p>
                <p className="text-sm mt-1">
                    Busca películas en la pestaña "Buscar" y añadelas a tu lista para verlas aquí
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-wrap gap-2">
                <div className="w-full sm:w-auto flex flex-wrap gap-1 overflow-x-auto sm:overflow-x-auto">
                    <Badge
                        variant={activeFilters.length === 0 ? 'default' : 'outline'}
                        onClick={() => setActiveFilters([])}
                        className="cursor-pointer text-sm px-3 py-1 h-auto shrink-0"
                    >
                        Todos
                    </Badge>
                    {MOODS.map((mood) => (
                        <Badge
                            key={mood.id}
                            variant={activeFilters.includes(mood.id) ? 'default' : 'outline'}
                            onClick={() => toggleFilter(mood.id)}
                            className="cursor-pointer text-sm px-3 py-1 h-auto shrink-0"
                        >
                            {mood.label}
                        </Badge>
                    ))}
                </div>
            </div>

            {filtered.length === 0 && (
                <div className="px-4 py-8 text-center text-muted-foreground border-2 border-dashed rounded-lg">
                    <p className="text-lg text-white font-medium">Sin resultados</p>
                    <p className="text-sm mt-1">
                        Ninguna película coincide con los filtros seleccionados
                    </p>
                </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {filtered.map((entry, idx) => (
                    <MediaCard
                        key={`${entry.mediaType}-${entry.id}`}
                        variant="watchlist"
                        className="animate-fade-in-up"
                        style={{ animationDelay: `${idx * 50}ms` }}
                        entry={entry}
                        onUpdateStatus={(status) =>
                            onUpdateStatus(entry.id, entry.mediaType, status)
                        }
                        onDelete={() => onDelete(entry.id, entry.mediaType)}
                        onEdit={(moods, note) => onEdit(entry.id, entry.mediaType, moods, note)}
                    />
                ))}
            </div>
        </div>
    );
}
