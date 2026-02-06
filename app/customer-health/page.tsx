import { Suspense } from 'react';
import type { CustomerListParams, HealthSegment } from '@/types/customer';
import { CustomerFiltersBar } from '@/components/customer-health/CustomerFiltersBar';
import { CustomerTable } from '@/components/customer-health/CustomerTable';
import { CustomerTableSkeleton } from '@/components/customer-health/CustomerTableSkeleton';
import { fetchCustomers } from '@/lib/api/customers';

interface CustomerHealthPageProps {
  searchParams: Promise<{
    search?: string;
    segment?: string;
    page?: string;
    pageSize?: string;
    sort?: string;
    dir?: string;
  }>;
}

export default async function CustomerHealthPage({
  searchParams,
}: CustomerHealthPageProps) {
  const params = await searchParams;
  
  // Parse and validate search params
  const listParams: CustomerListParams = {
    search: params.search || '',
    segment: isValidSegment(params.segment) ? params.segment : 'all',
    page: Math.max(1, parseInt(params.page || '1', 10) || 1),
    pageSize: Math.min(100, Math.max(10, parseInt(params.pageSize || '20', 10) || 20)),
    sort: isValidSortField(params.sort) ? params.sort : 'healthScore',
    dir: params.dir === 'asc' ? 'asc' : 'desc',
  };

  return (
    <div className="space-y-4">
      {/* Filters bar - client component for interactivity */}
      <CustomerFiltersBar
        initialSearch={listParams.search || ''}
        initialSegment={listParams.segment || 'all'}
      />

      {/* Customer table with server-side data fetching */}
      <Suspense
        key={JSON.stringify(listParams)}
        fallback={<CustomerTableSkeleton />}
      >
        <CustomerTableContent params={listParams} />
      </Suspense>
    </div>
  );
}

// Separate async component for data fetching
async function CustomerTableContent({ params }: { params: CustomerListParams }) {
  const response = await fetchCustomers(params);

  return (
    <CustomerTable
      customers={response.data}
      totalCount={response.totalCount}
      page={response.page}
      pageSize={response.pageSize}
      totalPages={response.totalPages}
      currentSort={params.sort}
      currentDir={params.dir}
    />
  );
}

// Type guards for validation
function isValidSegment(value?: string): value is HealthSegment | 'all' {
  return ['all', 'healthy', 'watch', 'at-risk'].includes(value || '');
}

function isValidSortField(value?: string): value is CustomerListParams['sort'] {
  return ['name', 'mrr', 'lastActive', 'healthScore', 'owner'].includes(value || '');
}
