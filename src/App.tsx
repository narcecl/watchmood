import { useState } from 'react';
import { Info, X } from 'lucide-react';
import { MoodId, MediaType, Status, TMDBResult, WatchlistEntry } from '@/types';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { STORAGE_KEYS } from '@/lib/storage';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import ApiKeyModal from '@/components/ApiKeyModal';
import SettingsModal from '@/components/SettingsModal';
import SearchTab from '@/components/SearchTab';
import WatchlistTab from '@/components/WatchlistTab';
import Logo from '@/components/Logo';

export default function App() {
    const [apiKey, setApiKey] = useLocalStorage<string>(STORAGE_KEYS.apiKey, '');
    const [watchlist, setWatchlist] = useLocalStorage<WatchlistEntry[]>(STORAGE_KEYS.watchlist, []);
    const [infoDismissed, setInfoDismissed] = useLocalStorage<boolean>(
        STORAGE_KEYS.infoDismissed,
        false,
    );
    const [tab, setTab] = useState('search');

    const handleAddMovie = (result: TMDBResult, moods: MoodId[], note: string) => {
        const entry: WatchlistEntry = {
            id: result.id,
            mediaType: result.mediaType,
            originalTitle: result.originalTitle,
            title: result.title,
            year: result.year,
            poster: result.poster,
            rating: result.rating,
            moods,
            note,
            status: 'pendiente',
            addedAt: Date.now(),
        };
        setWatchlist((prev) => [
            entry,
            ...prev.filter(
                (existing) =>
                    !(existing.id === result.id && existing.mediaType === result.mediaType),
            ),
        ]);
    };

    const handleUpdateStatus = (id: number, mediaType: MediaType, status: Status) =>
        setWatchlist((prev) =>
            prev.map((existing) =>
                existing.id === id && existing.mediaType === mediaType
                    ? { ...existing, status }
                    : existing,
            ),
        );

    const handleDelete = (id: number, mediaType: MediaType) =>
        setWatchlist((prev) =>
            prev.filter((existing) => !(existing.id === id && existing.mediaType === mediaType)),
        );

    const handleEditEntry = (id: number, mediaType: MediaType, moods: MoodId[], note: string) =>
        setWatchlist((prev) =>
            prev.map((existing) =>
                existing.id === id && existing.mediaType === mediaType
                    ? { ...existing, moods, note }
                    : existing,
            ),
        );

    return (
        <div className="dark min-h-dvh bg-background text-foreground flex flex-col gap-12">
            {!apiKey && <ApiKeyModal onSave={setApiKey} />}

            <header className="pt-8">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="flex flex-row items-center justify-between gap-4 sm:gap-0">
                        <div className="flex items-center gap-2">
                            <Logo />
                        </div>

                        <div className="flex items-center gap-3">
                            <SettingsModal
                                apiKey={apiKey}
                                onSaveApiKey={setApiKey}
                            />
                        </div>
                    </div>
                </div>
            </header>

            <main>
                <div className="max-w-6xl mx-auto px-4 pb-4">
                    {!infoDismissed && (
                        <Alert
                            variant="info"
                            className="relative mb-6"
                        >
                            <Info className="size-4" />
                            <AlertTitle className="text-white text-base leading-tight">
                                Tus datos son solo tuyos
                            </AlertTitle>
                            <AlertDescription>
                                watchMood guarda tu lista directamente en este navegador usando{' '}
                                <span className="text-white font-bold">localStorage</span>. Esto
                                significa que tu información nunca sale del dispositivo que estás
                                ocupando ahora mismo, pero si limpias los datos del navegador o usas
                                otro dispositivo, tu lista no estará disponible.
                            </AlertDescription>
                            <button
                                type="button"
                                aria-label="Cerrar aviso"
                                onClick={() => setInfoDismissed(true)}
                                className="absolute top-3 right-3 text-blue-400 hover:text-white transition-colors cursor-pointer"
                            >
                                <X className="size-4" />
                            </button>
                        </Alert>
                    )}
                    <Tabs
                        value={tab}
                        onValueChange={setTab}
                        className="flex flex-col gap-6"
                    >
                        <TabsList>
                            <TabsTrigger value="search">Buscar</TabsTrigger>
                            <TabsTrigger
                                value="watchlist"
                                className="flex items-center gap-1.5"
                            >
                                Mi lista
                                {watchlist.length > 0 && (
                                    <Badge
                                        variant="secondary"
                                        className="text-xs px-1.5 py-0 h-4"
                                    >
                                        {watchlist.length}
                                    </Badge>
                                )}
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="search">
                            {apiKey && (
                                <SearchTab
                                    apiKey={apiKey}
                                    watchlist={watchlist}
                                    onAdd={handleAddMovie}
                                    onRemove={(result) => handleDelete(result.id, result.mediaType)}
                                />
                            )}
                        </TabsContent>

                        <TabsContent value="watchlist">
                            <WatchlistTab
                                watchlist={watchlist}
                                apiKey={apiKey}
                                onUpdateStatus={handleUpdateStatus}
                                onDelete={handleDelete}
                                onEdit={handleEditEntry}
                                onSearchTab={() => setTab('search')}
                            />
                        </TabsContent>
                    </Tabs>
                </div>
            </main>
        </div>
    );
}
