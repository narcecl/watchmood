import { useState } from 'react';
import { TMDBResult, MoodId, Status, WatchlistEntry } from '@/types';
import { IMG_BASE } from '@/lib/tmdb';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import AddMovieForm from './AddMovieForm';
import MediaDetailModal from './MediaDetailModal';
import { STATUS_LABEL } from '@/lib/const';

type SearchVariant = {
    variant: 'search';
    result: TMDBResult;
    existingEntry: WatchlistEntry | null;
    onAdd: (moods: MoodId[], note: string) => void;
    onRemove: () => void;
    apiKey: string;
};

type WatchlistVariant = {
    variant: 'watchlist';
    entry: WatchlistEntry;
    onUpdateStatus: (status: Status) => void;
    onDelete: () => void;
    onEdit: (moods: MoodId[], note: string) => void;
    apiKey: string;
};

type MediaCardProps = React.HTMLAttributes<HTMLDivElement> & (SearchVariant | WatchlistVariant);

export default function MediaCard(props: MediaCardProps) {
    const [detailOpen, setDetailOpen] = useState(false);
    const [editMoodsOpen, setEditMoodsOpen] = useState(false);
    const { className, style } = props;

    const onWatchlist = props.variant === 'watchlist';

    const poster = onWatchlist ? props.entry.poster : props.result.poster;
    const mediaType = onWatchlist ? props.entry.mediaType : props.result.mediaType;
    const originalTitle = onWatchlist ? props.entry.originalTitle : props.result.originalTitle;
    const title = onWatchlist ? props.entry.title : props.result.title;
    const year = onWatchlist ? props.entry.year : props.result.year;
    const rating = onWatchlist ? props.entry.rating : props.result.rating;
    const id = onWatchlist ? props.entry.id : props.result.id;

    const isDescartada = onWatchlist && props.entry.status === 'descartada';
    const showLocalTitle = title !== originalTitle;

    return (
        <>
            <Card
                role="button"
                tabIndex={0}
                aria-label={`Ver detalles de ${originalTitle}`}
                className={cn(
                    'cursor-pointer overflow-hidden p-0 gap-0 transition-all hover:ring-amber-500!',
                    isDescartada && 'opacity-50',
                    className,
                )}
                style={style}
                onClick={() => setDetailOpen(true)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setDetailOpen(true);
                    }
                }}
            >
                <div className="relative">
                    {poster ? (
                        <div className="max-h-80 overflow-hidden">
                            <img
                                src={`${IMG_BASE}${poster}`}
                                alt={originalTitle}
                                className={cn(
                                    'w-full aspect-2/3 object-cover',
                                    isDescartada && 'grayscale',
                                )}
                                loading="lazy"
                            />
                        </div>
                    ) : (
                        <div
                            role="img"
                            aria-label={`Sin póster para ${originalTitle}`}
                            className="w-full aspect-2/3 bg-muted flex items-center justify-center text-4xl"
                        >
                            <span aria-hidden="true">{mediaType === 'tv' ? '📺' : '🎬'}</span>
                        </div>
                    )}

                    <Badge
                        variant="secondary"
                        className="absolute top-2 left-2 text-[10px] px-1.5 py-0.5 opacity-90"
                    >
                        {mediaType === 'tv' ? 'Serie' : 'Película'}
                    </Badge>

                    {onWatchlist && props.entry.status === 'vista' && (
                        <Badge
                            variant="success"
                            className="absolute top-2 right-2 text-[10px] px-1.5 py-0.5 opacity-90"
                        >
                            {STATUS_LABEL[props.entry.status]}
                        </Badge>
                    )}
                </div>

                <CardContent className="p-3 flex flex-col gap-2">
                    <div>
                        <p
                            className={cn(
                                'text-sm font-semibold leading-tight line-clamp-2',
                                isDescartada && 'line-through text-muted-foreground',
                            )}
                        >
                            {originalTitle}
                        </p>
                        <p className="text-[10px] text-muted-foreground leading-tight line-clamp-1 mt-0.5">
                            {showLocalTitle ? title : '-'}
                        </p>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">{year}</span>
                        <Badge variant="secondary" className="text-xs px-1.5">
                            <span aria-hidden="true">⭐</span>
                            <span className="sr-only">Valoración:</span>
                            {' '}{rating.toFixed(1)}
                        </Badge>
                    </div>

                    {onWatchlist && (
                        <div className="mt-auto">
                            <Button
                                variant="ghost"
                                className="w-full text-xs text-muted-foreground"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setEditMoodsOpen(true);
                                }}
                            >
                                Editar moods
                            </Button>
                        </div>
                    )}

                    {props.variant === 'search' && props.existingEntry && (
                        <span
                            className="text-xs text-green-500 font-medium"
                            aria-label="Ya está en tu lista"
                        >
                            ✓ En tu lista
                        </span>
                    )}
                </CardContent>
            </Card>

            <MediaDetailModal
                open={detailOpen}
                onOpenChange={setDetailOpen}
                id={id}
                mediaType={mediaType}
                originalTitle={originalTitle}
                poster={poster}
                apiKey={props.apiKey}
                {...(props.variant === 'search'
                    ? {
                          onAdd: () => props.onAdd([], ''),
                          onRemove: props.onRemove,
                          isInWatchlist: !!props.existingEntry,
                      }
                    : {
                          onRemove: props.onDelete,
                          isInWatchlist: true,
                          status: props.entry.status,
                          onUpdateStatus: props.onUpdateStatus,
                      })}
            />

            {onWatchlist && (
                <Dialog
                    open={editMoodsOpen}
                    onOpenChange={setEditMoodsOpen}
                >
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle className="pr-6 line-clamp-1">{originalTitle}</DialogTitle>
                        </DialogHeader>
                        <AddMovieForm
                            mediaType={mediaType}
                            initialMoods={props.entry.moods}
                            onAdd={(moods, note) => {
                                props.onEdit(moods, note);
                                setEditMoodsOpen(false);
                            }}
                            onCancel={() => setEditMoodsOpen(false)}
                        />
                    </DialogContent>
                </Dialog>
            )}
        </>
    );
}
