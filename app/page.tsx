'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { DashboardActions } from '@/components/DashboardActions';
import { clsx } from 'clsx';

// Mock data for dashboard
const stats = [
  { label: 'Total Customers', value: '247', change: '+12', changeType: 'positive' },
  { label: 'Total ARR', value: '$4.2M', change: '+8.2%', changeType: 'positive' },
  { label: 'At Risk Accounts', value: '18', change: '-3', changeType: 'positive' },
  { label: 'Avg Health Score', value: '72', change: '+5', changeType: 'positive' },
];

const recentActivity = [
  { customer: 'Acme Corporation', action: 'Health score dropped to 45', time: '2 hours ago', type: 'warning' },
  { customer: 'TechStart Inc', action: 'Renewed contract for 2 years', time: '4 hours ago', type: 'success' },
  { customer: 'Global Solutions', action: 'Support ticket opened', time: '5 hours ago', type: 'info' },
  { customer: 'DataDriven Co', action: 'QBR meeting scheduled', time: '1 day ago', type: 'info' },
  { customer: 'CloudFirst Systems', action: 'Upgraded to Enterprise', time: '2 days ago', type: 'success' },
];

const healthDistribution = [
  { segment: 'Healthy', count: 156, percentage: 63, color: 'bg-health-healthy' },
  { segment: 'Watch', count: 73, percentage: 30, color: 'bg-health-watch' },
  { segment: 'At Risk', count: 18, percentage: 7, color: 'bg-health-at-risk' },
];

const topAtRisk = [
  { name: 'Quantum Analytics', mrr: '$8,500', score: 28, daysInactive: 14 },
  { name: 'Nexus Innovations', mrr: '$12,000', score: 32, daysInactive: 21 },
  { name: 'Pinnacle Software', mrr: '$6,200', score: 35, daysInactive: 8 },
];

export default function HomePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Trigger animations after mount
    const timer = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header
        className="sticky top-0 z-10 bg-white border-b-2 border-black transition-all duration-500 ease-out"
        style={{
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(-10px)',
        }}
      >
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-black text-black uppercase tracking-tight">
                Dashboard
              </h1>
              <p className="mt-1 text-sm font-bold text-slate-500">
                Welcome back! Here&apos;s what&apos;s happening with your customers.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-black border-2 border-black px-3 py-1.5 bg-slate-100">
                Feb 6, 2026
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6">
        {/* Stats Grid with staggered animation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <StatCard
              key={stat.label}
              stat={stat}
              index={index}
              mounted={mounted}
            />
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Health Distribution */}
          <HealthDistributionCard mounted={mounted} />

          {/* Recent Activity */}
          <RecentActivityCard mounted={mounted} />

          {/* At Risk Accounts */}
          <AtRiskAccountsCard mounted={mounted} />
        </div>

        {/* Quick Actions */}
        <div
          className="bg-white border-2 border-black shadow-brutal p-5 transition-all duration-500 ease-out"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(20px)',
            transitionDelay: '400ms',
          }}
        >
          <h2 className="text-sm font-black text-black uppercase tracking-wide mb-4">
            Quick Actions
          </h2>
          <DashboardActions />
        </div>

        {/* Footer Note */}
        <div className="text-center py-4">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            FlowDesk • Customer Success Platform • Data refreshed 5 minutes ago
          </p>
        </div>
      </div>
    </div>
  );
}

// Stat Card Component with smooth animations
function StatCard({ stat, index, mounted }: { stat: typeof stats[0]; index: number; mounted: boolean }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative bg-white border-2 border-black shadow-brutal p-4 transition-all duration-300 ease-out cursor-default group"
      style={{
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'translateY(0)' : 'translateY(20px)',
        transitionDelay: `${index * 50}ms`,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider transition-colors duration-200">
        {stat.label}
      </p>
      <div className="mt-2 flex items-baseline gap-2">
        <p className={clsx(
          'text-3xl font-black text-black transition-all duration-300',
          isHovered && 'scale-105 text-brand-500'
        )}>
          {stat.value}
        </p>
        <span
          className={clsx(
            'text-sm font-bold transition-all duration-300',
            stat.changeType === 'positive' ? 'text-[#00A96E]' : 'text-[#FF3333]',
            isHovered && 'scale-110'
          )}
        >
          {stat.change}
        </span>
      </div>
      {/* Subtle hover effect */}
      <div
        className={clsx(
          'absolute inset-0 border-2 border-transparent transition-all duration-300 pointer-events-none',
          isHovered && 'shadow-brutal-lg'
        )}
        style={{ transform: isHovered ? 'translate(-2px, -2px)' : 'translate(0, 0)' }}
      />
    </div>
  );
}

// Health Distribution Card
function HealthDistributionCard({ mounted }: { mounted: boolean }) {
  const [animatedBars, setAnimatedBars] = useState(false);

  useEffect(() => {
    if (mounted) {
      const timer = setTimeout(() => setAnimatedBars(true), 300);
      return () => clearTimeout(timer);
    }
  }, [mounted]);

  return (
    <div
      className="bg-white border-2 border-black shadow-brutal p-5 transition-all duration-500 ease-out"
      style={{
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'translateY(0)' : 'translateY(20px)',
        transitionDelay: '200ms',
      }}
    >
      <h2 className="text-sm font-black text-black uppercase tracking-wide mb-4">
        Customer Health Distribution
      </h2>
      <div className="space-y-4">
        {healthDistribution.map((item, index) => (
          <div key={item.segment} className="group">
            <div className="flex justify-between text-sm mb-1">
              <span className="font-bold text-black transition-colors duration-200 group-hover:text-brand-500">
                {item.segment}
              </span>
              <span className="font-black text-black">{item.count} ({item.percentage}%)</span>
            </div>
            <div className="h-4 bg-white border-2 border-black overflow-hidden shadow-brutal-sm relative">
              <div
                className={clsx(
                  'h-full border-r-2 border-black transition-all duration-700 ease-out',
                  item.color
                )}
                style={{
                  width: animatedBars ? `${item.percentage}%` : '0%',
                  transitionDelay: `${index * 150}ms`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
      <Link
        href="/customer-health"
        className="mt-6 block text-center btn btn-primary w-full transition-all duration-200 hover:scale-[1.02]"
      >
        View All Customers →
      </Link>
    </div>
  );
}

// Recent Activity Card
function RecentActivityCard({ mounted }: { mounted: boolean }) {
  return (
    <div
      className="bg-white border-2 border-black shadow-brutal p-5 transition-all duration-500 ease-out"
      style={{
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'translateY(0)' : 'translateY(20px)',
        transitionDelay: '250ms',
      }}
    >
      <h2 className="text-sm font-black text-black uppercase tracking-wide mb-4">
        Recent Activity
      </h2>
      <div className="space-y-3">
        {recentActivity.map((activity, i) => (
          <div
            key={i}
            className="flex items-start gap-3 pb-3 border-b-2 border-black last:border-0 last:pb-0 transition-all duration-200 hover:bg-slate-50 -mx-2 px-2 py-1 rounded cursor-default group"
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateX(0)' : 'translateX(-10px)',
              transitionDelay: `${300 + i * 50}ms`,
            }}
          >
            <div
              className={clsx(
                'w-2 h-2 mt-2 border border-black flex-shrink-0 transition-all duration-300',
                activity.type === 'warning'
                  ? 'bg-health-at-risk group-hover:scale-125'
                  : activity.type === 'success'
                    ? 'bg-health-healthy group-hover:scale-125'
                    : 'bg-slate-200 group-hover:bg-slate-400'
              )}
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-black truncate transition-colors duration-200 group-hover:text-brand-500">
                {activity.customer}
              </p>
              <p className="text-xs font-medium text-slate-600">
                {activity.action}
              </p>
              <p className="text-xs font-bold text-slate-400 mt-0.5">
                {activity.time}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// At Risk Accounts Card
function AtRiskAccountsCard({ mounted }: { mounted: boolean }) {
  return (
    <div
      className="bg-white border-2 border-black shadow-brutal p-5 transition-all duration-500 ease-out"
      style={{
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'translateY(0)' : 'translateY(20px)',
        transitionDelay: '300ms',
      }}
    >
      <h2 className="text-sm font-black text-black uppercase tracking-wide mb-4">
        Top At-Risk Accounts
      </h2>
      <div className="space-y-3">
        {topAtRisk.map((account, index) => (
          <Link
            key={account.name}
            href="/customer-health?segment=at-risk"
            className="block p-3 border-2 border-black bg-health-at-risk/10 transition-all duration-200 shadow-brutal-sm hover:shadow-brutal hover:-translate-y-0.5 hover:bg-health-at-risk/15 group"
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateX(0)' : 'translateX(10px)',
              transitionDelay: `${350 + index * 50}ms`,
            }}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-bold text-black transition-colors duration-200 group-hover:text-brand-500">
                  {account.name}
                </p>
                <p className="text-xs font-medium text-slate-600">
                  {account.mrr}/mo • {account.daysInactive} days inactive
                </p>
              </div>
              <span className="px-2 py-0.5 text-xs font-black bg-health-at-risk text-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-transform duration-200 group-hover:scale-110">
                {account.score}
              </span>
            </div>
          </Link>
        ))}
      </div>
      <Link
        href="/customer-health?segment=at-risk"
        className="mt-4 block text-center btn btn-secondary w-full transition-all duration-200 hover:scale-[1.02]"
      >
        View All At-Risk →
      </Link>
    </div>
  );
}
