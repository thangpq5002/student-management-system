'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/lib/auth/AuthContext';
import { Teacher } from '@/modules/teacher/types';
import { teacherService } from '@/modules/teacher/services/teacher.service';
import { Subject } from '@/modules/subject/types';
import { subjectService } from '@/modules/subject/services/subject.service';
import { classService, ClassOption } from '@/modules/class/services/class.service';
import {
  TeachingAssignment,
  teachingAssignmentService,
} from '@/modules/class/services/teaching-assignment.service';

interface AssignmentFilters {
  teacherId: string;
  classId: string;
  subjectId: string;
  academicYear: string;
}

function defaultAcademicYear(): string {
  const now = new Date();
  const firstYear = now.getMonth() >= 7 ? now.getFullYear() : now.getFullYear() - 1;
  return `${firstYear}-${firstYear + 1}`;
}

function isValidAcademicYear(value: string): boolean {
  const match = /^(\d{4})-(\d{4})$/.exec(value.trim());
  return Boolean(match && Number(match[2]) === Number(match[1]) + 1);
}

function messageFor(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}

const fieldClass =
  'w-full rounded-xl border border-outline-variant/30 bg-surface-container-low px-3 py-2.5 text-sm text-on-surface disabled:opacity-50';

export function TeachingAssignmentsPanel() {
  const { role, isLoading: isAuthLoading } = useAuth();
  const isAdmin = role === 'admin';
  const [assignments, setAssignments] = useState<TeachingAssignment[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [classes, setClasses] = useState<ClassOption[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTeacherId, setEditingTeacherId] = useState('');
  const [filters, setFilters] = useState<AssignmentFilters>({
    teacherId: '',
    classId: '',
    subjectId: '',
    academicYear: '',
  });
  const [form, setForm] = useState({
    teacherId: '',
    classId: '',
    subjectId: '',
    academicYear: defaultAcademicYear(),
    semester: 'SEMESTER_1' as 'SEMESTER_1' | 'SEMESTER_2',
  });

  const reload = useCallback(async () => {
    const items = await teachingAssignmentService.getAssignments();
    setAssignments(items);
  }, []);

  useEffect(() => {
    if (isAuthLoading || !role) return;
    let active = true;
    setIsLoading(true);
    setError(null);
    const requests = isAdmin
      ? Promise.all([
          teachingAssignmentService.getAssignments(),
          teacherService.getTeachers(),
          classService.getClassOptions(),
          subjectService.getSubjects(),
        ]).then(([items, teacherItems, classItems, subjectItems]) => {
          if (!active) return;
          setAssignments(items);
          setTeachers(teacherItems.filter((item) => item.status === 'active'));
          setClasses(classItems.filter((item) => item.status === 'active'));
          setSubjects(subjectItems.filter((item) => item.status === 'active'));
        })
      : teachingAssignmentService.getAssignments().then((items) => {
          if (active) setAssignments(items);
        });
    requests
      .catch((loadError: unknown) => {
        if (active) setError(messageFor(loadError, 'Không thể tải dữ liệu phân công.'));
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [isAdmin, isAuthLoading, role]);

  useEffect(() => {
    if (!form.teacherId && teachers.length > 0) {
      setForm((current) => ({ ...current, teacherId: teachers[0].id }));
    }
    if (!form.classId && classes.length > 0) {
      setForm((current) => ({ ...current, classId: classes[0].id }));
    }
    if (!form.subjectId && subjects.length > 0) {
      setForm((current) => ({ ...current, subjectId: subjects[0].id }));
    }
  }, [classes, form.classId, form.subjectId, form.teacherId, subjects, teachers]);

  const visibleAssignments = useMemo(() => {
    const query = filters.academicYear.trim().toLocaleLowerCase();
    return assignments.filter((item) =>
      (!filters.teacherId || item.teacherId === filters.teacherId)
      && (!filters.classId || item.classId === filters.classId)
      && (!filters.subjectId || item.subjectId === filters.subjectId)
      && (!query || item.academicYear.toLocaleLowerCase().includes(query))
    );
  }, [assignments, filters]);

  const createAssignment = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setNotice(null);
    if (!isValidAcademicYear(form.academicYear)) {
      setError('Năm học phải có dạng YYYY-YYYY và hai năm liên tiếp.');
      return;
    }
    setIsSaving(true);
    try {
      await teachingAssignmentService.create({
        classId: Number(form.classId),
        subjectId: Number(form.subjectId),
        teacherId: Number(form.teacherId),
        academicYear: form.academicYear.trim(),
        semester: form.semester,
      });
      await reload();
      setNotice('Đã tạo phân công giảng dạy.');
    } catch (saveError) {
      setError(messageFor(saveError, 'Không thể tạo phân công.'));
    } finally {
      setIsSaving(false);
    }
  };

  const updateAssignment = async (id: string) => {
    if (!editingTeacherId) {
      setError('Hãy chọn giáo viên cần phân công.');
      return;
    }
    setIsSaving(true);
    setError(null);
    setNotice(null);
    try {
      await teachingAssignmentService.updateTeacher(id, Number(editingTeacherId));
      await reload();
      setEditingId(null);
      setNotice('Đã cập nhật giáo viên của phân công.');
    } catch (saveError) {
      setError(messageFor(saveError, 'Không thể cập nhật phân công.'));
    } finally {
      setIsSaving(false);
    }
  };

  const cancelAssignment = async (assignment: TeachingAssignment) => {
    if (!window.confirm(
      `Hủy phân công ${assignment.teacherName} · ${assignment.className} · ${assignment.subjectName}? Lịch sử điểm và điểm danh sẽ được giữ lại.`,
    )) return;
    setIsSaving(true);
    setError(null);
    setNotice(null);
    try {
      await teachingAssignmentService.cancel(assignment.id);
      await reload();
      setNotice('Đã hủy phân công. Lịch sử điểm và điểm danh được giữ nguyên.');
    } catch (saveError) {
      setError(messageFor(saveError, 'Không thể hủy phân công.'));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="flex flex-col gap-4 rounded-2xl border border-outline-variant/20 bg-surface-container-lowest p-5 shadow-sm">
      <div>
        <h2 className="text-lg font-bold text-primary">Phân công giáo viên giảng dạy</h2>
        <p className="mt-1 text-sm text-on-surface-variant">
          Phân công theo lớp, môn, năm học và học kỳ. Giáo viên chỉ xem được phân công của chính mình.
        </p>
      </div>

      {isAdmin && (
        <form onSubmit={createAssignment} className="grid grid-cols-1 gap-3 rounded-xl bg-surface-container-low p-4 sm:grid-cols-2 xl:grid-cols-6">
          <label className="flex flex-col gap-1.5 text-xs font-semibold text-on-surface">
            Giáo viên
            <select required value={form.teacherId} onChange={(event) => setForm((current) => ({ ...current, teacherId: event.target.value }))} className={fieldClass} disabled={isLoading || teachers.length === 0}>
              <option value="">Chọn giáo viên</option>
              {teachers.map((item) => <option key={item.id} value={item.id}>{item.fullName}</option>)}
            </select>
          </label>
          <label className="flex flex-col gap-1.5 text-xs font-semibold text-on-surface">
            Lớp
            <select required value={form.classId} onChange={(event) => setForm((current) => ({ ...current, classId: event.target.value }))} className={fieldClass} disabled={isLoading || classes.length === 0}>
              <option value="">Chọn lớp</option>
              {classes.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
            </select>
          </label>
          <label className="flex flex-col gap-1.5 text-xs font-semibold text-on-surface">
            Môn học
            <select required value={form.subjectId} onChange={(event) => setForm((current) => ({ ...current, subjectId: event.target.value }))} className={fieldClass} disabled={isLoading || subjects.length === 0}>
              <option value="">Chọn môn</option>
              {subjects.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
            </select>
          </label>
          <label className="flex flex-col gap-1.5 text-xs font-semibold text-on-surface">
            Năm học
            <input required value={form.academicYear} onChange={(event) => setForm((current) => ({ ...current, academicYear: event.target.value }))} pattern="\d{4}-\d{4}" placeholder="2026-2027" className={fieldClass} />
          </label>
          <label className="flex flex-col gap-1.5 text-xs font-semibold text-on-surface">
            Học kỳ
            <select value={form.semester} onChange={(event) => setForm((current) => ({ ...current, semester: event.target.value as 'SEMESTER_1' | 'SEMESTER_2' }))} className={fieldClass}>
              <option value="SEMESTER_1">Học kỳ 1</option>
              <option value="SEMESTER_2">Học kỳ 2</option>
            </select>
          </label>
          <div className="flex items-end">
            <button type="submit" disabled={isLoading || isSaving || !form.teacherId || !form.classId || !form.subjectId} className="w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-on-primary hover:bg-primary-container disabled:opacity-50">
              {isSaving ? 'Đang lưu...' : 'Tạo phân công'}
            </button>
          </div>
        </form>
      )}

      {isAdmin && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <FilterSelect label="Giáo viên" value={filters.teacherId} onChange={(teacherId) => setFilters((current) => ({ ...current, teacherId }))} options={teachers.map((item) => [item.id, item.fullName])} />
          <FilterSelect label="Lớp" value={filters.classId} onChange={(classId) => setFilters((current) => ({ ...current, classId }))} options={classes.map((item) => [item.id, item.name])} />
          <FilterSelect label="Môn học" value={filters.subjectId} onChange={(subjectId) => setFilters((current) => ({ ...current, subjectId }))} options={subjects.map((item) => [item.id, item.name])} />
          <label className="flex flex-col gap-1.5 text-xs font-semibold text-on-surface">
            Năm học
            <input value={filters.academicYear} onChange={(event) => setFilters((current) => ({ ...current, academicYear: event.target.value }))} placeholder="Tất cả năm học" className={fieldClass} />
          </label>
        </div>
      )}

      {error && <p role="alert" className="rounded-xl bg-error-container/40 px-4 py-3 text-sm text-error">{error}</p>}
      {notice && <p role="status" className="rounded-xl bg-secondary-fixed/30 px-4 py-3 text-sm text-primary">{notice}</p>}

      {isLoading || isAuthLoading ? (
        <div className="p-8 text-center text-sm text-on-surface-variant">Đang tải phân công...</div>
      ) : visibleAssignments.length === 0 ? (
        <div className="p-8 text-center text-sm text-on-surface-variant">
          {isAdmin ? 'Chưa có phân công phù hợp với bộ lọc.' : 'Bạn chưa được phân công giảng dạy.'}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-surface-container-low text-xs uppercase text-on-surface-variant">
              <tr>
                <th className="p-3">Giáo viên</th>
                <th className="p-3">Lớp</th>
                <th className="p-3">Môn học</th>
                <th className="p-3">Năm học</th>
                <th className="p-3">Học kỳ</th>
                {isAdmin && <th className="p-3">Thao tác</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/15">
              {visibleAssignments.map((assignment) => (
                <tr key={assignment.id}>
                  <td className="p-3 font-semibold">{assignment.teacherName}</td>
                  <td className="p-3">{assignment.className}</td>
                  <td className="p-3">{assignment.subjectName}</td>
                  <td className="p-3">{assignment.academicYear}</td>
                  <td className="p-3">{assignment.semester.replace('_', ' ')}</td>
                  {isAdmin && (
                    <td className="p-3">
                      {editingId === assignment.id ? (
                        <div className="flex flex-wrap items-center gap-2">
                          <select value={editingTeacherId} onChange={(event) => setEditingTeacherId(event.target.value)} className="rounded-lg border border-outline-variant/30 bg-surface-container-low px-2 py-1.5">
                            {teachers.map((teacher) => <option key={teacher.id} value={teacher.id}>{teacher.fullName}</option>)}
                          </select>
                          <button type="button" onClick={() => void updateAssignment(assignment.id)} disabled={isSaving} className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-on-primary disabled:opacity-50">Lưu</button>
                          <button type="button" onClick={() => setEditingId(null)} className="rounded-lg bg-surface-container px-3 py-1.5 text-xs font-semibold">Hủy</button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <button type="button" onClick={() => { setEditingId(assignment.id); setEditingTeacherId(assignment.teacherId); }} disabled={isSaving} className="rounded-lg bg-surface-container px-3 py-1.5 text-xs font-semibold hover:bg-surface-container-high">Đổi giáo viên</button>
                          <button type="button" onClick={() => void cancelAssignment(assignment)} disabled={isSaving} className="rounded-lg bg-error-container/60 px-3 py-1.5 text-xs font-semibold text-error hover:bg-error-container disabled:opacity-50">Hủy phân công</button>
                        </div>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<[string, string]>;
}) {
  return (
    <label className="flex flex-col gap-1.5 text-xs font-semibold text-on-surface">
      {label}
      <select value={value} onChange={(event) => onChange(event.target.value)} className={fieldClass}>
        <option value="">Tất cả</option>
        {options.map(([id, name]) => <option key={id} value={id}>{name}</option>)}
      </select>
    </label>
  );
}
