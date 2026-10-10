import React from 'react';
import { Teacher } from '../types';
import { X, Mail, Phone, BookOpen, GraduationCap, Award } from 'lucide-react';

interface TeacherDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  teacher: Teacher | null;
  onEditRequest?: (teacher: Teacher) => void;
}

export const TeacherDetailModal: React.FC<TeacherDetailModalProps> = ({
  isOpen,
  onClose,
  teacher,
  onEditRequest,
}) => {
  if (!isOpen || !teacher) return null;

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
              {teacher.avatarInitials}
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-on-surface">{teacher.fullName}</h3>
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-primary-fixed text-primary font-bold">
                  {teacher.teacherCode}
                </span>
              </div>
              <span className="text-xs text-secondary font-semibold">{teacher.titleRole}</span>
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
          {/* Status & Degree */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-surface-container-low rounded-xl flex flex-col gap-1">
              <span className="text-[11px] font-semibold text-outline uppercase flex items-center gap-1">
                <Award className="w-3.5 h-3.5" />
                Học vị / Trình độ
              </span>
              <span className="font-semibold text-on-surface">{teacher.degree || 'Cử nhân Sư phạm'}</span>
            </div>

            <div className="p-3 bg-surface-container-low rounded-xl flex flex-col gap-1">
              <span className="text-[11px] font-semibold text-outline uppercase flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5" />
                Tổ chuyên môn
              </span>
              <span className="font-semibold text-on-surface">{teacher.department}</span>
            </div>
          </div>

          <div className="p-3 bg-surface-container-low rounded-xl flex flex-col gap-1">
            <span className="text-[11px] font-semibold text-outline uppercase flex items-center gap-1">
              <GraduationCap className="w-3.5 h-3.5" />
              Phân công giảng dạy
            </span>
            <span className="font-medium text-on-surface">{teacher.subjectTaught}</span>
          </div>

          <div className="flex flex-col gap-2 p-3 bg-surface-container-low rounded-xl">
            <span className="text-[11px] font-semibold text-outline uppercase flex items-center gap-1">
              <Mail className="w-3.5 h-3.5" />
              Email công vụ
            </span>
            <span className="font-mono text-on-surface font-medium">{teacher.email}</span>
          </div>

          <div className="flex flex-col gap-2 p-3 bg-surface-container-low rounded-xl">
            <span className="text-[11px] font-semibold text-outline uppercase flex items-center gap-1">
              <Phone className="w-3.5 h-3.5" />
              Số điện thoại liên lạc
            </span>
            <span className="font-mono text-on-surface font-medium">{teacher.phone}</span>
          </div>

          {teacher.notes && (
            <div className="p-3 bg-surface-container-low rounded-xl flex flex-col gap-1">
              <span className="text-[11px] font-semibold text-outline uppercase">Ghi chú nhân sự</span>
              <p className="text-xs text-on-surface-variant leading-relaxed">{teacher.notes}</p>
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
                onEditRequest(teacher);
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
