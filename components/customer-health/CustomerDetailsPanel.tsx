'use client';

import { useState, useEffect } from 'react';
import { format, formatDistanceToNow } from 'date-fns';
import { clsx } from 'clsx';
import type { CustomerHealthDetails } from '@/types/customer';
import { HealthBadge } from '@/components/ui/HealthBadge';
import { Avatar } from '@/components/ui/Avatar';
import { CustomerEventsList } from './CustomerEventsList';
import { UsageTrendsChart } from './UsageTrendsChart';
import { CustomerNotes } from './CustomerNotes';

/**
 * Props for CustomerDetailsPanel component
 */
interface CustomerDetailsPanelProps {
  /** Complete customer health details data */
  customer: CustomerHealthDetails;
}

/**
 * CustomerDetailsPanel Component
 * 
 * Displays comprehensive customer health information in a tabbed interface.
 * 
 * Tabs:
 * - **Overview**: Health factors, usage trends, contract details, account owner
 * - **Activity**: Timeline of recent customer events
 * - **Notes**: Add and view internal notes
 * 
 * Features:
 * - Smooth tab transitions
 * - Animated health factor bars
 * - Interactive usage chart
 * - Responsive design (mobile: full-screen, desktop: centered)
 * - Professional animations throughout
 * 
 * @example
 * ```tsx
 * <CustomerDetailsPanel customer={customerHealthData} />
 * ```
 */

type TabId = 'overview' | 'activity' | 'notes';

const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { 
    id: 'overview', 
    label: 'Overview',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  { 
    id: 'activity', 
    label: 'Activity',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  { 
    id: 'notes', 
    label: 'Notes',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ),
  },
];

export function CustomerDetailsPanel({ customer }: CustomerDetailsPanelProps) {
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header with slide-in animation */}
      <div 
        className="p-4 sm:p-6 border-b-2 border-black bg-white transition-all duration-500 ease-out"
        style={{
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(-20px)',
        }}
      >
        <div className="flex items-start gap-3 sm:gap-4 pr-4 sm:pr-8">
          <div className="transition-transform duration-300 hover:scale-105 flex-shrink-0">
            <Avatar name={customer.name} size="lg" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg sm:text-xl font-black text-black truncate uppercase">
              {customer.name}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 truncate">{customer.domain}</p>
            <div className="mt-2">
              <HealthBadge
                segment={customer.healthSegment}
                showScore
                score={customer.healthScore}
              />
            </div>
          </div>
        </div>

        {/* Quick stats with staggered animation - responsive grid */}
        <div className="mt-4 sm:mt-6 grid grid-cols-2 gap-3 sm:gap-4">
          <div 
            className="bg-white border-2 border-black shadow-brutal p-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-brutal-lg cursor-default"
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateX(0)' : 'translateX(-20px)',
              transitionDelay: '100ms',
            }}
          >
            <p className="text-xs font-bold text-black uppercase tracking-wider">MRR</p>
            <p className="mt-1 text-lg font-black text-black">
              {formatCurrency(customer.mrr)}
            </p>
          </div>
          <div 
            className="bg-white border-2 border-black shadow-brutal p-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-brutal-lg cursor-default"
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateX(0)' : 'translateX(20px)',
              transitionDelay: '150ms',
            }}
          >
            <p className="text-xs font-bold text-black uppercase tracking-wider">ARR</p>
            <p className="mt-1 text-lg font-black text-black">
              {formatCurrency(customer.arr)}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs with smooth transitions - responsive */}
      <div 
        className="border-b-2 border-black"
        style={{
          opacity: mounted ? 1 : 0,
          transitionDelay: '200ms',
        }}
      >
        <nav className="flex relative" aria-label="Tabs">
          {tabs.map((tab, index) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={clsx(
                'flex-1 px-2 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-center border-r-2 border-black last:border-r-0 transition-all duration-200 flex items-center justify-center gap-1 sm:gap-2',
                activeTab === tab.id
                  ? 'bg-black text-white'
                  : 'bg-white text-black hover:bg-brand-50'
              )}
              aria-selected={activeTab === tab.id}
              role="tab"
              style={{
                transitionDelay: `${index * 50}ms`,
              }}
            >
              <span className={clsx(
                'transition-transform duration-200 flex-shrink-0',
                activeTab === tab.id && 'scale-110'
              )}>
                {tab.icon}
              </span>
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.label.charAt(0)}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab content with fade transition - responsive padding */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        <div
          key={activeTab}
          className="animate-fadeIn"
          style={{
            animation: 'fadeIn 0.3s ease-out',
          }}
        >
          {activeTab === 'overview' && (
            <OverviewTab customer={customer} mounted={mounted} />
          )}
          {activeTab === 'activity' && (
            <CustomerEventsList events={customer.recentEvents} />
          )}
          {activeTab === 'notes' && (
            <CustomerNotes notes={customer.notes} customerId={customer.id} />
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

function OverviewTab({ customer, mounted }: { customer: CustomerHealthDetails; mounted: boolean }) {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Health factors with animated bars */}
      <section
        style={{
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.4s ease-out',
          transitionDelay: '250ms',
        }}
      >
        <h3 className="text-xs sm:text-sm font-bold text-black uppercase mb-2 sm:mb-3">Health Factors</h3>
        <div className="space-y-2 sm:space-y-3">
          <HealthFactorBar label="Engagement" value={customer.healthFactors.engagement} delay={0} />
          <HealthFactorBar label="Adoption" value={customer.healthFactors.adoption} delay={100} />
          <HealthFactorBar label="Support" value={customer.healthFactors.support} delay={200} />
          <HealthFactorBar label="Growth" value={customer.healthFactors.growth} delay={300} />
        </div>
      </section>

      {/* Usage trends chart */}
      <section
        style={{
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.4s ease-out',
          transitionDelay: '350ms',
        }}
      >
        <h3 className="text-xs sm:text-sm font-bold text-black uppercase mb-2 sm:mb-3">Usage Trends (30 days)</h3>
        <UsageTrendsChart data={customer.usageTrends} />
      </section>

      {/* Contract info */}
      <section
        style={{
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.4s ease-out',
          transitionDelay: '450ms',
        }}
      >
        <h3 className="text-xs sm:text-sm font-bold text-black uppercase mb-2 sm:mb-3">Contract Details</h3>
        <div className="bg-white border-2 border-black shadow-brutal p-3 sm:p-4 space-y-2 sm:space-y-3 transition-shadow hover:shadow-brutal-lg">
          <ContractRow label="Contract Start" value={format(new Date(customer.contractStartDate), 'MMM d, yyyy')} />
          <ContractRow label="Contract End" value={format(new Date(customer.contractEndDate), 'MMM d, yyyy')} />
          <ContractRow label="Time Remaining" value={formatDistanceToNow(new Date(customer.contractEndDate))} />
        </div>
      </section>

      {/* Owner info */}
      <section
        style={{
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.4s ease-out',
          transitionDelay: '550ms',
        }}
      >
        <h3 className="text-xs sm:text-sm font-bold text-black uppercase mb-2 sm:mb-3">Account Owner</h3>
        <div className="flex items-center gap-2 sm:gap-3 bg-white border-2 border-black shadow-brutal p-3 sm:p-4 transition-all duration-200 hover:shadow-brutal-lg hover:-translate-y-0.5 cursor-pointer group">
          <div className="transition-transform duration-200 group-hover:scale-110 flex-shrink-0">
            <Avatar name={customer.owner.name} size="md" />
          </div>
          <div className="min-w-0">
            <p className="text-sm sm:text-base font-bold text-black group-hover:text-brand-600 transition-colors truncate">{customer.owner.name}</p>
            <p className="text-xs text-slate-500 font-semibold truncate">{customer.owner.email}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

function ContractRow({ label, value }: { label: string; value: string }) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0 text-xs sm:text-sm py-1 transition-colors duration-150 cursor-default"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span className={clsx(
        'font-bold transition-colors duration-150',
        isHovered ? 'text-black' : 'text-slate-500'
      )}>{label}</span>
      <span className={clsx(
        'font-bold transition-all duration-150 sm:text-right',
        isHovered ? 'text-brand-600 sm:translate-x-1' : 'text-black'
      )}>
        {value}
      </span>
    </div>
  );
}

function HealthFactorBar({ label, value, delay }: { label: string; value: number; delay: number }) {
  const [animated, setAnimated] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 500 + delay);
    return () => clearTimeout(timer);
  }, [delay]);

  const getBarColor = (value: number) => {
    if (value >= 70) return 'bg-health-healthy';
    if (value >= 40) return 'bg-health-watch';
    return 'bg-health-at-risk';
  };

  return (
    <div
      className="group cursor-default"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex justify-between text-xs sm:text-sm mb-1">
        <span className={clsx(
          'font-bold transition-colors duration-200',
          isHovered ? 'text-black' : 'text-slate-500'
        )}>{label}</span>
        <span className={clsx(
          'font-black transition-all duration-200',
          isHovered ? 'text-brand-600 scale-110' : 'text-black'
        )}>{value}</span>
      </div>
      <div className={clsx(
        'h-2.5 sm:h-3 bg-white border-2 border-black overflow-hidden relative transition-all duration-200',
        isHovered ? 'shadow-brutal-sm' : 'shadow-none'
      )}>
        <div
          className={clsx(
            'h-full transition-all duration-700 ease-out',
            getBarColor(value),
            animated ? '' : 'w-0'
          )}
          style={{ 
            width: animated ? `${value}%` : '0%',
            transitionDelay: `${delay}ms`,
          }}
        />
        {/* Shimmer effect on hover */}
        {isHovered && (
          <div 
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            style={{
              animation: 'shimmer 1s ease-in-out infinite',
            }}
          />
        )}
      </div>
      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}
