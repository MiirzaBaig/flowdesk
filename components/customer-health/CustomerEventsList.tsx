'use client';

import { useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { clsx } from 'clsx';
import type { CustomerEvent } from '@/types/customer';

interface CustomerEventsListProps {
  events: CustomerEvent[];
}

const eventIcons: Record<CustomerEvent['type'], { icon: React.ReactNode; color: string }> = {
  login: {
    icon: (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
      </svg>
    ),
    color: 'bg-blue-500',
  },
  feature_used: {
    icon: (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    color: 'bg-brand-500',
  },
  support_ticket: {
    icon: (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    color: 'bg-health-at-risk',
  },
  meeting: {
    icon: (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    color: 'bg-health-healthy',
  },
  email: {
    icon: (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    color: 'bg-purple-500',
  },
  note: {
    icon: (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ),
    color: 'bg-health-watch',
  },
};

export function CustomerEventsList({ events }: CustomerEventsListProps) {
  const [mounted, setMounted] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    // Trigger animations after mount
    const timer = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(timer);
  }, []);

  if (events.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-sm font-bold text-slate-500">No recent activity</p>
      </div>
    );
  }

  return (
    <div className="flow-root">
      {/* Timeline line that animates in */}
      <div className="absolute left-[15px] top-0 bottom-0 w-0.5 bg-slate-200 origin-top transition-transform duration-700 ease-out"
        style={{ transform: mounted ? 'scaleY(1)' : 'scaleY(0)' }}
      />
      
      <ul className="-mb-8 relative">
        {events.map((event, index) => {
          const { icon, color } = eventIcons[event.type];
          const isLast = index === events.length - 1;
          const isHovered = hoveredIndex === index;

          return (
            <li
              key={event.id}
              className="transition-all duration-300 ease-out"
              style={{
                opacity: mounted ? 1 : 0,
                transform: mounted ? 'translateX(0)' : 'translateX(-20px)',
                transitionDelay: `${index * 80}ms`,
              }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className={clsx(
                'relative pb-6 pl-10 transition-all duration-200 ease-out cursor-pointer',
                isHovered && 'bg-slate-50 -mx-2 px-2 pl-12'
              )}>
                {/* Connector line segment */}
                {!isLast && (
                  <span
                    className={clsx(
                      'absolute left-[15px] top-8 w-0.5 bg-black transition-all duration-300',
                      isHovered ? 'h-full opacity-100' : 'h-full opacity-30'
                    )}
                    style={{ height: 'calc(100% - 8px)' }}
                    aria-hidden="true"
                  />
                )}

                {/* Icon with pulse animation on hover */}
                <div
                  className={clsx(
                    'absolute left-0 flex h-8 w-8 items-center justify-center border-2 border-black text-white transition-all duration-300 ease-out',
                    color,
                    isHovered 
                      ? 'scale-110 shadow-brutal-sm -translate-y-0.5' 
                      : 'scale-100 shadow-none'
                  )}
                >
                  <div className={clsx(
                    'transition-transform duration-200',
                    isHovered && 'scale-110'
                  )}>
                    {icon}
                  </div>
                  
                  {/* Pulse ring on hover */}
                  {isHovered && (
                    <span className="absolute inset-0 border-2 border-black animate-ping opacity-30" />
                  )}
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <div className="text-sm">
                    <span className={clsx(
                      'font-bold text-black transition-all duration-200',
                      isHovered && 'text-brand-600'
                    )}>
                      {event.title}
                    </span>
                  </div>
                  {event.description && (
                    <p className={clsx(
                      'mt-0.5 text-sm font-medium transition-colors duration-200',
                      isHovered ? 'text-slate-700' : 'text-slate-500'
                    )}>
                      {event.description}
                    </p>
                  )}
                  <p className={clsx(
                    'mt-1 text-xs font-bold transition-colors duration-200',
                    isHovered ? 'text-slate-600' : 'text-slate-400'
                  )}>
                    {formatDistanceToNow(new Date(event.timestamp), { addSuffix: true })}
                  </p>
                </div>

                {/* Arrow indicator on hover */}
                <div className={clsx(
                  'absolute right-2 top-1/2 -translate-y-1/2 transition-all duration-200',
                  isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'
                )}>
                  <svg className="w-4 h-4 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
