import { Badge } from '@/components/ui/badge';
import { MoodId } from '@/types';
import { MOOD_DISPLAY } from '@/lib/const';

const colorClass: Record<MoodId, string> = {
    tranqui: 'border-teal-700 bg-teal-900/40 text-teal-300 hover:bg-teal-900/40',
    plan: 'border-yellow-700 bg-yellow-900/40 text-yellow-300 hover:bg-yellow-900/40',
    reir: 'border-orange-700 bg-orange-900/40 text-orange-300 hover:bg-orange-900/40',
    llorar: 'border-blue-700 bg-blue-900/40 text-blue-300 hover:bg-blue-900/40',
    cerebro: 'border-red-700 bg-red-900/40 text-red-300 hover:bg-red-900/40',
    pensar: 'border-purple-700 bg-purple-900/40 text-purple-300 hover:bg-purple-900/40',
};

interface MoodBadgeProps {
    id: MoodId;
}

export default function MoodBadge({ id }: MoodBadgeProps) {
    const display = MOOD_DISPLAY[id];
    if (!display) return null;
    const { Icon, label } = display;

    return (
        <Badge
            variant="outline"
            className={colorClass[id]}
        >
            <Icon
                size={11}
                aria-hidden="true"
            />
            {label}
        </Badge>
    );
}
