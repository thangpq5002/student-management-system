'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/AuthContext';
import { useGrades } from '@/modules/grade/hooks/useGrades';
import { GradeFilters } from '@/modules/grade/components/GradeFilters';
import { GradeTable } from '@/modules/grade/components/GradeTable';
import { GradeDistributionCard } from '@/modules/grade/components/GradeDistributionCard';
import { CheckCircle, Save } from 'lucide-react';

export default function GradesPage() {
  const { role } = useAuth();
  const {
    assignments,
    assessmentTypes,
    assignment,
    records,
    isLoading,
    isSaving,
    hasDraftScores,
    error,
    filters,
    setFilters,
    handleCellChange,
    scoreFor,
    saveGrades,
    totalStudents,
    completedCount,
    classAverage,
  } = useGrades();
  const [message, setMessage] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  const handleSave = async () => {
    setSaveError(null);
    setMessage(null);
    try {
      await saveGrades();
      setMessage("Điểm đã được lưu.");
    } catch (saveFailure) {
      setSaveError(saveFailure instanceof Error ? saveFailure.message : "Không thể lưu điểm.");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <span className="font-mono text-xs text-secondary uppercase font-semibold">Sổ điểm điện tử</span>
          <h1 className="text-2xl sm:text-3xl font-bold text-primary tracking-tight">
            Quản lý và nhập điểm
          </h1>
          <p className="text-sm text-on-surface-variant">
            Cột loại điểm và hệ số được tải từ cấu hình assessment_types trên hệ thống.
          </p>
        </div>
        <button
          type="button"
          onClick={handleSave}
          disabled={
            isLoading || isSaving || !assignment
            || assessmentTypes.length === 0 || !hasDraftScores
          }
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-primary text-on-primary rounded-xl hover:bg-primary-container disabled:opacity-50 text-sm font-semibold"
        >
          <Save className="w-4 h-4" />
          {isSaving ? "Đang lưu..." : "Lưu điểm"}
        </button>
      </header>

      <GradeFilters
        assignments={assignments}
        filters={filters}
        isLoading={isLoading}
        onChange={(next) => setFilters((current) => ({ ...current, ...next }))}
      />

      {assignment && (
        <div className="flex items-center gap-2 text-sm text-on-surface-variant">
          <span className="font-semibold text-primary">{assignment.className}</span>
          <span>·</span>
          <span>{assignment.subjectName}</span>
          <span>·</span>
          <span>{assignment.academicYear} / {assignment.semester.replace("_", " ")}</span>
        </div>
      )}

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

      {!isLoading && !error && assignment && records.length === 0 && (
        <div className="flex flex-col gap-2 rounded-2xl border border-outline-variant/20 bg-surface-container-lowest p-4 text-sm text-on-surface-variant sm:flex-row sm:items-center sm:justify-between">
          <p>
            Chưa có học sinh ACTIVE được ghi danh cho lớp {assignment.className} trong năm học
            {' '}<strong className="text-on-surface">{assignment.academicYear}</strong>.
            {role === 'admin'
              ? ' Hãy mở chi tiết lớp và ghi danh học sinh đúng năm học này.'
              : ' Vui lòng liên hệ ADMIN để hoàn tất ghi danh; không thay đổi năm học của phân công.'}
          </p>
          {role === 'admin' && (
            <Link
              href={`/classes/${encodeURIComponent(assignment.classId)}`}
              className="shrink-0 rounded-xl bg-primary-container px-4 py-2 text-center text-xs font-semibold text-on-primary hover:opacity-90"
            >
              Mở chi tiết lớp
            </Link>
          )}
        </div>
      )}

      {isLoading ? (
        <div className="rounded-2xl bg-surface-container-lowest p-8 text-center text-sm text-on-surface-variant">
          Đang tải dữ liệu điểm...
        </div>
      ) : error ? null : !assignment ? (
        <div className="rounded-2xl bg-surface-container-lowest p-8 text-center text-sm text-on-surface-variant">
          Chưa có phân công giảng dạy để nhập điểm.
        </div>
      ) : assessmentTypes.length === 0 ? (
        <div className="rounded-2xl bg-surface-container-lowest p-8 text-center text-sm text-on-surface-variant">
          Hệ thống chưa có loại điểm nào. Hãy nhờ quản trị viên kiểm tra cấu hình assessment_types.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Summary label="Học sinh" value={String(totalStudents)} />
            <Summary label="Có điểm" value={`${completedCount} / ${totalStudents}`} />
            <Summary label="Điểm trung bình có trọng số" value={classAverage} />
          </div>

          <GradeTable
            records={records}
            assessmentTypes={assessmentTypes}
            assessmentNumber={Number(filters.assessmentNumber) || 1}
            onCellChange={handleCellChange}
            scoreFor={scoreFor}
            disabled={isSaving}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GradeDistributionCard records={records} />
            <div className="rounded-2xl border border-outline-variant/20 bg-surface-container-lowest p-5 text-sm text-on-surface-variant">
              Điểm trung bình được tính từ các điểm đã ghi nhận theo trọng số của từng loại đánh giá trong cơ sở dữ liệu.
              Học sinh chưa có điểm được hiển thị là chưa có dữ liệu, không gán điểm mẫu.
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function Summary({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-outline-variant/20 bg-surface-container-lowest p-4">
      <span className="text-xs font-semibold uppercase tracking-wide text-outline">{label}</span>
      <p className="mt-1 text-2xl font-bold text-primary">{value}</p>
    </div>
  );
}
