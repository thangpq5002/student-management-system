'use client';

import React, { useEffect, useState } from 'react';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';
import { classService } from '@/modules/class/services/class.service';
import { SchoolClass } from '@/modules/class/types';
import { ClassStudentEnrollment } from './ClassStudentEnrollment';
import {
  ArrowLeft,
  Users,
  Building,
  GraduationCap,
  Calendar,
  CheckCircle,
  Award,
} from 'lucide-react';

export default function ClassDetailPage() {
  const router = useRouter();
  const routeParams = useParams<{ id: string }>();
  const classId = routeParams?.id;
  const { role } = useAuth();
  const [schoolClass, setSchoolClass] = useState<SchoolClass | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    if (!classId) {
      setSchoolClass(null);
      setIsLoading(false);
      return () => { active = false; };
    }
    setIsLoading(true);
    setError(null);
    classService.getClass(classId)
      .then((item) => { if (active) setSchoolClass(item); })
      .catch((loadError: unknown) => {
        if (active) {
          setSchoolClass(null);
          setError(loadError instanceof Error ? loadError.message : 'Không thể tải thông tin lớp học.');
        }
      })
      .finally(() => { if (active) setIsLoading(false); });
    return () => { active = false; };
  }, [classId]);

  const refreshClass = async () => {
    if (!classId) return;
    const updated = await classService.getClass(classId);
    if (!updated) throw new Error('Không tìm thấy thông tin lớp học sau khi cập nhật.');
    setSchoolClass(updated);
  };

  if (isLoading) {
    return <div className="p-8 text-center text-on-surface-variant">Đang tải chi tiết lớp học...</div>;
  }

  if (!schoolClass) {
    return (
      <div role={error ? 'alert' : undefined} className="p-8 text-center text-on-surface-variant">
        {error || 'Không tìm thấy thông tin lớp học.'}
      </div>
    );
  }

  return (
      <div className="flex flex-col gap-6 max-w-5xl mx-auto">
        {/* Breadcrumb & Navigation */}
        <div className="flex flex-col gap-1">
          <Breadcrumb
            items={[
              { label: 'Lớp học', href: '/classes' },
              { label: `Lớp ${schoolClass.className}`, isCurrent: true },
            ]}
          />
          <div className="flex items-center justify-between mt-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-on-surface">
              Chi tiết Lớp học {schoolClass.className}
            </h1>
            <button
              type="button"
              onClick={() => router.push('/classes')}
              className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-on-surface-variant hover:text-on-surface px-3 py-2 rounded-xl bg-surface-container"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Quay lại danh sách</span>
            </button>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/20 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-outline uppercase tracking-wider">
                Sĩ số học sinh
              </span>
              <p className="text-2xl font-bold font-mono text-on-surface mt-1">
                {schoolClass.currentStudents} / {schoolClass.maxStudents}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-primary">
              <Users className="w-5 h-5" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/20 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-outline uppercase tracking-wider">
                Phòng học cố định
              </span>
              <p className="text-2xl font-bold font-mono text-on-surface mt-1">
                {schoolClass.room}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-secondary">
              <Building className="w-5 h-5" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/20 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-outline uppercase tracking-wider">
                Giáo viên chủ nhiệm
              </span>
              <p className="text-sm font-bold text-on-surface mt-1">
                {schoolClass.homeroomTeacher?.fullName}
              </p>
              <span className="text-xs text-on-surface-variant font-mono">
                {schoolClass.homeroomTeacher?.email}
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-secondary-fixed flex items-center justify-center text-secondary">
              <GraduationCap className="w-5 h-5" />
            </div>
          </div>
        </div>

        {role === 'admin' && (
          <ClassStudentEnrollment
            classId={schoolClass.id}
            className={schoolClass.className}
            canManage
            onEnrolled={refreshClass}
          />
        )}

        {/* Student Roster Table */}
        <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 overflow-hidden">
          <div className="p-5 border-b border-outline-variant/15 flex items-center justify-between">
            <h2 className="font-bold text-base text-on-surface">
              Danh sách học sinh lớp {schoolClass.className} ({schoolClass.students.length} em)
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-surface-container-low text-on-surface-variant text-[11px] uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-5">STT</th>
                  <th className="py-3 px-4">Mã HS</th>
                  <th className="py-3 px-4">Họ và tên</th>
                  <th className="py-3 px-4">Ngày sinh</th>
                  <th className="py-3 px-5 text-right">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/15">
                {schoolClass.students.map((st, idx) => (
                  <tr key={st.id} className="hover:bg-surface-container-low/60 transition-colors">
                    <td className="py-3 px-5 text-outline font-mono">{idx + 1}</td>
                    <td className="py-3 px-4 font-mono font-semibold text-secondary">{st.studentCode}</td>
                    <td className="py-3 px-4 font-bold text-on-surface">{st.fullName}</td>
                    <td className="py-3 px-4 text-on-surface-variant">{st.dateOfBirth}</td>
                    <td className="py-3 px-5 text-right">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                        {st.roleInClass || 'Học sinh'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
  );
}
