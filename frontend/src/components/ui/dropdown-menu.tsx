import * as React from 'react';

import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent as DropdownMenuContentPrimitive,
  DropdownMenuGroup,
  DropdownMenuItem as DropdownMenuItemPrimitive,
  DropdownMenuLabel as DropdownMenuLabelPrimitive,
  DropdownMenuSeparator as DropdownMenuSeparatorPrimitive,
  type DropdownMenuContentProps as DropdownMenuContentPrimitiveProps,
  type DropdownMenuItemProps as DropdownMenuItemPrimitiveProps,
} from '@/components/animate-ui/primitives/radix/dropdown-menu';

type DropdownMenuContentProps = DropdownMenuContentPrimitiveProps;

function DropdownMenuContent({ className, ...props }: DropdownMenuContentProps) {
  return (
    <DropdownMenuContentPrimitive
      className={cn(
        'z-50 min-w-56 overflow-hidden rounded-xl border border-border-soft bg-surface p-1.5 shadow-lg',
        className,
      )}
      {...props}
    />
  );
}

type DropdownMenuItemProps = DropdownMenuItemPrimitiveProps & {
  variant?: 'default' | 'destructive';
};

function DropdownMenuItem({ className, variant = 'default', ...props }: DropdownMenuItemProps) {
  return (
    <DropdownMenuItemPrimitive
      data-variant={variant}
      className={cn(
        "flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-semibold text-ink-900 outline-none select-none data-[highlighted]:bg-brand-50 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-ink-600",
        variant === 'destructive' &&
          'text-danger-600 data-[highlighted]:bg-danger-600/10 [&_svg]:text-danger-600',
        className,
      )}
      {...props}
    />
  );
}

function DropdownMenuLabel({ className, ...props }: React.ComponentProps<typeof DropdownMenuLabelPrimitive>) {
  return (
    <DropdownMenuLabelPrimitive
      className={cn('flex items-center gap-2.5 px-2.5 py-2', className)}
      {...props}
    />
  );
}

function DropdownMenuSeparator({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuSeparatorPrimitive>) {
  return (
    <DropdownMenuSeparatorPrimitive className={cn('my-1.5 h-px bg-border-soft', className)} {...props} />
  );
}

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
};
