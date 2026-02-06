'use client';

import Link from 'next/link';
import { useSearchParams, usePathname } from 'next/navigation';
import { clsx } from 'clsx';
import { formatDistanceToNow } from 'date-fns';
import type { CustomerSummary, CustomerSortField, SortDirection } from '@/types/customer';
import { HealthBadge } from '@/components/ui/HealthBadge';
import { Avatar } from '@/components/ui/Avatar';
import { EmptyState } from '@/components/ui/EmptyState';
import { PaginationControls } from './PaginationControls';
import { CustomerTableHeader } from './CustomerTableHeader';

/**
 * Props for CustomerTable component
 */
interface CustomerTableProps {
  /** Array of customer summary data to display */
  customers: CustomerSummary[];
  /** Total number of customers matching current filters */
  totalCount: number;
  /** Current page number (1-indexed) */
  page: number;
  /** Number of items per page */
  pageSize: number;
  /** Total number of pages */
  totalPages: number;
  /** Currently active sort field */
  currentSort?: CustomerSortField;
  /** Current sort direction */
  currentDir?: SortDirection;
  /** ID of currently selected customer (for highlighting) */
  selectedCustomerId?: string;
}

/**
 * CustomerTable Component
 * 
 * Displays a sortable, paginated table of customers with key metrics.
 * Each row is clickable and navigates to the customer details page.
 * 
 * Features:
 * - Sortable columns (name, MRR, last active, health score, owner)
 * - Row selection highlighting
 * - Empty state when no results
 * - Results count display
 * - Responsive design with horizontal scroll on mobile
 * 
 * @example
 * ```tsx
 * <CustomerTable
 *   customers={customers}
 *   totalCount={247}
 *   page={1}
 *   pageSize={20}
 *   totalPages={13}
 *   currentSort="healthScore"
 *   currentDir="desc"
 * />
 * ```
 */

export function CustomerTable({
  customers,
  totalCount,
  page,
  pageSize,
  totalPages,
  currentSort = 'healthScore',
  currentDir = 'desc',
  selectedCustomerId: propSelectedId,
}: CustomerTableProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Build URL with current params preserved
  const buildCustomerUrl = (customerId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    return `/customer-health/${customerId}?${params.toString()}`;
  };

  // Check if a customer is currently selected (from URL or prop)
  const selectedCustomerId = propSelectedId || (pathname.includes('/customer-health/')
    ? pathname.split('/customer-health/')[1]?.split('?')[0]
    : null);

  if (customers.length === 0) {
    return (
      <div className="border-2 border-black shadow-brutal p-8 bg-white">
        <EmptyState
          icon={
            <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          }
          title="No customers found"
          description="Try adjusting your search or filter criteria to find what you're looking for."
          action={
            <Link href="/customer-health" className="btn-secondary font-bold border-2 border-black shadow-[4px_4px_0px_0px_#000000]">
              Clear filters
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Results count */}
      <div className="flex items-center justify-between text-sm text-slate-500">
        <span>
          Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, totalCount)} of {totalCount} customers
        </span>
      </div>

      {/* Table - responsive wrapper */}
      <div className="border-2 border-black shadow-brutal bg-white overflow-hidden">
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <div className="inline-block min-w-full align-middle">
            <table className="w-full">
            <CustomerTableHeader
              currentSort={currentSort}
              currentDir={currentDir}
            />
            <tbody className="divide-y-2 divide-black">
              {customers.map((customer) => (
                <CustomerRow
                  key={customer.id}
                  customer={customer}
                  href={buildCustomerUrl(customer.id)}
                  isSelected={selectedCustomerId === customer.id}
                />
              ))}
            </tbody>
          </table>
          </div>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <PaginationControls
          currentPage={page}
          totalPages={totalPages}
          pageSize={pageSize}
        />
      )}
    </div>
  );
}

interface CustomerRowProps {
  customer: CustomerSummary;
  href: string;
  isSelected: boolean;
}

function CustomerRow({ customer, href, isSelected }: CustomerRowProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatLastActive = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return 'Unknown';
    }
  };

  return (
    <tr
      className={clsx(
        'table-row group',
        isSelected && 'table-row-selected'
      )}
    >
      <td className="table-cell">
        <Link href={href} className="block" scroll={false}>
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <Avatar name={customer.name} size="md" />
            </div>
            <div className="min-w-0">
              <p className="font-bold text-black truncate group-hover:text-brand-600 transition-colors">
                {customer.name}
              </p>
              <p className="text-xs text-black font-semibold truncate">{customer.domain}</p>
            </div>
          </div>
        </Link>
      </td>
      <td className="table-cell">
        <Link href={href} className="block" scroll={false}>
          <span className="font-medium text-slate-900">
            {formatCurrency(customer.mrr)}
          </span>
          <span className="text-xs text-slate-500">/mo</span>
        </Link>
      </td>
      <td className="table-cell">
        <Link href={href} className="block" scroll={false}>
          <span className="text-slate-600">{formatLastActive(customer.lastActive)}</span>
        </Link>
      </td>
      <td className="table-cell">
        <Link href={href} className="block" scroll={false}>
          <HealthBadge
            segment={customer.healthSegment}
            showScore
            score={customer.healthScore}
            size="sm"
          />
        </Link>
      </td>
      <td className="table-cell">
        <Link href={href} className="block" scroll={false}>
          <div className="flex items-center gap-2">
            <Avatar name={customer.owner.name} size="sm" />
            <span className="text-slate-600 truncate">{customer.owner.name}</span>
          </div>
        </Link>
      </td>
      <td className="table-cell w-10">
        <Link href={href} className="block" scroll={false}>
          <svg
            className="h-5 w-5 text-slate-400 group-hover:text-brand-500 transition-colors"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </td>
    </tr>
  );
}
