import { apiRequest } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import {
  AssessmentType,
  GradeEnrollment,
  GradeRecord,
  TeachingAssignment,
} from "../types";

export interface GradeWriteRequest {
  enrollmentId: number;
  classTeacherId: number;
  assessmentTypeId: number;
  semester: string;
  assessmentNumber: number;
  score: number;
}

interface AssessmentTypeApiResponse {
  id: number | string;
  code: string;
  name: string;
  weight: number | string;
}

export const gradeService = {
  getAssignments(): Promise<TeachingAssignment[]> {
    return apiRequest<TeachingAssignment[]>(API_ENDPOINTS.teachingAssignments);
  },

  getEnrollments(): Promise<GradeEnrollment[]> {
    return apiRequest<GradeEnrollment[]>(API_ENDPOINTS.enrollments);
  },

  async getAssessmentTypes(): Promise<AssessmentType[]> {
    const response = await apiRequest<AssessmentTypeApiResponse[]>(
      API_ENDPOINTS.grades.assessmentTypes,
    );
    return response.map((item) => {
      const weight = Number(item.weight);
      if (!Number.isFinite(weight) || weight <= 0) {
        throw new Error(`Hệ số của loại điểm ${item.code} không hợp lệ.`);
      }
      return {
        ...item,
        id: String(item.id),
        weight,
      };
    });
  },

  getGradeRecords(assignment: TeachingAssignment): Promise<GradeRecord[]> {
    const params = new URLSearchParams({
      classSubjectId: assignment.classSubjectId,
      semester: assignment.semester,
    });
    return apiRequest<GradeRecord[]>(`${API_ENDPOINTS.grades.records}?${params.toString()}`);
  },

  createGrade(request: GradeWriteRequest): Promise<GradeRecord> {
    return apiRequest<GradeRecord>(API_ENDPOINTS.grades.records, {
      method: "POST",
      body: request,
    });
  },

  updateGrade(id: string, request: GradeWriteRequest): Promise<GradeRecord> {
    return apiRequest<GradeRecord>(
      `${API_ENDPOINTS.grades.records}/${encodeURIComponent(id)}`,
      { method: "PUT", body: request },
    );
  },
};
