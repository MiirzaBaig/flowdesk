'use client';

import { useEffect } from 'react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function CustomerHealthError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Customer Health page error:', error);
  }, [error]);

  return (
    <div className="panel">
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
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
        <h2 className="text-xl font-bold text-slate-900">
          Unable to load customer data
        </h2>
        <p className="mt-2 text-sm text-slate-500 max-w-md">
          We encountered an error while loading the customer health data. This might be a temporary issue.
        </p>
        <div className="mt-6 flex items-center gap-3">
          <button onClick={reset} className="btn-primary">
            Try again
          </button>
          <a href="/" className="btn-secondary">
            Go to dashboard
          </a>
        </div>
        {error.digest && (
          <p className="mt-4 text-xs text-slate-400">
            Error ID: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}
