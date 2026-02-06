import { Skeleton } from '@/components/ui/Skeleton';
import { CustomerTableSkeleton } from '@/components/customer-health/CustomerTableSkeleton';

export default function CustomerHealthLoading() {
  return (
    <div className="space-y-4">
      {/* Filters bar skeleton */}
      <div className="panel p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search skeleton */}
          <div className="flex-1 max-w-md">
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
          {/* Segment filter skeleton */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-16 rounded-md" />
            ))}
          </div>
        </div>
      </div>

      {/* Table skeleton */}
      <CustomerTableSkeleton />
    </div>
  );
}
