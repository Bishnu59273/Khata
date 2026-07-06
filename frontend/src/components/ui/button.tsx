import * as React from 'react';
import { Slot } from 'radix-ui';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
  {
    variants: {
      variant: {
        default: 'bg-brand-500 text-white hover:bg-brand-600',
        outline: 'border-2 border-border-soft bg-transparent text-ink-700 hover:bg-brand-50',
        ghost: 'hover:bg-brand-50',
        destructive: 'bg-danger-600 text-white hover:bg-danger-600/90',
        success: 'bg-success-600 text-white hover:bg-success-600/90',
      },
      size: {
        default: 'h-9 px-4 py-2',
        lg: 'h-auto flex-1 rounded-xl px-5 py-3 text-base font-bold',
        icon: 'size-7',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

type ButtonProps = React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot.Root : 'button';

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants, type ButtonProps };
