# FlowDesk - Customer Health Overview

A Next.js application for customer success teams to monitor and manage customer health. This is a complete implementation of a customer health dashboard with filtering, sorting, pagination, and detailed customer views.

## Features

### Core Functionality
- ✅ **Customer Health Table**: Sortable, filterable table of customers with key metrics
- ✅ **Health Segments**: Filter by Healthy, Watch, or At Risk customers
- ✅ **Search**: Real-time search by name or domain with debouncing
- ✅ **Server-Side Pagination**: Efficient handling of large customer datasets
- ✅ **Customer Details Panel**: Comprehensive view with health metrics, activity, and notes
- ✅ **Usage Trends**: Interactive SVG chart showing 30-day usage patterns
- ✅ **Activity Timeline**: Chronological view of customer events and interactions
- ✅ **Notes System**: Add and manage internal notes about customers
- ✅ **Export Functionality**: Download customer data as CSV

### UX Enhancements
- ✅ **Smooth Animations**: Professional, YC-style animations throughout
- ✅ **Responsive Design**: Mobile-first approach with full-screen sheets on mobile
- ✅ **Loading States**: Skeleton loaders for better perceived performance
- ✅ **Error Handling**: Comprehensive error boundaries with retry functionality
- ✅ **Empty States**: Helpful messaging when no data matches filters
- ✅ **Accessibility**: ARIA labels, keyboard navigation, semantic HTML

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Data Fetching**: Server Components + React Query (TanStack Query)
- **Testing**: Vitest (unit tests) + Playwright (E2E tests)
- **Date Formatting**: date-fns
- **Icons**: Heroicons (SVG)

## Getting Started

### Prerequisites

- Node.js 18+
- npm (comes with Node.js)

### Installation

```bash




npm install
```

### Development

```bash
# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

- **Dashboard**: [http://localhost:3000](http://localhost:3000)
- **Customer Health**: [http://localhost:3000/customer-health](http://localhost:3000/customer-health)

### Testing

```bash
# Run unit tests
npm test

# Run E2E tests
npm test:e2e

# Run tests in watch mode
npm test -- --watch
```

### Building for Production

```bash
npm run build
npm start
```

## Project Structure

```
idealogic/
├── app/
│   ├── customer-health/          # Main feature routes
│   │   ├── page.tsx              # Customer list (server component)
│   │   ├── layout.tsx            # Shared layout with header
│   │   ├── loading.tsx           # Loading skeleton
│   │   ├── error.tsx             # Error boundary
│   │   └── [customerId]/         # Customer details route
│   │       ├── page.tsx          # Details page (server component)
│   │       ├── error.tsx         # Details error boundary
│   │       └── not-found.tsx     # 404 state
│   ├── api/
│   │   └── customers/            # Mock API endpoints
│   │       ├── route.ts          # GET /api/customers
│   │       └── [customerId]/
│   │           └── health/
│   │               └── route.ts  # GET /api/customers/:id/health
│   ├── layout.tsx                # Root layout with sidebar
│   ├── page.tsx                  # Dashboard homepage
│   ├── providers.tsx             # React Query provider
│   └── globals.css               # Global styles & design system
├── components/
│   ├── customer-health/          # Feature-specific components
│   │   ├── CustomerFiltersBar.tsx      # Search & filter controls
│   │   ├── CustomerTable.tsx           # Main table component
│   │   ├── CustomerTableHeader.tsx    # Sortable headers
│   │   ├── CustomerTableSkeleton.tsx   # Loading skeleton
│   │   ├── PaginationControls.tsx      # Pagination UI
│   │   ├── CustomerDetailsPanel.tsx    # Details panel with tabs
│   │   ├── CustomerDetailsSkeleton.tsx # Details loading
│   │   ├── CustomerEventsList.tsx      # Activity timeline
│   │   ├── UsageTrendsChart.tsx        # Usage chart
│   │   ├── CustomerNotes.tsx           # Notes section
│   │   ├── CustomerHealthActions.tsx   # Export & Add buttons
│   │   └── AddCustomerModal.tsx        # Add customer form
│   └── ui/                       # Reusable design system components
│       ├── HealthBadge.tsx       # Health segment badge
│       ├── Avatar.tsx            # User avatar with initials
│       ├── Skeleton.tsx          # Loading skeletons
│       ├── EmptyState.tsx        # Empty state component
│       └── ErrorState.tsx        # Error display component
├── hooks/
│   ├── useCustomerFilters.ts     # URL-based filter state management
│   └── useCustomerHealth.ts      # React Query hooks for details
├── lib/
│   ├── api/
│   │   └── customers.ts          # API client functions
│   └── mock-data.ts              # Mock data generators
├── types/
│   └── customer.ts               # TypeScript type definitions
└── tests/
    ├── components/               # Component unit tests
    ├── lib/                      # Utility tests
    └── e2e/                      # Playwright E2E tests
```

## Architecture Decisions

### Server Components vs Client Components

**Server Components (Default)**:
- Page components for initial data fetching
- Layout components
- Static/presentational UI
- **Benefits**: Smaller bundle, better SEO, faster initial load

**Client Components (When Needed)**:
- Interactive elements (filters, sorting, tabs)
- Browser API usage (`useRouter`, `useSearchParams`)
- Animations and transitions
- Form handling
- **Benefits**: Rich interactivity, real-time updates

### State Management

**URL as Source of Truth**:
- All filters, search, pagination, and sorting stored in URL query params
- Enables deep linking, bookmarking, and browser back/forward
- No global state management library needed
- Server components re-fetch on URL changes

**React Query (Optional Enhancement)**:
- Used for client-side caching of customer details
- Background refetching for live updates
- Optimistic updates for mutations (notes)
- Reduces redundant API calls

### Data Fetching Strategy

1. **Initial Load**: Server component fetches data on page load
2. **Filter Changes**: URL update triggers server re-fetch
3. **Details Panel**: Server fetch with React Query enhancement
4. **Mutations**: React Query with optimistic updates

## API Endpoints

### GET /api/customers

List customers with filtering, sorting, and pagination.

**Query Parameters**:
- `search` (string, optional) - Search by name or domain
- `segment` (string, optional) - Filter by health segment: `healthy`, `watch`, `at-risk`, or `all`
- `page` (number, optional) - Page number (default: 1)
- `page_size` (number, optional) - Items per page (default: 20, max: 100)
- `sort` (string, optional) - Sort field: `name`, `mrr`, `lastActive`, `healthScore`, `owner` (default: `healthScore`)
- `dir` (string, optional) - Sort direction: `asc` or `desc` (default: `desc`)

**Response**:
```typescript
{
  data: CustomerSummary[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
```

### GET /api/customers/:id/health

Get detailed health information for a specific customer.

**Response**:
```typescript
{
  id: string;
  name: string;
  domain: string;
  mrr: number;
  arr: number;
  healthSegment: 'healthy' | 'watch' | 'at-risk';
  healthScore: number;
  healthFactors: {
    engagement: number;
    adoption: number;
    support: number;
    growth: number;
  };
  recentEvents: CustomerEvent[];
  usageTrends: UsageDataPoint[];
  notes: CustomerNote[];
  // ... other fields
}
```

## Responsive Design

### Mobile (< 1024px)
- **Details Panel**: Full-screen sheet with swipe-to-close
- **Table**: Horizontal scroll with sticky header
- **Filters**: Stacked vertically
- **Tabs**: Show icons only with abbreviated labels
- **Typography**: Smaller font sizes, adjusted spacing

### Desktop (≥ 1024px)
- **Details Panel**: Centered card layout (max-width: 5xl)
- **Table**: Full width with all columns visible
- **Filters**: Horizontal layout
- **Tabs**: Full labels with icons
- **Spacing**: Generous padding and margins

## Performance Optimizations

1. **Server Components**: Reduce client JavaScript bundle
2. **Suspense Boundaries**: Progressive loading, better perceived performance
3. **Debounced Search**: Reduces API calls (300ms delay)
4. **URL State**: No client-side state management overhead
5. **React Query Caching**: Reduces redundant requests
6. **Code Splitting**: Automatic with Next.js App Router
7. **Image Optimization**: Ready for Next.js Image component

## Testing Strategy

### Unit Tests (Vitest)
- Component rendering and interactions
- Utility functions
- Type guards and validators
- Mock data generators

### E2E Tests (Playwright)
- User flows (filter, search, pagination)
- Navigation between list and details
- Mobile responsive behavior
- Error scenarios

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Development Guidelines

### Code Style
- TypeScript strict mode enabled
- ESLint with Next.js config
- Consistent component structure
- JSDoc comments for complex functions

### Component Patterns
- Server components by default
- Client components only when needed
- Props typing with TypeScript interfaces
- Consistent naming conventions

### State Management
- URL for global/shared state
- React state for local UI state
- React Query for server state caching

## License

MIT

## Additional Documentation

See [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md) for detailed architecture decisions, trade-offs, and implementation rationale.
