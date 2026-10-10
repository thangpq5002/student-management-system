'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { apiRequest } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import { School, Users, Building, RotateCcw, ArrowRight, BookOpen, AlertCircle } from 'lucide-react';

interface DashboardSummary {
  totalStudents: number;
  totalTeachers: number | null;
  totalDepartments: number | null;
  totalClasses: number;
  classesByGrade: { grade10: number; grade11: number; grade12: number };
  studentsByStatus: { active: number; suspended: number; transferred: number };
  classes: Array<{ id: string; name: string; gradeLevel: number; homeroomTeacher: string; currentStudents: number; maxStudents: number }>;
  recentStudents: Array<{ id: string; studentCode: string; fullName: string; className: string; avatarInitials: string; createdAt: string }>;
}

function formatDate(value?: string) {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat('vi-VN', { dateStyle: 'medium' }).format(date);
}

export default function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [summaryError, setSummaryError] = useState('');

  const loadSummary = useCallback(async () => {
    setIsRefreshing(true);
    setSummaryError('');
    try {
      const data = await apiRequest<DashboardSummary>(API_ENDPOINTS.dashboard);
      setSummary(data);
    } catch (error) {
      setSummaryError(error instanceof Error ? error.message : 'Không thể tải số liệu tổng quan.');
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => { void loadSummary(); }, [loadSummary]);

  const cards = [
    { label: 'Tổng học sinh', value: summary?.totalStudents, icon: School, color: 'text-primary' },
    { label: 'Tổng giáo viên', value: summary?.totalTeachers, icon: Users, color: 'text-secondary' },
    { label: 'Tổng lớp học', value: summary?.totalClasses, icon: Building, color: 'text-tertiary' },
    { label: 'Tổ bộ môn', value: summary?.totalDepartments, icon: BookOpen, color: 'text-primary' },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <Breadcrumb items={[{ label: 'Bảng điều khiển', href: '/dashboard' }, { label: 'Tổng quan hệ thống', isCurrent: true }]} />
          <h1 className="text-2xl sm:text-3xl font-bold text-on-surface tracking-tight mt-1">Tổng quan hệ thống</h1>
          <p className="text-xs text-on-surface-variant">Các số liệu bên dưới được lấy từ API backend và cập nhật khi làm mới.</p>
        </div>
        <button type="button" onClick={() => void loadSummary()} disabled={isRefreshing} className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-surface-container-lowest text-on-surface font-semibold text-sm shadow-sm border border-outline-variant/20 disabled:opacity-60">
          <RotateCcw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Đang làm mới...' : 'Làm mới dữ liệu'}
        </button>
      </div>

      {summaryError && <div role="alert" className="flex items-start gap-2 rounded-xl bg-error/10 px-4 py-3 text-sm text-error"><AlertCircle className="w-4 h-4 mt-0.5 shrink-0" /> <span>{summaryError}</span></div>}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {cards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm border border-outline-variant/20">
            <div className="flex items-start justify-between gap-3">
              <div><span className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">{label}</span><div className="text-3xl font-bold text-on-surface tracking-tight mt-2 font-mono">{value == null ? '—' : value.toLocaleString('vi-VN')}</div></div>
              <div className={`w-11 h-11 rounded-xl bg-surface-container-high flex items-center justify-center ${color}`}><Icon className="w-6 h-6" /></div>
            </div>
          </div>
        ))}
      </div>

      {summary && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <section className="bg-surface-container-lowest rounded-2xl p-5 sm:p-6 shadow-sm border border-outline-variant/20">
            <div className="flex items-center justify-between gap-3 mb-5"><h2 className="font-bold text-base sm:text-lg text-on-surface">Phân bố lớp theo khối</h2><Link href="/classes" className="text-xs font-semibold text-primary inline-flex items-center gap-1">Quản lý lớp <ArrowRight className="w-3.5 h-3.5" /></Link></div>
            {([{ label: 'Khối 10', value: summary.classesByGrade.grade10 }, { label: 'Khối 11', value: summary.classesByGrade.grade11 }, { label: 'Khối 12', value: summary.classesByGrade.grade12 }]).map((item) => {
              const percent = summary.totalClasses > 0 ? Math.round(item.value / summary.totalClasses * 100) : 0;
              return <div key={item.label} className="mb-4 last:mb-0"><div className="flex items-center justify-between text-sm mb-2"><span className="text-on-surface-variant">{item.label}</span><span className="font-semibold text-on-surface">{item.value} lớp ({percent}%)</span></div><div className="h-2 rounded-full bg-surface-container overflow-hidden"><div className="h-full rounded-full bg-primary" style={{ width: `${percent}%` }} /></div></div>;
            })}
          </section>

          <section className="bg-surface-container-lowest rounded-2xl p-5 sm:p-6 shadow-sm border border-outline-variant/20">
            <div className="flex items-center justify-between gap-3 mb-5"><h2 className="font-bold text-base sm:text-lg text-on-surface">Tình trạng học sinh</h2><Link href="/students" className="text-xs font-semibold text-primary inline-flex items-center gap-1">Quản lý học sinh <ArrowRight className="w-3.5 h-3.5" /></Link></div>
            {([{ label: 'Đang học', value: summary.studentsByStatus.active }, { label: 'Tạm dừng', value: summary.studentsByStatus.suspended }, { label: 'Đã chuyển trường', value: summary.studentsByStatus.transferred }]).map((item) => {
              const percent = summary.totalStudents > 0 ? Math.round(item.value / summary.totalStudents * 100) : 0;
              return <div key={item.label} className="mb-4 last:mb-0"><div className="flex items-center justify-between text-sm mb-2"><span className="text-on-surface-variant">{item.label}</span><span className="font-semibold text-on-surface">{item.value} ({percent}%)</span></div><div className="h-2 rounded-full bg-surface-container overflow-hidden"><div className="h-full rounded-full bg-secondary" style={{ width: `${percent}%` }} /></div></div>;
            })}
          </section>

          <section className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 overflow-hidden lg:col-span-2">
            <div className="p-5 flex items-center justify-between border-b border-outline-variant/15"><h2 className="font-bold text-base sm:text-lg text-on-surface">Lớp học</h2><Link href="/classes" className="text-xs font-semibold text-primary inline-flex items-center gap-1">Xem tất cả <ArrowRight className="w-3.5 h-3.5" /></Link></div>
            {summary.classes.length === 0 ? <p className="p-5 text-sm text-on-surface-variant">Backend chưa trả về lớp học nào cho tài khoản hiện tại.</p> : <div className="overflow-x-auto"><table className="w-full text-sm"><thead className="bg-surface-container-low text-on-surface-variant"><tr><th className="px-5 py-3 text-left font-semibold">Lớp</th><th className="px-5 py-3 text-left font-semibold">Khối</th><th className="px-5 py-3 text-left font-semibold">Giáo viên chủ nhiệm</th><th className="px-5 py-3 text-right font-semibold">Sĩ số</th></tr></thead><tbody>{summary.classes.map((item) => <tr key={item.id} className="border-t border-outline-variant/10"><td className="px-5 py-3 font-semibold text-on-surface">{item.name}</td><td className="px-5 py-3 text-on-surface-variant">{item.gradeLevel}</td><td className="px-5 py-3 text-on-surface-variant">{item.homeroomTeacher || 'Chưa phân công'}</td><td className="px-5 py-3 text-right font-mono text-on-surface-variant">{item.currentStudents}/{item.maxStudents}</td></tr>)}</tbody></table></div>}
          </section>

          <section className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 overflow-hidden lg:col-span-2">
            <div className="p-5 flex items-center justify-between border-b border-outline-variant/15"><h2 className="font-bold text-base sm:text-lg text-on-surface">Học sinh mới thêm</h2><Link href="/students" className="text-xs font-semibold text-primary inline-flex items-center gap-1">Xem danh sách <ArrowRight className="w-3.5 h-3.5" /></Link></div>
            {summary.recentStudents.length === 0 ? <p className="p-5 text-sm text-on-surface-variant">Chưa có dữ liệu học sinh mới.</p> : <div className="overflow-x-auto"><table className="w-full text-sm"><thead className="bg-surface-container-low text-on-surface-variant"><tr><th className="px-5 py-3 text-left font-semibold">Mã học sinh</th><th className="px-5 py-3 text-left font-semibold">Họ và tên</th><th className="px-5 py-3 text-left font-semibold">Lớp</th><th className="px-5 py-3 text-left font-semibold">Ngày tạo</th></tr></thead><tbody>{summary.recentStudents.map((item) => <tr key={item.id} className="border-t border-outline-variant/10"><td className="px-5 py-3 font-mono text-on-surface-variant">{item.studentCode}</td><td className="px-5 py-3 font-semibold text-on-surface">{item.fullName}</td><td className="px-5 py-3 text-on-surface-variant">{item.className}</td><td className="px-5 py-3 text-on-surface-variant">{formatDate(item.createdAt)}</td></tr>)}</tbody></table></div>}
          </section>
        </div>
      )}

      {!summary && !summaryError && <div className="rounded-2xl border border-outline-variant/20 bg-surface-container-lowest p-8 text-center text-sm text-on-surface-variant">Đang tải dữ liệu tổng quan...</div>}
    </div>
  );
}
