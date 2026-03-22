import { PROVIDER_IMG_BASE, TMDBProvider } from '@/lib/tmdb';

export default function ProviderImage({ provider }: { provider: TMDBProvider }) {
    return (
        <img
            src={`${PROVIDER_IMG_BASE}${provider.logo_path}`}
            alt={provider.provider_name}
            title={provider.provider_name}
            loading="lazy"
            width={40}
            height={40}
            className="size-10 rounded-sm"
        />
    );
}
