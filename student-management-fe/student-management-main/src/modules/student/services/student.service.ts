import { apiRequest, ApiError } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { Student, StudentFiltersState, StudentFormData } from "../types";

function toQueryString(filters?: Partial<StudentFiltersState>): string {
  const params = new URLSearchParams();
  if (filters?.search?.trim()) params.set("search", filters.search.trim());
  if (filters?.gradeLevel) params.set("gradeLevel", filters.gradeLevel);
  if (filters?.className) params.set("className", filters.className);
  if (filters?.status) params.set("status", filters.status);
  const query = params.toString();
  return query ? `?${query}` : "";
}

export const studentService = {
  getStudents(filters?: Partial<StudentFiltersState>): Promise<Student[]> {
    return apiRequest<Student[]>(`${API_ENDPOINTS.students}${toQueryString(filters)}`);
  },

  async getStudent(id: string): Promise<Student | null> {
    try {
      return await apiRequest<Student>(`${API_ENDPOINTS.students}/${encodeURIComponent(id)}`);
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) return null;
      throw error;
    }
  },

  createStudent(data: StudentFormData): Promise<Student> {
    return apiRequest<Student>(API_ENDPOINTS.students, {
      method: "POST",
      body: {
        ...data,
        gradeLevel: Number(data.gradeLevel),
        className: data.className.trim(),
        status: "active",
      },
    });
  },

  async updateStudent(id: string, data: Partial<StudentFormData>): Promise<Student | null> {
    const current = await this.getStudent(id);
    if (!current) return null;

    const updated = {
      fullName: data.fullName ?? current.fullName,
      dateOfBirth: data.dateOfBirth ?? current.dateOfBirth,
      gender: data.gender ?? current.gender,
      gradeLevel: Number(data.gradeLevel ?? current.gradeLevel),
      className: (data.className ?? current.className).trim(),
      parentEmail: data.parentEmail ?? current.parentEmail,
      phone: data.phone ?? current.phone,
      notes: data.notes ?? current.notes ?? "",
      status: current.status,
    };

    try {
      return await apiRequest<Student>(`${API_ENDPOINTS.students}/${encodeURIComponent(id)}`, {
        method: "PUT",
        body: updated,
      });
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) return null;
      throw error;
    }
  },

  async deleteStudent(id: string): Promise<boolean> {
    try {
      await apiRequest<void>(`${API_ENDPOINTS.students}/${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      return true;
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) return false;
      throw error;
    }
  },
};
