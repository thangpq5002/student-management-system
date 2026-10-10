'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  GraduationCap,
  Users,
  UserCog,
  School,
  BookOpen,
  ClipboardCheck,
  CalendarCheck,
  History,
  LogOut,
  X,
} from 'lucide-react';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  isSubItem?: boolean;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export const navigationConfig: NavSection[] = [
  {
    title: 'TỔNG QUAN',
    items: [
      {
        label: 'Bảng điều khiển',
        href: '/dashboard',
        icon: LayoutDashboard,
      },
    ],
  },
  {
    title: 'QUẢN LÝ',
    items: [
      {
        label: 'Học sinh',
        href: '/students',
        icon: GraduationCap,
      },
      {
        label: 'Giáo viên',
        href: '/teachers',
        icon: Users,
      },
      {
        label: 'Lớp học',
        href: '/classes',
        icon: School,
      },
      {
        label: 'Môn học',
        href: '/subjects',
        icon: BookOpen,
      },
      {
        label: 'Quản lý tài khoản',
        href: '/users',
        icon: UserCog,
      },
    ],
  },
  {
    title: 'HỌC TẬP',
    items: [
      {
        label: 'Điểm số',
        href: '/grades',
        icon: ClipboardCheck,
      },
      {
        label: 'Điểm danh',
        href: '/attendance',
        icon: CalendarCheck,
      },
      {
        label: 'Lịch sử điểm danh',
        href: '/attendance/history',
        icon: History,
        isSubItem: true,
      },
    ],
  },
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();
  const { logout, role } = useAuth();
  const visibleSections = navigationConfig
    .map((section) => ({
      ...section,
      items: section.items.filter((item) =>
        role === 'admin' || item.href === '/dashboard' || item.href === '/students'
          || item.href === '/classes' || item.href === '/subjects'
          || item.href === '/grades' || item.href.startsWith('/attendance'),
      ),
    }))
    .filter((section) => section.items.length > 0);

  const isRouteActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard' || pathname === '/';
    if (href === '/attendance') return pathname === '/attendance';
    return pathname.startsWith(href);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full justify-between select-none">
      <div className="flex flex-col flex-1 overflow-y-auto">
        {/* Brand Header */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-outline-variant/20 bg-surface-container-lowest">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary-container text-on-primary flex items-center justify-center font-bold text-lg shadow-sm">
              <School className="w-5 h-5" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-semibold text-base text-primary leading-tight truncate">
                EduManage
              </span>
              <span className="text-[11px] font-medium text-on-surface-variant truncate tracking-wider uppercase">
                Quản Lý Trường Học
              </span>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg text-outline hover:text-on-surface"
              aria-label="Đóng menu"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation Sections */}
        <div className="p-3 py-4 flex flex-col gap-4">
          {visibleSections.map((section, idx) => (
            <div key={idx} className="flex flex-col gap-1">
              <div className="px-3 py-1">
                <span className="text-[11px] font-semibold tracking-wider text-outline uppercase">
                  {section.title}
                </span>
              </div>
              <nav className="flex flex-col gap-1">
                {section.items.map((item) => {
                  const active = isRouteActive(item.href);
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      className={cn(
                        'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group',
                        item.isSubItem && 'pl-8 text-xs',
                        active
                          ? 'bg-primary-container text-on-primary shadow-sm font-semibold'
                          : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                      )}
                    >
                      <Icon
                        className={cn(
                          'w-[18px] h-[18px] shrink-0 transition-colors',
                          active ? 'text-on-primary' : 'text-outline group-hover:text-on-surface'
                        )}
                      />
                      <span className="truncate">{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Settings & Logout */}
      <div className="p-3 border-t border-outline-variant/20 bg-surface-container-low/40">
        <nav className="flex flex-col gap-1">
          <Link
            href="/login"
            onClick={() => {
              void logout();
              if (onClose) onClose();
            }}
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-error hover:bg-error-container hover:text-on-error-container transition-all"
          >
            <LogOut className="w-[18px] h-[18px]" />
            <span>Đăng xuất</span>
          </Link>
        </nav>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-full w-72 bg-surface-container-lowest border-r border-outline-variant/30 z-50 shadow-[0_1px_8px_rgba(0,0,0,0.03)] flex-col">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-inverse-surface/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <aside className="fixed left-0 top-0 bottom-0 w-72 bg-surface-container-lowest shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
};
