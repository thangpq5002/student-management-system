import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AssessmentType,
  GradeEnrollment,
  GradeFiltersState,
  GradeRecord,
  GradeStudentRow,
  TeachingAssignment,
} from "../types";
import { gradeService, GradeWriteRequest } from "../services/grade.service";

function initials(name: string): string {
  return name.trim().split(/\s+/).slice(-2).map((part) => part[0] ?? "").join("").toUpperCase();
}

export const useGrades = () => {
  const [assignments, setAssignments] = useState<TeachingAssignment[]>([]);
  const [enrollments, setEnrollments] = useState<GradeEnrollment[]>([]);
  const [assessmentTypes, setAssessmentTypes] = useState<AssessmentType[]>([]);
  const [gradeRecords, setGradeRecords] = useState<GradeRecord[]>([]);
  const [draftScores, setDraftScores] = useState<Record<string, string>>({});
  const [filters, setFilters] = useState<GradeFiltersState>({
    assignmentId: "",
    assessmentNumber: "1",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    Promise.all([
      gradeService.getAssignments(),
      gradeService.getEnrollments(),
      gradeService.getAssessmentTypes(),
    ])
      .then(([assignmentItems, enrollmentItems, typeItems]) => {
        if (!active) return;
        setAssignments(assignmentItems);
        setEnrollments(enrollmentItems);
        setAssessmentTypes(typeItems);
        setFilters((current) => ({
          ...current,
          assignmentId: assignmentItems.some((item) => item.id === current.assignmentId)
            ? current.assignmentId
            : assignmentItems[0]?.id ?? "",
        }));
      })
      .catch((loadError: unknown) => {
        if (active) {
          setError(loadError instanceof Error ? loadError.message : "Không thể tải dữ liệu sổ điểm.");
        }
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const assignment = assignments.find((item) => item.id === filters.assignmentId) ?? null;

  const fetchRecords = useCallback(async () => {
    if (!assignment) {
      setGradeRecords([]);
      return;
    }
    const data = await gradeService.getGradeRecords(assignment);
    setGradeRecords(data);
  }, [assignment]);

  useEffect(() => {
    let active = true;
    setDraftScores({});
    if (!assignment) {
      setGradeRecords([]);
      return;
    }
    setIsLoading(true);
    gradeService.getGradeRecords(assignment)
      .then((data) => {
        if (active) {
          setGradeRecords(data);
          setError(null);
        }
      })
      .catch((loadError: unknown) => {
        if (active) {
          setGradeRecords([]);
          setError(loadError instanceof Error ? loadError.message : "Không thể tải điểm số.");
        }
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [assignment]);

  useEffect(() => {
    setDraftScores({});
  }, [filters.assessmentNumber]);

  const records = useMemo<GradeStudentRow[]>(() => {
    if (!assignment) return [];
    const typeWeights = new Map(assessmentTypes.map((type) => [type.id, type.weight]));
    return enrollments
      .filter((item) =>
        item.classId === assignment.classId
        && item.academicYear === assignment.academicYear
        && item.status.toLowerCase() === "active"
      )
      .map((enrollment) => {
        const grades = gradeRecords.filter((item) => item.enrollmentId === enrollment.id);
        const weightedScores = grades
          .map((grade) => ({ grade, weight: typeWeights.get(grade.assessmentTypeId) ?? 0 }))
          .filter((item) =>
            item.weight > 0
            && Number.isFinite(item.grade.score)
            && item.grade.score >= 0
            && item.grade.score <= 10
          );
        const totalWeight = weightedScores.reduce((sum, item) => sum + item.weight, 0);
        const average = totalWeight > 0
          ? weightedScores.reduce((sum, item) => sum + item.grade.score * item.weight, 0) / totalWeight
          : null;
        return {
          enrollmentId: enrollment.id,
          studentId: enrollment.studentId,
          studentCode: enrollment.studentCode,
          fullName: enrollment.studentName,
          avatarInitials: initials(enrollment.studentName),
          grades,
          avgScore: average === null ? null : Math.round(average * 10) / 10,
        };
      })
      .sort((left, right) => left.fullName.localeCompare(right.fullName, "vi"));
  }, [assignment, assessmentTypes, enrollments, gradeRecords]);

  const draftKey = (enrollmentId: string, assessmentTypeId: string) =>
    `${enrollmentId}:${assessmentTypeId}:${filters.assessmentNumber}`;

  const handleCellChange = (
    enrollmentId: string,
    assessmentTypeId: string,
    value: string,
  ) => {
    setDraftScores((current) => ({
      ...current,
      [draftKey(enrollmentId, assessmentTypeId)]: value,
    }));
  };

  const scoreFor = (record: GradeStudentRow, assessmentTypeId: string): string => {
    const key = draftKey(record.enrollmentId, assessmentTypeId);
    if (Object.hasOwn(draftScores, key)) return draftScores[key];
    const saved = record.grades.find((grade) =>
      grade.assessmentTypeId === assessmentTypeId
      && grade.assessmentNumber === Number(filters.assessmentNumber)
    );
    return saved ? String(saved.score) : "";
  };

  const saveGrades = async () => {
    if (!assignment || assessmentTypes.length === 0) {
      throw new Error("Hãy chọn phân công và đảm bảo hệ thống có loại điểm trước khi lưu.");
    }
    const assessmentNumber = Number(filters.assessmentNumber);
    if (!Number.isInteger(assessmentNumber) || assessmentNumber < 1) {
      throw new Error("Số thứ tự bài đánh giá phải là số nguyên dương.");
    }

    const changes: Array<{ request: GradeWriteRequest; existing: GradeRecord | undefined }> = [];
    for (const [key, draftValue] of Object.entries(draftScores)) {
      const [enrollmentId, assessmentTypeId, draftAssessmentNumber] = key.split(":");
      if (draftAssessmentNumber !== filters.assessmentNumber) continue;
      const record = records.find((item) => item.enrollmentId === enrollmentId);
      const assessmentType = assessmentTypes.find((item) => item.id === assessmentTypeId);
      if (!record || !assessmentType) continue;
      const rawScore = draftValue.trim().replace(",", ".");
      const existing = record.grades.find((grade) =>
        grade.assessmentTypeId === assessmentType.id
        && grade.assessmentNumber === assessmentNumber
      );
      if (!rawScore) {
        if (existing) throw new Error(`Không thể để trống điểm đã nhập của ${record.fullName}.`);
        continue;
      }
      if (!/^(?:10(?:\.0{1,2})?|[0-9](?:\.\d{1,2})?)$/.test(rawScore)) {
        throw new Error(`Điểm của ${record.fullName} phải nằm trong khoảng 0–10, tối đa 2 chữ số thập phân.`);
      }
      const score = Number(rawScore);
      if (existing?.score === score) continue;
      changes.push({
        existing,
        request: {
          enrollmentId: Number(record.enrollmentId),
          classTeacherId: Number(assignment.id),
          assessmentTypeId: Number(assessmentType.id),
          semester: assignment.semester,
          assessmentNumber,
          score,
        },
      });
    }

    if (changes.length === 0) {
      throw new Error("Chưa có thay đổi điểm để lưu.");
    }
    setIsSaving(true);
    setError(null);
    try {
      for (const change of changes) {
        const record = records.find(
          (item) => Number(item.enrollmentId) === change.request.enrollmentId,
        );
        const assessmentType = assessmentTypes.find(
          (item) => Number(item.id) === change.request.assessmentTypeId,
        );
        try {
          if (change.existing) {
            await gradeService.updateGrade(change.existing.id, change.request);
          } else {
            await gradeService.createGrade(change.request);
          }
        } catch (requestError) {
          const detail = requestError instanceof Error
            ? requestError.message
            : "Lỗi không xác định từ máy chủ.";
          throw new Error(
            `Không lưu được điểm ${assessmentType?.name ?? ""} của ${record?.fullName ?? "học sinh"}: ${detail}`,
          );
        }
      }
      setDraftScores({});
    } catch (saveError) {
      try {
        await fetchRecords();
      } catch (refreshError) {
        const refreshDetail = refreshError instanceof Error
          ? refreshError.message
          : "Lỗi không xác định.";
        throw new Error(
          `${saveError instanceof Error ? saveError.message : "Không thể lưu điểm."} Danh sách điểm hiện chưa tải lại được: ${refreshDetail}`,
        );
      }
      throw saveError;
    } finally {
      setIsSaving(false);
    }
    try {
      await fetchRecords();
    } catch (refreshError) {
      throw new Error(
        `Điểm đã lưu thành công nhưng không thể tải lại bảng điểm: ${
          refreshError instanceof Error ? refreshError.message : "Lỗi không xác định."
        }`,
      );
    }
  };

  const totalStudents = records.length;
  const completedCount = records.filter((record) => record.grades.length > 0).length;
  const averages = records.flatMap((record) => record.avgScore === null ? [] : [record.avgScore]);
  const classAverage = averages.length
    ? (averages.reduce((sum, value) => sum + value, 0) / averages.length).toFixed(2)
    : "—";

  return {
    assignments,
    assessmentTypes,
    assignment,
    records,
    isLoading,
    isSaving,
    hasDraftScores: Object.keys(draftScores).length > 0,
    error,
    filters,
    setFilters,
    handleCellChange,
    scoreFor,
    saveGrades,
    refresh: fetchRecords,
    totalStudents,
    completedCount,
    classAverage,
  };
};
