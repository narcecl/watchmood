import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const alertVariants = cva(
    'relative w-full rounded-lg border px-4 py-3 text-sm grid has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-3 gap-y-0.5 items-start [&>svg]:translate-y-0.5 [&>svg]:text-current',
    {
        variants: {
            variant: {
                default: 'bg-card text-card-foreground',
                info: 'bg-blue-950/40 border-blue-800/50 text-blue-200 [&>svg]:text-blue-400',
                destructive:
                    'bg-destructive/10 border-destructive/30 text-destructive [&>svg]:text-destructive',
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    },
);

function Alert({
    className,
    variant,
    ...props
}: React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>) {
    return (
        <div
            role="alert"
            data-slot="alert"
            className={cn(alertVariants({ variant }), className)}
            {...props}
        />
    );
}

function AlertTitle({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
    return (
        <div
            data-slot="alert-title"
            className={cn(
                'font-heading col-start-2 font-medium leading-none tracking-tight',
                className,
            )}
            {...props}
        />
    );
}

function AlertDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
    return (
        <div
            data-slot="alert-description"
            className={cn('col-start-2 text-sm [&_p]:leading-relaxed', className)}
            {...props}
        />
    );
}

export { Alert, AlertTitle, AlertDescription };
