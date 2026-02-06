# Customer Health Overview Page - Implementation Plan

## A. High-Level Estimation

**Overall Estimate**: **1.5-3 days** of focused development work for an experienced React/Next.js engineer, assuming designs are available.

**Breakdown**:
- **Routing, layout, basic page shell**: 0.25-0.5 day
- **Table with sorting, server-side pagination, filters, search**: 0.75-1 day
- **Customer details panel (right-side) with health data**: 0.5-0.75 day
- **Loading/error/empty states, polish, accessibility, tests**: 0.5-0.75 day

## B. Architecture & Component Structure

### Next.js Route & Layout Structure

The application uses Next.js 14 App Router with the following structure:

```
app/
├── customer-health/
│   ├── layout.tsx              # Shared layout with header and actions
│   ├── page.tsx                # Main list page (server component)
│   ├── loading.tsx             # Route-level loading skeleton
│   ├── error.tsx               # Route-level error boundary
│   └── [customerId]/
│       ├── page.tsx            # Customer details (server component)
│       ├── error.tsx           # Details error boundary
│       └── not-found.tsx        # 404 state for invalid customer IDs
```

**Key Design Decisions**:
- **Server Components** for initial data fetching (better performance, SEO)
- **Client Components** for interactive elements (filters, sorting, tabs)
- **URL as source of truth** for filters, pagination, and sorting state
- **Suspense boundaries** for progressive loading

### Component Breakdown

#### Core Components

1. **`CustomerHealthPage`** (Server Component)
   - Location: `app/customer-health/page.tsx`
   - Responsibilities:
     - Reads `searchParams` from URL
     - Validates and parses query parameters
     - Fetches customer list via `fetchCustomers()`
     - Renders filters bar and table with Suspense
   - Why Server: Initial data fetch, SEO-friendly, no client bundle

2. **`CustomerFiltersBar`** (Client Component)
   - Location: `components/customer-health/CustomerFiltersBar.tsx`
   - Responsibilities:
     - Search input with debouncing (300ms)
     - Health segment filter (All/Healthy/Watch/At Risk)
     - URL synchronization via `useRouter` and `useSearchParams`
     - Loading indicator during transitions
   - Why Client: Requires browser APIs (`useRouter`), real-time input handling

3. **`CustomerTable`** (Client Component)
   - Location: `components/customer-health/CustomerTable.tsx`
   - Responsibilities:
     - Renders table with customer data
     - Handles row selection highlighting
     - Builds navigation URLs preserving query params
     - Empty state when no results
   - Why Client: Interactive row clicks, hover states, URL building

4. **`CustomerTableHeader`** (Client Component)
   - Location: `components/customer-health/CustomerTableHeader.tsx`
   - Responsibilities:
     - Sortable column headers
     - Visual sort indicators (arrows)
     - URL updates on sort change
   - Why Client: Click handlers, visual feedback

5. **`CustomerRow`** (Client Component - nested in CustomerTable)
   - Responsibilities:
     - Individual row rendering
     - Link navigation to details
     - Formatting (currency, dates, health badges)
   - Why Client: Part of interactive table

6. **`PaginationControls`** (Client Component)
   - Location: `components/customer-health/PaginationControls.tsx`
   - Responsibilities:
     - Page number navigation
     - Page size selector
     - URL updates for pagination
   - Why Client: Interactive controls

7. **`CustomerDetailsPanel`** (Client Component)
   - Location: `components/customer-health/CustomerDetailsPanel.tsx`
   - Responsibilities:
     - Tab navigation (Overview/Activity/Notes)
     - Renders customer health details
     - Responsive layout (mobile: full-screen, desktop: centered)
   - Why Client: Tab switching, animations, responsive behavior

8. **`CustomerDetailsPage`** (Server Component)
   - Location: `app/customer-health/[customerId]/page.tsx`
   - Responsibilities:
     - Fetches customer health data
     - Handles 404 errors
     - Renders responsive layout (mobile vs desktop)
   - Why Server: Data fetching, SEO

9. **`HealthBadge`** (Server/Client - mostly presentational)
   - Location: `components/ui/HealthBadge.tsx`
   - Responsibilities:
     - Visual health segment indicator
     - Color coding (green/yellow/red)
   - Why Server: Static presentation, no interactivity

10. **`CustomerEventsList`** (Client Component)
    - Location: `components/customer-health/CustomerEventsList.tsx`
    - Responsibilities:
      - Timeline of recent events
      - Animated entry with staggered delays
      - Hover interactions
    - Why Client: Animations, hover effects

11. **`UsageTrendsChart`** (Client Component)
    - Location: `components/customer-health/UsageTrendsChart.tsx`
    - Responsibilities:
      - SVG-based line chart
      - Smooth animations
      - Hover tooltips
    - Why Client: SVG interactions, animations

12. **`CustomerNotes`** (Client Component)
    - Location: `components/customer-health/CustomerNotes.tsx`
    - Responsibilities:
      - Add new notes
      - Display existing notes
      - Form handling
    - Why Client: Form state, user input

### Server vs Client Component Strategy

**Server Components (Default)**:
- Page components (`page.tsx`)
- Layout components (`layout.tsx`)
- Initial data fetching
- Static/presentational UI
- **Rationale**: Better performance, smaller client bundle, SEO-friendly

**Client Components (When Needed)**:
- Interactive elements (buttons, inputs, tabs)
- State management (filters, sorting)
- Browser APIs (`useRouter`, `useSearchParams`)
- Animations and transitions
- **Rationale**: Requires interactivity, browser APIs, or client-side state

## C. Data Fetching & State Management

### Fetching the Paginated List of Customers

**Approach**: Server-side fetching with URL-based state

**Implementation**:
```typescript
// app/customer-health/page.tsx (Server Component)
export default async function CustomerHealthPage({ searchParams }) {
  const params = await searchParams;
  const listParams = parseAndValidate(params);
  
  return (
    <Suspense fallback={<CustomerTableSkeleton />}>
      <CustomerTableContent params={listParams} />
    </Suspense>
  );
}

async function CustomerTableContent({ params }) {
  const response = await fetchCustomers(params);
  return <CustomerTable {...response} />;
}
```

**Key Features**:
- Server-side fetch in `CustomerHealthPage`
- Query params parsed and validated
- `cache: 'no-store'` for fresh data
- Suspense for progressive loading

**State Management**:
- **No global state needed** - URL is the single source of truth
- Filters, search, pagination, sorting all in URL query params
- Navigation updates URL, triggering server re-render

### Fetching Customer Health Details

**Approach**: Server-side fetch with optional client-side enhancement

**Implementation**:
```typescript
// app/customer-health/[customerId]/page.tsx (Server Component)
export default async function CustomerDetailsPage({ params }) {
  const { customerId } = await params;
  
  return (
    <Suspense fallback={<CustomerDetailsSkeleton />}>
      <CustomerDetailsContent customerId={customerId} />
    </Suspense>
  );
}

async function CustomerDetailsContent({ customerId }) {
  const customerHealth = await fetchCustomerHealth(customerId);
  return <CustomerDetailsPanel customer={customerHealth} />;
}
```

**Client-Side Enhancement** (Optional):
- React Query hook `useCustomerHealth()` available
- Uses server data as `initialData`
- Background refetching for live updates
- Caching and optimistic updates for mutations

### Managing Loading, Error, and Empty States

**Loading States**:
1. **Route-level**: `app/customer-health/loading.tsx`
   - Skeleton for entire page
   - Shown during initial navigation

2. **Component-level**: `CustomerTableSkeleton`, `CustomerDetailsSkeleton`
   - Shown during data fetching
   - Matches actual content structure

3. **Inline loading**: 
   - Filter bar shows spinner during transitions
   - Pagination shows disabled state

**Error States**:
1. **Route-level**: `app/customer-health/error.tsx`
   - Catches errors in page component
   - Retry functionality
   - User-friendly message

2. **Details-level**: `app/customer-health/[customerId]/error.tsx`
   - Handles errors in details fetch
   - Back to list button

3. **404 handling**: `app/customer-health/[customerId]/not-found.tsx`
   - Customer not found scenario
   - Clear messaging and navigation

**Empty States**:
- `EmptyState` component in table when no results
- Clear filters button
- Helpful messaging

### Libraries & Patterns

**Primary Pattern**: Server Components + URL State
- **Why**: Minimal client bundle, SEO-friendly, simple state management
- **Trade-off**: Full page refresh on filter changes (acceptable for this use case)

**Secondary Pattern**: React Query (`@tanstack/react-query`)
- **Why**: Client-side caching, background refetching, optimistic updates
- **Usage**: Optional enhancement for details panel, future mutations
- **Trade-off**: Additional bundle size (~13KB gzipped)

**Custom Hooks**:
- `useCustomerFilters()` - Encapsulates URL param reading/updating
- `useCustomerHealth()` - React Query wrapper for details
- `useAddCustomerNote()` - Mutation with optimistic updates

## D. UX Details & Edge Cases

### Slow Network Responses

**Strategies**:
1. **Skeleton Loaders**: Show content structure immediately
2. **Progressive Loading**: Keep previous content visible during updates
3. **Loading Indicators**: Inline spinners for filter/pagination changes
4. **Optimistic UI**: For mutations (notes), show immediate feedback
5. **Timeout Handling**: Error state with retry after timeout

**Implementation**:
- Suspense boundaries at multiple levels
- `useTransition` for non-blocking updates
- Previous table content remains visible during filter changes

### Keeping Filters/Search in Sync with URL

**Approach**: URL as single source of truth

**Implementation**:
```typescript
// CustomerFiltersBar reads from URL
const searchParams = useSearchParams();
const initialSearch = searchParams.get('search') || '';

// Updates URL on change
const updateParams = (updates) => {
  const params = new URLSearchParams(searchParams.toString());
  // Apply updates...
  router.push(`${pathname}?${params.toString()}`, { scroll: false });
};
```

**Features**:
- Debounced search (300ms) to reduce API calls
- URL updates trigger server re-fetch automatically
- Browser back/forward works correctly
- Deep linking supported (shareable URLs)

### Preserving Scroll Position & Selection

**Scroll Position**:
- `scroll={false}` on Link components prevents scroll jump
- Table remains in view when opening details
- Mobile: Details panel is full-screen, no scroll preservation needed

**Selection Highlighting**:
- Selected customer ID stored in URL
- Table row highlights when `selectedCustomerId` matches
- Preserved across page refreshes via URL

### UX Edge Cases Handled

1. **No customers match filters/search**
   - Empty state component with clear messaging
   - "Clear filters" button for easy reset
   - No blank table shown

2. **Invalid query parameters**
   - Type guards validate segment values
   - Page number coerced to valid range (1 to max)
   - Default values for missing params
   - Graceful fallback to defaults

3. **Customer removed or inaccessible**
   - 404 handling in details route
   - `not-found.tsx` with clear message
   - "Back to list" navigation
   - Error boundary catches unexpected errors

4. **Stale URLs / outdated segments**
   - Validation checks segment against allowed values
   - Falls back to "all" if invalid
   - No runtime errors, graceful degradation

5. **Mobile / narrow viewport**
   - Details panel: Full-screen sheet on mobile, centered card on desktop
   - Responsive table with horizontal scroll
   - Touch-friendly tap targets
   - Responsive typography and spacing
   - Tab labels: Full text on desktop, initials on mobile

6. **Concurrent filter changes**
   - Debounced search prevents rapid API calls
   - `useTransition` prevents UI blocking
   - Loading indicators show during transitions

7. **Network errors / timeouts**
   - Error boundaries catch failures
   - Retry buttons available
   - User-friendly error messages
   - No technical jargon exposed

## E. Task Breakdown

### Phase 1: Foundation (0.5 day)
1. ✅ Set up Next.js route structure (`app/customer-health/`)
2. ✅ Create layout with header and actions
3. ✅ Implement basic page shell
4. ✅ Set up TypeScript types (`types/customer.ts`)

### Phase 2: Table Implementation (0.75 day)
5. ✅ Build table shell with mock data
6. ✅ Implement `CustomerTable`, `CustomerTableHeader`, `CustomerRow`
7. ✅ Add server-side data fetching
8. ✅ Wire up API route (`/api/customers`)
9. ✅ Implement data formatting (currency, dates)

### Phase 3: Filtering & Search (0.5 day)
10. ✅ Build `CustomerFiltersBar` component
11. ✅ Implement search with debouncing
12. ✅ Add health segment filter
13. ✅ Create `useCustomerFilters` hook
14. ✅ Wire up URL synchronization

### Phase 4: Pagination & Sorting (0.5 day)
15. ✅ Implement `PaginationControls`
16. ✅ Add page size selector
17. ✅ Wire up sortable columns
18. ✅ Handle URL param updates
19. ✅ Add results count display

### Phase 5: Details Panel (0.75 day)
20. ✅ Create details route (`[customerId]/page.tsx`)
21. ✅ Implement `CustomerDetailsPanel` with tabs
22. ✅ Build `CustomerEventsList` component
23. ✅ Create `UsageTrendsChart` component
24. ✅ Implement `CustomerNotes` component
25. ✅ Add responsive layout (mobile/desktop)

### Phase 6: States & Polish (0.5 day)
26. ✅ Create loading skeletons
27. ✅ Implement error boundaries
28. ✅ Add empty states
29. ✅ Handle 404 scenarios
30. ✅ Add smooth animations
31. ✅ Implement responsive design

### Phase 7: Testing & QA (0.5 day)
32. ✅ Write unit tests for components
33. ✅ Add E2E tests with Playwright
34. ✅ Test edge cases
35. ✅ Manual QA pass

### Phase 8: Enhancements (0.25 day)
36. ✅ Add React Query for client-side caching
37. ✅ Implement optimistic updates for notes
38. ✅ Add export functionality
39. ✅ Create dashboard page

## Implementation Notes

### API Integration

The implementation uses mock API routes (`app/api/customers/`) that simulate the expected backend behavior:

- `GET /api/customers` - Returns paginated, filtered, sorted customer list
- `GET /api/customers/:id/health` - Returns detailed health information

In production, these would be replaced with actual API calls to the backend service.

### Performance Optimizations

1. **Server Components**: Reduce client bundle size
2. **Suspense Boundaries**: Progressive loading, better perceived performance
3. **Debounced Search**: Reduces API calls
4. **URL State**: No client-side state management overhead
5. **React Query Caching**: Reduces redundant requests (optional enhancement)

### Accessibility

- ARIA labels on interactive elements
- Keyboard navigation support
- Focus management
- Screen reader friendly
- Semantic HTML structure

### Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Responsive design for all screen sizes

## Future Enhancements

1. **Real-time Updates**: WebSocket integration for live health score updates
2. **Bulk Actions**: Select multiple customers for batch operations
3. **Advanced Filters**: Date ranges, MRR ranges, custom segments
4. **Export Formats**: PDF, Excel in addition to CSV
5. **Saved Views**: Save filter combinations for quick access
6. **Keyboard Shortcuts**: Power user features for faster navigation
