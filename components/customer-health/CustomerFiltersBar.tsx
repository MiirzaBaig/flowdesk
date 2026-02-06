'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useCallback, useState, useTransition } from 'react';
import { clsx } from 'clsx';
import type { HealthSegment } from '@/types/customer';

/**
 * Props for CustomerFiltersBar component
 */
interface CustomerFiltersBarProps {
  /** Initial search query value from URL */
  initialSearch: string;
  /** Initial health segment filter from URL */
  initialSegment: HealthSegment | 'all';
}

/**
 * CustomerFiltersBar Component
 * 
 * Provides search and health segment filtering controls.
 * All filter state is synchronized with URL query parameters.
 * 
 * Features:
 * - Debounced search (300ms) to reduce API calls
 * - Health segment filter (All/Healthy/Watch/At Risk)
 * - URL synchronization via Next.js router
 * - Loading indicator during transitions
 * - Clear filters button when filters are active
 * 
 * @example
 * ```tsx
 * <CustomerFiltersBar
 *   initialSearch="acme"
 *   initialSegment="healthy"
 * />
 * ```
 */

const segments: { value: HealthSegment | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'healthy', label: 'Healthy' },
  { value: 'watch', label: 'Watch' },
  { value: 'at-risk', label: 'At Risk' },
];

export function CustomerFiltersBar({
  initialSearch,
  initialSegment,
}: CustomerFiltersBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [searchValue, setSearchValue] = useState(initialSearch);

  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === '' || (key === 'segment' && value === 'all')) {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });

      // Reset to page 1 when filters change
      params.delete('page');

      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
      });
    },
    [router, pathname, searchParams]
  );

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearchValue(value);

      // Debounce search updates
      const timeoutId = setTimeout(() => {
        updateParams({ search: value || null });
      }, 300);

      return () => clearTimeout(timeoutId);
    },
    [updateParams]
  );

  const handleSegmentChange = useCallback(
    (segment: HealthSegment | 'all') => {
      updateParams({ segment: segment === 'all' ? null : segment });
    },
    [updateParams]
  );

  const clearFilters = useCallback(() => {
    setSearchValue('');
    startTransition(() => {
      router.push(pathname, { scroll: false });
    });
  }, [router, pathname]);

  const hasActiveFilters = searchValue || initialSegment !== 'all';

  return (
    <div className="panel p-4">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search input */}
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className={clsx(
                'h-5 w-5 transition-colors',
                isPending ? 'text-brand-500' : 'text-slate-400'
              )}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search by name or domain..."
            value={searchValue}
            onChange={handleSearchChange}
            className="input pl-10"
            aria-label="Search customers"
          />
          {searchValue && (
            <button
              onClick={() => {
                setSearchValue('');
                updateParams({ search: null });
              }}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
              aria-label="Clear search"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Segment filter */}
        <div className="flex items-center gap-2 p-1 border-2 border-black bg-white">
          {segments.map((segment) => (
            <button
              key={segment.value}
              onClick={() => handleSegmentChange(segment.value)}
              className={clsx(
                'px-3 py-1.5 text-sm font-bold transition-all border-2 border-transparent',
                initialSegment === segment.value
                  ? 'bg-brand-500 text-white border-black shadow-brutal-sm'
                  : 'text-black hover:bg-slate-100 hover:border-black'
              )}
              aria-pressed={initialSegment === segment.value}
            >
              {segment.label}
            </button>
          ))}
        </div>

        {/* Clear filters */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="btn btn-ghost border-2 border-black hover:bg-brand-100"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Loading indicator */}
      {isPending && (
        <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Updating...
        </div>
      )}
    </div>
  );
}
