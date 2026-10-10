import React from 'react';
import { LoginForm } from '@/modules/auth/components/LoginForm';

export default function LoginPage() {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 bg-background overflow-hidden">
      {/* Subtle Ambient Background Glows */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-primary-fixed/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-secondary-fixed/40 rounded-full blur-3xl pointer-events-none" />

      {/* Main Login Card */}
      <LoginForm />
    </div>
  );
}
