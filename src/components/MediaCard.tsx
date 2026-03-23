import { useState } from 'react';
import { TMDBResult, MoodId, Status, WatchlistEntry } from '@/types';
import { IMG_BASE } from '@/lib/tmdb';
import { Check, Star, Tv2, Clapperboard } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
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

    const isWatchlist = props.variant === 'watchlist';

    const poster = isWatchlist ? props.entry.poster : props.result.poster;
    const mediaType = isWatchlist ? props.entry.mediaType : props.result.mediaType;
    const originalTitle = isWatchlist ? props.entry.originalTitle : props.result.originalTitle;
    const title = isWatchlist ? props.entry.title : props.result.title;
    const year = isWatchlist ? props.entry.year : props.result.year;
    const rating = isWatchlist ? props.entry.rating : props.result.rating;
    const id = isWatchlist ? props.entry.id : props.result.id;

    const isDescartada = isWatchlist && props.entry.status === 'descartada';

    return (
        <>
            <Card
                role="button"
                tabIndex={0}
                aria-label={`Ver detalles de ${originalTitle}`}
                className={cn(
                    'group/card cursor-pointer overflow-hidden p-0 gap-0 transition-all hover:ring-brand!',
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
                            className="w-full max-h-80 aspect-2/3 bg-linear-to-b from-neutral-800 to-neutral-950 flex flex-col items-center justify-center gap-1.5 px-4"
                        >
                            {mediaType === 'tv' ? (
                                <Tv2
                                    className="size-8 text-white"
                                    aria-hidden="true"
                                />
                            ) : (
                                <Clapperboard
                                    className="size-8 text-white"
                                    aria-hidden="true"
                                />
                            )}
                            <p className="text-[11px] font-medium text-white/80 text-center leading-snug line-clamp-4">
                                {originalTitle}
                            </p>
                        </div>
                    )}

                    <Badge
                        variant={mediaType === 'tv' ? 'information' : 'secondary'}
                        className="absolute top-2 left-2 text-[10px] px-1.5 py-0.5 opacity-90"
                    >
                        {mediaType === 'tv' ? 'Serie' : 'Película'}
                    </Badge>

                    {isWatchlist && props.entry.status === 'vista' && (
                        <Badge
                            variant="success"
                            className="absolute top-2 right-2 text-[10px] px-1.5 py-0.5 opacity-90"
                        >
                            {STATUS_LABEL[props.entry.status]}
                        </Badge>
                    )}

                    <div className="hidden sm:flex absolute inset-0 bg-black/55 items-center justify-center pb-3 opacity-0 group-hover/card:opacity-100 transition-opacity duration-200 pointer-events-none">
                        {props.variant === 'search' ? (
                            <Button
                                size="sm"
                                variant={props.existingEntry ? 'secondary' : 'default'}
                                className="pointer-events-auto shadow-lg"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (!props.existingEntry) props.onAdd([], '');
                                }}
                                aria-label={
                                    props.existingEntry
                                        ? 'Ya está en tu lista'
                                        : `Añadir ${originalTitle} a tu lista`
                                }
                            >
                                {props.existingEntry ? (
                                    <>
                                        <Check className="size-3.5" /> En lista
                                    </>
                                ) : (
                                    '+ Añadir'
                                )}
                            </Button>
                        ) : isWatchlist ? (
                            <Button
                                size="sm"
                                className="pointer-events-auto shadow-lg"
                                aria-label={`Editar moods de ${originalTitle}`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setEditMoodsOpen(true);
                                }}
                            >
                                Editar moods
                            </Button>
                        ) : null}
                    </div>
                </div>

                <CardContent className="p-3 flex flex-col gap-4">
                    <div>
                        <p
                            className={cn(
                                'font-heading text-sm font-semibold leading-tight line-clamp-2',
                                isDescartada && 'line-through text-muted-foreground',
                            )}
                        >
                            {originalTitle}
                        </p>

                        <div className="flex items-center justify-between">
                            {year && <span className="text-xs text-muted-foreground">{year}</span>}

                            {rating > 0 && (
                                <Badge
                                    variant="secondary"
                                    className="text-xs px-1.5"
                                >
                                    <Star
                                        size={11}
                                        aria-hidden="true"
                                        className="text-amber-500 fill-amber-500"
                                    />
                                    <span className="sr-only">Valoración:</span>
                                    {rating.toFixed(1)}
                                </Badge>
                            )}
                        </div>

                        {isWatchlist && (
                            <div className="sm:hidden mt-4">
                                <Button
                                    className="w-full pointer-events-auto"
                                    aria-label={`Editar moods de ${originalTitle}`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setEditMoodsOpen(true);
                                    }}
                                >
                                    Editar moods
                                </Button>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            <MediaDetailModal
                open={detailOpen}
                onOpenChange={setDetailOpen}
                id={id}
                mediaType={mediaType}
                originalTitle={originalTitle}
                title={title !== originalTitle ? title : undefined}
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

            {isWatchlist && (
                <Dialog
                    open={editMoodsOpen}
                    onOpenChange={setEditMoodsOpen}
                >
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle className="pr-6 line-clamp-1">{originalTitle}</DialogTitle>
                            <DialogDescription>
                                ¿Qué mood se te viene a la cabeza con esta{' '}
                                {mediaType === 'movie' ? 'película' : 'serie'}?
                            </DialogDescription>
                        </DialogHeader>
                        <AddMovieForm
                            initialMoods={props.entry.moods}
                            initialNote={props.entry.note}
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
