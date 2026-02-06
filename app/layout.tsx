import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';
import { Sidebar } from '@/components/Sidebar';

export const metadata: Metadata = {
  title: 'FlowDesk - Customer Success Platform',
  description: 'A 360° view of your customers for customer success teams',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <Providers>
          <div className="flex min-h-screen">
            {/* Sidebar with active route detection */}
            <Sidebar />

            {/* Main content */}
            <main className="flex-1 lg:pl-64">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
