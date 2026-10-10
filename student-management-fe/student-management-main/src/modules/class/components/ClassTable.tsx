import React from 'react';
import { SchoolClass } from '../types';
import { Eye, UserPlus, Users, Trash2, MapPin } from 'lucide-react';

interface ClassTableProps {
  classes: SchoolClass[];
  onOpenManage: (cls: SchoolClass) => void;
  onDeleteClass?: (cls: SchoolClass) => void;
  canManageAssignments?: boolean;
  isLoading?: boolean;
}

export const ClassTable: React.FC<ClassTableProps> = ({
  classes,
  onOpenManage,
  onDeleteClass,
  canManageAssignments = true,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="bg-surface-container-lowest rounded-2xl p-8 flex flex-col items-center justify-center gap-3">
        <span className="material-symbols-outlined text-[32px] text-primary animate-spin">
          progress_activity
        </span>
        <p className="text-sm text-on-surface-variant font-medium">Đang tải danh sách lớp học...</p>
      </div>
    );
  }

  return (
    <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 overflow-hidden flex flex-col">
      <div className="overflow-x-auto w-full">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low text-on-surface-variant text-[11px] font-semibold uppercase tracking-wider h-11 select-none">
              <th className="px-4 text-center w-12 font-semibold">STT</th>
              <th className="px-4 font-semibold">MÃ LỚP</th>
              <th className="px-4 font-semibold">TÊN LỚP</th>
              <th className="px-4 font-semibold">KHỐI</th>
              <th className="px-4 font-semibold min-w-[200px]">GIÁO VIÊN CHỦ NHIỆM</th>
              <th className="px-4 font-semibold">PHÒNG HỌC</th>
              <th className="px-4 font-semibold">TỔ HỢP / BAN</th>
              <th className="px-4 font-semibold text-right">SĨ SỐ</th>
              <th className="px-4 font-semibold text-center">TRẠNG THÁI</th>
              <th className="px-4 font-semibold text-center w-36">THAO TÁC</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/15 text-sm text-on-surface">
            {classes.map((cls, index) => {
              const indexStr = (index + 1).toString().padStart(2, '0');
              const percent = ((cls.currentStudents / cls.maxStudents) * 100).toFixed(1);
              const isFull = cls.currentStudents >= cls.maxStudents;

              return (
                <tr
                  key={cls.id}
                  className="hover:bg-surface-container-low/60 transition-colors group"
                >
                  <td className="px-4 py-3.5 text-center text-outline font-medium text-xs font-mono">
                    {indexStr}
                  </td>

                  <td className="px-4 py-3.5 font-mono text-xs font-semibold text-primary">
                    {cls.classCode}
                  </td>

                  <td className="px-4 py-3.5 font-semibold text-on-surface">
                    {cls.className}
                  </td>

                  <td className="px-4 py-3.5">
                    <span className="px-2 py-0.5 rounded bg-surface-container text-on-surface-variant text-xs font-medium">
                      Khối {cls.gradeLevel}
                    </span>
                  </td>

                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-primary-fixed text-primary font-bold text-xs flex items-center justify-center shrink-0">
                        {cls.homeroomTeacher.avatarInitials || 'GV'}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-semibold text-on-surface leading-tight truncate">
                          {cls.homeroomTeacher.fullName || 'Chưa phân công'}
                        </span>
                        <span className="text-[11px] text-on-surface-variant truncate">
                          {cls.homeroomTeacher.department || '—'}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3.5">
                    <div className="inline-flex items-center gap-1.5 text-on-surface-variant text-xs">
                      <MapPin className="w-3.5 h-3.5 text-outline" />
                      <span>{cls.room}</span>
                    </div>
                  </td>

                  <td className="px-4 py-3.5">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-tertiary-fixed text-tertiary">
                      {cls.stream}
                    </span>
                  </td>

                  <td className="px-4 py-3.5 text-right font-medium">
                    <div className="flex flex-col items-end">
                      <span className={isFull ? 'text-secondary font-bold' : ''}>
                        {cls.currentStudents} / {cls.maxStudents}
                      </span>
                      <span
                        className={`text-[11px] font-semibold ${
                          isFull ? 'text-secondary' : 'text-outline'
                        }`}
                      >
                        {percent}% {isFull && '(Đầy)'}
                      </span>
                    </div>
                  </td>

                  <td className="px-4 py-3.5 text-center">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-surface-container-high text-primary">
                      {cls.status === 'active' ? 'Đang hoạt động' : 'Đã lưu trữ'}
                    </span>
                  </td>

                  <td className="px-4 py-3.5 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        type="button"
                        onClick={() => onOpenManage(cls)}
                        className="p-1.5 rounded hover:bg-surface-container text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                        title="Xem chi tiết"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {canManageAssignments && <button
                        type="button"
                        onClick={() => onOpenManage(cls)}
                        className="p-1.5 rounded hover:bg-surface-container text-on-surface-variant hover:text-secondary transition-colors cursor-pointer"
                        title={`Thêm học sinh vào lớp ${cls.className}`}
                        aria-label={`Thêm học sinh vào lớp ${cls.className}`}
                      >
                        <UserPlus className="w-4 h-4" />
                      </button>}
                      <button
                        type="button"
                        onClick={() => onOpenManage(cls)}
                        className="p-1.5 rounded hover:bg-surface-container text-on-surface-variant hover:text-tertiary transition-colors cursor-pointer"
                        title="Danh sách học sinh"
                      >
                        <Users className="w-4 h-4" />
                      </button>
                      {onDeleteClass && (
                        <button
                          type="button"
                          onClick={() => onDeleteClass(cls)}
                          className="p-1.5 rounded hover:bg-error-container text-on-surface-variant hover:text-error transition-colors cursor-pointer"
                          title="Xóa lớp"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
