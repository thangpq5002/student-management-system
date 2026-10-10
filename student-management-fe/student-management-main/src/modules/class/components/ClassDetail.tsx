import React, { useEffect, useState } from 'react';
import { SchoolClass } from '../types';
import { X, RefreshCw } from 'lucide-react';
import { teacherService } from '@/modules/teacher/services/teacher.service';
import { Teacher } from '@/modules/teacher/types';
import { ClassStudentEnrollment } from './ClassStudentEnrollment';

interface ClassDetailProps {
  isOpen: boolean;
  onClose: () => void;
  schoolClass: SchoolClass | null;
  onUpdateTeacher: (classId: string, teacher: SchoolClass['homeroomTeacher'] | null) => Promise<void>;
  onEnrolled: () => Promise<void>;
  canManageAssignments?: boolean;
 }

export const ClassDetail: React.FC<ClassDetailProps> = ({
  isOpen,
  onClose,
  schoolClass,
  onUpdateTeacher,
  onEnrolled,
  canManageAssignments = true,
 }) => {
  const [isChangingTeacher, setIsChangingTeacher] = useState(false);
  const [selectedTeacherId, setSelectedTeacherId] = useState('');
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isLoadingTeachers, setIsLoadingTeachers] = useState(false);

  useEffect(() => {
    if (!isOpen || !canManageAssignments) return;
    let active = true;
    setIsLoadingTeachers(true);
    teacherService.getTeachers()
      .then((items) => { if (active) setTeachers(items); })
      .catch(() => { if (active) setTeachers([]); })
      .finally(() => { if (active) setIsLoadingTeachers(false); });
    return () => { active = false; };
  }, [canManageAssignments, isOpen]);

  if (!isOpen || !schoolClass) return null;

  const handleTeacherChangeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const selectedTeacher = teachers.find((item) => item.id === selectedTeacherId);
    const teacher = selectedTeacher ? {
      id: selectedTeacher.id,
      fullName: selectedTeacher.fullName,
      department: selectedTeacher.department,
      email: selectedTeacher.email,
      experience: selectedTeacher.titleRole || '',
      avatarInitials: selectedTeacher.avatarInitials,
    } : null;
    await onUpdateTeacher(schoolClass.id, teacher);
    setIsChangingTeacher(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-inverse-surface/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <aside className="relative w-full max-w-lg bg-surface-container-lowest z-10 shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300 h-full border-l border-outline-variant/30">
        {/* Drawer Header */}
        <div className="p-6 bg-surface-container-low flex items-start justify-between border-b border-outline-variant/20">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-xs font-bold bg-primary-fixed text-primary">
                {schoolClass.classCode}
              </span>
              <h2 className="text-xl font-bold text-on-surface tracking-tight">
                Quản lý {schoolClass.className}
              </h2>
            </div>
            <p className="text-xs text-on-surface-variant mt-1">
              Phân công nhân sự &amp; ban cán sự niên khóa 2024 - 2025
            </p>
          </div>
          {canManageAssignments && <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>}
        </div>

        {/* Drawer Content Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          {/* Section A: Assigned Teacher */}
          <div className="bg-surface-container-low rounded-2xl p-4 flex flex-col gap-3 border border-outline-variant/20">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-outline tracking-wider uppercase">
                Giáo viên chủ nhiệm hiện tại
              </span>
              {canManageAssignments && <button
                type="button"
                onClick={() => {
                  setSelectedTeacherId(schoolClass.homeroomTeacher.id || '');
                  setIsChangingTeacher(!isChangingTeacher);
                }}
                className="text-xs font-semibold text-secondary hover:underline flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>{isChangingTeacher ? 'Hủy đổi' : 'Đổi GVCN'}</span>
              </button>}
            </div>

            {canManageAssignments && isChangingTeacher ? (
              <form onSubmit={handleTeacherChangeSubmit} className="flex gap-2">
                <select
                  value={selectedTeacherId}
                  onChange={(e) => setSelectedTeacherId(e.target.value)}
                  disabled={isLoadingTeachers}
                  className="flex-1 px-3 py-2 bg-surface-container-lowest text-xs rounded-xl outline-none border border-secondary"
                >
                  <option value="">Chưa phân công</option>
                  {teachers.map((teacher) => <option key={teacher.id} value={teacher.id}>{teacher.fullName} ({teacher.teacherCode})</option>)}
                </select>
                <button type="submit" disabled={isLoadingTeachers} className="px-3 py-2 bg-secondary text-on-secondary rounded-xl text-xs font-semibold disabled:opacity-50">
                  Lưu GV
                </button>
              </form>
            ) : (
              <div className="flex items-center gap-4 p-3 rounded-xl bg-surface-container-lowest shadow-sm">
                <div className="w-12 h-12 rounded-full bg-primary-fixed text-primary font-bold text-base flex items-center justify-center shrink-0">
                  {schoolClass.homeroomTeacher.avatarInitials}
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="font-semibold text-sm text-on-surface">
                    {schoolClass.homeroomTeacher.fullName}
                  </span>
                  <span className="text-xs text-on-surface-variant truncate">
                    {schoolClass.homeroomTeacher.department} • {schoolClass.homeroomTeacher.email}
                  </span>
                  <span className="text-[11px] text-secondary font-medium mt-0.5">
                    {schoolClass.homeroomTeacher.experience}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Section B: Class Leaders (Ban cán sự) */}
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-on-surface">Ban Cán Sự Lớp</span>
              <span className="text-xs text-on-surface-variant">Dữ liệu từ máy chủ</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {schoolClass.leaders.map((leader, i) => (
                <div
                  key={i}
                  className="p-3 bg-surface-container-low rounded-xl flex flex-col gap-0.5 text-center border border-outline-variant/15"
                >
                  <span className="text-[10px] font-bold text-outline uppercase tracking-wider">
                    {leader.title}
                  </span>
                  <span className="text-xs text-on-surface truncate font-semibold">
                    {leader.fullName}
                  </span>
                  <span className="text-[10px] font-mono text-secondary">
                    {leader.studentCode}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Section C: Students in Class */}
          <div className="flex flex-col gap-3">
            <ClassStudentEnrollment
              classId={schoolClass.id}
              className={schoolClass.className}
              canManage={canManageAssignments}
              onEnrolled={onEnrolled}
            />
            <div>
              <span className="text-sm font-bold text-on-surface">Danh sách học sinh ({schoolClass.currentStudents})</span>
              <span className="text-xs text-on-surface-variant block">Sĩ số tối đa: {schoolClass.maxStudents} học sinh</span>
            </div>
            <div className="flex flex-col divide-y divide-outline-variant/15 rounded-xl overflow-hidden bg-surface-container-lowest border border-outline-variant/20 shadow-sm">
              {schoolClass.students.length === 0 ? <p className="p-4 text-xs text-on-surface-variant">Chưa có học sinh trong danh sách chi tiết của lớp.</p> : schoolClass.students.map((st, idx) => (
                <div key={st.id || idx} className="p-3 flex items-center justify-between hover:bg-surface-container-low/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-surface-container text-on-surface-variant flex items-center justify-center text-xs font-semibold">{(idx + 1).toString().padStart(2, '0')}</div>
                    <div className="flex flex-col"><span className="text-xs sm:text-sm font-semibold text-on-surface">{st.fullName}</span><span className="text-[11px] text-on-surface-variant font-mono">Mã HS: {st.studentCode} • {st.dateOfBirth}</span></div>
                  </div>
                  {st.roleInClass && <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-tertiary-fixed text-tertiary">{st.roleInClass}</span>}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 px-6 bg-surface-container-low border-t border-outline-variant/20 flex items-center justify-end">
          <button type="button" onClick={onClose} className="px-5 py-2 rounded-xl bg-surface-container text-on-surface text-xs font-semibold hover:bg-surface-container-high transition-all">Đóng</button>
        </div>
      </aside>
    </div>
  );
};
