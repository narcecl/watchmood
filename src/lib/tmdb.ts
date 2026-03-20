import { MediaType, TMDBResult } from '@/types';

const BASE = 'https://api.themoviedb.org/3';
export const IMG_BASE = 'https://image.tmdb.org/t/p/w500';

interface RawMovie {
    id: number;
    title: string;
    original_title: string;
    release_date: string;
    poster_path: string | null;
    vote_average: number;
}

interface RawShow {
    id: number;
    name: string;
    original_name: string;
    first_air_date: string;
    poster_path: string | null;
    vote_average: number;
}

function isRawMovie(_raw: RawMovie | RawShow, type: MediaType): _raw is RawMovie {
    return type === 'movie';
}

function normalize(raw: RawMovie, type: 'movie'): TMDBResult;
function normalize(raw: RawShow, type: 'tv'): TMDBResult;
function normalize(raw: RawMovie | RawShow, type: MediaType): TMDBResult {
    if (isRawMovie(raw, type)) { // narrows raw → RawMovie in true branch, RawShow in false
        return {
            id: raw.id,
            mediaType: 'movie',
            originalTitle: raw.original_title,
            title: raw.title,
            year: raw.release_date?.slice(0, 4) ?? '—',
            poster_path: raw.poster_path,
            vote_average: raw.vote_average,
        };
    }
    return {
        id: raw.id,
        mediaType: 'tv',
        originalTitle: raw.original_name,
        title: raw.name,
        year: raw.first_air_date?.slice(0, 4) ?? '—',
        poster_path: raw.poster_path,
        vote_average: raw.vote_average,
    };
}

/** Searches movies and TV shows in parallel, returns up to `limit` interleaved results. */
export async function searchAll(query: string, apiKey: string, limit = 16): Promise<TMDBResult[]> {
    const qs = `api_key=${apiKey}&query=${encodeURIComponent(query)}&language=es-MX`;
    const [moviesRes, showsRes] = await Promise.all([
        fetch(`${BASE}/search/movie?${qs}`),
        fetch(`${BASE}/search/tv?${qs}`),
    ]);

    if (!moviesRes.ok || !showsRes.ok) throw new Error('TMDB request failed');

    const [moviesData, showsData] = await Promise.all([
        moviesRes.json() as Promise<{ results: RawMovie[] }>,
        showsRes.json() as Promise<{ results: RawShow[] }>,
    ]);

    const movies = moviesData.results.slice(0, limit / 2).map((r) => normalize(r, 'movie'));
    const shows = showsData.results.slice(0, limit / 2).map((r) => normalize(r, 'tv'));

    const merged: TMDBResult[] = [];
    const len = Math.max(movies.length, shows.length);
    for (let i = 0; i < len && merged.length < limit; i++) {
        if (movies[i]) merged.push(movies[i]);
        if (shows[i] && merged.length < limit) merged.push(shows[i]);
    }
    return merged;
}
