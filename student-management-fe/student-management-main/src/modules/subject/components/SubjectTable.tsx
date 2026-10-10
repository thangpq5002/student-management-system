import React from 'react';
import { Subject } from '../types';
import { Eye, Edit2, BookOpen, Trash2 } from 'lucide-react';

interface SubjectTableProps {
  subjects: Subject[];
  onView: (subject: Subject) => void;
  onEdit: (subject: Subject) => void;
  onDelete: (subject: Subject) => void;
  canManage?: boolean;
  isLoading?: boolean;
}

export const SubjectTable: React.FC<SubjectTableProps> = ({
  subjects,
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
        <p className="text-sm text-on-surface-variant font-medium">Đang tải danh mục môn học...</p>
      </div>
    );
  }

  return (
    <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 overflow-hidden flex flex-col mb-6">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-surface-container-low h-10 text-outline text-[11px] font-semibold uppercase tracking-wider select-none">
              <th className="px-4 w-12 text-center">STT</th>
              <th className="px-4 w-28">Mã môn</th>
              <th className="px-4 min-w-[180px]">Tên môn học</th>
              <th className="px-4 min-w-[160px]">Tổ bộ môn</th>
              <th className="px-4 min-w-[140px] text-center">Tiết/Tuần (10/11/12)</th>
              <th className="px-4 min-w-[130px]">Hệ số tính điểm</th>
              <th className="px-4 min-w-[150px]">Hình thức ĐG</th>
              <th className="px-4 min-w-[180px]">Tổ trưởng phụ trách</th>
              <th className="px-4 min-w-[120px] text-center">Trạng thái</th>
              <th className="px-4 w-36 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody className="text-xs sm:text-sm text-on-surface divide-y divide-outline-variant/15">
            {subjects.map((sub, index) => {
              const indexStr = (index + 1).toString().padStart(2, '0');
              const isScore = sub.evaluationType === 'score';

              return (
                <tr
                  key={sub.id}
                  className="h-[52px] hover:bg-surface-container-low/60 transition-colors group"
                >
                  <td className="px-4 text-center font-mono text-xs text-outline">
                    {indexStr}
                  </td>

                  <td className="px-4 font-mono text-xs font-semibold text-primary">
                    {sub.subjectCode}
                  </td>

                  <td className="px-4 font-semibold text-on-surface">
                    {sub.name}
                  </td>

                  <td className="px-4 text-on-surface-variant font-medium">
                    {sub.department}
                  </td>

                  <td className="px-4 text-center">
                    <span className="inline-flex items-center px-2 py-0.5 rounded bg-surface-container font-mono text-xs font-medium text-on-surface">
                      {sub.weeklyPeriods}
                    </span>
                  </td>

                  <td className="px-4 font-medium text-on-surface-variant text-xs">
                    {sub.coefficient}
                  </td>

                  <td className="px-4">
                    {isScore ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-surface-container-high text-primary">
                        Cho điểm số
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-tertiary-fixed text-on-tertiary-fixed">
                        Đánh giá nhận xét
                      </span>
                    )}
                  </td>

                  <td className="px-4 font-medium text-on-surface">
                    {sub.headTeacher}
                  </td>

                  <td className="px-4 text-center">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-surface-container text-primary">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                      Đang giảng dạy
                    </span>
                  </td>

                  <td className="px-4 text-center">
                    <div className="inline-flex items-center justify-center gap-1">
                      <button
                        type="button"
                        onClick={() => onView(sub)}
                        className="w-8 h-8 rounded hover:bg-surface-container flex items-center justify-center text-outline hover:text-primary transition-colors cursor-pointer"
                        title="Xem chi tiết"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {canManage && <button
                        type="button"
                        onClick={() => onEdit(sub)}
                        className="w-8 h-8 rounded hover:bg-surface-container flex items-center justify-center text-outline hover:text-secondary transition-colors cursor-pointer"
                        title="Chỉnh sửa cấu hình"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>}
                      {canManage && <button
                        type="button"
                        onClick={() => onView(sub)}
                        className="w-8 h-8 rounded hover:bg-surface-container flex items-center justify-center text-outline hover:text-tertiary transition-colors cursor-pointer"
                        title="Phân công giảng dạy"
                      >
                        <BookOpen className="w-4 h-4" />
                      </button>}
                      {canManage && <button
                        type="button"
                        onClick={() => onDelete(sub)}
                        className="w-8 h-8 rounded hover:bg-error-container/40 flex items-center justify-center text-outline hover:text-error transition-colors cursor-pointer"
                        title="Xóa môn"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>}
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
