import { apiRequest, ApiError } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { Teacher, TeacherFiltersState, TeacherFormData } from "../types";

interface TeacherApiResponse extends Teacher {
  gender?: "male" | "female";
  dateOfBirth?: string;
}

function toQueryString(filters?: Partial<TeacherFiltersState>): string {
  const params = new URLSearchParams();
  if (filters?.search?.trim()) params.set("search", filters.search.trim());
  if (filters?.department) params.set("department", filters.department);
  if (filters?.status) params.set("status", filters.status);
  if (filters?.degree) params.set("degree", filters.degree);
  const query = params.toString();
  return query ? `?${query}` : "";
}

export const teacherService = {
  async getTeachers(filters?: Partial<TeacherFiltersState>): Promise<Teacher[]> {
    return apiRequest<Teacher[]>(`${API_ENDPOINTS.teachers}${toQueryString(filters)}`);
  },

  async getTeacher(id: string): Promise<Teacher | null> {
    try {
      return await apiRequest<TeacherApiResponse>(
        `${API_ENDPOINTS.teachers}/${encodeURIComponent(id)}`,
      );
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) return null;
      throw error;
    }
  },

  createTeacher(data: TeacherFormData): Promise<Teacher> {
    return apiRequest<Teacher>(API_ENDPOINTS.teachers, {
      method: "POST",
      body: { ...data, status: "active" },
    });
  },

  async updateTeacher(id: string, data: Partial<TeacherFormData>): Promise<Teacher | null> {
    const current = await this.getTeacher(id);
    if (!current) return null;

    const currentWithForm = current as TeacherApiResponse;
    const updated: TeacherFormData & { status: string } = {
      fullName: data.fullName ?? current.fullName,
      gender: data.gender ?? currentWithForm.gender ?? "male",
      dateOfBirth: data.dateOfBirth ?? currentWithForm.dateOfBirth ?? "",
      phone: data.phone ?? current.phone,
      email: data.email ?? current.email,
      department: data.department ?? current.department,
      degree: data.degree ?? current.degree ?? "",
      titleRole: data.titleRole ?? current.titleRole,
      subjectTaught: data.subjectTaught ?? current.subjectTaught,
      notes: data.notes ?? current.notes ?? "",
      status: current.status,
    };

    try {
      return await apiRequest<Teacher>(
        `${API_ENDPOINTS.teachers}/${encodeURIComponent(id)}`,
        { method: "PUT", body: updated },
      );
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) return null;
      throw error;
    }
  },

  async deleteTeacher(id: string): Promise<boolean> {
    try {
      await apiRequest<void>(`${API_ENDPOINTS.teachers}/${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      return true;
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) return false;
      throw error;
    }
  },
};
