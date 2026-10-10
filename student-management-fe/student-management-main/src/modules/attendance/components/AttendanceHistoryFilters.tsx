import React from 'react';
import { ClassOption } from '@/modules/class/services/class.service';
import { AttendanceHistoryFiltersState } from '../types';

interface AttendanceHistoryFiltersProps {
  classes: ClassOption[];
  filters: AttendanceHistoryFiltersState;
  onChange: (filters: Partial<AttendanceHistoryFiltersState>) => void;
  onReset: () => void;
}

const fieldClass =
  'w-full rounded-xl border border-outline-variant/30 bg-surface-container-low px-3 py-2 text-xs sm:text-sm text-on-surface';

export const AttendanceHistoryFilters: React.FC<AttendanceHistoryFiltersProps> = ({
  classes,
  filters,
  onChange,
  onReset,
}) => (
  <div className="bg-surface-container-lowest rounded-2xl p-4 sm:p-5 shadow-sm border border-outline-variant/20">
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 items-end">
      <label className="flex flex-col gap-1.5 text-xs font-semibold text-on-surface">
        Tìm học sinh
        <input
          type="search"
          value={filters.search}
          onChange={(event) => onChange({ search: event.target.value })}
          placeholder="Tên hoặc mã học sinh"
          className={fieldClass}
        />
      </label>
      <label className="flex flex-col gap-1.5 text-xs font-semibold text-on-surface">
        Lớp
        <select
          value={filters.classId}
          onChange={(event) => onChange({ classId: event.target.value })}
          className={fieldClass}
        >
          <option value="">Tất cả lớp được phép xem</option>
          {classes.map((item) => (
            <option key={item.id} value={item.id}>{item.label}</option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-1.5 text-xs font-semibold text-on-surface">
        Ngày
        <input
          type="date"
          value={filters.date}
          onChange={(event) => onChange({ date: event.target.value })}
          className={fieldClass}
        />
      </label>
      <div className="flex items-end gap-2">
        <label className="flex flex-1 flex-col gap-1.5 text-xs font-semibold text-on-surface">
          Trạng thái
          <select
            value={filters.status}
            onChange={(event) => onChange({ status: event.target.value })}
            className={fieldClass}
          >
            <option value="all">Tất cả</option>
            <option value="present">Có mặt</option>
            <option value="late">Đi muộn</option>
            <option value="excused">Vắng có phép</option>
            <option value="unexcused">Vắng không phép</option>
          </select>
        </label>
        <button
          type="button"
          onClick={onReset}
          className="rounded-xl bg-surface-container px-4 py-2 text-xs font-semibold text-on-surface hover:bg-surface-container-high"
        >
          Đặt lại
        </button>
      </div>
    </div>
  </div>
);
