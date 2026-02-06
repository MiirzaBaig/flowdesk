import type { Metadata } from 'next';
import { Suspense } from 'react';
import type { CustomerListParams, HealthSegment } from '@/types/customer';
import { CustomerHealthActions } from '@/components/customer-health/CustomerHealthActions';
import { CustomerFiltersBar } from '@/components/customer-health/CustomerFiltersBar';
import { CustomerTable } from '@/components/customer-health/CustomerTable';
import { CustomerTableSkeleton } from '@/components/customer-health/CustomerTableSkeleton';
import { CustomerHealthWrapper } from '@/components/customer-health/CustomerHealthWrapper';
import { fetchCustomers } from '@/lib/api/customers';

export const metadata: Metadata = {
  title: 'Customer Health - FlowDesk',
  description: 'Monitor and manage customer health across your portfolio',
};

interface CustomerHealthLayoutProps {
  children: React.ReactNode;
  params?: Promise<Record<string, string>>;
}

export default async function CustomerHealthLayout({
  children,
}: CustomerHealthLayoutProps) {
  return (
    <div className="min-h-screen bg-white relative">
      <CustomerHealthWrapper>
        {/* Page header */}
        <header className="sticky top-0 z-10 bg-white border-b-2 border-black">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-black text-black uppercase tracking-tight">
                  Customer Health
                </h1>
                <p className="mt-1 text-sm font-bold text-slate-500">
                  Monitor customer health scores and prioritize your outreach
                </p>
              </div>
              <CustomerHealthActions />
            </div>
          </div>
        </header>

        {/* Main content area */}
        <div className="p-6">
          {children}
        </div>
      </CustomerHealthWrapper>
    </div>
  );
}
