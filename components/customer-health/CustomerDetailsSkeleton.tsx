import { Skeleton, SkeletonAvatar } from '@/components/ui/Skeleton';

export function CustomerDetailsSkeleton() {
  return (
    <div className="flex flex-col h-full">
      {/* Header skeleton */}
      <div className="p-6 border-b border-slate-200 bg-gradient-to-br from-slate-50 to-white">
        <div className="flex items-start gap-4 pr-8">
          <SkeletonAvatar size="lg" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-6 w-24 rounded-full mt-2" />
          </div>
        </div>

        {/* Quick stats skeleton */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="bg-white rounded-lg border border-slate-200 p-3">
            <Skeleton className="h-3 w-12 mb-2" />
            <Skeleton className="h-6 w-20" />
          </div>
          <div className="bg-white rounded-lg border border-slate-200 p-3">
            <Skeleton className="h-3 w-12 mb-2" />
            <Skeleton className="h-6 w-24" />
          </div>
        </div>
      </div>

      {/* Tabs skeleton */}
      <div className="border-b border-slate-200 flex">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex-1 px-4 py-3 flex justify-center">
            <Skeleton className="h-4 w-16" />
          </div>
        ))}
      </div>

      {/* Content skeleton */}
      <div className="flex-1 p-6 space-y-6">
        {/* Health factors skeleton */}
        <div>
          <Skeleton className="h-4 w-24 mb-3" />
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i}>
                <div className="flex justify-between mb-1">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-3 w-8" />
                </div>
                <Skeleton className="h-2 w-full rounded-full" />
              </div>
            ))}
          </div>
        </div>

        {/* Chart skeleton */}
        <div>
          <Skeleton className="h-4 w-32 mb-3" />
          <Skeleton className="h-40 w-full rounded-lg" />
        </div>

        {/* Contract info skeleton */}
        <div>
          <Skeleton className="h-4 w-28 mb-3" />
          <div className="bg-slate-50 rounded-lg p-4 space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-28" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
