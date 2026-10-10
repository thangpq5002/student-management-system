'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { Pagination } from '@/components/ui/Pagination';
import { useClassOptions } from '@/modules/class/hooks/useClassOptions';
import { AttendanceHistoryFilters } from '@/modules/attendance/components/AttendanceHistoryFilters';
import { AttendanceHistoryTable } from '@/modules/attendance/components/AttendanceHistoryTable';
import { attendanceService, flattenAttendanceSessions } from '@/modules/attendance/services/attendance.service';
import { AttendanceHistoryFiltersState, AttendanceHistoryItem } from '@/modules/attendance/types';

export default function AttendanceHistoryPage() {
  const { classes, isLoading: areClassesLoading, error: classError } = useClassOptions();
  const [items, setItems] = useState<AttendanceHistoryItem[]>([]);
  const [filters, setFilters] = useState<AttendanceHistoryFiltersState>({
    search: '',
    classId: '',
    date: '',
    status: 'all',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    let active = true;
    attendanceService.getSessions()
      .then((sessions) => {
        if (active) setItems(flattenAttendanceSessions(sessions));
      })
      .catch((loadError: unknown) => {
        if (active) {
          setError(loadError instanceof Error ? loadError.message : 'Không thể tải lịch sử điểm danh.');
        }
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const filteredItems = useMemo(() => {
    const query = filters.search.trim().toLocaleLowerCase('vi');
    return items.filter((item) =>
      (!filters.classId || item.classId === filters.classId)
      && (!filters.date || item.dateStr === filters.date)
      && (filters.status === 'all' || item.status === filters.status)
      && (!query || item.fullName.toLocaleLowerCase('vi').includes(query)
        || item.studentCode.toLocaleLowerCase('vi').includes(query))
    );
  }, [filters, items]);

  const pageSize = 20;
  const totalPages = Math.max(1, Math.ceil(filteredItems.length / pageSize));
  const visibleItems = filteredItems.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleFilters = (next: Partial<AttendanceHistoryFiltersState>) => {
    setCurrentPage(1);
    setFilters((current) => ({ ...current, ...next }));
  };
  const handleReset = () => {
    setCurrentPage(1);
    setFilters({ search: '', classId: '', date: '', status: 'all' });
  };

  const present = filteredItems.filter((item) => item.status === 'present').length;
  const late = filteredItems.filter((item) => item.status === 'late').length;
  const excused = filteredItems.filter((item) => item.status === 'excused').length;
  const absent = filteredItems.filter((item) => item.status === 'unexcused').length;

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <Link href="/attendance" className="flex items-center gap-1 text-sm text-secondary hover:underline">
          <ChevronLeft className="h-4 w-4" />Quay lại điểm danh
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold text-primary tracking-tight">
          Lịch sử và thống kê điểm danh
        </h1>
        <p className="text-sm text-on-surface-variant">
          Hiển thị các bản ghi thực tế trong phạm vi dữ liệu mà tài khoản được phép truy cập.
        </p>
      </header>

      <AttendanceHistoryFilters
        classes={classes}
        filters={filters}
        onChange={handleFilters}
        onReset={handleReset}
      />
      {(error || classError) && (
        <p role="alert" className="rounded-xl border border-error/20 bg-error-container/30 p-3 text-sm text-error">
          {error || classError}
        </p>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Summary label="Bản ghi" value={String(filteredItems.length)} />
        <Summary label="Có mặt" value={String(present)} />
        <Summary label="Đi muộn" value={String(late)} />
        <Summary label="Vắng · phép / không phép" value={`${excused} / ${absent}`} />
      </div>

      <div className="flex flex-col gap-3">
        <AttendanceHistoryTable items={visibleItems} isLoading={isLoading || areClassesLoading} />
        {!isLoading && !areClassesLoading && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredItems.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            itemLabel="lượt điểm danh"
          />
        )}
      </div>
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
