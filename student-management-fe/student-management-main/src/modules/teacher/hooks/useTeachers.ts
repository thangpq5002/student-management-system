import { useState, useEffect, useCallback } from 'react';
import { Teacher, TeacherFiltersState, TeacherFormData } from '../types';
import { teacherService } from '../services/teacher.service';

export const useTeachers = (initialFilters?: Partial<TeacherFiltersState>) => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<TeacherFiltersState>({
    search: initialFilters?.search || '',
    department: initialFilters?.department || '',
    status: initialFilters?.status || '',
    degree: initialFilters?.degree || '',
  });

  const fetchTeachers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await teacherService.getTeachers(filters);
      setTeachers(data);
    } catch {
      setError('Không thể tải danh sách giáo viên. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchTeachers();
  }, [fetchTeachers]);

  const updateFilters = (newFilters: Partial<TeacherFiltersState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      department: '',
      status: '',
      degree: '',
    });
  };

  const createTeacher = async (data: TeacherFormData) => {
    const created = await teacherService.createTeacher(data);
    await fetchTeachers();
    return created;
  };

  const updateTeacher = async (id: string, data: Partial<TeacherFormData>) => {
    const updated = await teacherService.updateTeacher(id, data);
    await fetchTeachers();
    return updated;
  };

  const deleteTeacher = async (id: string) => {
    const success = await teacherService.deleteTeacher(id);
    await fetchTeachers();
    return success;
  };

  return {
    teachers,
    isLoading,
    error,
    filters,
    updateFilters,
    resetFilters,
    refresh: fetchTeachers,
    createTeacher,
    updateTeacher,
    deleteTeacher,
  };
};
