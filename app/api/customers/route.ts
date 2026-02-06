import { NextRequest, NextResponse } from 'next/server';
import type { PaginatedCustomersResponse, HealthSegment, CustomerSortField, SortDirection } from '@/types/customer';
import { generateMockCustomers } from '@/lib/mock-data';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  
  // Parse query parameters
  const search = searchParams.get('search')?.toLowerCase() || '';
  const segment = searchParams.get('segment') as HealthSegment | 'all' | null;
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get('page_size') || '20', 10)));
  const sort = (searchParams.get('sort') || 'healthScore') as CustomerSortField;
  const dir = (searchParams.get('dir') || 'desc') as SortDirection;

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
  await new Promise((resolve) => setTimeout(resolve, 300));

  const response: PaginatedCustomersResponse = {
    data: paginatedCustomers,
    totalCount,
    page,
    pageSize,
    totalPages,
  };

  return NextResponse.json(response);
}
