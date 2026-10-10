'use client';

import React from 'react';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { useRouter } from 'next/navigation';
import { useStudents } from '@/modules/student/hooks/useStudents';
import { Student } from '@/modules/student/types';
import { STUDENT_STATUS_MAP } from '@/modules/student/constants';
import {
  ArrowLeft,
  User,
  Calendar,
  Phone,
  Mail,
  School,
  Shield,
  Edit2,
  Award,
  BookOpen,
} from 'lucide-react';

export default function StudentDetailPage({ params }: { params?: { id: string } }) {
  const router = useRouter();
  const { students } = useStudents();

  // Find student by params or fallback to the first student
  const studentId = params?.id || 's-01';
  const student = students.find((s) => s.id === studentId) || students[0];

  if (!student) {
    return (
      
        <div className="p-8 text-center text-on-surface-variant">Không tìm thấy thông tin học sinh.</div>
      
    );
  }

  const statusConfig = STUDENT_STATUS_MAP[student.status] || {
    label: student.status,
    badgeVariant: 'neutral' as const,
  };

  return (
    
      <div className="flex flex-col gap-6 max-w-4xl mx-auto">
        {/* Breadcrumb & Navigation */}
        <div className="flex flex-col gap-1">
          <Breadcrumb
            items={[
              { label: 'Học sinh', href: '/students' },
              { label: student.fullName, isCurrent: true },
            ]}
          />
          <div className="flex items-center justify-between mt-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-on-surface">
              Chi tiết Hồ sơ Học sinh
            </h1>
            <button
              type="button"
              onClick={() => router.push('/students')}
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
            <div className="w-20 h-20 rounded-2xl bg-primary-container text-on-primary font-bold text-2xl flex items-center justify-center shadow">
              {student.avatarInitials ||
                student.fullName
                  .split(' ')
                  .slice(-2)
                  .map((n) => n[0])
                  .join('')}
            </div>
            <div className="flex flex-col flex-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h2 className="text-xl sm:text-2xl font-bold text-on-surface">{student.fullName}</h2>
                <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-surface-container font-semibold text-secondary">
                  {student.studentCode}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                  {statusConfig.label}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-on-surface-variant mt-1">
                Lớp {student.className} • Khối {student.gradeLevel} • Năm học 2024-2025
              </p>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-outline">
                Thông tin cá nhân &amp; Nhân khẩu
              </h3>
              <div className="bg-surface-container-low rounded-xl p-4 flex flex-col gap-3 text-xs sm:text-sm">
                <div className="flex justify-between py-1 border-b border-outline-variant/10">
                  <span className="text-on-surface-variant">Ngày sinh:</span>
                  <span className="font-medium text-on-surface">{student.dateOfBirth}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-outline-variant/10">
                  <span className="text-on-surface-variant">Giới tính:</span>
                  <span className="font-medium text-on-surface">
                    {student.gender === 'male' ? 'Nam' : student.gender === 'female' ? 'Nữ' : 'Khác'}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-outline-variant/10">
                  <span className="text-on-surface-variant">Lớp học:</span>
                  <span className="font-medium text-on-surface">{student.className}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-on-surface-variant">Ghi chú:</span>
                  <span className="text-on-surface">{student.notes || 'Không có ghi chú đặc biệt'}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-outline">
                Thông tin gia đình &amp; Liên hệ
              </h3>
              <div className="bg-surface-container-low rounded-xl p-4 flex flex-col gap-3 text-xs sm:text-sm">
                <div className="flex justify-between py-1 border-b border-outline-variant/10">
                  <span className="text-on-surface-variant">Email phụ huynh:</span>
                  <span className="font-mono text-on-surface">{student.parentEmail}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-outline-variant/10">
                  <span className="text-on-surface-variant">SĐT liên hệ:</span>
                  <span className="font-mono font-medium text-secondary">{student.phone}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-outline-variant/10">
                  <span className="text-on-surface-variant">Xếp loại chuyên cần:</span>
                  <span className="font-semibold text-emerald-700">Tốt (98.5%)</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-on-surface-variant">Học lực kỳ I:</span>
                  <span className="font-semibold text-primary">Giỏi (8.7 ĐTB)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    
  );
}
