/**
 * Health segment enum for customer health status
 */
export type HealthSegment = 'healthy' | 'watch' | 'at-risk';

/**
 * Customer summary displayed in the main table
 */
export interface CustomerSummary {
  id: string;
  name: string;
  domain: string;
  mrr: number;
  lastActive: string; // ISO date string
  healthSegment: HealthSegment;
  healthScore: number; // 0-100
  owner: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
}

/**
 * Paginated response for customer list
 */
export interface PaginatedCustomersResponse {
  data: CustomerSummary[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * Customer event in the activity timeline
 */
export interface CustomerEvent {
  id: string;
  type: 'login' | 'feature_used' | 'support_ticket' | 'meeting' | 'email' | 'note';
  title: string;
  description?: string;
  timestamp: string; // ISO date string
  metadata?: Record<string, unknown>;
}

/**
 * Usage trend data point
 */
export interface UsageDataPoint {
  date: string; // ISO date string
  activeUsers: number;
  sessions: number;
  featureAdoption: number; // percentage 0-100
}

/**
 * Customer note
 */
export interface CustomerNote {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
}

/**
 * Full customer health details
 */
export interface CustomerHealthDetails {
  id: string;
  name: string;
  domain: string;
  mrr: number;
  arr: number;
  contractStartDate: string;
  contractEndDate: string;
  healthSegment: HealthSegment;
  healthScore: number;
  healthFactors: {
    engagement: number;
    adoption: number;
    support: number;
    growth: number;
  };
  owner: {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
  };
  recentEvents: CustomerEvent[];
  usageTrends: UsageDataPoint[];
  notes: CustomerNote[];
}

/**
 * Sort direction
 */
export type SortDirection = 'asc' | 'desc';

/**
 * Sortable columns in the customer table
 */
export type CustomerSortField = 'name' | 'mrr' | 'lastActive' | 'healthScore' | 'owner';

/**
 * Query parameters for customer list API
 */
export interface CustomerListParams {
  search?: string;
  segment?: HealthSegment | 'all';
  page?: number;
  pageSize?: number;
  sort?: CustomerSortField;
  dir?: SortDirection;
}
