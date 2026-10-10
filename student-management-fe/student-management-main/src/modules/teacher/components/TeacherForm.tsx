import React, { useState, useEffect } from 'react';
import { Teacher, TeacherFormData } from '../types';
import { X, Save, UserPlus } from 'lucide-react';

interface TeacherFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TeacherFormData) => Promise<void>;
  initialData?: Teacher | null;
}

export const TeacherForm: React.FC<TeacherFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) => {
  const [formData, setFormData] = useState<TeacherFormData>({
    fullName: '',
    gender: 'male',
    dateOfBirth: '1985-06-20',
    phone: '',
    email: '',
    department: 'Toán - Tin học',
    degree: 'Cử nhân Sư phạm',
    titleRole: 'Giáo viên bộ môn',
    subjectTaught: 'Toán học',
    notes: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        fullName: initialData.fullName,
        gender: 'male',
        dateOfBirth: '1985-06-20',
        phone: initialData.phone,
        email: initialData.email,
        department: initialData.department,
        degree: initialData.degree || 'Cử nhân Sư phạm',
        titleRole: initialData.titleRole,
        subjectTaught: initialData.subjectTaught,
        notes: initialData.notes || '',
      });
    } else {
      setFormData({
        fullName: '',
        gender: 'male',
        dateOfBirth: '1988-03-15',
        phone: '',
        email: '',
        department: 'Toán - Tin học',
        degree: 'Cử nhân Sư phạm',
        titleRole: 'Giáo viên bộ môn',
        subjectTaught: 'Toán học',
        notes: '',
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
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-inverse-surface/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative w-full max-w-xl bg-surface-container-lowest shadow-2xl z-10 flex flex-col justify-between animate-in slide-in-from-right duration-300 h-full border-l border-outline-variant/30">
        <div className="flex flex-col h-full overflow-y-auto">
          {/* Drawer Header */}
          <div className="h-16 px-6 bg-surface-container-low flex items-center justify-between border-b border-outline-variant/20">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-primary-container text-on-primary flex items-center justify-center">
                <UserPlus className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-on-surface">
                  {initialData ? 'Chỉnh Sửa Hồ Sơ Giáo Viên' : 'Hồ sơ Giáo viên - Thêm mới'}
                </h2>
                <p className="text-[11px] text-on-surface-variant">
                  {initialData
                    ? `Mã: ${initialData.teacherCode} • Cập nhật thông tin công tác`
                    : 'Nhập thông tin nhân sự sư phạm vào hệ thống EduManage'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-xl text-on-surface-variant hover:bg-surface-container-high flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Form Body */}
          <form
            id="teacher-drawer-form"
            onSubmit={handleSubmit}
            className="p-6 overflow-y-auto flex-1 space-y-4"
          >
            {/* Mã GV & Họ tên */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1">
                  Mã giáo viên <span className="text-error">*</span>
                </label>
                <input
                  type="text"
                  readOnly
                  value={initialData?.teacherCode || 'GV-1009'}
                  className="w-full h-11 px-3.5 bg-surface-container text-primary font-mono text-xs font-semibold rounded-xl outline-none cursor-not-allowed border border-outline-variant/30"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-on-surface mb-1">
                  Họ và tên giáo viên <span className="text-error">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="VD: Nguyễn Thị Minh Tâm"
                  className="w-full h-11 px-3.5 bg-surface-container-low text-on-surface placeholder:text-outline text-xs sm:text-sm rounded-xl outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-secondary/20 transition-all border border-transparent focus:border-secondary"
                />
              </div>
            </div>

            {/* Giới tính & Ngày sinh */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1">
                  Giới tính <span className="text-error">*</span>
                </label>
                <div className="flex items-center gap-4 h-11 px-3 bg-surface-container-low rounded-xl">
                  <label className="inline-flex items-center gap-2 cursor-pointer text-xs sm:text-sm text-on-surface">
                    <input
                      type="radio"
                      name="gender"
                      value="male"
                      checked={formData.gender === 'male'}
                      onChange={() => setFormData({ ...formData, gender: 'male' })}
                      className="text-secondary focus:ring-secondary"
                    />
                    <span>Nam</span>
                  </label>
                  <label className="inline-flex items-center gap-2 cursor-pointer text-xs sm:text-sm text-on-surface">
                    <input
                      type="radio"
                      name="gender"
                      value="female"
                      checked={formData.gender === 'female'}
                      onChange={() => setFormData({ ...formData, gender: 'female' })}
                      className="text-secondary focus:ring-secondary"
                    />
                    <span>Nữ</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1">
                  Ngày sinh <span className="text-error">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  className="w-full h-11 px-3 bg-surface-container-low text-on-surface text-xs sm:text-sm rounded-xl outline-none focus:ring-2 focus:ring-secondary/20 transition-all border border-transparent focus:border-secondary"
                />
              </div>
            </div>

            {/* Số điện thoại & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1">
                  Số điện thoại <span className="text-error">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="09xx xxx xxx"
                  className="w-full h-11 px-3.5 bg-surface-container-low text-on-surface placeholder:text-outline text-xs sm:text-sm rounded-xl outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-secondary/20 transition-all border border-transparent focus:border-secondary"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1">
                  Email công vụ <span className="text-error">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="tengv@edumanage.edu.vn"
                  className="w-full h-11 px-3.5 bg-surface-container-low text-on-surface placeholder:text-outline text-xs sm:text-sm rounded-xl outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-secondary/20 transition-all border border-transparent focus:border-secondary"
                />
              </div>
            </div>

            {/* Tổ chuyên môn & Trình độ học vấn */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1">
                  Tổ chuyên môn <span className="text-error">*</span>
                </label>
                <div className="relative">
                  <select
                    required
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full h-11 pl-3 pr-8 bg-surface-container-low text-on-surface text-xs sm:text-sm rounded-xl appearance-none outline-none focus:ring-2 focus:ring-secondary/20 cursor-pointer"
                  >
                    <option value="Toán - Tin học">Tổ Toán - Tin học</option>
                    <option value="Ngữ Văn">Tổ Ngữ Văn</option>
                    <option value="Ngoại ngữ (Anh)">Tổ Tiếng Anh</option>
                    <option value="KHTN (Vật lý)">Tổ KHTN (Vật lý)</option>
                    <option value="KHTN (Hóa học)">Tổ KHTN (Hóa học)</option>
                    <option value="KHTN (Sinh học)">Tổ KHTN (Sinh học)</option>
                    <option value="KHXH (Sử - Địa)">Tổ KHXH</option>
                    <option value="GDTC - Nghệ thuật">Tổ GDTC - Nghệ thuật</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-outline text-[18px] pointer-events-none">
                    expand_more
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1">
                  Trình độ chuyên môn
                </label>
                <div className="relative">
                  <select
                    value={formData.degree}
                    onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                    className="w-full h-11 pl-3 pr-8 bg-surface-container-low text-on-surface text-xs sm:text-sm rounded-xl appearance-none outline-none focus:ring-2 focus:ring-secondary/20 cursor-pointer"
                  >
                    <option value="Cử nhân Sư phạm">Cử nhân Sư phạm</option>
                    <option value="Thạc sĩ">Thạc sĩ</option>
                    <option value="Tiến sĩ">Tiến sĩ</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-outline text-[18px] pointer-events-none">
                    expand_more
                  </span>
                </div>
              </div>
            </div>

            {/* Chức vụ & Môn giảng dạy */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1">
                  Chức vụ / Phụ trách
                </label>
                <input
                  type="text"
                  value={formData.titleRole}
                  onChange={(e) => setFormData({ ...formData, titleRole: e.target.value })}
                  placeholder="VD: Tổ trưởng chuyên môn / GVCN"
                  className="w-full h-11 px-3.5 bg-surface-container-low text-on-surface text-xs sm:text-sm rounded-xl outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-secondary/20 transition-all border border-transparent focus:border-secondary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1">
                  Môn giảng dạy
                </label>
                <input
                  type="text"
                  value={formData.subjectTaught}
                  onChange={(e) => setFormData({ ...formData, subjectTaught: e.target.value })}
                  placeholder="VD: Toán khối 10 &amp; 12"
                  className="w-full h-11 px-3.5 bg-surface-container-low text-on-surface text-xs sm:text-sm rounded-xl outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-secondary/20 transition-all border border-transparent focus:border-secondary"
                />
              </div>
            </div>

            {/* Ghi chú thêm */}
            <div>
              <label className="block text-xs font-semibold text-on-surface mb-1">
                Ghi chú bổ sung
              </label>
              <textarea
                rows={3}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Kinh nghiệm giảng dạy, chứng chỉ bồi dưỡng, phân công chi tiết..."
                className="w-full p-3 bg-surface-container-low text-on-surface placeholder:text-outline text-xs sm:text-sm rounded-xl outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-secondary/20 transition-all resize-none border border-transparent focus:border-secondary"
              />
            </div>
          </form>

          {/* Drawer Footer */}
          <div className="p-4 px-6 bg-surface-container-low border-t border-outline-variant/20 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-surface-container-lowest text-on-surface hover:bg-surface-container-high text-xs font-semibold shadow-sm transition-colors cursor-pointer"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              form="teacher-drawer-form"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-primary-container text-on-primary hover:bg-primary text-xs font-semibold shadow-sm transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSubmitting ? 'Đang lưu...' : 'Lưu hồ sơ giáo viên'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
