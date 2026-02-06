import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HealthBadge } from '@/components/ui/HealthBadge';

describe('HealthBadge', () => {
  it('renders healthy segment correctly', () => {
    render(<HealthBadge segment="healthy" />);
    expect(screen.getByText('Healthy')).toBeInTheDocument();
  });

  it('renders watch segment correctly', () => {
    render(<HealthBadge segment="watch" />);
    expect(screen.getByText('Watch')).toBeInTheDocument();
  });

  it('renders at-risk segment correctly', () => {
    render(<HealthBadge segment="at-risk" />);
    expect(screen.getByText('At Risk')).toBeInTheDocument();
  });

  it('displays score when showScore is true', () => {
    render(<HealthBadge segment="healthy" showScore score={85} />);
    expect(screen.getByText('(85)')).toBeInTheDocument();
  });

  it('does not display score when showScore is false', () => {
    render(<HealthBadge segment="healthy" score={85} />);
    expect(screen.queryByText('(85)')).not.toBeInTheDocument();
  });

  it('applies correct size class for sm', () => {
    const { container } = render(<HealthBadge segment="healthy" size="sm" />);
    const badge = container.firstChild as HTMLElement;
    expect(badge.className).toContain('text-xs');
  });

  it('applies correct size class for md', () => {
    const { container } = render(<HealthBadge segment="healthy" size="md" />);
    const badge = container.firstChild as HTMLElement;
    expect(badge.className).toContain('text-sm');
  });
});
