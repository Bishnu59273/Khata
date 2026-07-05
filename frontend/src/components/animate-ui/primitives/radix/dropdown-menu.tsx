import * as React from 'react';
import { DropdownMenu as DropdownMenuPrimitive } from 'radix-ui';
import { AnimatePresence, motion, type HTMLMotionProps } from 'motion/react';

import { getStrictContext } from '@/lib/get-strict-context';
import { useControlledState } from '@/hooks/use-controlled-state';

type DropdownMenuContextType = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
};

const [DropdownMenuProvider, useDropdownMenu] =
  getStrictContext<DropdownMenuContextType>('DropdownMenuContext');

type DropdownMenuProps = React.ComponentProps<typeof DropdownMenuPrimitive.Root>;

function DropdownMenu(props: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useControlledState({
    value: props.open,
    defaultValue: props.defaultOpen,
    onChange: props.onOpenChange,
  });

  return (
    <DropdownMenuProvider value={{ isOpen, setIsOpen }}>
      <DropdownMenuPrimitive.Root data-slot="dropdown-menu" {...props} onOpenChange={setIsOpen} />
    </DropdownMenuProvider>
  );
}

type DropdownMenuTriggerProps = React.ComponentProps<typeof DropdownMenuPrimitive.Trigger>;

function DropdownMenuTrigger(props: DropdownMenuTriggerProps) {
  return <DropdownMenuPrimitive.Trigger data-slot="dropdown-menu-trigger" {...props} />;
}

type DropdownMenuPortalProps = React.ComponentProps<typeof DropdownMenuPrimitive.Portal>;

function DropdownMenuPortal(props: DropdownMenuPortalProps) {
  const { isOpen } = useDropdownMenu();

  return (
    <AnimatePresence>
      {isOpen && <DropdownMenuPrimitive.Portal forceMount data-slot="dropdown-menu-portal" {...props} />}
    </AnimatePresence>
  );
}

type DropdownMenuContentProps = Omit<
  React.ComponentProps<typeof DropdownMenuPrimitive.Content>,
  'asChild' | 'forceMount'
> &
  HTMLMotionProps<'div'>;

function DropdownMenuContent({
  sideOffset = 4,
  transition = { duration: 0.15, ease: 'easeOut' },
  ...props
}: DropdownMenuContentProps) {
  return (
    <DropdownMenuPortal>
      <DropdownMenuPrimitive.Content asChild sideOffset={sideOffset}>
        <motion.div
          data-slot="dropdown-menu-content"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={transition}
          {...props}
        />
      </DropdownMenuPrimitive.Content>
    </DropdownMenuPortal>
  );
}

type DropdownMenuGroupProps = React.ComponentProps<typeof DropdownMenuPrimitive.Group>;

function DropdownMenuGroup(props: DropdownMenuGroupProps) {
  return <DropdownMenuPrimitive.Group data-slot="dropdown-menu-group" {...props} />;
}

type DropdownMenuItemProps = Omit<React.ComponentProps<typeof DropdownMenuPrimitive.Item>, 'asChild'>;

function DropdownMenuItem(props: DropdownMenuItemProps) {
  return <DropdownMenuPrimitive.Item data-slot="dropdown-menu-item" {...props} />;
}

type DropdownMenuLabelProps = React.ComponentProps<typeof DropdownMenuPrimitive.Label>;

function DropdownMenuLabel(props: DropdownMenuLabelProps) {
  return <DropdownMenuPrimitive.Label data-slot="dropdown-menu-label" {...props} />;
}

type DropdownMenuSeparatorProps = React.ComponentProps<typeof DropdownMenuPrimitive.Separator>;

function DropdownMenuSeparator(props: DropdownMenuSeparatorProps) {
  return <DropdownMenuPrimitive.Separator data-slot="dropdown-menu-separator" {...props} />;
}

export {
  useDropdownMenu,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuPortal,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  type DropdownMenuProps,
  type DropdownMenuTriggerProps,
  type DropdownMenuPortalProps,
  type DropdownMenuContentProps,
  type DropdownMenuGroupProps,
  type DropdownMenuItemProps,
  type DropdownMenuLabelProps,
  type DropdownMenuSeparatorProps,
};
