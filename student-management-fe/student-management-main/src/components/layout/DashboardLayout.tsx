'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const router = useRouter();
  const { isAuthenticated, isLoading, role } = useAuth();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login');
      return;
    }
    if (!isLoading && role === 'teacher' && !isTeacherRoute(pathname)) {
      router.replace('/classes');
    }
  }, [isAuthenticated, isLoading, pathname, role, router]);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-background text-on-surface">Đang xác thực...</div>;
  }

  if (!isAuthenticated || (role === 'teacher' && !isTeacherRoute(pathname))) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background text-on-surface antialiased flex flex-col">
      {/* Sidebar (Desktop + Mobile Drawer) */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Column Wrapper offset by sidebar width on desktop */}
      <div className="lg:pl-72 flex flex-col flex-1 min-h-screen">
        <Header onToggleSidebar={() => setSidebarOpen(true)} />
        <main className="w-full pt-16 flex-1 px-4 sm:px-6 lg:px-8 py-6">
          <div className="max-w-7xl mx-auto w-full">{children}</div>
        </main>
      </div>
    </div>
  );
};

function isTeacherRoute(pathname: string): boolean {
  const adminOnlyRoutes = [
    '/users',
    '/teachers',
    '/students/new',
    '/classes/new',
    '/subjects/new',
    '/grades/statistics',
    '/attendance/warnings',
  ];
  if (adminOnlyRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`))) {
    return false;
  }
  return !/^\/subjects\/[^/]+\/edit(?:\/|$)/.test(pathname);
}
