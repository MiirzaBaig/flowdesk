'use client';

import Link from 'next/link';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function CustomerDetailsError({ error, reset }: ErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-6 text-center">
      <div className="mb-4 rounded-full bg-red-100 p-4">
        <svg
          className="h-8 w-8 text-red-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>
      <h2 className="text-lg font-semibold text-slate-900">Failed to load customer details</h2>
      <p className="mt-1 text-sm text-slate-500 max-w-xs">
        We encountered an error while loading this customer&apos;s information. Please try again.
      </p>
      <div className="mt-4 flex items-center gap-3">
        <button onClick={reset} className="btn-primary">
          Try again
        </button>
        <Link href="/customer-health" className="btn-secondary" scroll={false}>
          Back to list
        </Link>
      </div>
    </div>
  );
}
