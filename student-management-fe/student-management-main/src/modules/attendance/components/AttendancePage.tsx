'use client';

import React, { useState } from 'react';
import { useAttendance } from '@/modules/attendance/hooks/useAttendance';
import { AttendanceDailyTable } from '@/modules/attendance/components/AttendanceDailyTable';
import Link from 'next/link';
import { CheckCircle, History, Save, UserCheck } from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';

export default function AttendancePage() {
  const { role } = useAuth();
  const {
    classes,
    dailyItems,
    isLoading,
    isSaving,
    error,
    filters,
    setFilters,
    setStudentStatus,
    markAllPresent,
    saveDaily,
    total,
    markedCount,
    presentCount,
    excusedCount,
    unexcusedCount,
    lateCount,
    attendanceRate,
  } = useAttendance();
  const [message, setMessage] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  const handleSave = async () => {
    setSaveError(null);
    setMessage(null);
    try {
      await saveDaily();
      setMessage('Điểm danh đã được lưu.');
    } catch (failure) {
      setSaveError(failure instanceof Error ? failure.message : 'Không thể lưu điểm danh.');
    }
  };

  const selectedClass = classes.find((item) => item.id === filters.classId);

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col xl:flex-row xl:items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <span className="font-mono text-xs text-secondary uppercase font-semibold">
            Sổ theo dõi chuyên cần
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-primary tracking-tight">
            Điểm danh lớp học
          </h1>
          <p className="text-sm text-on-surface-variant">
            Dữ liệu học sinh, phiên điểm danh và kết quả được tải từ hệ thống.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Link
            href="/attendance/history"
            className="flex items-center gap-2 px-4 py-2.5 bg-surface-container text-on-surface rounded-xl hover:bg-surface-container-high text-sm font-semibold"
          >
            <History className="w-4 h-4" />Lịch sử điểm danh
          </Link>
          <button
            type="button"
            onClick={markAllPresent}
            disabled={isLoading || dailyItems.length === 0}
            className="flex items-center gap-2 px-4 py-2.5 bg-secondary-fixed/40 text-secondary rounded-xl hover:bg-secondary-fixed text-sm font-semibold disabled:opacity-50"
          >
            <UserCheck className="w-4 h-4" />Đánh dấu cả lớp có mặt
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isLoading || isSaving || !filters.classId || !filters.date || dailyItems.length === 0}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary text-on-primary rounded-xl hover:bg-primary-container text-sm font-semibold disabled:opacity-50"
          >
            <Save className="w-4 h-4" />{isSaving ? 'Đang lưu...' : 'Lưu điểm danh'}
          </button>
        </div>
      </header>

      <div className="flex flex-wrap items-end gap-4 rounded-2xl border border-outline-variant/20 bg-surface-container-lowest p-4">
        <label className="flex flex-col gap-1.5 text-xs font-semibold text-on-surface-variant">
          Ngày học
          <input
            type="date"
            value={filters.date}
            onChange={(event) => setFilters((current) => ({ ...current, date: event.target.value }))}
            className="rounded-xl border border-outline-variant/30 bg-surface-container-low px-3 py-2 text-sm text-on-surface"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-xs font-semibold text-on-surface-variant">
          Lớp học
          <select
            value={filters.classId}
            onChange={(event) => setFilters((current) => ({ ...current, classId: event.target.value }))}
            disabled={isLoading || classes.length === 0}
            className="min-w-48 rounded-xl border border-outline-variant/30 bg-surface-container-low px-3 py-2 text-sm text-on-surface disabled:opacity-50"
          >
            <option value="">{isLoading ? 'Đang tải lớp...' : 'Chọn lớp'}</option>
            {classes.map((item) => (
              <option key={item.id} value={item.id}>{item.label}</option>
            ))}
          </select>
        </label>
        <span className="pb-2 text-sm text-on-surface-variant">
          {selectedClass?.label ?? 'Chưa chọn lớp'} · {filters.date || 'Chưa chọn ngày'}
        </span>
      </div>

      {(error || saveError) && (
        <p role="alert" className="rounded-xl border border-error/20 bg-error-container/30 p-3 text-sm text-error">
          {saveError || error}
        </p>
      )}
      {message && (
        <p role="status" className="flex items-center gap-2 rounded-xl border border-secondary/20 bg-secondary-fixed/30 p-3 text-sm text-primary">
          <CheckCircle className="h-4 w-4" />{message}
        </p>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <Summary label="Sĩ số" value={String(total)} />
        <Summary label="Đã ghi nhận" value={`${markedCount} / ${total}`} />
        <Summary label="Có mặt" value={`${presentCount} (${attendanceRate}%)`} />
        <Summary label="Đi muộn" value={String(lateCount)} />
        <Summary label="Vắng" value={`${excusedCount + unexcusedCount} · phép ${excusedCount}`} />
      </div>

      {!isLoading && !error && classes.length === 0 ? (
        <div className="rounded-2xl bg-surface-container-lowest p-8 text-center text-sm text-on-surface-variant">
          Tài khoản hiện không được phân công vào lớp nào.
        </div>
      ) : (
        <>
          {!isLoading && !error && selectedClass && dailyItems.length === 0 && (
            <div className="flex flex-col gap-2 rounded-2xl border border-outline-variant/20 bg-surface-container-lowest p-4 text-sm text-on-surface-variant sm:flex-row sm:items-center sm:justify-between">
              <p>
                Lớp {selectedClass.label} chưa có học sinh ACTIVE được ghi danh. Điểm danh chỉ dùng
                danh sách enrollment thực tế, không lấy thay thế từ hồ sơ học sinh.
                {role !== 'admin' && ' Vui lòng liên hệ ADMIN để ghi danh học sinh.'}
              </p>
              {role === 'admin' && (
                <Link
                  href={`/classes/${encodeURIComponent(selectedClass.id)}`}
                  className="shrink-0 rounded-xl bg-primary-container px-4 py-2 text-center text-xs font-semibold text-on-primary hover:opacity-90"
                >
                  Mở chi tiết lớp
                </Link>
              )}
            </div>
          )}
          <AttendanceDailyTable
            items={dailyItems}
            isLoading={isLoading}
            onStatusChange={(id, status) => setStudentStatus(id, status)}
            onNoteChange={(id, note) => {
              const current = dailyItems.find((item) => item.id === id);
              if (current) setStudentStatus(id, current.status, note);
            }}
          />
        </>
      )}
    </div>
  );
}

function Summary({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-outline-variant/20 bg-surface-container-lowest p-4">
      <span className="text-[11px] font-semibold uppercase tracking-wide text-outline">{label}</span>
      <p className="mt-1 text-xl font-bold text-primary">{value}</p>
    </div>
  );
}
