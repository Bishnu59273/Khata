import * as React from 'react';

import { cn } from '@/lib/utils';
import {
  TooltipProvider as TooltipProviderPrimitive,
  Tooltip as TooltipPrimitive,
  TooltipTrigger as TooltipTriggerPrimitive,
  TooltipContent as TooltipContentPrimitive,
  TooltipArrow as TooltipArrowPrimitive,
  type TooltipProviderProps as TooltipProviderPrimitiveProps,
  type TooltipProps as TooltipPrimitiveProps,
  type TooltipTriggerProps as TooltipTriggerPrimitiveProps,
  type TooltipContentProps as TooltipContentPrimitiveProps,
} from '@/components/animate-ui/primitives/animate/tooltip';

type TooltipProviderProps = Omit<TooltipProviderPrimitiveProps, 'delayDuration'> & {
  openDelay?: number;
};

function TooltipProvider({ openDelay = 0, ...props }: TooltipProviderProps) {
  return <TooltipProviderPrimitive delayDuration={openDelay} {...props} />;
}

type TooltipProps = TooltipPrimitiveProps;

function Tooltip(props: TooltipProps) {
  return <TooltipPrimitive {...props} />;
}

type TooltipTriggerProps = TooltipTriggerPrimitiveProps;

function TooltipTrigger(props: TooltipTriggerProps) {
  return <TooltipTriggerPrimitive {...props} />;
}

type TooltipContentProps = Omit<TooltipContentPrimitiveProps, 'asChild'> & {
  children: React.ReactNode;
};

function TooltipContent({ className, children, ...props }: TooltipContentProps) {
  return (
    <TooltipContentPrimitive
      className={cn('z-50 w-fit rounded-md bg-ink-900 text-cream', className)}
      {...props}
    >
      <div className="overflow-hidden px-3 py-1.5 text-xs text-balance">{children}</div>
      <TooltipArrowPrimitive className="fill-ink-900 size-3" />
    </TooltipContentPrimitive>
  );
}

export {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  type TooltipProviderProps,
  type TooltipProps,
  type TooltipTriggerProps,
  type TooltipContentProps,
};
