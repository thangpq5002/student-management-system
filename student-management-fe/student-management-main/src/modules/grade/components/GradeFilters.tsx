import React from "react";
import { GradeFiltersState, TeachingAssignment } from "../types";

interface GradeFiltersProps {
  assignments: TeachingAssignment[];
  filters: GradeFiltersState;
  isLoading: boolean;
  onChange: (filters: Partial<GradeFiltersState>) => void;
}

const selectClassName =
  "w-full h-11 px-3.5 bg-surface-container-low text-on-surface text-xs sm:text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary/20 border border-transparent focus:border-secondary disabled:opacity-50";

export const GradeFilters: React.FC<GradeFiltersProps> = ({
  assignments,
  filters,
  isLoading,
  onChange,
}) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 p-5 bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20">
    <label className="flex flex-col gap-1.5 text-xs font-semibold text-on-surface">
      Lớp và môn được phân công
      <select
        value={filters.assignmentId}
        onChange={(event) => onChange({ assignmentId: event.target.value })}
        disabled={isLoading || assignments.length === 0}
        className={selectClassName}
      >
        <option value="">{isLoading ? "Đang tải phân công..." : "Chọn lớp / môn học"}</option>
        {assignments.map((assignment) => (
          <option key={assignment.id} value={assignment.id}>
            {assignment.className} · {assignment.subjectName} · {assignment.academicYear} · {assignment.semester.replace("_", " ")}
          </option>
        ))}
      </select>
    </label>

    <label className="flex flex-col gap-1.5 text-xs font-semibold text-on-surface">
      Lần đánh giá
      <input
        type="number"
        min={1}
        step={1}
        value={filters.assessmentNumber}
        onChange={(event) => onChange({ assessmentNumber: event.target.value })}
        disabled={isLoading}
        className={selectClassName}
      />
    </label>

    <div className="flex flex-col justify-center gap-1 text-xs text-on-surface-variant">
      <span>Năm học và học kỳ</span>
      <strong className="text-sm text-primary">
        {assignments.find((item) => item.id === filters.assignmentId)
          ? `${assignments.find((item) => item.id === filters.assignmentId)?.academicYear} · ${assignments.find((item) => item.id === filters.assignmentId)?.semester.replace("_", " ")}`
          : "Chưa chọn phân công"}
      </strong>
    </div>
  </div>
);
