import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Avatar } from '@/components/ui/Avatar';

describe('Avatar', () => {
  it('renders initials when no image is provided', () => {
    render(<Avatar name="John Doe" />);
    expect(screen.getByText('JD')).toBeInTheDocument();
  });

  it('renders single initial for single-word name', () => {
    render(<Avatar name="John" />);
    expect(screen.getByText('JO')).toBeInTheDocument();
  });

  it('renders image when imageUrl is provided', () => {
    render(<Avatar name="John Doe" imageUrl="/test-image.jpg" />);
    const img = screen.getByAltText('John Doe');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', '/test-image.jpg');
  });

  it('applies correct size class for sm', () => {
    const { container } = render(<Avatar name="John Doe" size="sm" />);
    const avatar = container.firstChild as HTMLElement;
    expect(avatar.className).toContain('h-6');
    expect(avatar.className).toContain('w-6');
  });

  it('applies correct size class for md', () => {
    const { container } = render(<Avatar name="John Doe" size="md" />);
    const avatar = container.firstChild as HTMLElement;
    expect(avatar.className).toContain('h-8');
    expect(avatar.className).toContain('w-8');
  });

  it('applies correct size class for lg', () => {
    const { container } = render(<Avatar name="John Doe" size="lg" />);
    const avatar = container.firstChild as HTMLElement;
    expect(avatar.className).toContain('h-10');
    expect(avatar.className).toContain('w-10');
  });

  it('includes title attribute with name', () => {
    const { container } = render(<Avatar name="John Doe" />);
    const avatar = container.firstChild as HTMLElement;
    expect(avatar).toHaveAttribute('title', 'John Doe');
  });
});
