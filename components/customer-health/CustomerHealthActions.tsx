'use client';

import { useState, useTransition } from 'react';
import { useSearchParams } from 'next/navigation';
import { AddCustomerModal } from './AddCustomerModal';

export function CustomerHealthActions() {
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [showAddModal, setShowAddModal] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);

    try {
      // Get current filters from URL
      const params = new URLSearchParams(searchParams.toString());

      // Fetch all customers matching current filters (without pagination limit)
      const exportParams = new URLSearchParams(params);
      exportParams.set('page_size', '1000'); // Get up to 1000 records

      const response = await fetch(`/api/customers?${exportParams.toString()}`);
      const data = await response.json();

      // Convert to CSV
      const headers = ['Name', 'Domain', 'MRR', 'Last Active', 'Health Segment', 'Health Score', 'Owner'];
      const rows = data.data.map((customer: any) => [
        customer.name,
        customer.domain,
        `$${customer.mrr.toLocaleString()}`,
        new Date(customer.lastActive).toLocaleDateString(),
        customer.healthSegment,
        customer.healthScore,
        customer.owner.name,
      ]);

      const csvContent = [
        headers.join(','),
        ...rows.map((row: string[]) => row.map(cell => `"${cell}"`).join(','))
      ].join('\n');

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);

      link.setAttribute('href', url);
      link.setAttribute('download', `customer-health-export-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Show success message
      alert(`Exported ${data.data.length} customers successfully!`);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export customers. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <>
      <div className="flex items-center gap-3">
        <button
          onClick={handleExport}
          disabled={isExporting || isPending}
          className="group relative inline-flex items-center gap-2 px-4 py-2.5 bg-white text-black text-sm font-bold border-2 border-black shadow-brutal hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-x-0 disabled:translate-y-0"
        >
          {isExporting ? (
            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          ) : (
            <svg className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
          )}
          <span>{isExporting ? 'Exporting...' : 'Export'}</span>
        </button>
        <button
          onClick={() => setShowAddModal(true)}
          className="group relative inline-flex items-center gap-2 px-4 py-2.5 bg-brand-500 text-white text-sm font-bold border-2 border-black shadow-brutal hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
        >
          <svg className="w-4 h-4 transition-transform group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
          </svg>
          <span>Add Customer</span>
        </button>
      </div>

      {showAddModal && (
        <AddCustomerModal
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
            // Refresh the page to show new customer
            window.location.reload();
          }}
        />
      )}
    </>
  );
}
