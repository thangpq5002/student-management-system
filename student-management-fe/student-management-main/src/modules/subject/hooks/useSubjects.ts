import { useState, useEffect, useCallback } from "react";
import { Subject, SubjectFiltersState, SubjectFormData } from "../types";
import { subjectService } from "../services/subject.service";

export const useSubjects = (initialFilters?: Partial<SubjectFiltersState>) => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<SubjectFiltersState>({
    search: initialFilters?.search || "",
    department: initialFilters?.department || "",
    evaluationType: initialFilters?.evaluationType || "",
    gradeLevel: initialFilters?.gradeLevel || "",
  });

  const fetchSubjects = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await subjectService.getSubjects(filters);
      setSubjects(data);
    } catch {
      setError("Không thể tải danh sách môn học.");
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchSubjects();
  }, [fetchSubjects]);

  const updateFilters = (newFilters: Partial<SubjectFiltersState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const resetFilters = () => {
    setFilters({
      search: "",
      department: "",
      evaluationType: "",
      gradeLevel: "",
    });
  };

  const createSubject = async (data: SubjectFormData) => {
    const created = await subjectService.createSubject(data);
    await fetchSubjects();
    return created;
  };

  const updateSubject = async (id: string, data: SubjectFormData) => {
    const updated = await subjectService.updateSubject(id, data);
    await fetchSubjects();
    return updated;
  };

  const deleteSubject = async (id: string) => {
    const success = await subjectService.deleteSubject(id);
    await fetchSubjects();
    return success;
  };

  return {
    subjects,
    isLoading,
    error,
    filters,
    updateFilters,
    resetFilters,
    refresh: fetchSubjects,
    createSubject,
    updateSubject,
    deleteSubject,
  };
};
