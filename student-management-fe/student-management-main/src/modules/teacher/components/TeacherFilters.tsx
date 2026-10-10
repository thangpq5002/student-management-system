import React from 'react';
import { TeacherFiltersState } from '../types';
import { Search, RotateCcw, ChevronDown } from 'lucide-react';

interface TeacherFiltersProps {
  filters: TeacherFiltersState;
  onFilterChange: (filters: Partial<TeacherFiltersState>) => void;
  onReset: () => void;
}

export const TeacherFilters: React.FC<TeacherFiltersProps> = ({
  filters,
  onFilterChange,
  onReset,
}) => {
  return (
    <div className="p-4 sm:p-5 bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
      {/* Search Input */}
      <div className="relative flex-1 min-w-[280px]">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-outline pointer-events-none" />
        <input
          type="search"
          value={filters.search}
          onChange={(e) => onFilterChange({ search: e.target.value })}
          placeholder="Tìm theo Họ tên, Mã GV, Email, Số điện thoại..."
          className="w-full h-11 pl-10 pr-4 bg-surface-container-low text-on-surface placeholder:text-outline text-xs sm:text-sm rounded-xl outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-secondary/20 transition-all border border-transparent focus:border-secondary"
        />
      </div>

      {/* Filter Dropdowns */}
      <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
        {/* Bộ môn */}
        <div className="relative min-w-[150px] flex-1 sm:flex-initial">
          <select
            value={filters.department}
            onChange={(e) => onFilterChange({ department: e.target.value })}
            className="w-full h-11 pl-3 pr-8 bg-surface-container-low text-on-surface font-medium text-xs sm:text-sm rounded-xl appearance-none outline-none focus:ring-2 focus:ring-secondary/20 cursor-pointer"
          >
            <option value="">Tất cả tổ bộ môn</option>
            <option value="Toán">Tổ Toán - Tin</option>
            <option value="Ngữ Văn">Tổ Ngữ Văn</option>
            <option value="Ngoại ngữ">Tổ Tiếng Anh</option>
            <option value="KHTN">Tổ KHTN (Lý - Hóa - Sinh)</option>
            <option value="KHXH">Tổ KHXH (Sử - Địa - GDCD)</option>
            <option value="GDTC">Tổ Thể chất - Nghệ thuật</option>
          </select>
          <ChevronDown className="w-4 h-4 pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-outline" />
        </div>

        {/* Trạng thái */}
        <div className="relative min-w-[140px] flex-1 sm:flex-initial">
          <select
            value={filters.status}
            onChange={(e) => onFilterChange({ status: e.target.value })}
            className="w-full h-11 pl-3 pr-8 bg-surface-container-low text-on-surface font-medium text-xs sm:text-sm rounded-xl appearance-none outline-none focus:ring-2 focus:ring-secondary/20 cursor-pointer"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="active">Đang công tác</option>
            <option value="leave">Nghỉ phép / Thai sản</option>
            <option value="transferred">Đã chuyển trường</option>
          </select>
          <ChevronDown className="w-4 h-4 pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-outline" />
        </div>

        {/* Trình độ */}
        <div className="relative min-w-[130px] flex-1 sm:flex-initial">
          <select
            value={filters.degree}
            onChange={(e) => onFilterChange({ degree: e.target.value })}
            className="w-full h-11 pl-3 pr-8 bg-surface-container-low text-on-surface font-medium text-xs sm:text-sm rounded-xl appearance-none outline-none focus:ring-2 focus:ring-secondary/20 cursor-pointer"
          >
            <option value="">Tất cả trình độ</option>
            <option value="Tiến sĩ">Tiến sĩ</option>
            <option value="Thạc sĩ">Thạc sĩ</option>
            <option value="Cử nhân">Cử nhân</option>
          </select>
          <ChevronDown className="w-4 h-4 pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-outline" />
        </div>

        {/* Reset Filter Button */}
        <button
          type="button"
          onClick={onReset}
          className="h-11 px-3.5 rounded-xl bg-surface-container-low text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors flex items-center justify-center shrink-0 cursor-pointer"
          title="Đặt lại bộ lọc"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
