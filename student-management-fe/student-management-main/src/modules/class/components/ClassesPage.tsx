'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth/AuthContext';
import { useRouter } from 'next/navigation';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { useClasses } from '@/modules/class/hooks/useClasses';
import { classService } from '@/modules/class/services/class.service';
import { SchoolClass } from '@/modules/class/types';
import { ClassTable } from '@/modules/class/components/ClassTable';
import { ClassDetail } from '@/modules/class/components/ClassDetail';
import { TeachingAssignmentsPanel } from '@/modules/class/components/TeachingAssignmentsPanel';
import { Pagination } from '@/components/ui/Pagination';
import { Download, Plus, Building, Users, BadgeCheck, DoorOpen, Search, RotateCcw, ChevronDown } from 'lucide-react';

export default function ClassesPage() {
  const { role } = useAuth();
  const canManageClasses = role === 'admin';
  const router = useRouter();
  const { classes, isLoading, error, filters, updateFilters, resetFilters, assignTeacher } = useClasses();
  const [managingClass, setManagingClass] = useState<SchoolClass | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;
  const totalItems = classes.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const pageClasses = classes.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const grade10 = classes.filter((item) => item.gradeLevel === 10).length;
  const grade11 = classes.filter((item) => item.gradeLevel === 11).length;
  const grade12 = classes.filter((item) => item.gradeLevel === 12).length;
  const assignedTeachers = classes.filter((item) => Boolean(item.homeroomTeacher?.id)).length;
  const totalStudents = classes.reduce((sum, item) => sum + (item.currentStudents || 0), 0);
  const averageStudents = totalItems ? (totalStudents / totalItems).toFixed(1) : '—';
  const uniqueRooms = new Set(classes.map((item) => item.room.trim()).filter(Boolean)).size;

  useEffect(() => { setCurrentPage(1); }, [filters]);

  const handleOpenManage = async (item: SchoolClass) => {
    try {
      const detail = await classService.getClass(item.id);
      setManagingClass(detail ?? item);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Không thể tải chi tiết lớp học.');
      setManagingClass(item);
    }
  };

  const handleUpdateTeacher = async (classId: string, teacher: SchoolClass['homeroomTeacher'] | null) => {
    try {
      const updated = await assignTeacher(classId, teacher);
      if (updated) setManagingClass(updated);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Không thể cập nhật giáo viên chủ nhiệm.');
    }
  };

  const refreshManagingClass = async () => {
    if (!managingClass) return;
    const detail = await classService.getClass(managingClass.id);
    if (!detail) throw new Error('Không tìm thấy lớp học sau khi cập nhật.');
    setManagingClass(detail);
  };



  return (
    <div className="flex flex-col gap-6 relative">
      <div className="flex flex-col gap-1">
        <Breadcrumb items={[{ label: 'Quản lý', href: '/classes' }, { label: 'Lớp học', isCurrent: true }]} />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mt-1">
          <div className="flex flex-col">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">Quản lý lớp học</h1>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary-fixed text-primary">
                {isLoading ? 'Đang tải...' : `${totalItems} lớp theo bộ lọc`}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-on-surface-variant mt-1 max-w-3xl leading-relaxed">
              Danh sách và chỉ số được lấy từ backend. Các chỉ số thay đổi theo bộ lọc hiện tại.
            </p>
          </div>
          <div className="flex items-center gap-2.5 self-start lg:self-center shrink-0">
            <button type="button" onClick={() => alert('Chức năng xuất Excel chưa được tích hợp.')} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-container-lowest text-on-surface font-semibold text-xs sm:text-sm shadow-sm border border-outline-variant/20">
              <Download className="w-4 h-4 text-primary" /><span>Xuất danh sách Excel</span>
            </button>
            {canManageClasses && <button type="button" onClick={() => router.push('/classes/new')} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-container text-on-primary font-semibold text-xs sm:text-sm shadow">
              <Plus className="w-4 h-4" /><span>Tạo lớp học mới</span>
            </button>}
          </div>
        </div>
      </div>

      {error && <p role="alert" className="rounded-xl bg-error/10 px-4 py-3 text-sm text-error">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm border border-outline-variant/20 flex flex-col justify-between">
          <div className="flex items-start justify-between"><div><span className="text-xs font-medium text-on-surface-variant">Số lớp theo bộ lọc</span><div className="text-3xl font-bold text-on-surface mt-1 font-mono">{isLoading ? '—' : totalItems} <span className="text-sm font-normal text-on-surface-variant">lớp</span></div></div><div className="w-10 h-10 rounded-xl bg-primary-fixed flex items-center justify-center text-primary"><Building className="w-5 h-5" /></div></div>
          <div className="mt-4 pt-2 border-t border-outline-variant/10 flex items-center justify-between text-xs text-on-surface-variant bg-surface-container-low px-2.5 py-1 rounded-lg font-mono"><span>K10: <strong>{grade10}</strong></span><span>K11: <strong>{grade11}</strong></span><span>K12: <strong>{grade12}</strong></span></div>
        </div>
        <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm border border-outline-variant/20 flex flex-col justify-between">
          <div className="flex items-start justify-between"><div><span className="text-xs font-medium text-on-surface-variant">Sĩ số trung bình</span><div className="text-3xl font-bold text-on-surface mt-1 font-mono">{averageStudents} <span className="text-sm font-normal text-on-surface-variant">hs/lớp</span></div></div><div className="w-10 h-10 rounded-xl bg-secondary-fixed flex items-center justify-center text-secondary"><Users className="w-5 h-5" /></div></div>
          <div className="mt-4 pt-2 border-t border-outline-variant/10 flex items-center gap-1.5 text-xs text-on-surface-variant"><BadgeCheck className="w-4 h-4 text-tertiary" /><span>Tính từ sĩ số trả về bởi máy chủ</span></div>
        </div>
        <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm border border-outline-variant/20 flex flex-col justify-between">
          <div className="flex items-start justify-between"><div><span className="text-xs font-medium text-on-surface-variant">Đã phân công GVCN</span><div className="text-3xl font-bold text-on-surface mt-1 font-mono">{assignedTeachers}<span className="text-lg text-outline">/{totalItems}</span></div></div><div className="w-10 h-10 rounded-xl bg-tertiary-fixed flex items-center justify-center text-tertiary"><Users className="w-5 h-5" /></div></div>
          <div className="mt-4 pt-2 border-t border-outline-variant/10 flex items-center gap-2"><div className="w-full bg-surface-container rounded-full h-1.5 overflow-hidden"><div className="bg-secondary h-1.5 rounded-full" style={{ width: `${totalItems ? (assignedTeachers / totalItems) * 100 : 0}%` }} /></div><span className="text-xs font-bold text-secondary">{totalItems ? Math.round((assignedTeachers / totalItems) * 100) : 0}%</span></div>
        </div>
        <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm border border-outline-variant/20 flex flex-col justify-between">
          <div className="flex items-start justify-between"><div><span className="text-xs font-medium text-on-surface-variant">Phòng học đã khai báo</span><div className="text-3xl font-bold text-on-surface mt-1 font-mono">{uniqueRooms} <span className="text-sm font-normal text-on-surface-variant">phòng khác nhau</span></div></div><div className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center text-primary"><DoorOpen className="w-5 h-5" /></div></div>
          <div className="mt-4 pt-2 border-t border-outline-variant/10 text-xs text-on-surface-variant">Không suy đoán số phòng trống khi backend chưa cung cấp dữ liệu này.</div>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-2xl p-4 sm:p-5 shadow-sm border border-outline-variant/20 flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
        <div className="flex-1 relative"><Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-outline pointer-events-none" /><input type="search" value={filters.search} onChange={(e) => updateFilters({ search: e.target.value })} placeholder="Tìm theo tên lớp, mã lớp, tên GVCN, phòng học..." className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-container-low text-on-surface text-xs sm:text-sm focus:outline-none border border-transparent focus:border-secondary" /></div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-[130px] flex-1 sm:flex-initial"><select value={filters.gradeLevel} onChange={(e) => updateFilters({ gradeLevel: e.target.value })} className="w-full appearance-none pl-3 pr-8 py-2.5 rounded-xl bg-surface-container-low text-on-surface text-xs sm:text-sm cursor-pointer"><option value="">Tất cả khối</option><option value="10">Khối 10</option><option value="11">Khối 11</option><option value="12">Khối 12</option></select><ChevronDown className="w-4 h-4 pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-outline" /></div>
          <div className="relative min-w-[160px] flex-1 sm:flex-initial"><select value={filters.stream} onChange={(e) => updateFilters({ stream: e.target.value })} className="w-full appearance-none pl-3 pr-8 py-2.5 rounded-xl bg-surface-container-low text-on-surface text-xs sm:text-sm cursor-pointer"><option value="">Tổ hợp: Tất cả</option><option value="KHTN">Khoa học Tự nhiên</option><option value="KHXH">Khoa học Xã hội</option><option value="Quốc tế">Lớp Quốc tế / D1</option></select><ChevronDown className="w-4 h-4 pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-outline" /></div>
          <button type="button" onClick={resetFilters} className="p-2.5 rounded-xl bg-surface-container-low text-on-surface-variant flex items-center justify-center" title="Làm mới bộ lọc"><RotateCcw className="w-4 h-4" /></button>
        </div>
      </div>

      <div className="flex flex-col">
        <ClassTable
          classes={pageClasses}
          isLoading={isLoading}
          canManageAssignments={canManageClasses}
          onOpenManage={(cls) => void handleOpenManage(cls)}
        />
        <Pagination currentPage={Math.min(currentPage, totalPages)} totalPages={totalPages} totalItems={totalItems} pageSize={pageSize} onPageChange={setCurrentPage} itemLabel="lớp học" />
      </div>

      <TeachingAssignmentsPanel />

      <ClassDetail
        isOpen={!!managingClass}
        schoolClass={managingClass}
        onClose={() => setManagingClass(null)}
        onUpdateTeacher={handleUpdateTeacher}
        onEnrolled={refreshManagingClass}
        canManageAssignments={canManageClasses}
      />
    </div>
  );
}
