'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { useClasses } from '@/modules/class/hooks/useClasses';
import { classService } from '@/modules/class/services/class.service';
import { teacherService } from '@/modules/teacher/services/teacher.service';
import { Teacher } from '@/modules/teacher/types';
import { Save, ArrowLeft } from 'lucide-react';

export default function NewClassPage() {
  const router = useRouter();
  const { refresh } = useClasses();
  const [teachers, setTeachers] = React.useState<Teacher[]>([]);
  const [isLoadingTeachers, setIsLoadingTeachers] = React.useState(true);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState('');

  const [formData, setFormData] = React.useState({
    className: '',
    gradeLevel: '10',
    room: '',
    stream: 'KHTN',
    maxStudents: '40',
    homeroomTeacherId: '',
  });

  React.useEffect(() => {
    let active = true;
    teacherService.getTeachers()
      .then((items) => { if (active) setTeachers(items); })
      .catch(() => { if (active) setError('Không thể tải danh sách giáo viên. Bạn vẫn có thể tạo lớp chưa phân công GVCN.'); })
      .finally(() => { if (active) setIsLoadingTeachers(false); });
    return () => { active = false; };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!formData.className.trim()) {
      setError('Vui lòng nhập tên lớp.');
      return;
    }

    setIsSubmitting(true);
    try {
      await classService.createClass({
        className: formData.className,
        gradeLevel: Number(formData.gradeLevel),
        room: formData.room,
        stream: formData.stream,
        maxStudents: Number(formData.maxStudents),
        status: 'active',
        homeroomTeacherId: formData.homeroomTeacherId || null,
      });
      await refresh();
      router.push('/classes');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể tạo lớp học. Vui lòng kiểm tra dữ liệu và thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      <div className="flex flex-col gap-1">
        <Breadcrumb items={[{ label: 'Lớp học', href: '/classes' }, { label: 'Tạo lớp học mới', isCurrent: true }]} />
        <div className="flex items-center justify-between mt-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-on-surface">Thiết lập lớp học mới</h1>
          <button type="button" onClick={() => router.push('/classes')} className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-on-surface-variant hover:text-on-surface px-3 py-2 rounded-xl bg-surface-container">
            <ArrowLeft className="w-4 h-4" /><span>Quay lại</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-outline-variant/20 flex flex-col gap-6">
        {error && <p role="alert" className="rounded-xl bg-error/10 px-4 py-3 text-sm text-error">{error}</p>}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-on-surface block mb-1.5">Tên lớp học *</label>
            <input type="text" required maxLength={16} placeholder="Ví dụ: 10A3" value={formData.className} onChange={(e) => setFormData({ ...formData, className: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface text-sm focus:outline-none focus:border-secondary" />
          </div>
          <div>
            <label className="text-xs font-semibold text-on-surface block mb-1.5">Khối *</label>
            <select required value={formData.gradeLevel} onChange={(e) => setFormData({ ...formData, gradeLevel: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface text-sm">
              <option value="10">Khối 10</option><option value="11">Khối 11</option><option value="12">Khối 12</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-on-surface block mb-1.5">Phòng học</label>
            <input type="text" maxLength={50} placeholder="Ví dụ: A-204" value={formData.room} onChange={(e) => setFormData({ ...formData, room: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface text-sm" />
          </div>
          <div>
            <label className="text-xs font-semibold text-on-surface block mb-1.5">Tổ hợp / Ban</label>
            <select value={formData.stream} onChange={(e) => setFormData({ ...formData, stream: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface text-sm">
              <option value="KHTN">Khoa học Tự nhiên</option><option value="KHXH">Khoa học Xã hội</option><option value="Quốc tế">Quốc tế / D1</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-on-surface block mb-1.5">Sĩ số tối đa *</label>
            <input type="number" required min={1} max={100} value={formData.maxStudents} onChange={(e) => setFormData({ ...formData, maxStudents: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface text-sm" />
          </div>
          <div>
            <label className="text-xs font-semibold text-on-surface block mb-1.5">Giáo viên chủ nhiệm</label>
            <select disabled={isLoadingTeachers} value={formData.homeroomTeacherId} onChange={(e) => setFormData({ ...formData, homeroomTeacherId: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface text-sm">
              <option value="">{isLoadingTeachers ? 'Đang tải giáo viên...' : 'Chưa phân công'}</option>
              {teachers.map((teacher) => <option key={teacher.id} value={teacher.id}>{teacher.fullName} ({teacher.teacherCode})</option>)}
            </select>
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-outline-variant/20">
          <button type="button" onClick={() => router.push('/classes')} className="px-5 py-2.5 rounded-xl bg-surface-container text-on-surface font-semibold text-sm">Hủy bỏ</button>
          <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-on-primary font-semibold text-sm disabled:opacity-50">
            <Save className="w-4 h-4" /><span>{isSubmitting ? 'Đang lưu...' : 'Tạo lớp học'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
