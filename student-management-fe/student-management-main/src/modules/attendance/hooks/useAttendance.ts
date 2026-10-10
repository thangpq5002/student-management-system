import { useCallback, useEffect, useMemo, useState } from "react";
import { ClassOption } from "@/modules/class/services/class.service";
import { useClassOptions } from "@/modules/class/hooks/useClassOptions";
import {
  AttendanceApiSession,
  AttendanceEnrollment,
  AttendanceFiltersState,
  AttendanceStatus,
  DailyAttendanceItem,
} from "../types";
import { attendanceService } from "../services/attendance.service";

interface AttendanceDraft {
  status: AttendanceStatus;
  note: string;
}

function today(): string {
  const date = new Date();
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 10);
}

function toUiStatus(status: string | undefined): AttendanceStatus {
  switch (status?.toLowerCase()) {
    case "present": return "present";
    case "absent": return "unexcused";
    case "late": return "late";
    case "excused": return "excused";
    default: return "unmarked";
  }
}

function toApiStatus(status: AttendanceStatus): "PRESENT" | "ABSENT" | "LATE" | "EXCUSED" {
  switch (status) {
    case "present": return "PRESENT";
    case "unexcused": return "ABSENT";
    case "late": return "LATE";
    case "excused": return "EXCUSED";
    case "unmarked": throw new Error("Chưa chọn trạng thái điểm danh.");
  }
}

function initials(name: string): string {
  return name.trim().split(/\s+/).slice(-1)[0]?.slice(0, 1).toUpperCase() ?? "";
}

export const useAttendance = () => {
  const { classes, isLoading: areClassesLoading, error: classError } = useClassOptions();
  const [enrollments, setEnrollments] = useState<AttendanceEnrollment[]>([]);
  const [sessions, setSessions] = useState<AttendanceApiSession[]>([]);
  const [filters, setFilters] = useState<AttendanceFiltersState>({ classId: "", date: "" });
  const [drafts, setDrafts] = useState<Record<string, AttendanceDraft>>({});
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    Promise.all([attendanceService.getEnrollments(), attendanceService.getSessions()])
      .then(([enrollmentItems, sessionItems]) => {
        if (active) {
          setEnrollments(enrollmentItems);
          setSessions(sessionItems);
        }
      })
      .catch((loadError: unknown) => {
        if (active) {
          setError(loadError instanceof Error ? loadError.message : "Không thể tải dữ liệu điểm danh.");
        }
      })
      .finally(() => {
        if (active) setIsLoadingData(false);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    setFilters((current) => current.date ? current : { ...current, date: today() });
  }, []);

  useEffect(() => {
    if (!filters.classId && classes.length > 0) {
      setFilters((current) => ({ ...current, classId: classes[0].id }));
    }
  }, [classes, filters.classId]);

  useEffect(() => {
    setDrafts({});
  }, [filters.classId, filters.date]);

  const selectedClass: ClassOption | undefined = classes.find((item) => item.id === filters.classId);
  const selectedSession = sessions.find((session) =>
    session.classId === filters.classId
    && session.attendanceType.toUpperCase() === "CLASS"
    && session.attendanceDate === filters.date
    && session.period === null
  );

  const roster = useMemo(() => {
    const currentEnrollments = enrollments
      .filter((item) => item.classId === filters.classId && item.status.toLowerCase() === "active")
      .sort((left, right) => right.academicYear.localeCompare(left.academicYear));
    const uniqueStudents = new Map<string, AttendanceEnrollment>();
    currentEnrollments.forEach((item) => {
      if (!uniqueStudents.has(item.studentId)) uniqueStudents.set(item.studentId, item);
    });
    return [...uniqueStudents.values()].sort((left, right) =>
      left.studentName.localeCompare(right.studentName, "vi")
    );
  }, [enrollments, filters.classId]);

  const dailyItems = useMemo<DailyAttendanceItem[]>(() => {
    const existingRecords = new Map(
      (selectedSession?.records ?? []).map((record) => [record.enrollmentId, record]),
    );
    return roster.map((enrollment) => {
      const stored = existingRecords.get(enrollment.id);
      const draft = drafts[enrollment.id];
      return {
        id: enrollment.id,
        enrollmentId: enrollment.id,
        studentCode: enrollment.studentCode,
        fullName: enrollment.studentName,
        avatarLetter: initials(enrollment.studentName),
        status: draft?.status ?? toUiStatus(stored?.status),
        checkInTime: "—",
        note: draft?.note ?? stored?.note ?? "",
      };
    });
  }, [drafts, roster, selectedSession]);

  const setStudentStatus = useCallback((id: string, status: AttendanceStatus, note?: string) => {
    setDrafts((current) => ({
      ...current,
      [id]: {
        status,
        note: note ?? current[id]?.note ?? "",
      },
    }));
  }, []);

  const markAllPresent = useCallback(() => {
    setDrafts((current) => {
      const next = { ...current };
      roster.forEach((student) => {
        next[student.id] = { status: "present", note: current[student.id]?.note ?? "" };
      });
      return next;
    });
  }, [roster]);

  const saveDaily = useCallback(async () => {
    if (!selectedClass) throw new Error("Hãy chọn lớp được phép điểm danh.");
    const marked = dailyItems.filter((item) => item.status !== "unmarked");
    if (marked.length === 0) throw new Error("Hãy đánh dấu trạng thái cho ít nhất một học sinh.");
    setIsSaving(true);
    setError(null);
    try {
      let session: AttendanceApiSession;
      if (selectedSession) {
        session = selectedSession;
      } else {
        session = await attendanceService.createSession({
          classId: Number(selectedClass.id),
          attendanceDate: filters.date,
          attendanceType: "CLASS",
          period: null,
        });
      }
      await attendanceService.saveRecords(session.id, marked.map((item) => ({
        enrollmentId: Number(item.enrollmentId),
        status: toApiStatus(item.status),
        note: item.note.trim() || null,
      })));
      const updatedSession = await attendanceService.getSession(session.id);
      setSessions((current) => [
        ...current.filter((item) => item.id !== updatedSession.id),
        updatedSession,
      ]);
      setDrafts({});
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Không thể lưu điểm danh.");
      throw saveError;
    } finally {
      setIsSaving(false);
    }
  }, [dailyItems, filters.date, selectedClass, selectedSession]);

  const total = dailyItems.length;
  const presentCount = dailyItems.filter((item) => item.status === "present").length;
  const excusedCount = dailyItems.filter((item) => item.status === "excused").length;
  const unexcusedCount = dailyItems.filter((item) => item.status === "unexcused").length;
  const lateCount = dailyItems.filter((item) => item.status === "late").length;
  const markedCount = presentCount + excusedCount + unexcusedCount + lateCount;
  const attendanceRate = markedCount
    ? (((presentCount + lateCount) / markedCount) * 100).toFixed(1)
    : "0.0";

  return {
    classes,
    enrollments,
    sessions,
    selectedSession,
    dailyItems,
    isLoading: areClassesLoading || isLoadingData,
    isSaving,
    error: classError || error,
    filters,
    setFilters,
    setStudentStatus,
    markAllPresent,
    saveDaily,
    total,
    markedCount,
    presentCount,
    excusedCount,
    unexcusedCount,
    lateCount,
    attendanceRate,
  };
};
