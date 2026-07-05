import * as React from 'react';

import { cn } from '@/lib/utils';

type SkeletonProps = React.ComponentProps<'div'>;

function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      data-slot="skeleton"
      className={cn('animate-pulse rounded-md bg-border-soft', className)}
      {...props}
    />
  );
}

export { Skeleton, type SkeletonProps };
