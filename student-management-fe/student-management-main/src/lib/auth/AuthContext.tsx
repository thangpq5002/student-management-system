'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';
import { authService, AuthUser } from '@/modules/auth/services/auth.service';

export type UserRole = 'admin' | 'teacher';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarText: string;
  title: string;
}

interface AuthContextType {
  user: User | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<UserRole>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function toUser(account: AuthUser): User {
  return {
    id: account.id,
    name: account.name,
    email: account.email,
    role: account.role,
    avatarText: account.avatarText,
    title: account.title,
  };
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (pathname === '/login') {
      setIsLoading(false);
      return;
    }

    let active = true;
    const handleUnauthorized = () => {
      if (active) setUser(null);
    };
    window.addEventListener('student-management:unauthorized', handleUnauthorized);
    authService.me()
      .then((account) => {
        if (active) setUser(toUser(account));
      })
      .catch(() => {
        if (active) setUser(null);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
      window.removeEventListener('student-management:unauthorized', handleUnauthorized);
    };
  }, [pathname]);

  const login = useCallback(async (email: string, password: string): Promise<UserRole> => {
    const account = await authService.login({
      username: email,
      password,
    });
    setUser(toUser(account));
    return account.role;
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
    }
  }, []);

  const role = user?.role ?? null;
  const value = useMemo(() => ({
    user,
    role,
    isAuthenticated: user !== null,
    isLoading,
    login,
    logout,
  }), [user, role, isLoading, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
