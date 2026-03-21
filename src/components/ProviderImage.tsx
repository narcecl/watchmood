import { PROVIDER_IMG_BASE, TMDBProvider } from '@/lib/tmdb';

export default function ProviderImage({ provider }: { provider: TMDBProvider }) {
    return (
        <img
            src={`${PROVIDER_IMG_BASE}${provider.logo_path}`}
            alt={provider.provider_name}
            title={provider.provider_name}
            className="size-8 rounded-xs"
        />
    );
}
