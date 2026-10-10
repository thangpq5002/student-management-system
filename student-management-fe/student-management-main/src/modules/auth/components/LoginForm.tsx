'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth/AuthContext';
import { useRouter } from 'next/navigation';
import {
  GraduationCap,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle,
  HelpCircle,
  ShieldCheck,
} from 'lucide-react';

export const LoginForm: React.FC = () => {
  const { login } = useAuth();
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    try {
      const role = await login(username, password);
      setIsSuccess(true);
      router.replace(role === 'admin' ? '/dashboard' : '/classes');
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message.replace(/^\d+:\s*/, '')
          : 'Không thể đăng nhập. Vui lòng kiểm tra kết nối API và thông tin đăng nhập.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative w-full max-w-[480px] bg-surface-container-lowest rounded-2xl shadow-xl flex flex-col overflow-hidden border border-outline-variant/30">
      <div className="h-1.5 w-full bg-primary-container" />
      <div className="p-6 sm:p-8 flex flex-col">
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-2xl bg-primary-container text-on-primary flex items-center justify-center mb-4 shadow-sm">
            <GraduationCap className="w-7 h-7" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-on-surface tracking-tight">EduManage School Portal</h1>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-1">Cổng thông tin quản lý đào tạo &amp; học sinh</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="login-email" className="text-xs font-semibold text-on-surface">Email <span className="text-error font-bold">*</span></label>
            <div className="relative flex items-center">
              <Mail className="w-4 h-4 absolute left-3.5 text-outline pointer-events-none" />
              <input id="login-email" type="email" autoComplete="username" required value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Nhập email" className="w-full h-11 pl-10 pr-3.5 rounded-xl bg-surface-container-low text-on-surface text-sm placeholder:text-outline transition-all outline-none border border-transparent focus:border-secondary focus:bg-surface-container-lowest focus:ring-2 focus:ring-secondary/20" />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="login-password" className="text-xs font-semibold text-on-surface">Mật khẩu <span className="text-error font-bold">*</span></label>
              <span className="text-xs text-on-surface-variant">Liên hệ quản trị viên nếu quên mật khẩu</span>
            </div>
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 absolute left-3.5 text-outline pointer-events-none" />
              <input id="login-password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Nhập mật khẩu" className="w-full h-11 pl-10 pr-10 rounded-xl bg-surface-container-low text-on-surface text-sm placeholder:text-outline transition-all outline-none border border-transparent focus:border-secondary focus:bg-surface-container-lowest focus:ring-2 focus:ring-secondary/20" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 p-1 text-outline hover:text-on-surface transition-colors cursor-pointer" title={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}>
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer select-none pt-1">
            <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="w-4 h-4 rounded text-primary focus:ring-secondary cursor-pointer" />
            <span className="text-xs text-on-surface-variant">Ghi nhớ đăng nhập trên thiết bị này</span>
          </label>

          {errorMessage && <p role="alert" className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">{errorMessage}</p>}

          <button type="submit" disabled={isLoading || isSuccess} className={`mt-2 w-full h-11 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all select-none cursor-pointer ${isSuccess ? 'bg-secondary text-on-secondary shadow-md' : 'bg-primary-container text-on-primary hover:bg-primary shadow hover:shadow-md active:scale-[0.99]'}`}>
            {isLoading ? <><span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span><span>Đang xác thực...</span></> : isSuccess ? <><CheckCircle className="w-4 h-4" /><span>Đăng nhập thành công</span></> : <><span>Đăng nhập vào hệ thống</span><ArrowRight className="w-4 h-4" /></>}
          </button>
        </form>

        <div className="mt-6 p-3 rounded-xl bg-surface-container-low flex items-start gap-2.5 border border-outline-variant/20">
          <ShieldCheck className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
          <p className="text-xs text-on-surface-variant leading-relaxed">Phiên đăng nhập được xác thực bởi máy chủ. Vai trò và quyền truy cập được lấy từ tài khoản đã đăng nhập.</p>
        </div>

        <div className="mt-6 pt-4 border-t border-outline-variant/20 flex items-center justify-between text-xs text-on-surface-variant">
          <div className="flex items-center gap-1.5 font-mono text-[11px]"><span className="w-2 h-2 rounded-full bg-secondary-container" /><span>EduManage OS v2.4.0</span></div>
          <a href="mailto:support@edumanage.edu.vn" className="text-secondary hover:text-primary flex items-center gap-1 transition-colors hover:underline"><HelpCircle className="w-3.5 h-3.5" /><span>Hỗ trợ IT trường học</span></a>
        </div>
      </div>
    </div>
  );
};
