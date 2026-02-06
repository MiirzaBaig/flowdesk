import Link from 'next/link';

export default function CustomerNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-6 text-center">
      <div className="mb-4 rounded-full bg-slate-100 p-4">
        <svg
          className="h-8 w-8 text-slate-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <h2 className="text-lg font-semibold text-slate-900">Customer not found</h2>
      <p className="mt-1 text-sm text-slate-500 max-w-xs">
        This customer may have been removed or you don&apos;t have access to view their details.
      </p>
      <Link
        href="/customer-health"
        className="mt-4 btn-secondary"
        scroll={false}
      >
        Back to customer list
      </Link>
    </div>
  );
}
