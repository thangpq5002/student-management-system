'use client';

import React from 'react';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { useRouter } from 'next/navigation';
import { useTeachers } from '@/modules/teacher/hooks/useTeachers';
import { TEACHER_STATUS_MAP } from '@/modules/teacher/constants';
import { ArrowLeft, Mail, Phone, School, Award, BookOpen } from 'lucide-react';

export default function TeacherDetailPage({ params }: { params?: { id: string } }) {
  const router = useRouter();
  const { teachers } = useTeachers();

  const teacherId = params?.id || 't-01';
  const teacher = teachers.find((t) => t.id === teacherId) || teachers[0];

  if (!teacher) {
    return (
      
        <div className="p-8 text-center text-on-surface-variant">Không tìm thấy thông tin giáo viên.</div>
      
    );
  }

  const statusConfig = TEACHER_STATUS_MAP[teacher.status] || {
    label: teacher.status,
    badgeVariant: 'neutral' as const,
  };

  return (
    
      <div className="flex flex-col gap-6 max-w-4xl mx-auto">
        {/* Breadcrumb & Navigation */}
        <div className="flex flex-col gap-1">
          <Breadcrumb
            items={[
              { label: 'Giáo viên', href: '/teachers' },
              { label: teacher.fullName, isCurrent: true },
            ]}
          />
          <div className="flex items-center justify-between mt-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-on-surface">
              Chi tiết Hồ sơ Giáo viên
            </h1>
            <button
              type="button"
              onClick={() => router.push('/teachers')}
              className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-on-surface-variant hover:text-on-surface px-3 py-2 rounded-xl bg-surface-container"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Quay lại</span>
            </button>
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-outline-variant/20 flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 pb-6 border-b border-outline-variant/20">
            <div className="w-20 h-20 rounded-2xl bg-secondary-fixed text-on-secondary-fixed font-bold text-2xl flex items-center justify-center shadow">
              {teacher.avatarInitials ||
                teacher.fullName
                  .split(' ')
                  .slice(-2)
                  .map((n) => n[0])
                  .join('')}
            </div>
            <div className="flex flex-col flex-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h2 className="text-xl sm:text-2xl font-bold text-on-surface">{teacher.fullName}</h2>
                <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-surface-container font-semibold text-secondary">
                  {teacher.teacherCode}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                  {statusConfig.label}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-on-surface-variant mt-1">
                {teacher.titleRole} • {teacher.department}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-outline">
                Thông tin Chuyên môn &amp; Giảng dạy
              </h3>
              <div className="bg-surface-container-low rounded-xl p-4 flex flex-col gap-3 text-xs sm:text-sm">
                <div className="flex justify-between py-1 border-b border-outline-variant/10">
                  <span className="text-on-surface-variant">Tổ bộ môn:</span>
                  <span className="font-semibold text-on-surface">{teacher.department}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-outline-variant/10">
                  <span className="text-on-surface-variant">Môn giảng dạy:</span>
                  <span className="font-medium text-on-surface">{teacher.subjectTaught}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-outline-variant/10">
                  <span className="text-on-surface-variant">Học vị / Bằng cấp:</span>
                  <span className="font-medium text-secondary">{teacher.degree || 'Cử nhân'}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-on-surface-variant">Số tiết/tuần hiện tại:</span>
                  <span className="font-mono font-medium text-on-surface">18 tiết/tuần</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-outline">
                Thông tin Liên hệ Công vụ
              </h3>
              <div className="bg-surface-container-low rounded-xl p-4 flex flex-col gap-3 text-xs sm:text-sm">
                <div className="flex justify-between py-1 border-b border-outline-variant/10">
                  <span className="text-on-surface-variant">Email trường:</span>
                  <span className="font-mono text-on-surface">{teacher.email}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-outline-variant/10">
                  <span className="text-on-surface-variant">Số điện thoại:</span>
                  <span className="font-mono text-on-surface">{teacher.phone}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-outline-variant/10">
                  <span className="text-on-surface-variant">Đánh giá thi đua:</span>
                  <span className="font-semibold text-primary">Chiến sĩ thi đua cấp cơ sở</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-on-surface-variant">Năm công tác:</span>
                  <span className="font-medium text-on-surface">8 năm</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    
  );
}
