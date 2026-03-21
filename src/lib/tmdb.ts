import { MediaType, TMDBResult } from '@/types';

const BASE = 'https://api.themoviedb.org/3';
export const IMG_BASE = 'https://image.tmdb.org/t/p/w500';
export const PROVIDER_IMG_BASE = 'https://image.tmdb.org/t/p/w92';

export interface TMDBProvider {
    provider_id: number;
    provider_name: string;
    logo_path: string;
}

export interface MediaDetails {
    overview: string;
    tagline: string | null;
    genres: string[];
    runtime: string | null;
    director: string | null;
    creators: string[];
    cast: string[];
    providers: {
        flatrate: TMDBProvider[];
        rent: TMDBProvider[];
        buy: TMDBProvider[];
    };
}

interface RawProviderRegion {
    flatrate?: TMDBProvider[];
    rent?: TMDBProvider[];
    buy?: TMDBProvider[];
}

interface RawDetails {
    overview: string;
    tagline?: string;
    genres: { id: number; name: string }[];
    runtime?: number | null;
    episode_run_time?: number[];
    created_by?: { name: string }[];
    credits: {
        cast: { name: string; order: number }[];
        crew: { name: string; job: string }[];
    };
}

const MAX_CAST_MEMBERS = 6;
const TMDB_DIRECTOR_JOB = 'Director';
const PREFERRED_REGION = 'CL';
const FALLBACK_REGION = 'US';

export async function fetchDetails(id: number, mediaType: MediaType, apiKey: string): Promise<MediaDetails> {
    const qs = `api_key=${apiKey}&language=es-MX&append_to_response=credits`;

    const [detailsRes, providersRes] = await Promise.all([
        fetch(`${BASE}/${mediaType}/${id}?${qs}`),
        fetch(`${BASE}/${mediaType}/${id}/watch/providers?api_key=${apiKey}`),
    ]);

    if (!detailsRes.ok) throw new Error('TMDB request failed');

    const raw = (await detailsRes.json()) as RawDetails;
    const providersJson = providersRes.ok
        ? ((await providersRes.json()) as { results: Record<string, RawProviderRegion> })
        : { results: {} };

    const regionProviders: RawProviderRegion =
        providersJson.results?.[PREFERRED_REGION] ?? providersJson.results?.[FALLBACK_REGION] ?? {};

    const cast = (raw.credits?.cast ?? [])
        .sort((memberA, memberB) => memberA.order - memberB.order)
        .slice(0, MAX_CAST_MEMBERS)
        .map((castMember) => castMember.name);

    const director =
        mediaType === 'movie'
            ? ((raw.credits?.crew ?? []).find((crewMember) => crewMember.job === TMDB_DIRECTOR_JOB)?.name ?? null)
            : null;

    const creators = mediaType === 'tv' ? (raw.created_by ?? []).map((creator) => creator.name) : [];

    let runtime: string | null = null;
    if (mediaType === 'movie' && raw.runtime) {
        const hours = Math.floor(raw.runtime / 60);
        const minutes = raw.runtime % 60;
        runtime = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
    } else if (mediaType === 'tv' && raw.episode_run_time?.[0]) {
        runtime = `${raw.episode_run_time[0]} min / ep`;
    }

    return {
        overview: raw.overview,
        tagline: raw.tagline ?? null,
        genres: raw.genres.map((genre) => genre.name),
        runtime,
        director,
        creators,
        cast,
        providers: {
            flatrate: regionProviders.flatrate ?? [],
            rent: regionProviders.rent ?? [],
            buy: regionProviders.buy ?? [],
        },
    };
}

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
            poster: raw.poster_path,
            rating: raw.vote_average,
        };
    }
    return {
        id: raw.id,
        mediaType: 'tv',
        originalTitle: raw.original_name,
        title: raw.name,
        year: raw.first_air_date?.slice(0, 4) ?? '—',
        poster: raw.poster_path,
        rating: raw.vote_average,
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
