import * as React from 'react';
import { Popover as PopoverPrimitive } from 'radix-ui';
import { AnimatePresence, motion, type HTMLMotionProps } from 'motion/react';

import { getStrictContext } from '@/lib/get-strict-context';
import { useControlledState } from '@/hooks/use-controlled-state';

type PopoverContextType = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
};

const [PopoverProvider, usePopover] = getStrictContext<PopoverContextType>('PopoverContext');

type PopoverProps = React.ComponentProps<typeof PopoverPrimitive.Root>;

function Popover(props: PopoverProps) {
  const [isOpen, setIsOpen] = useControlledState({
    value: props.open,
    defaultValue: props.defaultOpen,
    onChange: props.onOpenChange,
  });

  return (
    <PopoverProvider value={{ isOpen, setIsOpen }}>
      <PopoverPrimitive.Root data-slot="popover" {...props} onOpenChange={setIsOpen} />
    </PopoverProvider>
  );
}

type PopoverTriggerProps = React.ComponentProps<typeof PopoverPrimitive.Trigger>;

function PopoverTrigger(props: PopoverTriggerProps) {
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />;
}

type PopoverPortalProps = React.ComponentProps<typeof PopoverPrimitive.Portal>;

function PopoverPortal(props: PopoverPortalProps) {
  const { isOpen } = usePopover();

  return (
    <AnimatePresence>
      {isOpen && <PopoverPrimitive.Portal forceMount data-slot="popover-portal" {...props} />}
    </AnimatePresence>
  );
}

type PopoverContentProps = Omit<
  React.ComponentProps<typeof PopoverPrimitive.Content>,
  'asChild' | 'forceMount'
> &
  HTMLMotionProps<'div'>;

function PopoverContent({
  sideOffset = 8,
  transition = { type: 'spring', stiffness: 300, damping: 25 },
  children,
  ...props
}: PopoverContentProps) {
  return (
    <PopoverPortal>
      <PopoverPrimitive.Content asChild sideOffset={sideOffset} {...props}>
        <motion.div
          data-slot="popover-content"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={transition}
        >
          {children}
        </motion.div>
      </PopoverPrimitive.Content>
    </PopoverPortal>
  );
}

export {
  usePopover,
  Popover,
  PopoverTrigger,
  PopoverPortal,
  PopoverContent,
  type PopoverProps,
  type PopoverTriggerProps,
  type PopoverPortalProps,
  type PopoverContentProps,
};
