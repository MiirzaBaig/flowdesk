import type {
  CustomerListParams,
  PaginatedCustomersResponse,
  CustomerHealthDetails,
  HealthSegment,
  CustomerSortField,
  SortDirection,
} from '@/types/customer';
import { generateMockCustomers, generateMockCustomerHealth } from '@/lib/mock-data';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

/**
 * Server-side function to fetch paginated list of customers with filters
 * This directly processes mock data without HTTP roundtrip
 */
export async function fetchCustomers(
  params: CustomerListParams
): Promise<PaginatedCustomersResponse> {
  // For server components, use direct data processing
  // This avoids HTTP roundtrip and port mismatch issues
  const search = (params.search || '').toLowerCase();
  const segment = params.segment as HealthSegment | 'all' | null;
  const page = params.page || 1;
  const pageSize = params.pageSize || 20;
  const sort = (params.sort || 'healthScore') as CustomerSortField;
  const dir = (params.dir || 'desc') as SortDirection;

  // Get all mock customers
  let customers = generateMockCustomers();

  // Apply search filter
  if (search) {
    customers = customers.filter(
      (c) =>
        c.name.toLowerCase().includes(search) ||
        c.domain.toLowerCase().includes(search)
    );
  }

  // Apply segment filter
  if (segment && segment !== 'all') {
    customers = customers.filter((c) => c.healthSegment === segment);
  }

  // Apply sorting
  customers.sort((a, b) => {
    let comparison = 0;
    
    switch (sort) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'mrr':
        comparison = a.mrr - b.mrr;
        break;
      case 'lastActive':
        comparison = new Date(a.lastActive).getTime() - new Date(b.lastActive).getTime();
        break;
      case 'healthScore':
        comparison = a.healthScore - b.healthScore;
        break;
      case 'owner':
        comparison = a.owner.name.localeCompare(b.owner.name);
        break;
      default:
        comparison = 0;
    }
    
    return dir === 'asc' ? comparison : -comparison;
  });

  // Calculate pagination
  const totalCount = customers.length;
  const totalPages = Math.ceil(totalCount / pageSize);
  const startIndex = (page - 1) * pageSize;
  const paginatedCustomers = customers.slice(startIndex, startIndex + pageSize);

  // Simulate network latency (remove in production)
  await new Promise((resolve) => setTimeout(resolve, 100));

  return {
    data: paginatedCustomers,
    totalCount,
    page,
    pageSize,
    totalPages,
  };
}

/**
 * Server-side function to fetch detailed health information for a specific customer
 * This directly uses mock data without HTTP roundtrip
 */
export async function fetchCustomerHealth(
  customerId: string
): Promise<CustomerHealthDetails> {
  // Simulate network latency (remove in production)
  await new Promise((resolve) => setTimeout(resolve, 150));

  const customerHealth = generateMockCustomerHealth(customerId);

  if (!customerHealth) {
    throw new Error('Customer not found');
  }

  return customerHealth;
}

/**
 * Client-side fetcher for React Query / SWR
 */
export async function fetchCustomerHealthClient(
  customerId: string
): Promise<CustomerHealthDetails> {
  const url = `/api/customers/${customerId}/health`;

  const response = await fetch(url);

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Customer not found');
    }
    throw new Error(`Failed to fetch customer health: ${response.status}`);
  }

  return response.json();
}
