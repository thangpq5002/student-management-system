import React from 'react';
import { Student } from '../types';
import { STUDENT_STATUS_MAP } from '../constants';
import { Eye, Edit2, Trash2 } from 'lucide-react';

interface StudentTableProps {
  students: Student[];
  onView: (student: Student) => void;
  onEdit: (student: Student) => void;
  onDelete: (student: Student) => void;
  canManage?: boolean;
  isLoading?: boolean;
}

export const StudentTable: React.FC<StudentTableProps> = ({
  students,
  onView,
  onEdit,
  onDelete,
  canManage = true,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="bg-surface-container-lowest rounded-2xl p-8 flex flex-col items-center justify-center gap-3">
        <span className="material-symbols-outlined text-[32px] text-primary animate-spin">
          progress_activity
        </span>
        <p className="text-sm text-on-surface-variant font-medium">Đang tải danh sách học sinh...</p>
      </div>
    );
  }

  if (students.length === 0) {
    return (
      <div className="bg-surface-container-lowest rounded-2xl p-12 text-center flex flex-col items-center justify-center gap-3 border border-outline-variant/20">
        <div className="w-12 h-12 rounded-2xl bg-surface-container-low flex items-center justify-center text-outline">
          <span className="material-symbols-outlined text-[28px]">search_off</span>
        </div>
        <h3 className="text-base font-semibold text-on-surface">Không tìm thấy học sinh</h3>
        <p className="text-xs text-on-surface-variant max-w-sm">
          Không có hồ sơ học sinh nào phù hợp với bộ lọc tìm kiếm hiện tại. Vui lòng thử từ khóa khác hoặc đặt lại bộ lọc.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 overflow-hidden flex flex-col">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low text-outline uppercase text-[11px] font-semibold tracking-wider select-none h-11">
              <th className="py-3 px-4 text-center w-12">STT</th>
              <th className="py-3 px-4">Mã HS</th>
              <th className="py-3 px-4">Họ và tên</th>
              <th className="py-3 px-4">Ngày sinh</th>
              <th className="py-3 px-4">Giới tính</th>
              <th className="py-3 px-4">Lớp</th>
              <th className="py-3 px-4">Trạng thái</th>
              <th className="py-3 px-4 text-right pr-6">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/15 text-on-surface text-sm">
            {students.map((student, index) => {
              const statusInfo = STUDENT_STATUS_MAP[student.status] || STUDENT_STATUS_MAP.active;
              const indexStr = (index + 1).toString().padStart(2, '0');

              return (
                <tr
                  key={student.id}
                  className="hover:bg-surface-container-low/60 transition-colors group"
                >
                  {/* STT */}
                  <td className="py-3 px-4 text-center font-mono text-xs text-outline">
                    {indexStr}
                  </td>

                  {/* Mã HS */}
                  <td className="py-3 px-4 font-mono text-xs font-semibold text-primary">
                    {student.studentCode}
                  </td>

                  {/* Họ và tên + Email */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary-fixed text-primary flex items-center justify-center font-bold text-xs shrink-0">
                        {student.avatarInitials}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-semibold text-on-surface leading-tight group-hover:text-primary transition-colors truncate">
                          {student.fullName}
                        </span>
                        <span className="text-[11px] text-outline truncate">
                          {student.parentEmail}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Ngày sinh */}
                  <td className="py-3 px-4 font-mono text-xs text-on-surface-variant whitespace-nowrap">
                    {student.dateOfBirth}
                  </td>

                  {/* Giới tính */}
                  <td className="py-3 px-4 text-xs">
                    {student.gender === 'male' ? 'Nam' : student.gender === 'female' ? 'Nữ' : 'Khác'}
                  </td>

                  {/* Lớp */}
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-md bg-surface-container font-semibold text-xs text-primary">
                      {student.className}
                    </span>
                  </td>

                  {/* Trạng thái */}
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide ${statusInfo.badgeClass}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dotClass}`} />
                      {statusInfo.label}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right pr-6">
                    <div className="inline-flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => onView(student)}
                        className="p-1.5 rounded-lg text-outline hover:text-primary hover:bg-surface-container transition-colors cursor-pointer"
                        title="Xem chi tiết"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {canManage && (
                        <>
                          <button
                            type="button"
                            onClick={() => onEdit(student)}
                            className="p-1.5 rounded-lg text-outline hover:text-secondary hover:bg-surface-container transition-colors cursor-pointer"
                            title="Chỉnh sửa"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onDelete(student)}
                            className="p-1.5 rounded-lg text-outline hover:text-error hover:bg-error-container/30 transition-colors cursor-pointer"
                            title="Xóa học sinh"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
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
