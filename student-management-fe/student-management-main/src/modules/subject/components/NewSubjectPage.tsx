'use client';

import React from 'react';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { useRouter } from 'next/navigation';
import { useSubjects } from '@/modules/subject/hooks/useSubjects';
import { SubjectFormData } from '@/modules/subject/types';
import { Save, ArrowLeft } from 'lucide-react';

export default function NewSubjectPage() {
  const router = useRouter();
  const { createSubject } = useSubjects();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const [formData, setFormData] = React.useState<SubjectFormData>({
    subjectCode: `MH-${Math.floor(10 + Math.random() * 90)}`,
    name: '',
    department: 'Toán - Tin học',
    evaluationType: 'score',
    grade10Periods: 4,
    grade11Periods: 4,
    grade12Periods: 4,
    description: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Vui lòng nhập tên môn học.');
      return;
    }
    setIsSubmitting(true);
    try {
      await createSubject(formData);
      router.push('/subjects');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    
      <div className="flex flex-col gap-6 max-w-4xl mx-auto">
        <div className="flex flex-col gap-1">
          <Breadcrumb
            items={[
              { label: 'Môn học', href: '/subjects' },
              { label: 'Thêm môn học mới', isCurrent: true },
            ]}
          />
          <div className="flex items-center justify-between mt-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-on-surface">
              Khởi tạo Môn học mới
            </h1>
            <button
              type="button"
              onClick={() => router.push('/subjects')}
              className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-on-surface-variant hover:text-on-surface px-3 py-2 rounded-xl bg-surface-container"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Quay lại</span>
            </button>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-outline-variant/20 flex flex-col gap-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider block mb-1.5">
                Mã môn học <span className="text-error">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.subjectCode}
                onChange={(e) => setFormData({ ...formData, subjectCode: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface font-mono text-sm focus:outline-none focus:border-secondary"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider block mb-1.5">
                Tên môn học <span className="text-error">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Ví dụ: Tin học ứng dụng"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                <option value="Khoa học Tự nhiên">Khoa học Tự nhiên</option>
                <option value="Khoa học Xã hội">Khoa học Xã hội</option>
                <option value="Ngoại ngữ">Ngoại ngữ</option>
                <option value="Thể chất - Quốc phòng">Thể chất - Quốc phòng</option>
                <option value="Nghệ thuật">Nghệ thuật</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider block mb-1.5">
                Hình thức đánh giá
              </label>
              <select
                value={formData.evaluationType}
                onChange={(e) => setFormData({ ...formData, evaluationType: e.target.value as any })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface text-sm focus:outline-none focus:border-secondary"
              >
                <option value="score">Điểm số (Thang điểm 10)</option>
                <option value="evaluation">Đánh giá bằng nhận xét (Đạt / Chưa đạt)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider block mb-1.5">
                Số tiết Khối 10
              </label>
              <input
                type="number"
                min={1}
                max={10}
                value={formData.grade10Periods}
                onChange={(e) => setFormData({ ...formData, grade10Periods: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface text-sm focus:outline-none focus:border-secondary font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider block mb-1.5">
                Số tiết Khối 11
              </label>
              <input
                type="number"
                min={1}
                max={10}
                value={formData.grade11Periods}
                onChange={(e) => setFormData({ ...formData, grade11Periods: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface text-sm focus:outline-none focus:border-secondary font-mono"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-outline-variant/20">
            <button
              type="button"
              onClick={() => router.push('/subjects')}
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
              <span>{isSubmitting ? 'Đang lưu...' : 'Lưu môn học'}</span>
            </button>
          </div>
        </form>
      </div>
    
  );
}
