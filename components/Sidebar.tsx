'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';

const navItems = [
  {
    href: '/',
    label: 'Dashboard',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    href: '/customer-health',
    label: 'Customer Health',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    href: '/customers',
    label: 'Customers',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
];

export function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 bg-black border-r-2 border-black z-20">
      <div className="flex items-center h-16 px-6 bg-black border-b-2 border-white/20">
        <div className="flex items-center gap-2 text-white">
          <div className="w-8 h-8 bg-brand-500 border-2 border-white flex items-center justify-center shadow-[2px_2px_0px_0px_#ffffff]">
            <span className="font-black text-lg">F</span>
          </div>
          <span className="text-xl font-black tracking-tight uppercase">
            FlowDesk
          </span>
        </div>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-3 bg-white border-r-2 border-black">
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                'group flex items-center gap-3 px-4 py-3 text-sm font-bold transition-all duration-200 border-2',
                active
                  ? 'text-white bg-black border-black shadow-[4px_4px_0px_0px_#F26522] translate-x-[-2px] translate-y-[-2px]'
                  : 'text-black bg-white border-transparent hover:border-black hover:shadow-brutal-sm hover:-translate-y-0.5'
              )}
            >
              <span className={clsx(
                'transition-transform duration-200',
                active ? 'scale-110' : 'group-hover:scale-110'
              )}>
                {item.icon}
              </span>
              <span className="uppercase tracking-wide">{item.label}</span>

              {active && (
                <div className="ml-auto w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Profile Snippet (Mock) */}
      <div className="p-4 bg-white border-t-2 border-black">
        <div className="flex items-center gap-3 p-3 border-2 border-black hover:bg-slate-50 cursor-pointer transition-colors">
          <div className="w-8 h-8 bg-black rounded-full border-2 border-black text-white flex items-center justify-center font-bold">
            JD
          </div>
          <div>
            <p className="text-xs font-bold uppercase text-black">John Doe</p>
            <p className="text-[10px] font-bold text-slate-500">Admin</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
