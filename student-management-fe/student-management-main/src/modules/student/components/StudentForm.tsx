import React, { useState, useEffect } from 'react';
import { Student, StudentFormData } from '../types';
import { GRADE_LEVELS } from '../constants';
import { useClassOptions } from '@/modules/class/hooks/useClassOptions';
import { X, Save } from 'lucide-react';

interface StudentFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: StudentFormData) => Promise<void>;
  initialData?: Student | null;
}

export const StudentForm: React.FC<StudentFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) => {
  const [formData, setFormData] = useState<StudentFormData>({
    fullName: '',
    dateOfBirth: '2007-05-14',
    gender: 'male',
    gradeLevel: 10,
    className: '',
    parentEmail: '',
    phone: '',
    notes: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { classes, isLoading: isLoadingClasses, error: classLoadError } = useClassOptions();
  const availableClasses = classes.filter((item) => item.gradeLevel === Number(formData.gradeLevel));

  useEffect(() => {
    setSubmitError(null);
    if (initialData) {
      setFormData({
        fullName: initialData.fullName,
        dateOfBirth: initialData.dateOfBirth.includes('/')
          ? initialData.dateOfBirth.split('/').reverse().join('-')
          : initialData.dateOfBirth,
        gender: initialData.gender,
        gradeLevel: initialData.gradeLevel,
        className: initialData.className,
        parentEmail: initialData.parentEmail,
        phone: initialData.phone,
        notes: initialData.notes || '',
      });
    } else {
      setFormData({
        fullName: '',
        dateOfBirth: '2008-01-15',
        gender: 'male',
        gradeLevel: 10,
        className: '',
        parentEmail: '',
        phone: '',
        notes: '',
      });
    }
  }, [initialData, isOpen]);

  useEffect(() => {
    if (!isOpen || initialData || isLoadingClasses || availableClasses.length === 0) return;
    if (!availableClasses.some((item) => item.name === formData.className)) {
      setFormData((current) => ({ ...current, className: availableClasses[0].name }));
    }
  }, [availableClasses, formData.className, initialData, isLoadingClasses, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Không thể lưu hồ sơ học sinh.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-inverse-surface/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative w-full max-w-lg bg-surface-container-lowest shadow-2xl z-10 flex flex-col justify-between animate-in slide-in-from-right duration-300 h-full border-l border-outline-variant/30">
        <div className="flex flex-col h-full overflow-y-auto">
          {/* Drawer Header */}
          <div className="p-6 pb-5 flex items-center justify-between bg-surface-container-low border-b border-outline-variant/20">
            <div className="flex flex-col">
              <h2 className="text-lg font-bold text-primary">
                {initialData ? 'Chỉnh Sửa Hồ Sơ Học Sinh' : 'Thêm Học Sinh Mới'}
              </h2>
              <span className="text-xs text-on-surface-variant">
                {initialData
                  ? `Mã hồ sơ: ${initialData.studentCode} • Cập nhật dữ liệu`
                  : 'Nhập thông tin hồ sơ cơ bản của học sinh để lập mã số.'}
              </span>
            </div>
            <button
              onClick={onClose}
              type="button"
              className="p-2 rounded-xl text-outline hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form Body */}
          <form id="student-drawer-form" onSubmit={handleSubmit} className="p-6 flex flex-col gap-4 flex-1">
            {/* Full Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-on-surface">
                Họ và tên học sinh <span className="text-error">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="Ví dụ: Hoàng Tuấn Kiệt"
                className="w-full px-3.5 py-2.5 bg-surface-container-low rounded-xl outline-none text-sm text-on-surface placeholder:text-outline focus:bg-surface-container-lowest focus:ring-2 focus:ring-secondary/20 transition-all border border-transparent focus:border-secondary"
              />
            </div>

            {/* Birthday & Gender */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-on-surface">
                  Ngày sinh <span className="text-error">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-surface-container-low rounded-xl outline-none text-sm text-on-surface focus:bg-surface-container-lowest focus:ring-2 focus:ring-secondary/20 transition-all border border-transparent focus:border-secondary"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-on-surface">
                  Giới tính <span className="text-error">*</span>
                </label>
                <div className="relative">
                  <select
                    value={formData.gender}
                    onChange={(e) =>
                      setFormData({ ...formData, gender: e.target.value as StudentFormData['gender'] })
                    }
                    className="w-full appearance-none px-3.5 py-2.5 bg-surface-container-low rounded-xl outline-none text-sm text-on-surface focus:bg-surface-container-lowest focus:ring-2 focus:ring-secondary/20 transition-all cursor-pointer border border-transparent focus:border-secondary"
                  >
                    <option value="male">Nam</option>
                    <option value="female">Nữ</option>
                    <option value="other">Khác</option>
                  </select>
                  <span className="material-symbols-outlined pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-outline text-[18px]">
                    keyboard_arrow_down
                  </span>
                </div>
              </div>
            </div>

            {/* Grade level & Class */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-on-surface">
                  Khối lớp <span className="text-error">*</span>
                </label>
                <div className="relative">
                  <select
                    value={formData.gradeLevel}
                    onChange={(e) => {
                      const gradeLevel = Number(e.target.value);
                      const gradeClasses = classes.filter((item) => item.gradeLevel === gradeLevel);
                      setFormData({
                        ...formData,
                        gradeLevel,
                        className: gradeClasses.some((item) => item.name === formData.className)
                          ? formData.className
                          : gradeClasses[0]?.name || '',
                      });
                    }}
                    className="w-full appearance-none px-3.5 py-2.5 bg-surface-container-low rounded-xl outline-none text-sm text-on-surface focus:bg-surface-container-lowest focus:ring-2 focus:ring-secondary/20 transition-all cursor-pointer border border-transparent focus:border-secondary"
                  >
                    {GRADE_LEVELS.map((g) => (
                      <option key={g.value} value={g.value}>
                        {g.label}
                      </option>
                    ))}
                  </select>
                  <span className="material-symbols-outlined pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-outline text-[18px]">
                    keyboard_arrow_down
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-on-surface">Lớp học phân bổ</label>
                <div className="relative">
                  <select
                    required
                    value={formData.className}
                    onChange={(e) => setFormData({ ...formData, className: e.target.value })}
                    disabled={isLoadingClasses || availableClasses.length === 0}
                    className="w-full appearance-none px-3.5 py-2.5 bg-surface-container-low rounded-xl outline-none text-sm text-on-surface focus:bg-surface-container-lowest focus:ring-2 focus:ring-secondary/20 transition-all cursor-pointer border border-transparent focus:border-secondary"
                  >
                    <option value="" disabled>
                      {isLoadingClasses ? 'Đang tải danh sách lớp...' : 'Chọn lớp học'}
                    </option>
                    {availableClasses.map((item) => (
                      <option key={item.id} value={item.name}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                  <span className="material-symbols-outlined pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-outline text-[18px]">
                    keyboard_arrow_down
                  </span>
                </div>
                {classLoadError && <p role="alert" className="mt-1 text-xs text-error">{classLoadError}</p>}
                {!isLoadingClasses && !classLoadError && availableClasses.length === 0 && (
                  <p className="mt-1 text-xs text-error">Không có lớp trong khối này trên hệ thống.</p>
                )}
              </div>
            </div>

            {/* Parent Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-on-surface">
                Địa chỉ Email phụ huynh / liên hệ
              </label>
              <input
                type="email"
                value={formData.parentEmail}
                onChange={(e) => setFormData({ ...formData, parentEmail: e.target.value })}
                placeholder="phuhuynh@example.com"
                className="w-full px-3.5 py-2.5 bg-surface-container-low rounded-xl outline-none text-sm text-on-surface placeholder:text-outline focus:bg-surface-container-lowest focus:ring-2 focus:ring-secondary/20 transition-all border border-transparent focus:border-secondary"
              />
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-on-surface">Số điện thoại liên lạc</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="0912 345 678"
                className="w-full px-3.5 py-2.5 bg-surface-container-low rounded-xl outline-none text-sm text-on-surface placeholder:text-outline focus:bg-surface-container-lowest focus:ring-2 focus:ring-secondary/20 transition-all border border-transparent focus:border-secondary"
              />
            </div>

            {/* Notes */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-on-surface">
                Ghi chú tình trạng nhập học
              </label>
              <textarea
                rows={3}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Nhập ghi chú hạnh kiểm hoặc giấy tờ bổ sung..."
                className="w-full px-3.5 py-2.5 bg-surface-container-low rounded-xl outline-none text-sm text-on-surface placeholder:text-outline focus:bg-surface-container-lowest focus:ring-2 focus:ring-secondary/20 transition-all resize-none border border-transparent focus:border-secondary"
              />
            </div>
          </form>

          {/* Drawer Actions Footer */}
          <div className="p-4 px-6 bg-surface-container-low border-t border-outline-variant/20 flex items-center justify-end gap-3">
            {submitError && <p role="alert" className="mr-auto text-xs text-error">{submitError}</p>}
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-surface-container text-on-surface text-xs font-semibold rounded-xl hover:bg-surface-container-high transition-colors cursor-pointer"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              form="student-drawer-form"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-primary text-on-primary text-xs font-semibold rounded-xl hover:bg-primary-container shadow-md transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSubmitting ? 'Đang lưu...' : 'Lưu hồ sơ'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
