import React from "react";
import { AssessmentType, GradeStudentRow } from "../types";

interface GradeTableProps {
  records: GradeStudentRow[];
  assessmentTypes: AssessmentType[];
  assessmentNumber: number;
  onCellChange: (enrollmentId: string, assessmentTypeId: string, value: string) => void;
  scoreFor: (record: GradeStudentRow, assessmentTypeId: string) => string;
  disabled?: boolean;
}

export const GradeTable: React.FC<GradeTableProps> = ({
  records,
  assessmentTypes,
  assessmentNumber,
  onCellChange,
  scoreFor,
  disabled,
}) => {
  return (
    <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container text-xs text-on-surface-variant uppercase tracking-wider h-11">
              <th className="py-3 px-4 text-center w-12 font-semibold">STT</th>
              <th className="py-3 px-4 w-28 font-semibold">Mã HS</th>
              <th className="py-3 px-5 min-w-[190px] font-semibold">Họ và tên</th>
              {assessmentTypes.map((type) => (
                <th key={type.id} className="min-w-36 px-4 py-3 text-center font-semibold">
                  <span className="block">{type.name}</span>
                  <span className="mt-1 block text-[10px] font-normal normal-case tracking-normal">
                    {type.code} · hệ số {type.weight} · lần {assessmentNumber}
                  </span>
                </th>
              ))}
              <th className="py-3 px-4 text-right w-32 font-semibold">ĐTB có trọng số</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/15 text-sm text-on-surface">
            {records.map((record, index) => (
              <tr key={record.enrollmentId} className="hover:bg-surface-container-low/60">
                <td className="py-3 px-4 text-center font-mono text-xs text-outline">
                  {(index + 1).toString().padStart(2, "0")}
                </td>
                <td className="py-3 px-4 font-mono text-xs font-semibold text-primary">
                  {record.studentCode}
                </td>
                <td className="py-3 px-5 font-medium">
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-full bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center font-bold text-[11px] shrink-0">
                      {record.avatarInitials}
                    </span>
                    <span>{record.fullName}</span>
                  </div>
                </td>
                {assessmentTypes.map((type) => (
                  <td key={type.id} className="px-4 py-3 text-center">
                    <input
                      type="number"
                      min={0}
                      max={10}
                      step={0.01}
                      inputMode="decimal"
                      aria-label={`${type.name}, lần ${assessmentNumber}, của ${record.fullName}`}
                      value={scoreFor(record, type.id)}
                      onChange={(event) =>
                        onCellChange(record.enrollmentId, type.id, event.target.value)
                      }
                      disabled={disabled}
                      className="h-10 w-24 rounded-xl bg-surface-container-low px-2 text-center font-mono text-sm font-semibold focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                    />
                  </td>
                ))}
                <td className="py-3 px-4 text-right font-mono font-bold text-secondary">
                  {record.avgScore === null ? "—" : record.avgScore.toFixed(1)}
                </td>
              </tr>
            ))}
            {records.length === 0 && (
              <tr>
                <td colSpan={assessmentTypes.length + 4} className="p-8 text-center text-sm text-on-surface-variant">
                  Không có học sinh đang ghi danh cho lớp và năm học này. Nhờ ADMIN mở chi tiết lớp,
                  chọn đúng năm học và ghi danh học sinh; không cần thay đổi năm học của phân công.
                </td>
              </tr>
            )}
            {assessmentTypes.length === 0 && records.length > 0 && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-sm text-on-surface-variant">
                  Chưa có loại điểm nào được cấu hình trong hệ thống.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
