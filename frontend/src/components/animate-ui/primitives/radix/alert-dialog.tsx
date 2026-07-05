import * as React from 'react';
import { AlertDialog as AlertDialogPrimitive } from 'radix-ui';
import { AnimatePresence, motion, type HTMLMotionProps } from 'motion/react';

import { getStrictContext } from '@/lib/get-strict-context';
import { useControlledState } from '@/hooks/use-controlled-state';

type AlertDialogContextType = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

const [AlertDialogProvider, useAlertDialog] =
  getStrictContext<AlertDialogContextType>('AlertDialogContext');

type AlertDialogProps = React.ComponentProps<typeof AlertDialogPrimitive.Root>;

function AlertDialog(props: AlertDialogProps) {
  const [isOpen, setIsOpen] = useControlledState({
    value: props.open,
    defaultValue: props.defaultOpen,
    onChange: props.onOpenChange,
  });

  return (
    <AlertDialogProvider value={{ isOpen, setIsOpen }}>
      <AlertDialogPrimitive.Root data-slot="alert-dialog" {...props} onOpenChange={setIsOpen} />
    </AlertDialogProvider>
  );
}

type AlertDialogTriggerProps = React.ComponentProps<typeof AlertDialogPrimitive.Trigger>;

function AlertDialogTrigger(props: AlertDialogTriggerProps) {
  return <AlertDialogPrimitive.Trigger data-slot="alert-dialog-trigger" {...props} />;
}

type AlertDialogPortalProps = React.ComponentProps<typeof AlertDialogPrimitive.Portal>;

function AlertDialogPortal(props: AlertDialogPortalProps) {
  const { isOpen } = useAlertDialog();

  return (
    <AnimatePresence>
      {isOpen && (
        <AlertDialogPrimitive.Portal forceMount data-slot="alert-dialog-portal" {...props} />
      )}
    </AnimatePresence>
  );
}

type AlertDialogOverlayProps = Omit<
  React.ComponentProps<typeof AlertDialogPrimitive.Overlay>,
  'asChild' | 'forceMount'
> &
  HTMLMotionProps<'div'>;

function AlertDialogOverlay({
  transition = { duration: 0.2, ease: 'easeInOut' },
  ...props
}: AlertDialogOverlayProps) {
  return (
    <AlertDialogPrimitive.Overlay asChild forceMount>
      <motion.div
        key="alert-dialog-overlay"
        data-slot="alert-dialog-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={transition}
        {...props}
      />
    </AlertDialogPrimitive.Overlay>
  );
}

type AlertDialogContentProps = React.ComponentProps<typeof AlertDialogPrimitive.Content> &
  HTMLMotionProps<'div'>;

function AlertDialogContent({
  transition = { type: 'spring', stiffness: 300, damping: 25 },
  children,
  ...props
}: AlertDialogContentProps) {
  return (
    <AlertDialogPrimitive.Content asChild forceMount {...props}>
      <motion.div
        key="alert-dialog-content"
        data-slot="alert-dialog-content"
        initial={{ opacity: 0, scale: 0.95, x: '-50%', y: '-50%' }}
        animate={{ opacity: 1, scale: 1, x: '-50%', y: '-50%' }}
        exit={{ opacity: 0, scale: 0.95, x: '-50%', y: '-50%' }}
        transition={transition}
        style={{ position: 'fixed', top: '50%', left: '50%' }}
      >
        {children}
      </motion.div>
    </AlertDialogPrimitive.Content>
  );
}

type AlertDialogTitleProps = React.ComponentProps<typeof AlertDialogPrimitive.Title>;

function AlertDialogTitle(props: AlertDialogTitleProps) {
  return <AlertDialogPrimitive.Title data-slot="alert-dialog-title" {...props} />;
}

type AlertDialogDescriptionProps = React.ComponentProps<typeof AlertDialogPrimitive.Description>;

function AlertDialogDescription(props: AlertDialogDescriptionProps) {
  return <AlertDialogPrimitive.Description data-slot="alert-dialog-description" {...props} />;
}

type AlertDialogActionProps = React.ComponentProps<typeof AlertDialogPrimitive.Action>;

function AlertDialogAction(props: AlertDialogActionProps) {
  return <AlertDialogPrimitive.Action data-slot="alert-dialog-action" {...props} />;
}

type AlertDialogCancelProps = React.ComponentProps<typeof AlertDialogPrimitive.Cancel>;

function AlertDialogCancel(props: AlertDialogCancelProps) {
  return <AlertDialogPrimitive.Cancel data-slot="alert-dialog-cancel" {...props} />;
}

export {
  useAlertDialog,
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
  type AlertDialogProps,
  type AlertDialogTriggerProps,
  type AlertDialogPortalProps,
  type AlertDialogOverlayProps,
  type AlertDialogContentProps,
  type AlertDialogTitleProps,
  type AlertDialogDescriptionProps,
  type AlertDialogActionProps,
  type AlertDialogCancelProps,
};
