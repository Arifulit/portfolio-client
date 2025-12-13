// app/dashboard/layout.tsx
'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, loading, user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  // Protect dashboard routes
  React.useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  type NavigationItem = 
    | { name: string; href: string; icon: string; type?: undefined; label?: string }
    | { type: 'divider'; label: string; name?: string; href?: string; icon?: string };

  const navigation: NavigationItem[] = [
    { name: 'Dashboard', href: '/dashboard', icon: '📊' },
    { type: 'divider', label: 'Blogs' },
    { name: 'Manage Blogs', href: '/dashboard/blogs', icon: '📝' },
    { name: 'Create Blog', href: '/dashboard/blogs/create', icon: '✏️' },
    { type: 'divider', label: 'Projects' },
    { name: 'Manage Projects', href: '/dashboard/projects', icon: '💼' },
    { name: 'Create Project', href: '/dashboard/projects/create', icon: '🛠️' },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/dashboard" className="text-xl font-bold text-primary-600">
                Dashboard
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, <strong>{user?.name}</strong>
              </span>
              <button
                onClick={() => logout()}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="w-64 flex-shrink-0">
            <nav className="bg-white rounded-lg shadow-md p-4 sticky top-24">
              <ul className="space-y-2">
                {navigation.map((item, index) => {
                  if (item.type === 'divider') {
                    return (
                      <li key={`divider-${index}`} className="px-4 pt-4 pb-2">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          {item.label}
                        </span>
                      </li>
                    );
                  }
                  
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                          isActive(item.href)
                            ? 'bg-primary-100 text-primary-700 font-medium'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <span className="mr-3 text-xl">{item.icon}</span>
                        {item.name}
                      </Link>
                    </li>
                  );
                })}
                
                <li className="pt-4 border-t border-gray-200">
                  <Link
                    href="/"
                    className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <span className="mr-3 text-xl">🏠</span>
                    Back to Home
                  </Link>
                </li>
              </ul>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}