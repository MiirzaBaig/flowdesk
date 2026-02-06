import { Skeleton, SkeletonAvatar } from '@/components/ui/Skeleton';

export function CustomerTableSkeleton() {
  return (
    <div className="space-y-4">
      {/* Results count skeleton */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-48" />
      </div>

      {/* Table skeleton */}
      <div className="panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="table-header-cell min-w-[200px]">Customer</th>
                <th className="table-header-cell w-28">MRR</th>
                <th className="table-header-cell w-32">Last Active</th>
                <th className="table-header-cell w-32">Health</th>
                <th className="table-header-cell w-40">Owner</th>
                <th className="table-header-cell w-10" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {Array.from({ length: 10 }).map((_, i) => (
                <tr key={i} className="bg-white">
                  <td className="table-cell">
                    <div className="flex items-center gap-3">
                      <SkeletonAvatar size="md" />
                      <div className="space-y-1.5">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </div>
                  </td>
                  <td className="table-cell">
                    <Skeleton className="h-4 w-16" />
                  </td>
                  <td className="table-cell">
                    <Skeleton className="h-4 w-20" />
                  </td>
                  <td className="table-cell">
                    <Skeleton className="h-6 w-24 rounded-full" />
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center gap-2">
                      <SkeletonAvatar size="sm" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  </td>
                  <td className="table-cell">
                    <Skeleton className="h-5 w-5" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination skeleton */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-9 w-24" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-9" />
          <Skeleton className="h-9 w-9" />
          <Skeleton className="h-9 w-9" />
        </div>
        <Skeleton className="h-9 w-24" />
      </div>
    </div>
  );
}
