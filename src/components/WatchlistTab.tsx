import { useState } from 'react';
import { MOODS, MoodId, MediaType, Status, WatchlistEntry } from '@/types';
import { MOOD_DISPLAY } from '@/lib/const';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import MediaCard from './MediaCard';

interface WatchlistTabProps {
    watchlist: WatchlistEntry[];
    apiKey: string;
    onUpdateStatus: (id: number, mediaType: MediaType, status: Status) => void;
    onDelete: (id: number, mediaType: MediaType) => void;
    onEdit: (id: number, mediaType: MediaType, moods: MoodId[], note: string) => void;
    onSearchTab: () => void;
}

export default function WatchlistTab({
    watchlist,
    apiKey,
    onUpdateStatus,
    onDelete,
    onEdit,
    onSearchTab,
}: WatchlistTabProps) {
    const [activeFilters, setActiveFilters] = useState<MoodId[]>([]);

    const toggleFilter = (id: MoodId) =>
        setActiveFilters((prev) =>
            prev.includes(id) ? prev.filter((moodId) => moodId !== id) : [...prev, id],
        );

    const filtered =
        activeFilters.length === 0
            ? watchlist
            : watchlist.filter((entry) =>
                  activeFilters.some((filter) => entry.moods.includes(filter)),
              );

    if (watchlist.length === 0) {
        return (
            <div className="px-4 py-10 text-center text-muted-foreground border-2 border-dashed rounded-lg flex flex-col items-center gap-4">
                <div>
                    <p className="text-lg text-white font-medium">Tu lista está vacía</p>
                    <p className="text-sm mt-1">
                        Busca películas y series para añadirlas a tu lista
                    </p>
                </div>
                <Button
                    variant="outline"
                    onClick={onSearchTab}
                >
                    Ir a Buscar
                </Button>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="w-full flex flex-row sm:flex-wrap gap-2 overflow-x-auto">
                <button
                    type="button"
                    aria-pressed={activeFilters.length === 0}
                    onClick={() => setActiveFilters([])}
                    className={cn(
                        'flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm cursor-pointer transition-colors duration-150 select-none hover:bg-brand/30 hover:border-brand/50',
                        activeFilters.length === 0
                            ? 'bg-brand! border border-transparent text-[#0a0a0f] font-medium'
                            : 'bg-[#1a1a24] border border-[#333] text-white',
                    )}
                >
                    Todos
                </button>

                {MOODS.map((mood) => {
                    const { Icon, label } = MOOD_DISPLAY[mood.id];
                    const isActive = activeFilters.includes(mood.id);
                    return (
                        <button
                            key={mood.id}
                            type="button"
                            aria-pressed={isActive}
                            onClick={() => toggleFilter(mood.id)}
                            className={cn(
                                'flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm cursor-pointer transition-colors duration-150 select-none hover:bg-brand/30 hover:border-brand/50',
                                isActive
                                    ? 'bg-brand! border border-transparent text-[#0a0a0f] font-medium'
                                    : 'bg-[#1a1a24] border border-[#333] text-white',
                            )}
                        >
                            <Icon
                                size={15}
                                aria-hidden="true"
                            />
                            {label}
                        </button>
                    );
                })}
            </div>

            {filtered.length === 0 && (
                <div className="px-4 py-8 text-center text-muted-foreground border-2 border-dashed rounded-lg">
                    <p className="text-lg text-white font-medium">Sin resultados</p>
                    <p className="text-sm mt-1">
                        Ninguna película coincide con los filtros seleccionados
                    </p>
                </div>
            )}

            <p
                className="sr-only"
                aria-live="polite"
                aria-atomic="true"
            >
                {filtered.length} {filtered.length === 1 ? 'resultado' : 'resultados'}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 lg:gap-6">
                {filtered.map((entry, idx) => (
                    <MediaCard
                        key={`${entry.mediaType}-${entry.id}`}
                        variant="watchlist"
                        className="animate-fade-in-up"
                        style={{ animationDelay: `${Math.min(idx * 50, 400)}ms` }}
                        entry={entry}
                        apiKey={apiKey}
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
