import { useQuery } from '@tanstack/react-query';
import { MediaType, Status } from '@/types';
import { fetchDetails, IMG_BASE } from '@/lib/tmdb';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import ProviderImage from './ProviderImage';
import { STATUS_CYCLE, STATUS_LABEL } from '@/lib/const';

type BaseMediaDetailModalProps = {
    apiKey: string;
    id: number;
    mediaType: MediaType;
    onOpenChange: (open: boolean) => void;
    open: boolean;
    originalTitle: string;
    title?: string;
    poster: string | null;
};

type SearchVariantProps = BaseMediaDetailModalProps & {
    isInWatchlist: boolean;
    onAdd?: () => void;
    onRemove?: () => void;
    status?: never;
    onUpdateStatus?: never;
};

type WatchlistVariantProps = BaseMediaDetailModalProps & {
    isInWatchlist: true;
    onRemove: () => void;
    status: Status;
    onUpdateStatus: (status: Status) => void;
    onAdd?: never;
};

type MediaDetailModalProps = SearchVariantProps | WatchlistVariantProps;

export default function MediaDetailModal({
    open,
    onOpenChange,
    id,
    mediaType,
    originalTitle,
    title,
    poster,
    apiKey,
    onAdd,
    onRemove,
    onUpdateStatus,
    isInWatchlist,
    status,
}: MediaDetailModalProps) {
    const { data, isLoading, isError } = useQuery({
        queryKey: ['details', id, mediaType, apiKey],
        queryFn: () => fetchDetails(id, mediaType, apiKey),
        enabled: open,
        staleTime: 10 * 60 * 1000,
    });

    const hasProviders =
        !!data &&
        (data.providers.flatrate.length > 0 ||
            data.providers.rent.length > 0 ||
            data.providers.buy.length > 0);

    const handleWatchlistAction = () => {
        if (isInWatchlist) {
            onRemove?.();
        } else {
            onAdd?.();
        }
    };

    return (
        <Dialog
            open={open}
            onOpenChange={onOpenChange}
        >
            <DialogContent className="p-0 flex flex-col sm:flex-row w-full sm:max-w-3xl! max-h-[90vh] overflow-y-auto">
                <div className="hidden sm:block w-full sm:w-2/4 h-36 sm:h-auto">
                    {poster && (
                        <img
                            src={`${IMG_BASE}${poster}`}
                            alt={originalTitle}
                            loading="lazy"
                            className="w-full h-full object-cover object-top"
                        />
                    )}
                </div>

                <div className="w-full sm:w-2/4 shrink-0 px-4 sm:pl-0 py-4 pr-4">
                    <div className="flex flex-col gap-4 justify-between h-full">
                        {isLoading && (
                            <div
                                className="flex flex-col gap-4 grow"
                                aria-busy="true"
                                aria-label="Cargando detalles"
                            >
                                <div className="flex flex-col gap-2">
                                    <Skeleton className="h-5 w-3/4" />
                                    <Skeleton className="h-4 w-1/2" />
                                </div>
                                <div className="flex gap-1.5">
                                    <Skeleton className="h-5 w-12 rounded-full" />
                                    <Skeleton className="h-5 w-16 rounded-full" />
                                    <Skeleton className="h-5 w-10 rounded-full" />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Skeleton className="h-3 w-full" />
                                    <Skeleton className="h-3 w-full" />
                                    <Skeleton className="h-3 w-5/6" />
                                    <Skeleton className="h-3 w-4/6" />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <Skeleton className="h-3 w-2/3" />
                                    <Skeleton className="h-3 w-3/4" />
                                </div>
                                <div className="border-t border-border pt-4 flex flex-col gap-3">
                                    <Skeleton className="h-4 w-24" />
                                    <div className="flex gap-2">
                                        <Skeleton className="size-6 rounded-xs" />
                                        <Skeleton className="size-6 rounded-xs" />
                                        <Skeleton className="size-6 rounded-xs" />
                                    </div>
                                </div>
                            </div>
                        )}

                        {isError && (
                            <p className="text-destructive text-sm grow">
                                No se pudieron cargar los detalles.
                            </p>
                        )}

                        {data && (
                            <>
                                <div className="flex flex-col gap-4 grow">
                                    <DialogHeader className="gap-0">
                                        <DialogTitle className="text-xl pr-10 line-clamp-2">
                                            {originalTitle}
                                        </DialogTitle>
                                        {title && (
                                            <DialogDescription>
                                                <p className="text-sm text-muted-foreground line-clamp-1">
                                                    {title}
                                                </p>
                                            </DialogDescription>
                                        )}
                                    </DialogHeader>

                                    <div className="flex flex-wrap gap-1">
                                        {data.genres.map((genre) => (
                                            <Badge
                                                key={genre}
                                                variant="secondary"
                                                className="text-xs"
                                            >
                                                {genre}
                                            </Badge>
                                        ))}
                                        {data.runtime && (
                                            <Badge
                                                variant="outline"
                                                className="text-xs"
                                            >
                                                {data.runtime}
                                            </Badge>
                                        )}
                                        {data.seasons && (
                                            <Badge
                                                variant="outline"
                                                className="text-xs"
                                            >
                                                {data.seasons}{' '}
                                                {data.seasons === 1 ? 'temporada' : 'temporadas'}
                                            </Badge>
                                        )}
                                    </div>

                                    {data.overview && (
                                        <p className="text-sm line-clamp-3">{data.overview}</p>
                                    )}

                                    <div>
                                        {data.director && (
                                            <p className="text-xs text-muted-foreground">
                                                <span className="text-foreground font-medium">
                                                    Director:{' '}
                                                </span>
                                                {data.director}
                                            </p>
                                        )}
                                        {data.creators.length > 0 && (
                                            <p className="text-xs text-muted-foreground">
                                                <span className="text-foreground font-medium">
                                                    Creador(es):{' '}
                                                </span>
                                                {data.creators.join(', ')}
                                            </p>
                                        )}
                                        {data.cast.length > 0 && (
                                            <p className="text-xs text-muted-foreground">
                                                <span className="text-foreground font-medium">
                                                    Reparto:{' '}
                                                </span>
                                                {data.cast.join(', ')}
                                            </p>
                                        )}
                                    </div>

                                    <div className="border-t border-border pt-4 flex flex-col">
                                        <h3 className="text-sm font-medium">¿Dónde ver?</h3>

                                        {!hasProviders && (
                                            <p className="text-xs text-muted-foreground">
                                                Sin información de disponibilidad por el momento.
                                            </p>
                                        )}

                                        <div className="flex flex-col gap-2 mt-2">
                                            {data.providers.flatrate.length > 0 && (
                                                <div className="flex flex-col gap-2">
                                                    <h4 className="font-sans text-xs text-muted-foreground">
                                                        Streaming
                                                    </h4>
                                                    <div className="flex flex-wrap gap-2">
                                                        {data.providers.flatrate.map((provider) => (
                                                            <ProviderImage
                                                                key={provider.provider_id}
                                                                provider={provider}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                            {data.providers.buy.length > 0 && (
                                                <div className="flex flex-col gap-2">
                                                    <h4 className="font-sans text-xs text-muted-foreground">
                                                        Compra
                                                    </h4>
                                                    <div className="flex flex-wrap gap-2">
                                                        {data.providers.buy.map((provider) => (
                                                            <ProviderImage
                                                                key={provider.provider_id}
                                                                provider={provider}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    {status && onUpdateStatus && (
                                        <Button
                                            className="w-full"
                                            variant="outline"
                                            aria-label={`Marcar como ${STATUS_LABEL[STATUS_CYCLE[status]]}`}
                                            onClick={() => onUpdateStatus(STATUS_CYCLE[status])}
                                        >
                                            {STATUS_LABEL[status]}
                                        </Button>
                                    )}
                                    {(onAdd || onRemove) && (
                                        <Button
                                            className="w-full"
                                            variant={isInWatchlist ? 'destructive' : 'default'}
                                            onClick={handleWatchlistAction}
                                        >
                                            {isInWatchlist
                                                ? 'Eliminar de mi lista'
                                                : '+ Añadir a mi lista'}
                                        </Button>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
