'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useCallback, useTransition } from 'react';
import { clsx } from 'clsx';
import type { CustomerSortField, SortDirection } from '@/types/customer';

interface CustomerTableHeaderProps {
  currentSort: CustomerSortField;
  currentDir: SortDirection;
}

interface Column {
  key: CustomerSortField;
  label: string;
  sortable: boolean;
  className?: string;
}

const columns: Column[] = [
  { key: 'name', label: 'Customer', sortable: true, className: 'min-w-[200px]' },
  { key: 'mrr', label: 'MRR', sortable: true, className: 'w-28' },
  { key: 'lastActive', label: 'Last Active', sortable: true, className: 'w-32' },
  { key: 'healthScore', label: 'Health', sortable: true, className: 'w-32' },
  { key: 'owner', label: 'Owner', sortable: true, className: 'w-40' },
];

export function CustomerTableHeader({
  currentSort,
  currentDir,
}: CustomerTableHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const handleSort = useCallback(
    (field: CustomerSortField) => {
      const params = new URLSearchParams(searchParams.toString());

      // Toggle direction if same field, otherwise default to desc
      const newDir: SortDirection =
        currentSort === field && currentDir === 'desc' ? 'asc' : 'desc';

      params.set('sort', field);
      params.set('dir', newDir);
      // Reset to first page when sorting changes
      params.delete('page');

      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
      });
    },
    [router, pathname, searchParams, currentSort, currentDir]
  );

  return (
    <thead>
      <tr>
        {columns.map((column) => (
          <th
            key={column.key}
            className={clsx('table-header-cell', column.className)}
          >
            {column.sortable ? (
              <button
                onClick={() => handleSort(column.key)}
                className={clsx(
                  'inline-flex items-center gap-1 hover:text-slate-700 transition-colors',
                  currentSort === column.key && 'text-brand-600',
                  isPending && 'opacity-50'
                )}
                disabled={isPending}
              >
                {column.label}
                <SortIcon
                  isActive={currentSort === column.key}
                  direction={currentSort === column.key ? currentDir : undefined}
                />
              </button>
            ) : (
              column.label
            )}
          </th>
        ))}
        {/* Empty header for chevron column */}
        <th className="table-header-cell w-10" />
      </tr>
    </thead>
  );
}

function SortIcon({
  isActive,
  direction,
}: {
  isActive: boolean;
  direction?: SortDirection;
}) {
  if (!isActive) {
    return (
      <svg
        className="h-4 w-4 text-slate-300"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
        />
      </svg>
    );
  }

  return (
    <svg
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      {direction === 'asc' ? (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={3}
          d="M5 15l7-7 7 7"
        />
      ) : (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={3}
          d="M19 9l-7 7-7-7"
        />
      )}
    </svg>
  );
}
