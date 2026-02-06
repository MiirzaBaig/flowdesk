# Architecture Overview

## Design Principles

### 1. Server-First Approach
- Use server components by default
- Only use client components when interactivity is required
- Reduces client bundle size and improves initial load time

### 2. URL as State
- All filter, search, pagination, and sort state in URL
- Enables deep linking, bookmarking, and browser navigation
- No global state management needed

### 3. Progressive Enhancement
- Server-rendered content works without JavaScript
- Client-side enhancements for better UX
- Graceful degradation

### 4. Performance First
- Suspense boundaries for progressive loading
- Debounced search to reduce API calls
- React Query caching for client-side data
- Optimistic updates for mutations

## Component Hierarchy

```
CustomerHealthPage (Server)
├── CustomerFiltersBar (Client)
│   └── Search Input
│   └── Segment Filter Buttons
│
└── Suspense
    └── CustomerTableContent (Server)
        └── CustomerTable (Client)
            ├── CustomerTableHeader (Client)
            ├── CustomerRow[] (Client)
            └── PaginationControls (Client)
```

## Data Flow

### List Page Load
```
1. User navigates to /customer-health
2. Server component reads searchParams
3. fetchCustomers() called on server
4. Data passed to CustomerTable (client)
5. Table renders with data
```

### Filter Change
```
1. User types in search or clicks filter
2. CustomerFiltersBar updates URL via router.push()
3. Next.js re-renders server component
4. New searchParams trigger new fetchCustomers()
5. Table updates with new data
```

### Details Panel Open
```
1. User clicks customer row
2. Link navigates to /customer-health/[customerId]
3. Server component fetches customer health
4. CustomerDetailsPanel renders with data
5. React Query optionally enhances with caching
```

## State Management Flow

```
URL Query Params
    ↓
Server Component (reads searchParams)
    ↓
API Fetch (server-side)
    ↓
Props to Client Components
    ↓
User Interaction
    ↓
URL Update (router.push)
    ↓
Server Re-render (new searchParams)
```

## Responsive Breakpoints

- **Mobile**: < 640px (sm)
- **Tablet**: 640px - 1024px
- **Desktop**: ≥ 1024px (lg)

### Mobile Adaptations
- Details panel: Full-screen sheet
- Table: Horizontal scroll
- Filters: Stacked vertically
- Tabs: Icons only with single letter labels
- Typography: Reduced sizes

## Performance Metrics

### Bundle Size
- Server components: ~0KB client bundle
- Client components: Optimized with code splitting
- React Query: ~13KB gzipped (optional)

### Load Times
- Initial page load: < 1s (with mock data)
- Filter change: < 300ms (debounced)
- Details panel: < 500ms

## Security Considerations

1. **Input Validation**: All query params validated with type guards
2. **XSS Prevention**: React's built-in escaping
3. **CSRF**: Next.js built-in protection
4. **API Security**: Would use authentication tokens in production

## Accessibility Features

- Semantic HTML structure
- ARIA labels on interactive elements
- Keyboard navigation support
- Focus management
- Screen reader friendly
- Color contrast compliance

## Testing Strategy

### Unit Tests
- Component rendering
- User interactions
- Utility functions
- Type guards

### Integration Tests
- Filter + search combinations
- Pagination flow
- Sort behavior
- Navigation

### E2E Tests
- Complete user journeys
- Mobile responsive behavior
- Error scenarios
- Edge cases

## Future Improvements

1. **Real-time Updates**: WebSocket integration
2. **Offline Support**: Service worker + cache
3. **Advanced Filters**: Date ranges, custom segments
4. **Bulk Actions**: Multi-select operations
5. **Keyboard Shortcuts**: Power user features
6. **Saved Views**: Preset filter combinations
