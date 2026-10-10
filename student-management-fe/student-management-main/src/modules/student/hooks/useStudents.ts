import { useState, useEffect, useCallback } from 'react';
import { Student, StudentFiltersState, StudentFormData } from '../types';
import { studentService } from '../services/student.service';

export const useStudents = (initialFilters?: Partial<StudentFiltersState>) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<StudentFiltersState>({
    search: initialFilters?.search || '',
    gradeLevel: initialFilters?.gradeLevel || '',
    className: initialFilters?.className || '',
    status: initialFilters?.status || '',
  });

  const fetchStudents = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await studentService.getStudents(filters);
      setStudents(data);
    } catch {
      setError('Không thể tải danh sách học sinh. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const updateFilters = (newFilters: Partial<StudentFiltersState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      gradeLevel: '',
      className: '',
      status: '',
    });
  };

  const createStudent = async (data: StudentFormData) => {
    const created = await studentService.createStudent(data);
    await fetchStudents();
    return created;
  };

  const updateStudent = async (id: string, data: Partial<StudentFormData>) => {
    const updated = await studentService.updateStudent(id, data);
    await fetchStudents();
    return updated;
  };

  const deleteStudent = async (id: string) => {
    const success = await studentService.deleteStudent(id);
    await fetchStudents();
    return success;
  };

  return {
    students,
    isLoading,
    error,
    filters,
    updateFilters,
    resetFilters,
    refresh: fetchStudents,
    createStudent,
    updateStudent,
    deleteStudent,
  };
};
