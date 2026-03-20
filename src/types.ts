export const MOODS = [
    { id: 'tranqui', label: '🧘 Solo tranqui' },
    { id: 'plan', label: '🍿 Plan con alguien' },
    { id: 'reir', label: '😂 Necesito reírme' },
    { id: 'llorar', label: '😭 Para llorar' },
    { id: 'cerebro', label: '💥 Apagar el cerebro' },
    { id: 'pensar', label: '🤯 Algo que me haga pensar' },
] as const;

export type MoodId = (typeof MOODS)[number]['id'];

export type Status = 'pendiente' | 'vista' | 'descartada';

export type MediaType = 'movie' | 'tv';

export interface WatchlistEntry {
    id: number;
    mediaType: MediaType;
    originalTitle: string;
    title: string;
    year: string;
    poster: string | null;
    rating: number;
    moods: MoodId[];
    note: string;
    status: Status;
    addedAt: number;
}

/** Normalized result — works for both movies and TV shows */
export interface TMDBResult {
    id: number;
    mediaType: MediaType;
    originalTitle: string;
    title: string;
    year: string;
    poster_path: string | null;
    vote_average: number;
}
