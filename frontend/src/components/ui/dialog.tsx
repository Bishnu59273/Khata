import * as React from 'react';
import { XIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogTrigger,
  DialogClose,
  DialogPortal,
  DialogOverlay,
  DialogContent as DialogContentPrimitive,
  DialogTitle,
  DialogDescription,
  type DialogContentProps as DialogContentPrimitiveProps,
} from '@/components/animate-ui/primitives/radix/dialog';

function DialogOverlayStyled({ className, ...props }: React.ComponentProps<typeof DialogOverlay>) {
  return <DialogOverlay className={cn('fixed inset-0 z-50 bg-black/40', className)} {...props} />;
}

type DialogContentProps = DialogContentPrimitiveProps & {
  showCloseButton?: boolean;
};

function DialogContent({ className, children, showCloseButton = true, ...props }: DialogContentProps) {
  return (
    <DialogPortal>
      <DialogOverlayStyled />
      <DialogContentPrimitive
        className={cn(
          'z-50 max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-surface p-6 shadow-lg outline-none',
          className,
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogClose className="absolute top-4 right-4 rounded-lg p-1 text-ink-600 opacity-70 transition-opacity hover:bg-brand-50 hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none disabled:pointer-events-none">
            <XIcon className="size-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        )}
      </DialogContentPrimitive>
    </DialogPortal>
  );
}

function DialogHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="dialog-header" className={cn('mb-4 flex flex-col gap-1.5', className)} {...props} />;
}

function DialogFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="dialog-footer" className={cn('mt-2 flex gap-3', className)} {...props} />;
}

function DialogTitleStyled({ className, ...props }: React.ComponentProps<typeof DialogTitle>) {
  return <DialogTitle className={cn('text-lg font-bold text-ink-900', className)} {...props} />;
}

function DialogDescriptionStyled({ className, ...props }: React.ComponentProps<typeof DialogDescription>) {
  return <DialogDescription className={cn('text-sm text-ink-600', className)} {...props} />;
}

export {
  Dialog,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitleStyled as DialogTitle,
  DialogDescriptionStyled as DialogDescription,
};
