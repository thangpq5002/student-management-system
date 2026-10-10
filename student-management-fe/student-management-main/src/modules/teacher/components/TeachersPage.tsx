'use client';

import React, { useState } from 'react';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { useTeachers } from '@/modules/teacher/hooks/useTeachers';
import { Teacher, TeacherFormData } from '@/modules/teacher/types';
import { TeacherFilters } from '@/modules/teacher/components/TeacherFilters';
import { TeacherTable } from '@/modules/teacher/components/TeacherTable';
import { TeacherForm } from '@/modules/teacher/components/TeacherForm';
import { DeleteTeacherModal } from '@/modules/teacher/components/DeleteTeacherModal';
import { TeacherDetailModal } from '@/modules/teacher/components/TeacherDetailModal';
import { Pagination } from '@/components/ui/Pagination';
import {
  Download,
  UserPlus,
  School,
  CalendarX,
  Users,
  Layers,
  CheckCircle,
  X,
} from 'lucide-react';

export default function TeachersPage() {
  const {
    teachers,
    isLoading,
    error,
    filters,
    updateFilters,
    resetFilters,
    createTeacher,
    updateTeacher,
    deleteTeacher,
  } = useTeachers();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [viewingTeacher, setViewingTeacher] = useState<Teacher | null>(null);
  const [deletingTeacher, setDeletingTeacher] = useState<Teacher | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;
  const totalItems = teachers.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const pageTeachers = teachers.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const activeTeachers = teachers.filter((teacher) => teacher.status === 'active').length;
  const leaveTeachers = teachers.filter((teacher) => teacher.status === 'leave').length;
  const transferredTeachers = teachers.filter((teacher) => teacher.status === 'transferred').length;
  const departmentCount = new Set(teachers.map((teacher) => teacher.department.trim()).filter(Boolean)).size;

  React.useEffect(() => { setCurrentPage(1); }, [filters]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleCreateOrUpdate = async (formData: TeacherFormData) => {
    if (editingTeacher) {
      await updateTeacher(editingTeacher.id, formData);
      showToast('Cập nhật hồ sơ giáo viên thành công.');
    } else {
      await createTeacher(formData);
      showToast('Thêm hồ sơ giáo viên mới thành công.');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingTeacher) return;
    setIsDeleting(true);
    try {
      await deleteTeacher(deletingTeacher.id);
      setDeletingTeacher(null);
      showToast('Đã xóa thông tin giáo viên khỏi hệ thống.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    
      <div className="flex flex-col gap-6 relative">
        {/* Toast Alert Notification */}
        {toastMessage && (
          <div className="fixed top-20 right-6 z-50 flex items-center gap-3 px-5 py-3.5 bg-surface-container-lowest text-on-surface rounded-2xl shadow-xl border border-outline-variant/30 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="w-8 h-8 rounded-full bg-tertiary-fixed text-on-tertiary-fixed-variant flex items-center justify-center shrink-0">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div className="flex flex-col pr-4">
              <span className="font-semibold text-xs sm:text-sm text-on-surface">
                Thao tác thành công
              </span>
              <span className="text-xs text-on-surface-variant">{toastMessage}</span>
            </div>
            <button
              onClick={() => setToastMessage(null)}
              className="p-1 text-outline hover:text-on-surface transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Breadcrumb & Header */}
        <div className="flex flex-col gap-1">
          <Breadcrumb
            items={[
              { label: 'Quản lý', href: '/teachers' },
              { label: 'Giáo viên', isCurrent: true },
            ]}
          />
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-1">
            <div className="flex flex-col">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">
                  Quản lý Giáo viên
                </h1>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary-fixed text-primary text-xs font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  Tổng số: {teachers.length} giáo viên theo bộ lọc
                </span>
              </div>
              <p className="text-xs sm:text-sm text-on-surface-variant mt-1 max-w-2xl leading-relaxed">
                Quản lý danh sách nhân sự sư phạm, phân công tổ bộ môn, liên hệ và trạng thái công tác.
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2.5 self-start md:self-auto shrink-0">
              <button
                type="button"
                onClick={() => alert('Đang xuất danh sách giáo viên ra file Excel (.xlsx)...')}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-container-lowest text-on-surface hover:bg-surface-container font-semibold text-xs sm:text-sm shadow-sm transition-all border border-outline-variant/20 cursor-pointer"
              >
                <Download className="w-4 h-4 text-secondary" />
                <span>Xuất danh sách Excel</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditingTeacher(null);
                  setIsFormOpen(true);
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-container text-on-primary hover:bg-primary font-semibold text-xs sm:text-sm shadow hover:shadow-md transition-all cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>Thêm giáo viên</span>
              </button>
            </div>
          </div>
        </div>

        {error && <p role="alert" className="rounded-xl bg-error/10 px-4 py-3 text-sm text-error">{error}</p>}

        {/* KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1 */}
          <div className="p-5 rounded-2xl bg-surface-container-lowest shadow-sm border border-outline-variant/20 flex flex-col justify-between relative overflow-hidden group">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                Đang giảng dạy
              </span>
              <School className="w-5 h-5 text-primary" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-on-surface font-mono">{activeTeachers}</span>
              <span className="text-xs text-on-surface-variant">giáo viên</span>
            </div>
            <div className="flex items-center gap-1.5 mt-3 pt-2 border-t border-outline-variant/10 text-xs">
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed-variant font-bold text-[10px]">
                {totalItems ? (activeTeachers / totalItems * 100).toFixed(1) : '0.0'}%
              </span>
              <span className="text-on-surface-variant">Chiếm biên chế toàn trường</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="p-5 rounded-2xl bg-surface-container-lowest shadow-sm border border-outline-variant/20 flex flex-col justify-between relative overflow-hidden group">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                Nghỉ phép / Thai sản
              </span>
              <CalendarX className="w-5 h-5 text-error" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-on-surface font-mono">{leaveTeachers}</span>
              <span className="text-xs text-on-surface-variant">giáo viên</span>
            </div>
            <div className="flex items-center gap-1.5 mt-3 pt-2 border-t border-outline-variant/10 text-xs">
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-error-container text-error font-bold text-[10px]">
                Tạm hoãn
              </span>
              <span className="text-on-surface-variant">Đã có GV dạy thay thế</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="p-5 rounded-2xl bg-surface-container-lowest shadow-sm border border-outline-variant/20 flex flex-col justify-between relative overflow-hidden group">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                Đã chuyển công tác
              </span>
              <Users className="w-5 h-5 text-secondary" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-on-surface font-mono">{transferredTeachers}</span>
              <span className="text-xs text-on-surface-variant">giáo viên</span>
            </div>
            <div className="flex items-center gap-1.5 mt-3 pt-2 border-t border-outline-variant/10 text-xs">
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant font-bold text-[10px]">
                100%
              </span>
              <span className="text-on-surface-variant">Theo trạng thái dữ liệu backend</span>
            </div>
          </div>

          {/* Card 4 */}
          <div className="p-5 rounded-2xl bg-surface-container-lowest shadow-sm border border-outline-variant/20 flex flex-col justify-between relative overflow-hidden group">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                Tổ chuyên môn
              </span>
              <Layers className="w-5 h-5 text-tertiary" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-on-surface font-mono">{departmentCount}</span>
              <span className="text-xs text-on-surface-variant">tổ bộ môn</span>
            </div>
            <div className="flex items-center gap-1.5 mt-3 pt-2 border-t border-outline-variant/10 text-xs">
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-surface-container text-on-surface font-bold text-[10px]">
                Quy chuẩn
              </span>
              <span className="text-on-surface-variant">Toán, Văn, Anh, KHTN...</span>
            </div>
          </div>
        </div>

        {/* Filter Toolbar */}
        <TeacherFilters
          filters={filters}
          onFilterChange={updateFilters}
          onReset={resetFilters}
        />

        {/* Table & Pagination */}
        <div className="flex flex-col">
          <TeacherTable
            teachers={pageTeachers}
            isLoading={isLoading}
            onView={(t) => setViewingTeacher(t)}
            onEdit={(t) => {
              setEditingTeacher(t);
              setIsFormOpen(true);
            }}
            onDelete={(t) => setDeletingTeacher(t)}
          />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            pageSize={pageSize}
            onPageChange={(p) => setCurrentPage(p)}
            itemLabel="giáo viên"
          />
        </div>

        {/* Slide-over Drawer for Add/Edit */}
        <TeacherForm
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setEditingTeacher(null);
          }}
          onSubmit={handleCreateOrUpdate}
          initialData={editingTeacher}
        />

        {/* Delete Confirmation Modal */}
        <DeleteTeacherModal
          isOpen={!!deletingTeacher}
          teacher={deletingTeacher}
          onClose={() => setDeletingTeacher(null)}
          onConfirm={handleDeleteConfirm}
          isDeleting={isDeleting}
        />

        {/* Teacher Detail Modal */}
        <TeacherDetailModal
          isOpen={!!viewingTeacher}
          teacher={viewingTeacher}
          onClose={() => setViewingTeacher(null)}
          onEditRequest={(t) => {
            setViewingTeacher(null);
            setEditingTeacher(t);
            setIsFormOpen(true);
          }}
        />
      </div>
    
  );
}
