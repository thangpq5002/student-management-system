'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth/AuthContext';
import { useStudents } from '@/modules/student/hooks/useStudents';
import { Student, StudentFormData } from '@/modules/student/types';
import { StudentFilters } from '@/modules/student/components/StudentFilters';
import { StudentTable } from '@/modules/student/components/StudentTable';
import { StudentForm } from '@/modules/student/components/StudentForm';
import { DeleteStudentModal } from '@/modules/student/components/DeleteStudentModal';
import { StudentDetailModal } from '@/modules/student/components/StudentDetailModal';
import { Pagination } from '@/components/ui/Pagination';
import {
  Download,
  Upload,
  UserPlus,
  School,
  PauseCircle,
  LogOut,
  Clock,
  ArrowUp,
  CheckCircle,
  X,
} from 'lucide-react';

export default function StudentsPage() {
  const { role } = useAuth();
  const canManageStudents = role === 'admin';
  const {
    students,
    isLoading,
    error,
    filters,
    updateFilters,
    resetFilters,
    createStudent,
    updateStudent,
    deleteStudent,
  } = useStudents();

  // Drawers and Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [viewingStudent, setViewingStudent] = useState<Student | null>(null);
  const [deletingStudent, setDeletingStudent] = useState<Student | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const totalItems = students.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const pageStudents = students.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const activeStudents = students.filter((student) => student.status === 'active').length;
  const suspendedStudents = students.filter((student) => student.status === 'suspended').length;
  const transferredStudents = students.filter((student) => student.status === 'transferred').length;
  const activePercent = totalItems ? (activeStudents / totalItems * 100).toFixed(1) : '0.0';

  React.useEffect(() => { setCurrentPage(1); }, [filters]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleCreateOrUpdate = async (formData: StudentFormData) => {
    if (editingStudent) {
      await updateStudent(editingStudent.id, formData);
      showToast('Cập nhật hồ sơ học sinh thành công.');
    } else {
      await createStudent(formData);
      showToast('Thêm mới học sinh vào hệ thống thành công.');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingStudent) return;
    setIsDeleting(true);
    try {
      await deleteStudent(deletingStudent.id);
      setDeletingStudent(null);
      showToast('Đã xóa học sinh khỏi danh sách lớp.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    
      <div className="flex flex-col gap-6 relative">
        {/* Floating Toast Feedback Simulation */}
        {toastMessage && (
          <div className="fixed top-20 right-6 z-50 flex items-center gap-3 px-5 py-3.5 bg-surface-container-lowest text-on-surface rounded-2xl shadow-xl border border-outline-variant/30 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="w-8 h-8 rounded-full bg-secondary-container/20 text-secondary-container flex items-center justify-center shrink-0">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div className="flex flex-col pr-4">
              <span className="font-semibold text-xs sm:text-sm text-on-surface">
                Cập nhật thành công
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

        {/* Header Section with Context Metas & Primary Actions */}
        <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-xs text-on-surface-variant font-medium">
              <span className="font-mono text-secondary uppercase font-semibold">
                HỌC SINH VÀ ĐÀO TẠO
              </span>
              <span className="w-1 h-1 rounded-full bg-outline" />
              <span>Dữ liệu hiện tại từ máy chủ</span>
            </div>
            <div className="flex items-baseline gap-3 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-bold text-primary tracking-tight">
                Quản lý Học sinh
              </h1>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-surface-container-high text-primary font-semibold text-xs">
                Tổng số: {students.length.toLocaleString('vi-VN')} học sinh theo bộ lọc
              </span>
            </div>
            <p className="text-xs sm:text-sm text-on-surface-variant max-w-2xl leading-relaxed">
              Theo dõi thông tin nhân khẩu, quản lý hồ sơ nhập học, trạng thái chuyên cần và quản lý trạng thái học tập theo từng khối lớp.
            </p>
          </div>

          {/* Action Ribbon */}
          {canManageStudents && <div className="flex items-center gap-2.5 flex-wrap shrink-0">
            <button
              type="button"
              onClick={() => alert('Đang xuất danh sách học sinh ra file Excel (.xlsx)...')}
              className="flex items-center gap-2 px-4 py-2.5 bg-surface-container text-on-surface rounded-xl hover:bg-surface-container-high transition-colors text-xs sm:text-sm font-semibold cursor-pointer border border-outline-variant/20"
            >
              <Download className="w-4 h-4 text-outline" />
              <span>Xuất Excel</span>
            </button>
            <button
              type="button"
              onClick={() => alert('Mở giao diện nhập dữ liệu từ file Excel/CSV')}
              className="flex items-center gap-2 px-4 py-2.5 bg-surface-container text-on-surface rounded-xl hover:bg-surface-container-high transition-colors text-xs sm:text-sm font-semibold cursor-pointer border border-outline-variant/20"
            >
              <Upload className="w-4 h-4 text-outline" />
              <span>Nhập danh sách</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setEditingStudent(null);
                setIsFormOpen(true);
              }}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary text-on-primary rounded-xl hover:bg-primary-container shadow hover:shadow-md transition-all text-xs sm:text-sm font-semibold cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>+ Thêm học sinh</span>
            </button>
          </div>}
        </div>

        {error && <p role="alert" className="rounded-xl bg-error/10 px-4 py-3 text-sm text-error">{error}</p>}

        {/* KPI Overview Micro-Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {/* Card 1 */}
          <div className="p-5 bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-outline">
                Đang theo học
              </span>
              <span className="text-2xl font-bold text-on-surface mt-1 font-mono">{activeStudents.toLocaleString('vi-VN')}</span>
              <span className="text-[11px] text-secondary flex items-center gap-1 mt-0.5 font-semibold">
                <ArrowUp className="w-3 h-3" /> {activePercent}% trong danh sách hiện tại
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-primary">
              <School className="w-6 h-6" />
            </div>
          </div>

          {/* Card 2 */}
          <div className="p-5 bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-outline">
                Bảo lưu kết quả
              </span>
              <span className="text-2xl font-bold text-on-surface mt-1 font-mono">{suspendedStudents.toLocaleString('vi-VN')}</span>
              <span className="text-[11px] text-on-surface-variant flex items-center gap-1 mt-0.5">
                Tạm hoãn 1 học kỳ
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-tertiary-fixed/30 flex items-center justify-center text-tertiary">
              <PauseCircle className="w-6 h-6" />
            </div>
          </div>

          {/* Card 3 */}
          <div className="p-5 bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-outline">
                Chuyển trường / Thôi học
              </span>
              <span className="text-2xl font-bold text-on-surface mt-1 font-mono">{transferredStudents.toLocaleString('vi-VN')}</span>
              <span className="text-[11px] text-error flex items-center gap-1 mt-0.5 font-semibold">
                -0.8% so với kỳ trước
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-error-container/30 flex items-center justify-center text-error">
              <LogOut className="w-6 h-6" />
            </div>
          </div>

          {/* Card 4 */}
          <div className="p-5 bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-outline">
                Hồ sơ chờ duyệt
              </span>
              <span className="text-2xl font-bold text-on-surface mt-1 font-mono">18</span>
              <span className="text-[11px] text-secondary flex items-center gap-1 mt-0.5 font-semibold">
                Học sinh chuyển đến
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-secondary-fixed/50 flex items-center justify-center text-secondary">
              <Clock className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Filter & Control Toolbar */}
        <StudentFilters
          filters={filters}
          onFilterChange={updateFilters}
          onReset={resetFilters}
        />

        {/* Primary Tabular Ledger */}
        <div className="flex flex-col">
          <StudentTable
            students={pageStudents}
            isLoading={isLoading}
            canManage={canManageStudents}
            onView={(student) => setViewingStudent(student)}
            onEdit={(student) => {
              setEditingStudent(student);
              setIsFormOpen(true);
            }}
            onDelete={(student) => setDeletingStudent(student)}
          />

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            pageSize={pageSize}
            onPageChange={(p) => setCurrentPage(p)}
            itemLabel="học sinh"
          />
        </div>

        {/* Slide-over Drawer for Add / Edit Student */}
        {canManageStudents && <StudentForm
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setEditingStudent(null);
          }}
          onSubmit={handleCreateOrUpdate}
          initialData={editingStudent}
        />}

        {/* Delete Confirmation Modal */}
        {canManageStudents && <DeleteStudentModal
          isOpen={!!deletingStudent}
          student={deletingStudent}
          onClose={() => setDeletingStudent(null)}
          onConfirm={handleDeleteConfirm}
          isDeleting={isDeleting}
        />}

        {/* Student Detail Modal */}
        <StudentDetailModal
          isOpen={!!viewingStudent}
          student={viewingStudent}
          onClose={() => setViewingStudent(null)}
          onEditRequest={canManageStudents ? (student) => {
            setViewingStudent(null);
            setEditingStudent(student);
            setIsFormOpen(true);
          } : undefined}
        />
      </div>
    
  );
}
