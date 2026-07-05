import * as React from 'react';
import { Tooltip as TooltipPrimitive } from 'radix-ui';
import { motion, type HTMLMotionProps, type Transition } from 'motion/react';

type TooltipProviderProps = React.ComponentProps<typeof TooltipPrimitive.Provider>;

function TooltipProvider({ delayDuration = 0, ...props }: TooltipProviderProps) {
  return <TooltipPrimitive.Provider delayDuration={delayDuration} {...props} />;
}

type TooltipProps = React.ComponentProps<typeof TooltipPrimitive.Root>;

function Tooltip(props: TooltipProps) {
  return <TooltipPrimitive.Root {...props} />;
}

type TooltipTriggerProps = React.ComponentProps<typeof TooltipPrimitive.Trigger>;

function TooltipTrigger(props: TooltipTriggerProps) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />;
}

type TooltipContentProps = Omit<
  React.ComponentProps<typeof TooltipPrimitive.Content>,
  'asChild' | 'forceMount'
> &
  HTMLMotionProps<'div'> & {
    hidden?: boolean;
    transition?: Transition;
  };

function TooltipContent({
  sideOffset = 10,
  transition = { type: 'spring', stiffness: 300, damping: 35 },
  hidden,
  children,
  ...props
}: TooltipContentProps) {
  if (hidden) return null;

  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content asChild sideOffset={sideOffset}>
        <motion.div
          data-slot="tooltip-content"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={transition}
          {...props}
        >
          {children}
        </motion.div>
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  );
}

type TooltipArrowProps = React.ComponentProps<typeof TooltipPrimitive.Arrow> & {
  tipRadius?: number;
};

function TooltipArrow({ tipRadius, ...props }: TooltipArrowProps) {
  void tipRadius;
  return <TooltipPrimitive.Arrow data-slot="tooltip-arrow" {...props} />;
}

export {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipArrow,
  type TooltipProviderProps,
  type TooltipProps,
  type TooltipTriggerProps,
  type TooltipContentProps,
  type TooltipArrowProps,
};
