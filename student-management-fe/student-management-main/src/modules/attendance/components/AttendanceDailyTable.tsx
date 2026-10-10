import React from 'react';
import { DailyAttendanceItem, AttendanceStatus } from '../types';
import { CheckCircle2, FileText, XCircle, Clock } from 'lucide-react';

interface AttendanceDailyTableProps {
  items: DailyAttendanceItem[];
  onStatusChange: (id: string, status: AttendanceStatus) => void;
  onNoteChange: (id: string, note: string) => void;
  isLoading?: boolean;
}

export const AttendanceDailyTable: React.FC<AttendanceDailyTableProps> = ({
  items,
  onStatusChange,
  onNoteChange,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="bg-surface-container-lowest rounded-2xl p-8 flex flex-col items-center justify-center gap-3">
        <span className="material-symbols-outlined text-[32px] text-primary animate-spin">
          progress_activity
        </span>
        <p className="text-sm text-on-surface-variant font-medium">Đang tải sổ điểm danh...</p>
      </div>
    );
  }

  return (
    <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 overflow-hidden flex flex-col">
      <div className="overflow-x-auto w-full">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low/70 h-10 text-on-surface-variant text-[11px] font-semibold uppercase tracking-wider select-none">
              <th className="py-2.5 px-4 w-12 text-center font-semibold">STT</th>
              <th className="py-2.5 px-4 w-28 font-semibold">Mã HS</th>
              <th className="py-2.5 px-4 min-w-[200px] font-semibold">Họ và tên</th>
              <th className="py-2.5 px-4 min-w-[340px] text-center font-semibold">Trạng thái chuyên cần</th>
              <th className="py-2.5 px-4 w-32 text-center font-semibold">Giờ vào lớp</th>
              <th className="py-2.5 px-4 min-w-[220px] font-semibold">Lý do / Ghi chú</th>
              <th className="py-2.5 px-4 w-16 text-center font-semibold">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/15 text-sm text-on-surface">
            {items.map((item, index) => {
              const indexStr = (index + 1).toString().padStart(2, '0');
              const isUnexcused = item.status === 'unexcused';
              const isExcused = item.status === 'excused';
              const isLate = item.status === 'late';

              return (
                <tr
                  key={item.id}
                  className={`h-14 transition-colors group ${
                    isUnexcused
                      ? 'bg-error-container/20 hover:bg-error-container/30'
                      : isExcused
                      ? 'bg-tertiary-fixed/30 hover:bg-tertiary-fixed/40'
                      : isLate
                      ? 'bg-surface-container-high/40 hover:bg-surface-container-high/60'
                      : 'hover:bg-surface-container-low/40'
                  }`}
                >
                  {/* STT */}
                  <td className="px-4 text-center font-mono text-xs text-outline">
                    {indexStr}
                  </td>

                  {/* Mã HS */}
                  <td className="px-4 font-mono text-xs font-semibold text-primary">
                    {item.studentCode}
                  </td>

                  {/* Họ tên */}
                  <td className="px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center font-bold text-xs text-on-primary-fixed shrink-0">
                        {item.avatarLetter}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-semibold text-on-surface truncate group-hover:text-primary transition-colors">
                          {item.fullName}
                        </span>
                        {item.roleSubtitle && (
                          <span
                            className={`text-[11px] truncate ${
                              isUnexcused
                                ? 'text-error font-medium'
                                : isExcused
                                ? 'text-tertiary font-medium'
                                : isLate
                                ? 'text-surface-tint font-medium'
                                : 'text-outline'
                            }`}
                          >
                            {item.roleSubtitle}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Segmented Buttons for Attendance Status */}
                  <td className="px-4">
                    <div className="flex items-center justify-center gap-1 p-1 bg-surface-container-low rounded-xl">
                      {/* Có mặt */}
                      <button
                        type="button"
                        onClick={() => onStatusChange(item.id, 'present')}
                        className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                          item.status === 'present'
                            ? 'bg-secondary-container text-on-secondary shadow-sm'
                            : 'text-on-surface-variant hover:bg-surface-container-lowest'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Có mặt</span>
                      </button>

                      {/* Phép (P) */}
                      <button
                        type="button"
                        onClick={() => onStatusChange(item.id, 'excused')}
                        className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                          item.status === 'excused'
                            ? 'bg-tertiary text-on-tertiary shadow-sm'
                            : 'text-on-surface-variant hover:bg-surface-container-lowest'
                        }`}
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Phép (P)</span>
                      </button>

                      {/* K.Phép */}
                      <button
                        type="button"
                        onClick={() => onStatusChange(item.id, 'unexcused')}
                        className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                          item.status === 'unexcused'
                            ? 'bg-error text-on-error shadow-sm'
                            : 'text-on-surface-variant hover:bg-surface-container-lowest'
                        }`}
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>K.Phép</span>
                      </button>

                      {/* Muộn */}
                      <button
                        type="button"
                        onClick={() => onStatusChange(item.id, 'late')}
                        className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                          item.status === 'late'
                            ? 'bg-surface-tint text-on-primary shadow-sm'
                            : 'text-on-surface-variant hover:bg-surface-container-lowest'
                        }`}
                      >
                        <Clock className="w-3.5 h-3.5" />
                        <span>Muộn</span>
                      </button>
                    </div>
                  </td>

                  {/* Giờ vào lớp */}
                      <td className="px-4 text-center font-mono text-xs text-outline">
                        {item.checkInTime}
                      </td>

                  {/* Ghi chú / lý do */}
                  <td className="px-4">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={item.note}
                        onChange={(e) => onNoteChange(item.id, e.target.value)}
                        placeholder="Nhập ghi chú..."
                        className={`w-full h-9 px-3 rounded-lg text-xs transition-colors outline-none ${
                          isUnexcused
                            ? 'bg-surface-container-low text-error placeholder:text-error/60'
                            : 'bg-transparent hover:bg-surface-container-low focus:bg-surface-container-low text-on-surface'
                        }`}
                      />
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-4 text-center">
                    <span className="text-xs text-outline">
                      {item.status === 'unmarked' ? 'Chưa ghi nhận' : 'Đã ghi nhận'}
                    </span>
                  </td>
                </tr>
              );
            })}
            {items.length === 0 && (
              <tr>
                <td colSpan={7} className="p-8 text-center text-sm text-on-surface-variant">
                  Không có học sinh đang ghi danh trong lớp này; cần có enrollment ACTIVE để điểm danh.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
