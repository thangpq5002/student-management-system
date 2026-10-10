import { apiRequest } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import {
  AttendanceApiRecord,
  AttendanceApiSession,
  AttendanceHistoryItem,
  AttendanceEnrollment,
} from "../types";

export interface AttendanceSessionWriteRequest {
  classId: number;
  attendanceDate: string;
  attendanceType: "CLASS";
  period: null;
}

export interface AttendanceRecordWriteRequest {
  enrollmentId: number;
  status: "PRESENT" | "ABSENT" | "LATE" | "EXCUSED";
  note: string | null;
}

function historyStatus(status: string): AttendanceHistoryItem["status"] {
  switch (status.toLowerCase()) {
    case "present": return "present";
    case "absent": return "unexcused";
    case "late": return "late";
    case "excused": return "excused";
    default: throw new Error(`Trạng thái điểm danh không được hỗ trợ: ${status}`);
  }
}

export const attendanceService = {
  getSessions(): Promise<AttendanceApiSession[]> {
    return apiRequest<AttendanceApiSession[]>(API_ENDPOINTS.attendance.sessions);
  },

  getSession(id: string): Promise<AttendanceApiSession> {
    return apiRequest<AttendanceApiSession>(
      `${API_ENDPOINTS.attendance.sessions}/${encodeURIComponent(id)}`,
    );
  },

  getEnrollments(): Promise<AttendanceEnrollment[]> {
    return apiRequest<AttendanceEnrollment[]>(API_ENDPOINTS.enrollments);
  },

  createSession(request: AttendanceSessionWriteRequest): Promise<AttendanceApiSession> {
    return apiRequest<AttendanceApiSession>(API_ENDPOINTS.attendance.sessions, {
      method: "POST",
      body: request,
    });
  },

  saveRecords(
    sessionId: string,
    records: AttendanceRecordWriteRequest[],
  ): Promise<AttendanceApiRecord[]> {
    return apiRequest<AttendanceApiRecord[]>(
      `${API_ENDPOINTS.attendance.sessions}/${encodeURIComponent(sessionId)}/records`,
      { method: "PUT", body: records },
    );
  },
};

export function flattenAttendanceSessions(
  sessions: AttendanceApiSession[],
): AttendanceHistoryItem[] {
  return sessions.flatMap((session) => session.records.map((record) => {
    const status = record.status.toLowerCase();
    return {
      id: record.id,
      dateStr: session.attendanceDate,
      session: session.attendanceType.toUpperCase() === "CLASS" ? "Điểm danh lớp" : "Điểm danh môn",
      classId: session.classId,
      className: session.className,
      periodSubject: [
        session.period ? `Tiết ${session.period}` : "",
        session.subjectName ?? "",
      ].filter(Boolean).join(" · ") || "Điểm danh cả lớp",
      studentCode: record.studentCode,
      fullName: record.studentName,
      avatarInitials: record.studentName.trim().split(/\s+/).slice(-2)
        .map((part) => part[0] ?? "").join("").toUpperCase(),
      status: historyStatus(status),
      checkInTime: "—",
      teacherName: session.teacherName ?? "Không có thông tin người điểm danh",
      note: record.note ?? "",
    };
  }));
}
