import React, { useState, useEffect } from 'react';
import { Subject, SubjectFormData, EvaluationType } from '../types';
import { X, Check, BookPlus } from 'lucide-react';

interface SubjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: SubjectFormData) => Promise<void>;
  initialData?: Subject | null;
}

export const SubjectModal: React.FC<SubjectModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) => {
  const [formData, setFormData] = useState<SubjectFormData>({
    subjectCode: '',
    name: '',
    department: 'toan-tin',
    evaluationType: 'score',
    grade10Periods: 2,
    grade11Periods: 2,
    grade12Periods: 2,
    description: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        subjectCode: initialData.subjectCode,
        name: initialData.name,
        department: initialData.department,
        evaluationType: initialData.evaluationType,
        grade10Periods: initialData.periodsByGrade.grade10,
        grade11Periods: initialData.periodsByGrade.grade11,
        grade12Periods: initialData.periodsByGrade.grade12,
        description: initialData.description || '',
      });
    } else {
      setFormData({
        subjectCode: '',
        name: '',
        department: 'Tổ Toán - Tin học',
        evaluationType: 'score',
        grade10Periods: 2,
        grade11Periods: 2,
        grade12Periods: 2,
        description: '',
      });
    }
  }, [initialData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-inverse-surface/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-surface-container-lowest rounded-2xl shadow-xl overflow-hidden z-10 flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200 border border-outline-variant/30">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-surface-container-low flex items-center justify-between border-b border-outline-variant/20">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <BookPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-on-surface">
                {initialData ? 'Cấu hình Môn học' : 'Thêm Môn học mới'}
              </h2>
              <p className="text-xs text-on-surface-variant">
                Khai báo cấu hình và định mức tiết giảng dạy chuẩn GDPT 2018
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-outline hover:bg-surface-container transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body (Form Fields) */}
        <form onSubmit={handleSubmit} id="subject-modal-form" className="p-6 overflow-y-auto flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Mã môn học */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-on-surface">
                Mã môn học <span className="text-error font-bold">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.subjectCode}
                onChange={(e) => setFormData({ ...formData, subjectCode: e.target.value })}
                placeholder="VD: MH-LICH-SU"
                className="h-11 px-3 rounded-xl bg-surface-container-low text-on-surface font-mono text-xs uppercase focus:outline-none focus:bg-surface-container-lowest transition-all border border-transparent focus:border-secondary"
              />
            </div>

            {/* Tên môn học */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-on-surface">
                Tên môn học <span className="text-error font-bold">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="VD: Lịch sử &amp; Địa lý"
                className="h-11 px-3 rounded-xl bg-surface-container-low text-on-surface text-xs sm:text-sm focus:outline-none focus:bg-surface-container-lowest transition-all border border-transparent focus:border-secondary"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Tổ chuyên môn phụ trách */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-on-surface">
                Tổ chuyên môn phụ trách <span className="text-error font-bold">*</span>
              </label>
              <select
                required
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="h-11 px-3 rounded-xl bg-surface-container-low text-on-surface text-xs sm:text-sm focus:outline-none focus:bg-surface-container-lowest transition-all cursor-pointer border border-transparent focus:border-secondary"
              >
                <option value="Tổ Toán - Tin học">Tổ Toán - Tin học</option>
                <option value="Tổ Ngữ Văn">Tổ Ngữ Văn</option>
                <option value="Tổ Ngoại ngữ">Tổ Ngoại ngữ</option>
                <option value="Tổ KHTN">Tổ Khoa học Tự nhiên</option>
                <option value="Tổ KHXH">Tổ Khoa học Xã hội</option>
                <option value="Tổ GDTC - QP">Tổ GDTC - Nghệ thuật</option>
              </select>
            </div>

            {/* Hình thức tính điểm */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-on-surface">
                Hình thức tính điểm <span className="text-error font-bold">*</span>
              </label>
              <select
                required
                value={formData.evaluationType}
                onChange={(e) =>
                  setFormData({ ...formData, evaluationType: e.target.value as EvaluationType })
                }
                className="h-11 px-3 rounded-xl bg-surface-container-low text-on-surface text-xs sm:text-sm focus:outline-none focus:bg-surface-container-lowest transition-all cursor-pointer border border-transparent focus:border-secondary"
              >
                <option value="score">Tính điểm số (Thang điểm 10)</option>
                <option value="evaluation">Đánh giá nhận xét (Đạt / Chưa đạt)</option>
              </select>
            </div>
          </div>

          {/* Định mức số tiết theo từng khối */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-on-surface">
              Định mức phân bổ số tiết / tuần theo khối học
            </label>
            <div className="grid grid-cols-3 gap-3 bg-surface-container-low p-3 rounded-2xl border border-outline-variant/15">
              <div className="flex flex-col gap-1">
                <span className="text-[11px] font-semibold text-on-surface-variant text-center">
                  Khối 10
                </span>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={formData.grade10Periods}
                    onChange={(e) =>
                      setFormData({ ...formData, grade10Periods: parseFloat(e.target.value) || 0 })
                    }
                    className="h-10 w-full text-center rounded-xl bg-surface-container-lowest font-semibold text-xs sm:text-sm text-on-surface focus:outline-none"
                  />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-outline hidden sm:inline">
                    tiết
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-[11px] font-semibold text-on-surface-variant text-center">
                  Khối 11
                </span>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={formData.grade11Periods}
                    onChange={(e) =>
                      setFormData({ ...formData, grade11Periods: parseFloat(e.target.value) || 0 })
                    }
                    className="h-10 w-full text-center rounded-xl bg-surface-container-lowest font-semibold text-xs sm:text-sm text-on-surface focus:outline-none"
                  />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-outline hidden sm:inline">
                    tiết
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-[11px] font-semibold text-on-surface-variant text-center">
                  Khối 12
                </span>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={formData.grade12Periods}
                    onChange={(e) =>
                      setFormData({ ...formData, grade12Periods: parseFloat(e.target.value) || 0 })
                    }
                    className="h-10 w-full text-center rounded-xl bg-surface-container-lowest font-semibold text-xs sm:text-sm text-on-surface focus:outline-none"
                  />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-outline hidden sm:inline">
                    tiết
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Mô tả & Mục tiêu chương trình học */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-on-surface">
              Mô tả &amp; Mục tiêu chương trình học
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Mục tiêu môn học, yêu cầu cần đạt theo chuẩn chương trình GDPT 2018..."
              className="p-3 rounded-xl bg-surface-container-low text-on-surface text-xs sm:text-sm focus:outline-none focus:bg-surface-container-lowest transition-all resize-none border border-transparent focus:border-secondary"
            />
          </div>
        </form>

        {/* Modal Actions Footer */}
        <div className="p-4 px-6 bg-surface-container-low border-t border-outline-variant/20 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="h-10 px-5 rounded-xl bg-surface-container text-on-surface-variant hover:text-on-surface text-xs font-semibold transition-colors cursor-pointer"
          >
            Hủy bỏ
          </button>
          <button
            type="submit"
            form="subject-modal-form"
            disabled={isSubmitting}
            className="h-10 px-6 rounded-xl bg-primary-container text-on-primary hover:bg-primary text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Check className="w-4 h-4" />
            <span>{isSubmitting ? 'Đang lưu...' : 'Lưu môn học'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
