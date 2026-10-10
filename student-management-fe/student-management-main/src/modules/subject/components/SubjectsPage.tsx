'use client';
import React, { useState } from 'react';
import { useAuth } from '@/lib/auth/AuthContext';
import { useRouter } from 'next/navigation';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { useSubjects } from '@/modules/subject/hooks/useSubjects';
import { Subject, SubjectFormData } from '@/modules/subject/types';
import { SubjectFilters } from '@/modules/subject/components/SubjectFilters';
import { SubjectTable } from '@/modules/subject/components/SubjectTable';
import { SubjectModal } from '@/modules/subject/components/SubjectModal';
import { Pagination } from '@/components/ui/Pagination';
import {
  Download,
  Plus,
  BookOpen,
  Calculator,
  ClipboardCheck,
  CalendarDays,
  CheckCircle,
  X,
} from 'lucide-react';

interface SubjectsPageProps {
  initialEditingId?: string;
}

export default function SubjectsPage({ initialEditingId }: SubjectsPageProps) {
  const { role } = useAuth();
  const canManageSubjects = role === 'admin';
  const router = useRouter();
  const {
    subjects,
    isLoading,
    error,
    filters,
    updateFilters,
    resetFilters,
    createSubject,
    updateSubject,
    deleteSubject,
  } = useSubjects();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;
  const totalItems = subjects.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const pageSubjects = subjects.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const scoreSubjects = subjects.filter((subject) => subject.evaluationType === 'score').length;
  const evaluationSubjects = subjects.filter((subject) => subject.evaluationType === 'evaluation').length;
  const totalPeriods = subjects.reduce((sum, subject) => sum + subject.periodsByGrade.grade10 + subject.periodsByGrade.grade11 + subject.periodsByGrade.grade12, 0);

  React.useEffect(() => { setCurrentPage(1); }, [filters]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const initialEditHandled = React.useRef(false);

  React.useEffect(() => {
    if (!initialEditingId || isLoading || initialEditHandled.current) return;
    initialEditHandled.current = true;

    const subject = subjects.find((item) => item.id === initialEditingId);
    if (!subject) {
      router.replace('/subjects');
      return;
    }

    setEditingSubject(subject);
    setIsModalOpen(true);
  }, [initialEditingId, isLoading, router, subjects]);

  const handleFormSubmit = async (data: SubjectFormData) => {
    try {
      if (editingSubject) {
        const updated = await updateSubject(editingSubject.id, data);
        if (!updated) {
          showToast('Không tìm thấy môn học cần cập nhật.');
          return;
        }
        showToast('Đã cập nhật cấu hình môn học thành công.');
        return;
      }

      await createSubject(data);
      showToast('Đã lưu cấu hình môn học thành công.');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Không thể lưu môn học. Vui lòng kiểm tra dữ liệu và thử lại.');
      throw err;
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingSubject(null);
    if (initialEditingId) router.replace('/subjects');
  };

  const handleDelete = async (sub: Subject) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa môn ${sub.name} (${sub.subjectCode})?`)) return;
    try {
      const deleted = await deleteSubject(sub.id);
      showToast(deleted ? `Đã xóa môn ${sub.name}.` : 'Không tìm thấy môn học cần xóa.');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Không thể xóa môn học.');
    }
  };

  return (
    
      <div className="flex flex-col gap-6 relative">
        {/* Toast Alert */}
        {toastMessage && (
          <div className="fixed top-20 right-6 z-50 flex items-center gap-3 px-5 py-3.5 bg-surface-container-lowest text-on-surface rounded-2xl shadow-xl border border-outline-variant/30 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="w-8 h-8 rounded-full bg-secondary-container/20 text-secondary-container flex items-center justify-center shrink-0">
              <CheckCircle className="w-5 h-5" />
            </div>
            <span className="text-xs sm:text-sm font-semibold text-on-surface">{toastMessage}</span>
            <button
              onClick={() => setToastMessage(null)}
              className="p-1 text-outline hover:text-on-surface cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Breadcrumb & Header */}
        <div className="flex flex-col gap-1">
          <Breadcrumb
            items={[
              { label: 'Quản lý', href: '/subjects' },
              { label: 'Môn học', isCurrent: true },
            ]}
          />
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mt-1">
            <div className="flex flex-col gap-1 max-w-3xl">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">
                  Quản lý Môn học
                </h1>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-surface-container text-primary">
                  {subjects.length} môn theo bộ lọc
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-surface-container-high text-secondary">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                  CT GDPT 2018
                </span>
              </div>
              <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                Quản lý danh mục môn học theo chương trình GDPT, phân bổ số tiết học/tuần, cấu hình tổ bộ môn và hệ số tính điểm.
              </p>
            </div>

            {/* Actions */}
            {canManageSubjects && <div className="flex items-center gap-2.5 flex-shrink-0">
              <button
                type="button"
                onClick={() => alert('Đang xuất tệp cấu hình danh mục môn học...')}
                className="h-11 px-4 rounded-xl bg-surface-container-lowest text-on-surface hover:bg-surface-container text-xs sm:text-sm font-semibold shadow-sm transition-all flex items-center gap-2 border border-outline-variant/20 cursor-pointer"
              >
                <Download className="w-4 h-4 text-on-surface-variant" />
                <span>Xuất cấu hình</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditingSubject(null);
                  setIsModalOpen(true);
                }}
                className="h-11 px-5 rounded-xl bg-primary-container text-on-primary hover:bg-primary text-xs sm:text-sm font-semibold shadow hover:shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm môn học mới</span>
              </button>
            </div>}
          </div>
        </div>

        {error && <p role="alert" className="rounded-xl bg-error/10 px-4 py-3 text-sm text-error">{error}</p>}

        {/* 4 KPI Metrics Widgets */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {/* Card 1 */}
          <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm border border-outline-variant/20 flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-medium text-on-surface-variant block">
                  Số môn theo bộ lọc
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-bold text-on-surface tracking-tight font-mono">{subjects.length}</span>
                  <span className="text-xs text-outline font-mono">môn</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-surface-container-low flex items-center justify-center text-primary">
                <BookOpen className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 pt-2 border-t border-outline-variant/10 text-xs text-on-surface-variant">
              <span className="font-semibold text-primary">{subjects.length}</span> môn trong danh sách hiện tại
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm border border-outline-variant/20 flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-medium text-on-surface-variant block">
                  Đánh giá bằng điểm số
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-bold text-on-surface tracking-tight font-mono">{scoreSubjects}</span>
                  <span className="text-xs text-outline font-mono">môn</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-surface-container-low flex items-center justify-center text-secondary">
                <Calculator className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 pt-2 border-t border-outline-variant/10 flex items-center gap-1.5 text-xs text-on-surface-variant">
              <span className="inline-block w-2 h-2 rounded-full bg-secondary" />
              <span>Thang điểm 10 theo thông tư 22/2021</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm border border-outline-variant/20 flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-medium text-on-surface-variant block">
                  Đánh giá bằng nhận xét
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-bold text-on-surface tracking-tight font-mono">{evaluationSubjects.toString().padStart(2, '0')}</span>
                  <span className="text-xs text-outline font-mono">môn</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-surface-container-low flex items-center justify-center text-tertiary-container">
                <ClipboardCheck className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 pt-2 border-t border-outline-variant/10 flex items-center gap-1.5 text-xs text-on-surface-variant">
              <span className="inline-block w-2 h-2 rounded-full bg-tertiary-container" />
              <span>GDTC, Âm nhạc, Mỹ thuật (Đ / CĐ)</span>
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm border border-outline-variant/20 flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-medium text-on-surface-variant block">
                  Tổng số tiết / tuần
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-bold text-on-surface tracking-tight font-mono">{totalPeriods.toLocaleString('vi-VN')}</span>
                  <span className="text-xs text-outline font-mono">tiết/trường</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-surface-container-low flex items-center justify-center text-primary-container">
                <CalendarDays className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 pt-2 border-t border-outline-variant/10 flex items-center gap-1 text-xs text-primary font-medium">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Đạt định mức chuẩn GDPT &amp; giáo viên</span>
            </div>
          </div>
        </div>

        {/* Filter Toolbar */}
        <SubjectFilters
          filters={filters}
          onFilterChange={updateFilters}
          onReset={resetFilters}
        />

        {/* Subject Table & Pagination */}
        <div className="flex flex-col">
          <SubjectTable
            subjects={pageSubjects}
            isLoading={isLoading}
            canManage={canManageSubjects}
            onView={(subject) => {
              if (canManageSubjects) {
                setEditingSubject(subject);
                setIsModalOpen(true);
              } else {
                router.push(`/subjects/${encodeURIComponent(subject.id)}`);
              }
            }}
            onEdit={(s) => {
              setEditingSubject(s);
              setIsModalOpen(true);
            }}
            onDelete={handleDelete}
          />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            pageSize={pageSize}
            onPageChange={(p) => setCurrentPage(p)}
            itemLabel="môn học"
          />
        </div>

        {/* Modal for Add / Edit Subject */}
        {canManageSubjects && <SubjectModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onSubmit={handleFormSubmit}
          initialData={editingSubject}
        />}
      </div>
    
  );
}
