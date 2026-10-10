import React from 'react';
import { Teacher } from '../types';
import { AlertTriangle } from 'lucide-react';

interface DeleteTeacherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  teacher: Teacher | null;
  isDeleting?: boolean;
}

export const DeleteTeacherModal: React.FC<DeleteTeacherModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  teacher,
  isDeleting,
}) => {
  if (!isOpen || !teacher) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-inverse-surface/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md bg-surface-container-lowest rounded-2xl shadow-2xl p-6 flex flex-col gap-5 z-10 animate-in fade-in zoom-in-95 duration-150 border border-outline-variant/30">
        <div className="w-12 h-12 rounded-xl bg-error-container text-error flex items-center justify-center shrink-0">
          <AlertTriangle className="w-6 h-6" />
        </div>

        <div className="flex flex-col gap-1.5">
          <h3 className="text-lg font-bold text-on-surface">Xác nhận xóa giáo viên?</h3>
          <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
            Bạn sắp thực hiện xóa hồ sơ cán bộ giáo viên{' '}
            <span className="font-semibold text-on-surface">{teacher.fullName}</span> (Mã:{' '}
            <span className="font-mono text-xs text-error font-bold">{teacher.teacherCode}</span>).
            Lưu ý: Nếu giáo viên đang là GVCN hoặc phụ trách nhập điểm, phân công sẽ cần được chuyển giao trước.
          </p>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-surface-container text-on-surface text-xs font-semibold rounded-xl hover:bg-surface-container-high transition-colors cursor-pointer"
          >
            Hủy bỏ
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-6 py-2.5 bg-error text-on-error text-xs font-semibold rounded-xl hover:bg-error/90 shadow-md transition-all cursor-pointer disabled:opacity-50"
          >
            {isDeleting ? 'Đang xóa...' : 'Xác nhận xóa'}
          </button>
        </div>
      </div>
    </div>
  );
};
