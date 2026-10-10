'use client';

import React from 'react';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { useRouter } from 'next/navigation';
import { useTeachers } from '@/modules/teacher/hooks/useTeachers';
import { TeacherFormData } from '@/modules/teacher/types';
import { Save, ArrowLeft } from 'lucide-react';

export default function NewTeacherPage() {
  const router = useRouter();
  const { createTeacher } = useTeachers();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const [formData, setFormData] = React.useState<TeacherFormData>({
    fullName: '',
    gender: 'male',
    dateOfBirth: '1985-05-20',
    phone: '0912 345 678',
    email: 'gv.moi@edumanage.edu.vn',
    department: 'Toán - Tin học',
    degree: 'Thạc sĩ',
    titleRole: 'Giáo viên bộ môn',
    subjectTaught: 'Toán khối 10 & 11',
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim()) {
      alert('Vui lòng nhập họ và tên giáo viên.');
      return;
    }
    setIsSubmitting(true);
    try {
      await createTeacher(formData);
      router.push('/teachers');
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
              { label: 'Giáo viên', href: '/teachers' },
              { label: 'Thêm mới giáo viên', isCurrent: true },
            ]}
          />
          <div className="flex items-center justify-between mt-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-on-surface">
              Tiếp nhận Hồ sơ Giáo viên mới
            </h1>
            <button
              type="button"
              onClick={() => router.push('/teachers')}
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
                Họ và tên (kèm học vị nếu có) <span className="text-error">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Ví dụ: ThS. Hoàng Văn Thụ"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface text-sm focus:outline-none focus:border-secondary"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider block mb-1.5">
                Chức vụ / Vai trò
              </label>
              <input
                type="text"
                placeholder="Ví dụ: Tổ phó chuyên môn, GVCN Lớp 10A1"
                value={formData.titleRole}
                onChange={(e) => setFormData({ ...formData, titleRole: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface text-sm focus:outline-none focus:border-secondary"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider block mb-1.5">
                Tổ bộ môn <span className="text-error">*</span>
              </label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface text-sm focus:outline-none focus:border-secondary"
              >
                <option value="Toán - Tin học">Toán - Tin học</option>
                <option value="Ngữ văn">Ngữ văn</option>
                <option value="Khoa học Tự nhiên">Khoa học Tự nhiên (Lý - Hóa - Sinh)</option>
                <option value="Khoa học Xã hội">Khoa học Xã hội (Sử - Địa - GDCD)</option>
                <option value="Ngoại ngữ">Ngoại ngữ</option>
                <option value="Thể chất - Quốc phòng">Thể chất - Quốc phòng</option>
                <option value="Nghệ thuật">Nghệ thuật</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider block mb-1.5">
                Môn giảng dạy chính
              </label>
              <input
                type="text"
                placeholder="Ví dụ: Toán khối 10 & 11"
                value={formData.subjectTaught}
                onChange={(e) => setFormData({ ...formData, subjectTaught: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface text-sm focus:outline-none focus:border-secondary"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider block mb-1.5">
                Email công vụ <span className="text-error">*</span>
              </label>
              <input
                type="email"
                required
                placeholder="gv.ten@edumanage.edu.vn"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface text-sm focus:outline-none focus:border-secondary"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider block mb-1.5">
                Số điện thoại liên hệ <span className="text-error">*</span>
              </label>
              <input
                type="tel"
                required
                placeholder="09xx xxx xxx"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface text-sm focus:outline-none focus:border-secondary"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-outline-variant/20">
            <button
              type="button"
              onClick={() => router.push('/teachers')}
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
              <span>{isSubmitting ? 'Đang lưu...' : 'Lưu hồ sơ giáo viên'}</span>
            </button>
          </div>
        </form>
      </div>
    
  );
}
