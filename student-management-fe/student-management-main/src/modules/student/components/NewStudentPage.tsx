'use client';

import React from 'react';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { useRouter } from 'next/navigation';
import { useStudents } from '@/modules/student/hooks/useStudents';
import { StudentFormData } from '@/modules/student/types';
import { GRADE_LEVELS } from '@/modules/student/constants';
import { useClassOptions } from '@/modules/class/hooks/useClassOptions';
import { Save, ArrowLeft, UserPlus } from 'lucide-react';

export default function NewStudentPage() {
  const router = useRouter();
  const { createStudent } = useStudents();
  const { classes, isLoading: isLoadingClasses, error: classLoadError } = useClassOptions();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  const [formData, setFormData] = React.useState<StudentFormData>({
    fullName: '',
    dateOfBirth: '2008-01-15',
    gender: 'male',
    gradeLevel: 10,
    className: '',
    parentEmail: 'phuhuynh@example.com',
    phone: '0912 345 678',
    notes: '',
  });

  const availableClasses = classes.filter((item) => item.gradeLevel === Number(formData.gradeLevel));

  React.useEffect(() => {
    if (availableClasses.length === 0) return;
    if (!availableClasses.some((item) => item.name === formData.className)) {
      setFormData((current) => ({ ...current, className: availableClasses[0].name }));
    }
  }, [availableClasses, formData.className]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    if (!formData.fullName.trim()) {
      setSubmitError('Vui lòng nhập họ và tên học sinh.');
      return;
    }
    if (!formData.className) {
      setSubmitError('Vui lòng chọn lớp học từ danh sách trên hệ thống.');
      return;
    }
    setIsSubmitting(true);
    try {
      await createStudent(formData);
      router.push('/students');
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Không thể tạo hồ sơ học sinh.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    
      <div className="flex flex-col gap-6 max-w-4xl mx-auto">
        {/* Breadcrumb & Navigation */}
        <div className="flex flex-col gap-1">
          <Breadcrumb
            items={[
              { label: 'Học sinh', href: '/students' },
              { label: 'Thêm mới học sinh', isCurrent: true },
            ]}
          />
          <div className="flex items-center justify-between mt-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-on-surface">
              Tiếp nhận Hồ sơ Học sinh mới
            </h1>
            <button
              type="button"
              onClick={() => router.push('/students')}
              className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-on-surface-variant hover:text-on-surface px-3 py-2 rounded-xl bg-surface-container"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Quay lại</span>
            </button>
          </div>
        </div>

        {/* Form Card */}
        <form
          onSubmit={handleSubmit}
          className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-outline-variant/20 flex flex-col gap-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider block mb-1.5">
                Họ và tên <span className="text-error">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Ví dụ: Nguyễn Văn Bảo"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface text-sm focus:outline-none focus:border-secondary"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider block mb-1.5">
                Ngày sinh <span className="text-error">*</span>
              </label>
              <input
                type="date"
                required
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface text-sm focus:outline-none focus:border-secondary"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider block mb-1.5">
                Giới tính <span className="text-error">*</span>
              </label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface text-sm focus:outline-none focus:border-secondary"
              >
                <option value="male">Nam</option>
                <option value="female">Nữ</option>
                <option value="other">Khác</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider block mb-1.5">
                Khối lớp
              </label>
              <select
                value={formData.gradeLevel}
                onChange={(e) => {
                  const gradeLevel = Number(e.target.value);
                  const gradeClasses = classes.filter((item) => item.gradeLevel === gradeLevel);
                  setFormData({
                    ...formData,
                    gradeLevel,
                    className: gradeClasses[0]?.name || '',
                  });
                }}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface text-sm focus:outline-none focus:border-secondary"
              >
                {GRADE_LEVELS.map((g) => (
                  <option key={g.value} value={g.value}>
                    {g.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider block mb-1.5">
                Lớp học phân bổ
              </label>
              <select
                value={formData.className}
                onChange={(e) => setFormData({ ...formData, className: e.target.value })}
                required
                disabled={isLoadingClasses || availableClasses.length === 0}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface text-sm focus:outline-none focus:border-secondary"
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
              {classLoadError && <p role="alert" className="mt-1 text-xs text-error">{classLoadError}</p>}
              {!isLoadingClasses && !classLoadError && availableClasses.length === 0 && (
                <p className="mt-1 text-xs text-error">Không có lớp trong khối này trên hệ thống.</p>
              )}
            </div>

            <div>
              <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider block mb-1.5">
                Email phụ huynh <span className="text-error">*</span>
              </label>
              <input
                type="email"
                required
                placeholder="phuhuynh@example.com"
                value={formData.parentEmail}
                onChange={(e) => setFormData({ ...formData, parentEmail: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface text-sm focus:outline-none focus:border-secondary"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider block mb-1.5">
                Số điện thoại phụ huynh <span className="text-error">*</span>
              </label>
              <input
                type="tel"
                required
                placeholder="0912 345 678"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface text-sm focus:outline-none focus:border-secondary"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider block mb-1.5">
                Ghi chú bổ sung
              </label>
              <input
                type="text"
                placeholder="Thông tin thêm (nếu có)..."
                value={formData.notes || ''}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface text-sm focus:outline-none focus:border-secondary"
              />
            </div>
          </div>

          {submitError && <p role="alert" className="text-sm text-error">{submitError}</p>}

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-outline-variant/20">
            <button
              type="button"
              onClick={() => router.push('/students')}
              className="px-5 py-2.5 rounded-xl bg-surface-container text-on-surface font-semibold text-sm hover:bg-surface-container-high transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-on-primary font-semibold text-sm hover:bg-primary-container shadow transition-all disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSubmitting ? 'Đang lưu...' : 'Lưu hồ sơ học sinh'}</span>
            </button>
          </div>
        </form>
      </div>
    
  );
}
