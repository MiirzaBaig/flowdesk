'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AddCustomerModal } from './customer-health/AddCustomerModal';

export function DashboardActions() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      // Fetch all customers for export
      const response = await fetch('/api/customers?page_size=1000');
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
      link.setAttribute('download', `flowdesk-dashboard-export-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      alert(`Exported ${data.data.length} customers successfully!`);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export data. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleScheduleQBR = () => {
    // In a real app, this would open a calendar/scheduling modal
    alert('QBR scheduling feature coming soon! This would open a calendar to schedule quarterly business reviews.');
  };

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Link
          href="/customer-health"
          className="flex items-center gap-3 p-4 border-2 border-black bg-white hover:bg-brand-50 transition-all shadow-brutal hover:-translate-y-1 hover:shadow-brutal-lg"
        >
          <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <span className="text-sm font-bold text-black">Health Overview</span>
        </Link>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-3 p-4 border-2 border-black bg-white hover:bg-brand-50 transition-all shadow-brutal hover:-translate-y-1 hover:shadow-brutal-lg"
        >
          <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
          </svg>
          <span className="text-sm font-bold text-black">Add Customer</span>
        </button>
        <button
          onClick={handleScheduleQBR}
          className="flex items-center gap-3 p-4 border-2 border-black bg-white hover:bg-brand-50 transition-all shadow-brutal hover:-translate-y-1 hover:shadow-brutal-lg"
        >
          <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-sm font-bold text-black">Schedule QBR</span>
        </button>
        <button
          onClick={handleExport}
          disabled={isExporting}
          className="flex items-center gap-3 p-4 border-2 border-black bg-white hover:bg-brand-50 transition-all shadow-brutal hover:-translate-y-1 hover:shadow-brutal-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isExporting ? (
            <>
              <svg className="animate-spin h-6 w-6 text-black" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span className="text-sm font-bold text-black">Exporting...</span>
            </>
          ) : (
            <>
              <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              <span className="text-sm font-bold text-black">Export Report</span>
            </>
          )}
        </button>
      </div>

      {showAddModal && (
        <AddCustomerModal
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
            window.location.reload();
          }}
        />
      )}
    </>
  );
}
