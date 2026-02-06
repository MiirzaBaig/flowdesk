'use client';

// Wrapper no longer needs to handle split view resizing
export function CustomerHealthWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="transition-all duration-300 ease-in-out">
      {children}
    </div>
  );
}
