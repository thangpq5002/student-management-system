'use client';

import React, { useEffect, useState } from 'react';
import { Search, UserPlus } from 'lucide-react';
import { classService } from '@/modules/class/services/class.service';
import { Student } from '@/modules/student/types';

interface ClassStudentEnrollmentProps {
  classId: string;
  className: string;
  canManage: boolean;
  onEnrolled: () => Promise<void>;
}

function isAcademicYear(value: string): boolean {
  const match = /^(\d{4})-(\d{4})$/.exec(value.trim());
  return match !== null && Number(match[2]) === Number(match[1]) + 1;
}

function currentAcademicYear(): string {
  const now = new Date();
  const startYear = now.getMonth() >= 7 ? now.getFullYear() : now.getFullYear() - 1;
  return `${startYear}-${startYear + 1}`;
}

export const ClassStudentEnrollment: React.FC<ClassStudentEnrollmentProps> = ({
  classId,
  className,
  canManage,
  onEnrolled,
}) => {
  const [academicYear, setAcademicYear] = useState(currentAcademicYear);
  const [search, setSearch] = useState('');
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [refreshVersion, setRefreshVersion] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const validYear = isAcademicYear(academicYear);

  useEffect(() => {
    if (!canManage || !validYear) {
      setStudents([]);
      setSelectedIds([]);
      setIsLoading(false);
      return;
    }
    let active = true;
    setIsLoading(true);
    setError(null);
    classService.getAvailableStudents(classId, academicYear.trim(), search)
      .then((items) => {
        if (active) {
          setStudents(items);
        }
      })
      .catch((loadError: unknown) => {
        if (active) {
          setStudents([]);
          setError(loadError instanceof Error ? loadError.message : 'Không thể tải danh sách học sinh.');
        }
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [academicYear, canManage, classId, refreshVersion, search, validYear]);

  if (!canManage) return null;

  const toggleStudent = (studentId: string) => {
    setSelectedIds((selected) => selected.includes(studentId)
      ? selected.filter((id) => id !== studentId)
      : [...selected, studentId]);
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validYear || selectedIds.length === 0 || isSubmitting) return;

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);
    try {
      const enrolled = await classService.enrollStudents(classId, {
        studentIds: selectedIds.map(Number),
        academicYear: academicYear.trim(),
      });
      setSelectedIds([]);
      setSuccess(`Đã thêm ${enrolled.length} học sinh vào lớp ${className}.`);
      setRefreshVersion((version) => version + 1);
      try {
        await onEnrolled();
      } catch {
        setError('Đã thêm học sinh nhưng không thể làm mới danh sách lớp. Hãy tải lại trang.');
      }
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Không thể thêm học sinh vào lớp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="rounded-2xl border border-outline-variant/20 bg-surface-container-lowest p-4">
      <div className="mb-3 flex items-center gap-2">
        <UserPlus className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-bold text-on-surface">Thêm học sinh vào lớp</h3>
      </div>
      <form onSubmit={(event) => void handleSubmit(event)} className="flex flex-col gap-3">
        <label className="flex flex-col gap-1 text-xs font-semibold text-on-surface-variant">
          Năm học
          <input
            value={academicYear}
            onChange={(event) => {
              setAcademicYear(event.target.value);
              setSuccess(null);
            }}
            placeholder="Ví dụ: 2026-2027"
            maxLength={9}
            aria-invalid={academicYear.length > 0 && !validYear}
            className="rounded-lg border border-outline-variant/40 bg-surface-container-low px-3 py-2 text-sm text-on-surface outline-none focus:border-secondary"
          />
        </label>
        {academicYear.length > 0 && !validYear && (
          <p className="text-xs text-error">Năm học phải theo dạng YYYY-YYYY và hai năm liên tiếp.</p>
        )}
        <label className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-outline" />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Tìm theo mã hoặc tên học sinh"
            disabled={!validYear || isLoading || isSubmitting}
            className="w-full rounded-lg border border-outline-variant/40 bg-surface-container-low py-2 pl-9 pr-3 text-sm text-on-surface outline-none focus:border-secondary disabled:opacity-60"
          />
        </label>

        {validYear && (
          <div className="max-h-56 divide-y divide-outline-variant/20 overflow-y-auto rounded-lg border border-outline-variant/20">
            {isLoading ? (
              <p className="p-3 text-xs text-on-surface-variant">Đang tải học sinh...</p>
            ) : students.length === 0 ? (
              <p className="p-3 text-xs text-on-surface-variant">
                Không có học sinh phù hợp chưa thuộc lớp này. Học sinh cần được tạo trước trong mục Học sinh.
              </p>
            ) : students.map((student) => (
              <label key={student.id} className="flex cursor-pointer items-center gap-3 p-3 hover:bg-surface-container-low">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(student.id)}
                  onChange={() => toggleStudent(student.id)}
                  disabled={isSubmitting}
                  className="h-4 w-4 accent-primary"
                />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-on-surface">{student.fullName}</span>
                  <span className="block text-xs text-on-surface-variant">
                    {student.studentCode} · Lớp hiện tại {student.className}
                  </span>
                </span>
              </label>
            ))}
          </div>
        )}

        {error && <p role="alert" className="text-xs text-error">{error}</p>}
        {success && <p role="status" className="text-xs text-tertiary">{success}</p>}
        <button
          type="submit"
          disabled={!validYear || selectedIds.length === 0 || isSubmitting}
          className="rounded-xl bg-primary-container px-4 py-2.5 text-sm font-semibold text-on-primary disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting
            ? 'Đang thêm...'
            : selectedIds.length > 0
              ? `Thêm ${selectedIds.length} học sinh`
              : 'Chọn học sinh để thêm'}
        </button>
      </form>
    </section>
  );
};
