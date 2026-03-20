import { useState } from 'react';
import { TMDBResult, MoodId, Status, WatchlistEntry } from '@/types';
import { IMG_BASE } from '@/lib/tmdb';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import AddMovieForm from './AddMovieForm';

const STATUS_CYCLE: Record<Status, Status> = {
    pendiente: 'vista',
    vista: 'descartada',
    descartada: 'pendiente',
};

const STATUS_LABEL: Record<Status, string> = {
    pendiente: '⏳ Pendiente',
    vista: '✅ Vista',
    descartada: '🗑 Descartada',
};

type SearchVariant = {
    variant: 'search';
    result: TMDBResult;
    existingEntry: WatchlistEntry | null;
    onAdd: (moods: MoodId[], note: string) => void;
};

type WatchlistVariant = {
    variant: 'watchlist';
    entry: WatchlistEntry;
    onUpdateStatus: (status: Status) => void;
    onDelete: () => void;
    onEdit: (moods: MoodId[], note: string) => void;
};

type MediaCardProps = React.HTMLAttributes<HTMLDivElement> & (SearchVariant | WatchlistVariant);

export default function MediaCard(props: MediaCardProps) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const { className, style } = props;

    const poster = props.variant === 'watchlist' ? props.entry.poster : props.result.poster_path;
    const mediaType =
        props.variant === 'watchlist' ? props.entry.mediaType : props.result.mediaType;
    const originalTitle =
        props.variant === 'watchlist' ? props.entry.originalTitle : props.result.originalTitle;
    const title = props.variant === 'watchlist' ? props.entry.title : props.result.title;
    const year = props.variant === 'watchlist' ? props.entry.year : props.result.year;
    const rating = props.variant === 'watchlist' ? props.entry.rating : props.result.vote_average;

    const isDescartada = props.variant === 'watchlist' && props.entry.status === 'descartada';
    const showLocalTitle = title !== originalTitle;

    return (
        <Card
            className={cn(
                'cursor-default overflow-hidden p-0 gap-0 transition-all hover:scale-[1.02] hover:ring-amber-500!',
                isDescartada && 'opacity-50',
                className,
            )}
            style={style}
        >
            <div className="relative">
                {poster ? (
                    <img
                        src={`${IMG_BASE}${poster}`}
                        alt={originalTitle}
                        className={cn(
                            'w-full aspect-2/3 object-cover',
                            isDescartada && 'grayscale',
                        )}
                        loading="lazy"
                    />
                ) : (
                    <div className="w-full aspect-2/3 bg-muted flex items-center justify-center text-4xl">
                        {mediaType === 'tv' ? '📺' : '🎬'}
                    </div>
                )}

                <Badge
                    variant="secondary"
                    className="absolute top-2 left-2 text-[10px] px-1.5 py-0.5 opacity-90"
                >
                    {mediaType === 'tv' ? 'Serie' : 'Película'}
                </Badge>

                {props.variant === 'watchlist' && (
                    <button
                        onClick={props.onDelete}
                        title="Eliminar"
                        className="absolute top-2 right-2 bg-black/60 hover:bg-destructive/80 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs transition-colors"
                    >
                        ✕
                    </button>
                )}
            </div>

            <CardContent className="p-3 flex flex-col gap-2">
                <div>
                    <p
                        className={cn(
                            'text-xs font-semibold leading-tight line-clamp-2',
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
                    <Badge
                        variant="secondary"
                        className="text-xs px-1.5"
                    >
                        ⭐ {rating.toFixed(1)}
                    </Badge>
                </div>

                {props.variant === 'watchlist' && (
                    <>
                        {props.entry.note && (
                            <p className="text-xs text-muted-foreground italic line-clamp-2">
                                "{props.entry.note}"
                            </p>
                        )}

                        <div className="mt-auto flex flex-col gap-1.5">
                            <Button
                                variant="outline"
                                size="sm"
                                className="w-full text-xs h-7"
                                onClick={() =>
                                    props.onUpdateStatus(STATUS_CYCLE[props.entry.status])
                                }
                            >
                                {STATUS_LABEL[props.entry.status]}
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="w-full text-xs h-7 text-muted-foreground"
                                onClick={() => setDialogOpen(true)}
                            >
                                Editar moods
                            </Button>
                        </div>

                        <Dialog
                            open={dialogOpen}
                            onOpenChange={setDialogOpen}
                        >
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle className="pr-6 line-clamp-1">
                                        {originalTitle}
                                    </DialogTitle>
                                </DialogHeader>
                                <AddMovieForm
                                    initialMoods={props.entry.moods}
                                    initialNote={props.entry.note}
                                    onAdd={(moods, note) => {
                                        props.onEdit(moods, note);
                                        setDialogOpen(false);
                                    }}
                                    onCancel={() => setDialogOpen(false)}
                                />
                            </DialogContent>
                        </Dialog>
                    </>
                )}

                {props.variant === 'search' && (
                    <>
                        {props.existingEntry && (
                            <span className="text-xs text-green-500 font-medium">
                                ✓ En tu lista
                            </span>
                        )}
                        <Button
                            variant={props.existingEntry ? 'outline' : 'default'}
                            className="w-full text-xs"
                            onClick={() => setDialogOpen(true)}
                        >
                            {props.existingEntry ? 'Editar moods' : 'Añadir a mi lista'}
                        </Button>

                        <Dialog
                            open={dialogOpen}
                            onOpenChange={setDialogOpen}
                        >
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle className="pr-6 line-clamp-1">
                                        {originalTitle}
                                    </DialogTitle>
                                </DialogHeader>
                                <AddMovieForm
                                    result={props.result}
                                    initialMoods={props.existingEntry?.moods}
                                    initialNote={props.existingEntry?.note}
                                    onAdd={(moods, note) => {
                                        props.onAdd(moods, note);
                                        setDialogOpen(false);
                                    }}
                                    onCancel={() => setDialogOpen(false)}
                                />
                            </DialogContent>
                        </Dialog>
                    </>
                )}
            </CardContent>
        </Card>
    );
}
