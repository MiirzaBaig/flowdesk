'use client';

import { useCallback, useMemo } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import type { CustomerListParams, HealthSegment, CustomerSortField, SortDirection } from '@/types/customer';

/**
 * Hook for managing customer list filters via URL search params
 * Provides a single source of truth for filter state
 */
export function useCustomerFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Parse current filter state from URL
  const filters = useMemo((): CustomerListParams => {
    const search = searchParams.get('search') || '';
    const segmentParam = searchParams.get('segment');
    const segment = isValidSegment(segmentParam) ? segmentParam : 'all';
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10) || 1);
    const pageSize = Math.min(100, Math.max(10, parseInt(searchParams.get('pageSize') || '20', 10) || 20));
    const sortParam = searchParams.get('sort');
    const sort = isValidSortField(sortParam) ? sortParam : 'healthScore';
    const dir = (searchParams.get('dir') === 'asc' ? 'asc' : 'desc') as SortDirection;

    return { search, segment, page, pageSize, sort, dir };
  }, [searchParams]);

  // Update filters in URL
  const setFilters = useCallback(
    (updates: Partial<CustomerListParams>, options?: { resetPage?: boolean }) => {
      const params = new URLSearchParams(searchParams.toString());

      // Apply updates
      Object.entries(updates).forEach(([key, value]) => {
        if (value === undefined || value === null || value === '' || 
            (key === 'segment' && value === 'all') ||
            (key === 'page' && value === 1)) {
          params.delete(key);
        } else {
          params.set(key, String(value));
        }
      });

      // Reset to page 1 when filters change (unless explicitly updating page)
      if (options?.resetPage !== false && !('page' in updates)) {
        params.delete('page');
      }

      const queryString = params.toString();
      const url = queryString ? `${pathname}?${queryString}` : pathname;
      
      router.push(url, { scroll: false });
    },
    [router, pathname, searchParams]
  );

  // Convenience methods
  const setSearch = useCallback(
    (search: string) => setFilters({ search: search || undefined }),
    [setFilters]
  );

  const setSegment = useCallback(
    (segment: HealthSegment | 'all') => setFilters({ segment }),
    [setFilters]
  );

  const setPage = useCallback(
    (page: number) => setFilters({ page }, { resetPage: false }),
    [setFilters]
  );

  const setPageSize = useCallback(
    (pageSize: number) => setFilters({ pageSize }),
    [setFilters]
  );

  const setSort = useCallback(
    (sort: CustomerSortField, dir?: SortDirection) => {
      // Toggle direction if clicking same column
      const newDir = dir ?? (filters.sort === sort && filters.dir === 'desc' ? 'asc' : 'desc');
      setFilters({ sort, dir: newDir });
    },
    [setFilters, filters.sort, filters.dir]
  );

  const clearFilters = useCallback(() => {
    router.push(pathname, { scroll: false });
  }, [router, pathname]);

  return {
    filters,
    setFilters,
    setSearch,
    setSegment,
    setPage,
    setPageSize,
    setSort,
    clearFilters,
    hasActiveFilters: !!(filters.search || (filters.segment && filters.segment !== 'all')),
  };
}

// Type guards
function isValidSegment(value: string | null): value is HealthSegment | 'all' {
  return ['all', 'healthy', 'watch', 'at-risk'].includes(value || '');
}

function isValidSortField(value: string | null): value is CustomerSortField {
  return ['name', 'mrr', 'lastActive', 'healthScore', 'owner'].includes(value || '');
}
