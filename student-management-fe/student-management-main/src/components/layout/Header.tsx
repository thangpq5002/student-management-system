'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/lib/auth/AuthContext';
import { useRouter } from 'next/navigation';
import {
  Search,
  Bell,
  ChevronDown,
  Menu,
  LogOut,
  User as UserIcon,
} from 'lucide-react';

interface HeaderProps {
  onToggleSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const { user, role, logout } = useAuth();
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      router.push(`/students?search=${encodeURIComponent(searchValue.trim())}`);
    }
  };

  return (
    <header className="fixed top-0 left-0 lg:left-72 right-0 h-16 bg-surface-container-lowest/90 backdrop-blur-md border-b border-outline-variant/30 z-40 px-4 lg:px-6 flex items-center justify-between shadow-[0_1px_4px_rgba(0,0,0,0.02)]">
      {/* Left: Mobile Menu Toggle & Global Search */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-xl text-on-surface-variant hover:bg-surface-container transition-colors"
          aria-label="Mở menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <form onSubmit={handleSearchSubmit} className="relative w-full max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none" />
          <input
            type="search"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Tìm kiếm thông tin học sinh, lớp học..."
            className="w-full pl-9 pr-4 py-2 bg-surface-container-low text-on-surface placeholder:text-outline text-xs sm:text-sm rounded-xl border border-outline-variant/30 focus:outline-none focus:border-secondary focus:bg-surface-container-lowest transition-all"
          />
        </form>
      </div>

      {/* Right: Notifications & User profile */}
      <div className="flex items-center gap-3 sm:gap-5">
        {/* Notifications */}
        <button
          type="button"
          className="relative p-2 rounded-xl text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
          title="Thông báo hệ thống"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-error ring-2 ring-surface-container-lowest" />
        </button>

        <div className="h-6 w-px bg-outline-variant/30 hidden sm:block" />

        {/* User Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-surface-container-low transition-colors cursor-pointer select-none"
            aria-expanded={isDropdownOpen}
          >
            <div className="flex flex-col text-right hidden sm:flex">
              <span className="text-xs sm:text-sm font-semibold text-on-surface leading-tight">
                {user?.name || ''}
              </span>
              <span className="text-[11px] text-secondary font-semibold capitalize">
                {role === 'admin' ? 'Quản trị viên' : role === 'teacher' ? 'Giáo viên' : ''}
              </span>
            </div>

            <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-xs shadow-sm">
              <UserIcon className="w-4 h-4" />
            </div>

            <ChevronDown className="w-4 h-4 text-outline" />
          </button>

          {/* Account menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-surface-container-lowest shadow-2xl border border-outline-variant/30 p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-2 border-b border-outline-variant/20 mb-1">
                <p className="text-xs font-semibold text-on-surface">{user?.name}</p>
                <p className="text-[11px] text-on-surface-variant truncate">{user?.email}</p>
              </div>

              <div className="my-1 border-t border-outline-variant/20" />

              <button
                onClick={() => {
                  void logout();
                  setIsDropdownOpen(false);
                  router.push('/login');
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-error hover:bg-error-container transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Đăng xuất</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
