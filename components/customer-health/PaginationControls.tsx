'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useCallback, useTransition } from 'react';
import { clsx } from 'clsx';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
}

export function PaginationControls({
  currentPage,
  totalPages,
  pageSize,
}: PaginationControlsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const goToPage = useCallback(
    (page: number) => {
      const params = new URLSearchParams(searchParams.toString());

      if (page === 1) {
        params.delete('page');
      } else {
        params.set('page', page.toString());
      }

      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
      });
    },
    [router, pathname, searchParams]
  );

  const changePageSize = useCallback(
    (newSize: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set('pageSize', newSize.toString());
      params.delete('page'); // Reset to first page

      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
      });
    },
    [router, pathname, searchParams]
  );

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // Always show first page
    pages.push(1);

    // Calculate range around current page
    let start = Math.max(2, currentPage - 1);
    let end = Math.min(totalPages - 1, currentPage + 1);

    // Adjust if at edges
    if (currentPage <= 3) {
      end = Math.min(4, totalPages - 1);
    }
    if (currentPage >= totalPages - 2) {
      start = Math.max(2, totalPages - 3);
    }

    // Add ellipsis before range if needed
    if (start > 2) {
      pages.push('ellipsis');
    }

    // Add range
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    // Add ellipsis after range if needed
    if (end < totalPages - 1) {
      pages.push('ellipsis');
    }

    // Always show last page
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-between">
      {/* Page size selector */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-slate-500">Show</span>
        <select
          value={pageSize}
          onChange={(e) => changePageSize(Number(e.target.value))}
          className="input w-auto py-1.5 pr-8 rounded-none border-2 border-black shadow-brutal-sm font-bold"
          disabled={isPending}
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
        <span className="text-sm text-slate-500">per page</span>
      </div>

      {/* Page numbers */}
      <nav className="flex items-center gap-1" aria-label="Pagination">
        {/* Previous button */}
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1 || isPending}
          className={clsx(
            'p-2 text-black hover:bg-brand-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors border-2 border-black shadow-brutal active:shadow-none active:translate-x-[2px] active:translate-y-[2px]',
            isPending && 'opacity-50'
          )}
          aria-label="Previous page"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Page numbers */}
        <div className="flex items-center gap-1">
          {getPageNumbers().map((page, index) =>
            page === 'ellipsis' ? (
              <span
                key={`ellipsis-${index}`}
                className="px-2 py-1 text-sm text-slate-400"
              >
                ...
              </span>
            ) : (
              <button
                key={page}
                onClick={() => goToPage(page)}
                disabled={isPending}
                className={clsx(
                  'min-w-[36px] px-3 py-1.5 text-sm font-bold transition-all border-2 border-black',
                  currentPage === page
                    ? 'bg-black text-white shadow-none'
                    : 'bg-white text-black hover:bg-brand-50 shadow-brutal hover:shadow-brutal-lg active:shadow-none active:translate-x-[2px] active:translate-y-[2px]',
                  isPending && 'opacity-50'
                )}
                aria-current={currentPage === page ? 'page' : undefined}
              >
                {page}
              </button>
            )
          )}
        </div>

        {/* Next button */}
        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages || isPending}
          className={clsx(
            'p-2 text-black hover:bg-brand-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors border-2 border-black shadow-brutal active:shadow-none active:translate-x-[2px] active:translate-y-[2px]',
            isPending && 'opacity-50'
          )}
          aria-label="Next page"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </nav>

      {/* Spacer for alignment */}
      <div className="w-40" />
    </div>
  );
}
