import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { MoodId, TMDBResult, WatchlistEntry } from '@/types';
import { searchAll } from '@/lib/tmdb';
import { Input } from '@/components/ui/input';
import MediaCard from './MediaCard';
import { useDebounce } from '@/hooks/useDebounce';

interface SearchTabProps {
    apiKey: string;
    watchlist: WatchlistEntry[];
    onAdd: (result: TMDBResult, moods: MoodId[], note: string) => void;
}

export default function SearchTab({ apiKey, watchlist, onAdd }: SearchTabProps) {
    const [query, setQuery] = useState('');
    const debouncedQuery = useDebounce(query, 500);

    const { data: results = [], isFetching, isError } = useQuery({
        queryKey: ['search', debouncedQuery, apiKey],
        queryFn: () => searchAll(debouncedQuery, apiKey),
        enabled: debouncedQuery.trim().length > 0,
    });

    const resultKey = (r: TMDBResult) => `${r.mediaType}-${r.id}`;
    const existingEntry = (r: TMDBResult) =>
        watchlist.find((w) => w.id === r.id && w.mediaType === r.mediaType) ?? null;

    return (
        <div className="flex flex-col gap-6">
            <div className="relative">
                <Input
                    placeholder="Busca una película o serie..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="h-11"
                    autoFocus
                />
                {isFetching && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs animate-pulse">
                        Buscando...
                    </span>
                )}
            </div>

            {isError && (
                <p className="text-destructive text-sm bg-destructive/10 border border-destructive/30 rounded-lg px-4 py-3">
                    No se pudo conectar con TMDB. Verifica tu API key.
                </p>
            )}

            {results.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {results.map((item, idx) => {
                        const key = resultKey(item);
                        return (
                            <MediaCard
                                key={key}
                                variant="search"
                                className="animate-fade-in-up"
                                style={{ animationDelay: `${idx * 50}ms` }}
                                result={item}
                                existingEntry={existingEntry(item)}
                                onAdd={(moods, note) => onAdd(item, moods, note)}
                            />
                        );
                    })}
                </div>
            )}

            {!isFetching && debouncedQuery && results.length === 0 && !isError && (
                <p className="text-muted-foreground text-sm text-center py-8">
                    Sin resultados para "{debouncedQuery}"
                </p>
            )}

            {!query && (
                <p className="text-muted-foreground text-sm text-center py-12">
                    Escribe el nombre de una película o serie para empezar
                </p>
            )}
        </div>
    );
}
