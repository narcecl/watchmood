import { type LucideIcon, Sofa, Users, Laugh, Heart, Zap, Brain } from 'lucide-react';
import { MoodId, Status } from '@/types';

export const MOOD_DISPLAY: Record<MoodId, { Icon: LucideIcon; label: string }> = {
    tranqui: { Icon: Sofa, label: 'Solo tranqui' },
    plan: { Icon: Users, label: 'Plan con alguien' },
    reir: { Icon: Laugh, label: 'Necesito reírme' },
    llorar: { Icon: Heart, label: 'Para llorar' },
    cerebro: { Icon: Zap, label: 'Apagar el cerebro' },
    pensar: { Icon: Brain, label: 'Algo que me haga pensar' },
};

export const STATUS_CYCLE: Record<Status, Status> = {
    pendiente: 'vista',
    vista: 'descartada',
    descartada: 'pendiente',
};

export const STATUS_LABEL: Record<Status, string> = {
    pendiente: 'Pendiente de ver',
    vista: 'Vista',
    descartada: 'Descartada',
};
