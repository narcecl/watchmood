import { Tabs as TabsPrimitive } from '@base-ui/react/tabs';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

function Tabs({ className, orientation = 'horizontal', ...props }: TabsPrimitive.Root.Props) {
    return (
        <TabsPrimitive.Root
            data-slot="tabs"
            data-orientation={orientation}
            className={cn('group/tabs flex gap-2 data-horizontal:flex-col', className)}
            {...props}
        />
    );
}

const tabsListVariants = cva(
    [
        'group/tabs-list flex text-muted-foreground data-[variant=line]:rounded-none w-full border-b',
        'group-data-vertical/tabs:h-fit group-data-vertical/tabs:flex-col group-data-vertical/tabs:pb-0 group-data-vertical/tabs:border-b-0 group-data-vertical/tabs:border-r',
        'gap-4',
    ],
    {
        variants: {
            variant: {
                default: '',
                line: 'gap-1 bg-transparent',
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    },
);

function TabsList({
    className,
    variant = 'default',
    ...props
}: TabsPrimitive.List.Props & VariantProps<typeof tabsListVariants>) {
    return (
        <TabsPrimitive.List
            data-slot="tabs-list"
            data-variant={variant}
            className={cn(tabsListVariants({ variant }), className)}
            {...props}
        />
    );
}

function TabsTrigger({ className, ...props }: TabsPrimitive.Tab.Props) {
    return (
        <TabsPrimitive.Tab
            data-slot="tabs-trigger"
            className={cn(
                'cursor-pointer hover:text-foreground relative inline-flex items-center justify-center gap-1.5 px-2 pt-2 pb-4 text-sm font-medium whitespace-nowrap text-foreground/60 transition-all border-b-2 border-b-transparent!',
                'dark:data-active:text-foreground data-active:border-b-brand!',
                className,
            )}
            {...props}
        />
    );
}

function TabsContent({ className, ...props }: TabsPrimitive.Panel.Props) {
    return (
        <TabsPrimitive.Panel
            data-slot="tabs-content"
            className={cn('flex-1 text-sm outline-none', className)}
            {...props}
        />
    );
}

export { Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants };
