import { apiRequest, ApiError } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { Subject, SubjectFiltersState, SubjectFormData } from "../types";

interface SubjectApiResponse extends Subject {
  headTeacherId?: string | null;
}

function toQueryString(filters?: Partial<SubjectFiltersState>): string {
  const params = new URLSearchParams();
  if (filters?.search?.trim()) params.set("search", filters.search.trim());
  if (filters?.department) params.set("department", filters.department);
  if (filters?.evaluationType) params.set("evaluationType", filters.evaluationType);
  if (filters?.gradeLevel) params.set("gradeLevel", filters.gradeLevel);
  const query = params.toString();
  return query ? `?${query}` : "";
}

function toRequest(data: SubjectFormData, current?: SubjectApiResponse) {
  return {
    subjectCode: data.subjectCode.trim().toUpperCase(),
    name: data.name.trim(),
    department: data.department.trim(),
    evaluationType: data.evaluationType,
    grade10Periods: Number(data.grade10Periods),
    grade11Periods: Number(data.grade11Periods),
    grade12Periods: Number(data.grade12Periods),
    description: data.description ?? current?.description ?? "",
    // SubjectResponse explicitly returns headTeacherId. Preserve it on edit instead
    // of silently clearing the relation when the subject is saved.
    headTeacherId: current?.headTeacherId ?? null,
    status: current?.status ?? "active",
  };
}

export const subjectService = {
  getSubjects(filters?: Partial<SubjectFiltersState>): Promise<Subject[]> {
    return apiRequest<Subject[]>(`${API_ENDPOINTS.subjects}${toQueryString(filters)}`);
  },

  async getSubject(id: string): Promise<SubjectApiResponse | null> {
    if (!/^\d+$/.test(id)) return null;
    try {
      return await apiRequest<SubjectApiResponse>(
        `${API_ENDPOINTS.subjects}/${encodeURIComponent(id)}`,
      );
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) return null;
      throw error;
    }
  },

  createSubject(data: SubjectFormData): Promise<Subject> {
    return apiRequest<Subject>(API_ENDPOINTS.subjects, {
      method: "POST",
      body: toRequest(data),
    });
  },

  async updateSubject(id: string, data: SubjectFormData): Promise<Subject | null> {
    const current = await this.getSubject(id);
    if (!current) return null;

    try {
      return await apiRequest<Subject>(
        `${API_ENDPOINTS.subjects}/${encodeURIComponent(id)}`,
        { method: "PUT", body: toRequest(data, current) },
      );
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) return null;
      throw error;
    }
  },

  async deleteSubject(id: string): Promise<boolean> {
    if (!/^\d+$/.test(id)) return false;
    try {
      await apiRequest<void>(`${API_ENDPOINTS.subjects}/${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      return true;
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) return false;
      throw error;
    }
  },
};
