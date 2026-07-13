import { Skeleton } from '../ui/skeleton';

export function StatCardsSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="rounded-2xl border border-border-soft bg-surface p-5">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="mt-2.5 h-7 w-32" />
        </div>
      ))}
    </div>
  );
}

export function TableSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border-soft bg-surface">
      <div className="bg-tablehead px-5 py-3.5">
        <Skeleton className="h-4 w-2/5" />
      </div>
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="flex items-center gap-4 border-t border-border-row px-5 py-3.5">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/6" />
          <Skeleton className="ml-auto h-4 w-1/5" />
        </div>
      ))}
    </div>
  );
}

const CHART_SKELETON_BAR_HEIGHTS = [40, 65, 50, 80, 60, 90, 70];

export function ChartSkeleton() {
  return (
    <div className="rounded-2xl border border-border-soft bg-surface p-6">
      <Skeleton className="mb-5 h-4 w-48" />
      <div className="flex h-[170px] items-end justify-around gap-3">
        {CHART_SKELETON_BAR_HEIGHTS.map((height, i) => (
          <Skeleton
            key={i}
            className="w-full max-w-6 rounded-t"
            style={{ height: `${height}%` }}
          />
        ))}
      </div>
      <div className="mt-2 flex justify-around gap-3">
        {CHART_SKELETON_BAR_HEIGHTS.map((_, i) => (
          <Skeleton key={i} className="h-3 w-8" />
        ))}
      </div>
    </div>
  );
}

export function CardGridSkeleton({
  count = 6,
  columnsClass = 'sm:grid-cols-2 lg:grid-cols-3',
}: {
  count?: number;
  columnsClass?: string;
}) {
  return (
    <div className={`grid grid-cols-1 gap-3.5 ${columnsClass}`}>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="flex items-start gap-3.5 rounded-2xl border border-border-soft bg-surface p-4">
          <Skeleton className="h-12 w-12 rounded-xl" />
          <div className="flex-1">
            <Skeleton className="h-4 w-3/5" />
            <Skeleton className="mt-2 h-3 w-2/5" />
          </div>
        </div>
      ))}
    </div>
  );
}
