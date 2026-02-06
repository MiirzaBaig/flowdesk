import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CustomerFiltersBar } from '@/components/customer-health/CustomerFiltersBar';

// Mock the navigation hooks
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/customer-health',
}));

describe('CustomerFiltersBar', () => {
  beforeEach(() => {
    mockPush.mockClear();
  });

  it('renders search input with initial value', () => {
    render(<CustomerFiltersBar initialSearch="test" initialSegment="all" />);
    const input = screen.getByPlaceholderText('Search by name or domain...');
    expect(input).toHaveValue('test');
  });

  it('renders all segment filter buttons', () => {
    render(<CustomerFiltersBar initialSearch="" initialSegment="all" />);
    expect(screen.getByText('All')).toBeInTheDocument();
    expect(screen.getByText('Healthy')).toBeInTheDocument();
    expect(screen.getByText('Watch')).toBeInTheDocument();
    expect(screen.getByText('At Risk')).toBeInTheDocument();
  });

  it('highlights the active segment', () => {
    render(<CustomerFiltersBar initialSearch="" initialSegment="healthy" />);
    const healthyButton = screen.getByText('Healthy');
    expect(healthyButton).toHaveAttribute('aria-pressed', 'true');
  });

  it('shows clear filters button when filters are active', () => {
    render(<CustomerFiltersBar initialSearch="test" initialSegment="all" />);
    expect(screen.getByText('Clear filters')).toBeInTheDocument();
  });

  it('hides clear filters button when no filters are active', () => {
    render(<CustomerFiltersBar initialSearch="" initialSegment="all" />);
    expect(screen.queryByText('Clear filters')).not.toBeInTheDocument();
  });

  it('updates search value on input change', () => {
    render(<CustomerFiltersBar initialSearch="" initialSegment="all" />);
    const input = screen.getByPlaceholderText('Search by name or domain...');
    fireEvent.change(input, { target: { value: 'new search' } });
    expect(input).toHaveValue('new search');
  });

  it('shows clear button when search has value', () => {
    render(<CustomerFiltersBar initialSearch="test" initialSegment="all" />);
    const clearButton = screen.getByLabelText('Clear search');
    expect(clearButton).toBeInTheDocument();
  });
});
