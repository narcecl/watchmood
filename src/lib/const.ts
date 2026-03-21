import { Status } from '@/types';

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
