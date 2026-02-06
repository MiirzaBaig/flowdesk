import { Suspense } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CustomerDetailsPanel } from '@/components/customer-health/CustomerDetailsPanel';
import { CustomerDetailsSkeleton } from '@/components/customer-health/CustomerDetailsSkeleton';
import { fetchCustomerHealth } from '@/lib/api/customers';

// Force dynamic rendering since we use dynamic route params
export const dynamic = 'force-dynamic';

interface CustomerDetailsPageProps {
  params: Promise<{ customerId: string }>;
}

export default async function CustomerDetailsPage({
  params,
}: CustomerDetailsPageProps) {
  const { customerId } = await params;

  return (
    <>
      {/* Mobile: Full-screen sheet */}
      <div className="lg:hidden fixed inset-0 z-50 bg-white">
        {/* Mobile header with back button */}
        <div className="sticky top-0 z-10 bg-white border-b-2 border-black px-4 py-3 flex items-center gap-3">
          <Link
            href="/customer-health"
            className="p-2 border-2 border-black bg-white text-black hover:bg-black hover:text-white transition-all shadow-brutal-sm active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
            aria-label="Close panel"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <h2 className="text-sm font-black text-black uppercase">Customer Details</h2>
        </div>

        {/* Mobile content */}
        <div className="overflow-y-auto h-[calc(100vh-57px)]">
          <div className="p-4">
            <Suspense fallback={<CustomerDetailsSkeleton />}>
              <CustomerDetailsContent customerId={customerId} />
            </Suspense>
          </div>
        </div>
      </div>

      {/* Desktop: Centered card layout */}
      <div className="hidden lg:block max-w-5xl mx-auto">
        <div className="mb-6">
          <Link
            href="/customer-health"
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-black transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Customer List
          </Link>
        </div>

        <div className="bg-white border-2 border-black shadow-brutal">
          <Suspense fallback={<CustomerDetailsSkeleton />}>
            <CustomerDetailsContent customerId={customerId} />
          </Suspense>
        </div>
      </div>
    </>
  );
}

// Panel content component
async function CustomerDetailsContent({ customerId }: { customerId: string }) {
  try {
    const customerHealth = await fetchCustomerHealth(customerId);
    return <CustomerDetailsPanel customer={customerHealth} />;
  } catch (error) {
    if (error instanceof Error && error.message === 'Customer not found') {
      notFound();
    }
    throw error;
  }
}
