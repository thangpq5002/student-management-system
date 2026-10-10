import React from 'react';
import { Teacher } from '../types';
import { Eye, Edit2, Trash2 } from 'lucide-react';

interface TeacherTableProps {
  teachers: Teacher[];
  onView: (teacher: Teacher) => void;
  onEdit: (teacher: Teacher) => void;
  onDelete: (teacher: Teacher) => void;
  isLoading?: boolean;
}

export const TeacherTable: React.FC<TeacherTableProps> = ({
  teachers,
  onView,
  onEdit,
  onDelete,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="bg-surface-container-lowest rounded-2xl p-8 flex flex-col items-center justify-center gap-3">
        <span className="material-symbols-outlined text-[32px] text-primary animate-spin">
          progress_activity
        </span>
        <p className="text-sm text-on-surface-variant font-medium">Đang tải danh sách giáo viên...</p>
      </div>
    );
  }

  if (teachers.length === 0) {
    return (
      <div className="bg-surface-container-lowest rounded-2xl p-12 text-center flex flex-col items-center justify-center gap-3 border border-outline-variant/20">
        <div className="w-12 h-12 rounded-2xl bg-surface-container-low flex items-center justify-center text-outline">
          <span className="material-symbols-outlined text-[28px]">person_off</span>
        </div>
        <h3 className="text-base font-semibold text-on-surface">Không tìm thấy giáo viên</h3>
        <p className="text-xs text-on-surface-variant max-w-sm">
          Không có thông tin giáo viên nào phù hợp với điều kiện tìm kiếm hiện tại.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 overflow-hidden flex flex-col">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low text-on-surface-variant text-[11px] font-semibold uppercase tracking-wider select-none h-11">
              <th className="py-3.5 pl-6 pr-3 text-center w-14">STT</th>
              <th className="py-3.5 px-3">Mã GV</th>
              <th className="py-3.5 px-4 min-w-[220px]">Họ và tên &amp; Chức vụ</th>
              <th className="py-3.5 px-4">Tổ chuyên môn</th>
              <th className="py-3.5 px-4">Môn giảng dạy</th>
              <th className="py-3.5 px-4">Email</th>
              <th className="py-3.5 px-4">Số điện thoại</th>
              <th className="py-3.5 px-4 text-center">Trạng thái</th>
              <th className="py-3.5 pl-3 pr-6 text-right w-28">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/15 text-sm text-on-surface">
            {teachers.map((teacher, index) => {
              const indexStr = (index + 1).toString().padStart(2, '0');
              const isLeave = teacher.status === 'leave';

              return (
                <tr
                  key={teacher.id}
                  className="hover:bg-surface-container-low/60 transition-colors group"
                >
                  <td className="py-3.5 pl-6 pr-3 text-center font-mono text-xs text-outline">
                    {indexStr}
                  </td>

                  <td className="py-3.5 px-3 font-mono text-xs font-semibold text-primary">
                    <span className="bg-primary-fixed/50 px-2 py-0.5 rounded">
                      {teacher.teacherCode}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                          isLeave
                            ? 'bg-error-container text-error'
                            : 'bg-primary-fixed text-primary'
                        }`}
                      >
                        {teacher.avatarInitials}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-semibold text-on-surface truncate group-hover:text-primary transition-colors">
                          {teacher.fullName}
                        </span>
                        <span className="text-[11px] text-secondary font-medium truncate">
                          {teacher.titleRole}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-xs text-on-surface-variant font-medium">
                    {teacher.department}
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-0.5 rounded-full bg-surface-container text-xs text-on-surface font-medium">
                      {teacher.subjectTaught}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 font-mono text-xs text-on-surface-variant">
                    {teacher.email}
                  </td>

                  <td className="py-3.5 px-4 font-mono text-xs text-on-surface">
                    {teacher.phone}
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    {isLeave ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-error-container text-error text-[11px] font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-error" />
                        Nghỉ thai sản
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed text-[11px] font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-tertiary-container" />
                        Đang công tác
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 pl-3 pr-6 text-right">
                    <div className="inline-flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => onView(teacher)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-outline hover:bg-surface-container hover:text-primary transition-colors cursor-pointer"
                        title="Xem chi tiết"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onEdit(teacher)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-outline hover:bg-surface-container hover:text-secondary transition-colors cursor-pointer"
                        title="Chỉnh sửa"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(teacher)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-outline hover:bg-error-container hover:text-error transition-colors cursor-pointer"
                        title="Xóa giáo viên"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
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
