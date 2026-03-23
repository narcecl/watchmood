import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { MoodId, TMDBResult, WatchlistEntry } from '@/types';
import { searchAll } from '@/lib/tmdb';
import { Input } from '@/components/ui/input';
import MediaCard from './MediaCard';
import { useDebounce } from '@/hooks/useDebounce';
import { Spinner } from '@/components/ui/spinner';
import { X } from 'lucide-react';

interface SearchTabProps {
    apiKey: string;
    watchlist: WatchlistEntry[];
    onAdd: (result: TMDBResult, moods: MoodId[], note: string) => void;
    onRemove: (result: TMDBResult) => void;
}

export default function SearchTab({ apiKey, watchlist, onAdd, onRemove }: SearchTabProps) {
    const [query, setQuery] = useState('');
    const debouncedQuery = useDebounce(query, 500);

    const {
        data: results = [],
        isFetching,
        isError,
    } = useQuery({
        queryKey: ['search', debouncedQuery, apiKey],
        queryFn: () => searchAll(debouncedQuery, apiKey),
        enabled: debouncedQuery.trim().length > 0,
    });

    const resultKey = (r: TMDBResult) => `${r.mediaType}-${r.id}`;

    const watchlistMap = useMemo(
        () => new Map(watchlist.map((entry) => [`${entry.mediaType}-${entry.id}`, entry])),
        [watchlist],
    );
    const existingEntry = (r: TMDBResult) => watchlistMap.get(resultKey(r)) ?? null;

    return (
        <div className="flex flex-col gap-6">
            <div
                role="search"
                className="relative"
            >
                <Input
                    aria-label="Escribe el nombre de una película o serie para empezar"
                    placeholder="Escribe el nombre de una película o serie para empezar"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="px-4 h-12"
                />
                {isFetching && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <Spinner />
                    </div>
                )}
                {query.length > 0 && !isFetching && (
                    <button
                        className="flex items-center justify-center rounded-full size-8 hover:bg-white/10 cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white transition-colors"
                        onClick={() => setQuery('')}
                        aria-label="Limpiar búsqueda"
                        type="button"
                    >
                        <X className="size-4" />
                    </button>
                )}
            </div>

            {isError && (
                <p className="text-destructive text-sm bg-destructive/10 border border-destructive/30 rounded-lg px-4 py-3">
                    No se pudo conectar con TMDB. Verifica tu API key.
                </p>
            )}

            {results.length > 0 && (
                <>
                    <p
                        className="sr-only"
                        aria-live="polite"
                        aria-atomic="true"
                    >
                        {results.length}{' '}
                        {results.length === 1 ? 'resultado encontrado' : 'resultados encontrados'}
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 lg:gap-6">
                        {results.map((item, idx) => {
                            const key = resultKey(item);
                            return (
                                <MediaCard
                                    key={key}
                                    variant="search"
                                    className="animate-fade-in-up"
                                    style={{ animationDelay: `${Math.min(idx * 50, 300)}ms` }}
                                    result={item}
                                    existingEntry={existingEntry(item)}
                                    onAdd={(moods, note) => onAdd(item, moods, note)}
                                    onRemove={() => onRemove(item)}
                                    apiKey={apiKey}
                                />
                            );
                        })}
                    </div>
                </>
            )}

            {!isFetching && debouncedQuery && results.length === 0 && !isError && (
                <div className="px-4 py-8 text-center text-muted-foreground border-2 border-dashed rounded-lg">
                    <p className="text-lg text-white font-medium">Sin resultados</p>
                    <p className="text-sm mt-1">
                        No se encontraron resultados para "{debouncedQuery}"
                    </p>
                </div>
            )}
        </div>
    );
}
