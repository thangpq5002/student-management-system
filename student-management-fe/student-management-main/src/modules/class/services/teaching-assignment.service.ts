import { apiRequest } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

export interface TeachingAssignment {
  id: string;
  classId: string;
  className: string;
  classSubjectId: string;
  subjectId: string;
  subjectName: string;
  teacherId: string;
  teacherName: string;
  academicYear: string;
  semester: string;
}

export interface TeachingAssignmentCreateRequest {
  classId: number;
  subjectId: number;
  teacherId: number;
  academicYear: string;
  semester: "SEMESTER_1" | "SEMESTER_2";
}

export const teachingAssignmentService = {
  getAssignments(): Promise<TeachingAssignment[]> {
    return apiRequest<TeachingAssignment[]>(API_ENDPOINTS.teachingAssignments);
  },

  create(request: TeachingAssignmentCreateRequest): Promise<TeachingAssignment> {
    return apiRequest<TeachingAssignment>(API_ENDPOINTS.teachingAssignments, {
      method: "POST",
      body: request,
    });
  },

  updateTeacher(id: string, teacherId: number): Promise<TeachingAssignment> {
    return apiRequest<TeachingAssignment>(
      `${API_ENDPOINTS.teachingAssignments}/${encodeURIComponent(id)}`,
      { method: "PUT", body: { teacherId } },
    );
  },

  cancel(id: string): Promise<void> {
    return apiRequest<void>(
      `${API_ENDPOINTS.teachingAssignments}/${encodeURIComponent(id)}`,
      { method: "DELETE" },
    );
  },
};
