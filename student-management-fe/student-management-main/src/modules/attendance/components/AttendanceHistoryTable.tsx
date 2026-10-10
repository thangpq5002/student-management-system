import React from 'react';
import { AttendanceHistoryItem } from '../types';
import { CheckCircle2, Clock, XCircle, FileText } from 'lucide-react';

interface AttendanceHistoryTableProps {
  items: AttendanceHistoryItem[];
  isLoading?: boolean;
}

export const AttendanceHistoryTable: React.FC<AttendanceHistoryTableProps> = ({
  items,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="bg-surface-container-lowest rounded-2xl p-8 flex flex-col items-center justify-center gap-3">
        <span className="material-symbols-outlined text-[32px] text-primary animate-spin">
          progress_activity
        </span>
        <p className="text-sm text-on-surface-variant font-medium">Đang tải lịch sử điểm danh...</p>
      </div>
    );
  }

  const getStatusBadge = (status: AttendanceHistoryItem['status']) => {
    switch (status) {
      case 'present':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs bg-surface-container-highest text-primary font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
            Có mặt
          </span>
        );
      case 'excused':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs bg-tertiary-fixed text-tertiary-container font-semibold">
            <FileText className="w-3.5 h-3.5 text-tertiary" />
            Có phép
          </span>
        );
      case 'unexcused':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs bg-error-container text-error font-semibold">
            <XCircle className="w-3.5 h-3.5 text-error" />
            Không phép
          </span>
        );
      case 'late':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs bg-secondary-fixed text-secondary font-semibold">
            <Clock className="w-3.5 h-3.5 text-secondary" />
            Đi muộn (10p)
          </span>
        );
      default:
        return <span className="text-xs text-outline">Chưa ghi nhận</span>;
    }
  };

  return (
    <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 overflow-hidden flex flex-col">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low text-on-surface-variant text-[11px] font-semibold uppercase tracking-wider h-11 select-none">
              <th className="py-2.5 px-4 text-center w-12 font-semibold">STT</th>
              <th className="py-2.5 px-4 font-semibold">Ngày &amp; Buổi</th>
              <th className="py-2.5 px-4 font-semibold">Lớp</th>
              <th className="py-2.5 px-4 font-semibold">Tiết / Môn học</th>
              <th className="py-2.5 px-4 font-semibold">Mã HS</th>
              <th className="py-2.5 px-4 min-w-[180px] font-semibold">Họ và tên</th>
              <th className="py-2.5 px-4 font-semibold">Trạng thái</th>
              <th className="py-2.5 px-4 font-semibold">Thời gian</th>
              <th className="py-2.5 px-4 font-semibold">GV Điểm danh</th>
              <th className="py-2.5 px-4 min-w-[200px] font-semibold">Ghi chú / Minh chứng</th>
              <th className="py-2.5 px-4 min-w-[180px] font-semibold">Ghi chú</th>
            </tr>
          </thead>
          <tbody className="text-xs sm:text-sm font-normal text-on-surface divide-y divide-outline-variant/15">
            {items.map((item, index) => {
              const indexStr = (index + 1).toString().padStart(2, '0');

              return (
                <tr
                  key={item.id}
                  className="hover:bg-surface-container-low/70 transition-colors h-[54px]"
                >
                  <td className="px-4 text-center text-outline font-mono text-xs">
                    {indexStr}
                  </td>

                  <td className="px-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="font-semibold text-on-surface">{item.dateStr}</span>
                      <span className="text-[10px] text-outline">{item.session}</span>
                    </div>
                  </td>

                  <td className="px-4 whitespace-nowrap font-bold text-primary font-mono text-xs">
                    {item.className}
                  </td>

                  <td className="px-4 whitespace-nowrap">
                    <div className="flex items-center gap-1.5 text-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                      <span className="font-semibold text-on-surface">{item.periodSubject.split('·')[0]}</span>
                      <span className="text-outline">·</span>
                      <span className="text-on-surface-variant">{item.periodSubject.split('·')[1]}</span>
                    </div>
                  </td>

                  <td className="px-4 whitespace-nowrap font-mono text-xs font-semibold text-secondary">
                    {item.studentCode}
                  </td>

                  <td className="px-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-surface-container text-on-surface flex items-center justify-center font-bold text-[11px]">
                        {item.avatarInitials}
                      </div>
                      <span className="font-semibold text-on-surface">{item.fullName}</span>
                    </div>
                  </td>

                  <td className="px-4 whitespace-nowrap">
                    {getStatusBadge(item.status)}
                  </td>

                  <td className="px-4 whitespace-nowrap font-mono text-xs text-on-surface-variant">
                    {item.checkInTime}
                  </td>

                  <td className="px-4 whitespace-nowrap text-on-surface font-medium">
                    {item.teacherName}
                  </td>

                  <td className="px-4 max-w-xs">
                    <div className="flex items-center gap-1.5 text-xs text-on-surface-variant truncate">
                      <span className="truncate">{item.note}</span>
                    </div>
                  </td>
                </tr>
              );
            })}
            {items.length === 0 && (
              <tr>
                <td colSpan={10} className="p-8 text-center text-sm text-on-surface-variant">
                  Không có bản ghi điểm danh phù hợp.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
