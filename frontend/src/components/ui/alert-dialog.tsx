import * as React from 'react';

import { cn } from '@/lib/utils';
import { Button, type ButtonProps } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogContent as AlertDialogContentPrimitive,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction as AlertDialogActionPrimitive,
  AlertDialogCancel as AlertDialogCancelPrimitive,
  type AlertDialogContentProps as AlertDialogContentPrimitiveProps,
  type AlertDialogActionProps as AlertDialogActionPrimitiveProps,
  type AlertDialogCancelProps as AlertDialogCancelPrimitiveProps,
} from '@/components/animate-ui/primitives/radix/alert-dialog';

function AlertDialogOverlayStyled({ className, ...props }: React.ComponentProps<typeof AlertDialogOverlay>) {
  return <AlertDialogOverlay className={cn('fixed inset-0 z-50 bg-black/40', className)} {...props} />;
}

type AlertDialogContentProps = AlertDialogContentPrimitiveProps;

function AlertDialogContent({ className, ...props }: AlertDialogContentProps) {
  return (
    <AlertDialogPortal>
      <AlertDialogOverlayStyled />
      <AlertDialogContentPrimitive
        className={cn(
          'z-50 w-full max-w-md rounded-2xl bg-surface p-6 shadow-lg',
          className,
        )}
        {...props}
      />
    </AlertDialogPortal>
  );
}

function AlertDialogHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="alert-dialog-header" className={cn('mb-2 flex flex-col gap-1.5', className)} {...props} />;
}

function AlertDialogFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="alert-dialog-footer"
      className={cn('mt-6 flex gap-3', className)}
      {...props}
    />
  );
}

function AlertDialogTitleStyled({ className, ...props }: React.ComponentProps<typeof AlertDialogTitle>) {
  return <AlertDialogTitle className={cn('text-lg font-bold text-ink-900', className)} {...props} />;
}

function AlertDialogDescriptionStyled({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogDescription>) {
  return <AlertDialogDescription className={cn('text-sm text-ink-600', className)} {...props} />;
}

type AlertDialogActionProps = AlertDialogActionPrimitiveProps &
  Pick<ButtonProps, 'variant' | 'size'>;

function AlertDialogAction({ className, variant = 'default', size = 'lg', ...props }: AlertDialogActionProps) {
  return (
    <Button variant={variant} size={size} asChild>
      <AlertDialogActionPrimitive className={cn(className)} {...props} />
    </Button>
  );
}

type AlertDialogCancelProps = AlertDialogCancelPrimitiveProps &
  Pick<ButtonProps, 'variant' | 'size'>;

function AlertDialogCancel({ className, variant = 'outline', size = 'lg', ...props }: AlertDialogCancelProps) {
  return (
    <Button variant={variant} size={size} asChild>
      <AlertDialogCancelPrimitive className={cn(className)} {...props} />
    </Button>
  );
}

export {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitleStyled as AlertDialogTitle,
  AlertDialogDescriptionStyled as AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
};
