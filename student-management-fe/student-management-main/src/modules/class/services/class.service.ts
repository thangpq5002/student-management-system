import { apiRequest, ApiError } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { SchoolClass, ClassFiltersState, ClassLeader } from "../types";
import { Student } from "@/modules/student/types";

interface ClassApiResponse extends Omit<SchoolClass, "homeroomTeacher"> {
  name?: string;
  homeroomTeacher: SchoolClass["homeroomTeacher"] | null;
}

export interface ClassFormData {
  className: string;
  gradeLevel: number;
  room: string;
  stream: string;
  maxStudents: number;
  status?: "active" | "archived";
  homeroomTeacherId?: string | null;
}

export interface ClassStudentEnrollmentRequest {
  studentIds: number[];
  academicYear: string;
}

export interface ClassEnrollmentResponse {
  id: string;
  studentId: string;
  studentCode: string;
  studentName: string;
  classId: string;
  className: string;
  academicYear: string;
  status: string;
}

export interface ClassOption {
  id: string;
  name: string;
  label: string;
  gradeLevel: number;
  status: SchoolClass["status"];
}

function toQueryString(filters?: Partial<ClassFiltersState>): string {
  const params = new URLSearchParams();
  if (filters?.search?.trim()) params.set("search", filters.search.trim());
  if (filters?.gradeLevel) params.set("gradeLevel", filters.gradeLevel);
  if (filters?.stream?.trim()) params.set("stream", filters.stream.trim());
  if (filters?.capacity) params.set("capacity", filters.capacity);
  const query = params.toString();
  return query ? `?${query}` : "";
}

function normalizeClass(item: ClassApiResponse): SchoolClass {
  return {
    ...item,
    id: String(item.id),
    classCode: item.classCode ?? "",
    className: item.className || item.name || "",
    homeroomTeacher: item.homeroomTeacher ?? {
      id: "",
      fullName: "",
      department: "",
      email: "",
      experience: "",
      avatarInitials: "",
    },
    leaders: item.leaders ?? [],
    students: item.students ?? [],
    room: item.room ?? "",
    stream: item.stream ?? "",
  };
}

function toRequest(data: ClassFormData) {
  return {
    name: data.className.trim().replace(/^Lớp\s+/i, ""),
    gradeLevel: Number(data.gradeLevel),
    room: data.room.trim(),
    stream: data.stream.trim(),
    maxStudents: Number(data.maxStudents),
    status: data.status ?? "active",
    homeroomTeacherId: data.homeroomTeacherId || null,
  };
}

async function getClassById(id: string): Promise<SchoolClass | null> {
  try {
    const item = await apiRequest<ClassApiResponse>(
      `${API_ENDPOINTS.classes}/${encodeURIComponent(id)}`,
    );
    return normalizeClass(item);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}

export const classService = {
  async getClassOptions(): Promise<ClassOption[]> {
    const items = await apiRequest<ClassApiResponse[]>(API_ENDPOINTS.classes);
    return items.map((item) => {
      const name = item.name?.trim()
        || (item.className || "").replace(/^lớp\s+/i, "").trim();
      return {
        id: String(item.id),
        name,
        label: item.className || `Lớp ${name}`,
        gradeLevel: Number(item.gradeLevel),
        status: item.status,
      };
    }).filter((item) => item.name.length > 0);
  },

  async getClasses(filters?: Partial<ClassFiltersState>): Promise<SchoolClass[]> {
    const items = await apiRequest<ClassApiResponse[]>(
      `${API_ENDPOINTS.classes}${toQueryString(filters)}`,
    );
    return items.map(normalizeClass);
  },

  getClass(id: string): Promise<SchoolClass | null> {
    // The backend identifies classes by their numeric database ID, not classCode.
    if (!/^\d+$/.test(id)) return Promise.resolve(null);
    return getClassById(id);
  },

  async createClass(data: ClassFormData): Promise<SchoolClass> {
    const item = await apiRequest<ClassApiResponse>(API_ENDPOINTS.classes, {
      method: "POST",
      body: toRequest(data),
    });
    return normalizeClass(item);
  },

  async updateClass(id: string, data: ClassFormData): Promise<SchoolClass | null> {
    if (!/^\d+$/.test(id)) return null;
    try {
      const item = await apiRequest<ClassApiResponse>(
        `${API_ENDPOINTS.classes}/${encodeURIComponent(id)}`,
        { method: "PUT", body: toRequest(data) },
      );
      return normalizeClass(item);
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) return null;
      throw error;
    }
  },

  async deleteClass(id: string): Promise<boolean> {
    if (!/^\d+$/.test(id)) return false;
    try {
      await apiRequest<void>(`${API_ENDPOINTS.classes}/${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      return true;
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) return false;
      throw error;
    }
  },

  async assignTeacher(
    classId: string,
    teacher: SchoolClass["homeroomTeacher"] | null,
  ): Promise<SchoolClass | null> {
    if (!/^\d+$/.test(classId)) return null;
    try {
      const item = await apiRequest<ClassApiResponse>(
        `${API_ENDPOINTS.classes}/${encodeURIComponent(classId)}/homeroom-teacher`,
        {
          method: "PUT",
          body: { teacherId: teacher?.id || null },
        },
      );
      return normalizeClass(item);
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) return null;
      throw error;
    }
  },

  async getAvailableStudents(
    classId: string,
    academicYear: string,
    search: string,
  ): Promise<Student[]> {
    const params = new URLSearchParams({ academicYear });
    if (search.trim()) params.set("search", search.trim());
    return apiRequest<Student[]>(
      `${API_ENDPOINTS.classStudents(classId)}/available?${params.toString()}`,
    );
  },

  enrollStudents(
    classId: string,
    request: ClassStudentEnrollmentRequest,
  ): Promise<ClassEnrollmentResponse[]> {
    return apiRequest<ClassEnrollmentResponse[]>(API_ENDPOINTS.classStudents(classId), {
      method: "POST",
      body: request,
    });
  },

  async updateLeaders(
    classId: string,
    leaders: ClassLeader[],
  ): Promise<SchoolClass | null> {
    if (!/^\d+$/.test(classId)) return null;
    try {
      const item = await apiRequest<ClassApiResponse>(
        `${API_ENDPOINTS.classes}/${encodeURIComponent(classId)}/leaders`,
        {
          method: "PUT",
          body: leaders.map(({ title, studentCode }) => ({ title, studentCode })),
        },
      );
      return normalizeClass(item);
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) return null;
      throw error;
    }
  },
};
