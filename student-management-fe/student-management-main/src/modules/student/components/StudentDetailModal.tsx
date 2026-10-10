import React from 'react';
import { Student } from '../types';
import { STUDENT_STATUS_MAP } from '../constants';
import { X, User, Calendar, Phone, Mail, School, Shield } from 'lucide-react';

interface StudentDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
  onEditRequest?: (student: Student) => void;
}

export const StudentDetailModal: React.FC<StudentDetailModalProps> = ({
  isOpen,
  onClose,
  student,
  onEditRequest,
}) => {
  if (!isOpen || !student) return null;

  const statusInfo = STUDENT_STATUS_MAP[student.status] || STUDENT_STATUS_MAP.active;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-inverse-surface/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-lg bg-surface-container-lowest rounded-2xl shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150 border border-outline-variant/30 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 bg-surface-container-low border-b border-outline-variant/20 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-primary text-on-primary font-bold text-base flex items-center justify-center shadow-sm">
              {student.avatarInitials}
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-on-surface">{student.fullName}</h3>
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-primary-fixed text-primary font-bold">
                  {student.studentCode}
                </span>
              </div>
              <span className="text-xs text-on-surface-variant">Lớp {student.className} • Khối {student.gradeLevel}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex flex-col gap-4 text-xs sm:text-sm">
          {/* Status Badge */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low">
            <span className="text-on-surface-variant font-medium">Trạng thái đào tạo:</span>
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${statusInfo.badgeClass}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dotClass}`} />
              {statusInfo.label}
            </span>
          </div>

          {/* Key Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-surface-container-low rounded-xl flex flex-col gap-1">
              <span className="text-[11px] font-semibold text-outline uppercase flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                Ngày sinh
              </span>
              <span className="font-mono font-medium text-on-surface">{student.dateOfBirth}</span>
            </div>

            <div className="p-3 bg-surface-container-low rounded-xl flex flex-col gap-1">
              <span className="text-[11px] font-semibold text-outline uppercase flex items-center gap-1">
                <User className="w-3.5 h-3.5" />
                Giới tính
              </span>
              <span className="font-medium text-on-surface">
                {student.gender === 'male' ? 'Nam' : student.gender === 'female' ? 'Nữ' : 'Khác'}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2 p-3 bg-surface-container-low rounded-xl">
            <span className="text-[11px] font-semibold text-outline uppercase flex items-center gap-1">
              <Mail className="w-3.5 h-3.5" />
              Email phụ huynh / liên hệ
            </span>
            <span className="font-medium text-on-surface">{student.parentEmail || 'Chưa cập nhật'}</span>
          </div>

          <div className="flex flex-col gap-2 p-3 bg-surface-container-low rounded-xl">
            <span className="text-[11px] font-semibold text-outline uppercase flex items-center gap-1">
              <Phone className="w-3.5 h-3.5" />
              Số điện thoại gia đình
            </span>
            <span className="font-mono font-medium text-on-surface">{student.phone || 'Chưa cập nhật'}</span>
          </div>

          {student.notes && (
            <div className="flex flex-col gap-1.5 p-3 bg-surface-container-low rounded-xl">
              <span className="text-[11px] font-semibold text-outline uppercase">Ghi chú học bạ</span>
              <p className="text-xs text-on-surface-variant leading-relaxed">{student.notes}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 px-6 bg-surface-container-low border-t border-outline-variant/20 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-surface-container text-on-surface text-xs font-semibold rounded-xl hover:bg-surface-container-high transition-colors cursor-pointer"
          >
            Đóng
          </button>
          {onEditRequest && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onEditRequest(student);
              }}
              className="px-5 py-2 bg-primary text-on-primary text-xs font-semibold rounded-xl hover:bg-primary-container shadow transition-all cursor-pointer"
            >
              Chỉnh sửa hồ sơ
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
