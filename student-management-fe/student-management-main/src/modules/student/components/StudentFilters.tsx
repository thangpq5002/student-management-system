import React from 'react';
import { StudentFiltersState } from '../types';
import { GRADE_LEVELS } from '../constants';
import { useClassOptions } from '@/modules/class/hooks/useClassOptions';
import { Search, RotateCcw, ChevronDown } from 'lucide-react';

interface StudentFiltersProps {
  filters: StudentFiltersState;
  onFilterChange: (filters: Partial<StudentFiltersState>) => void;
  onReset: () => void;
}

export const StudentFilters: React.FC<StudentFiltersProps> = ({
  filters,
  onFilterChange,
  onReset,
}) => {
  const { classes, isLoading: isLoadingClasses, error: classLoadError } = useClassOptions();

  return (
    <div className="p-4 sm:p-5 bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
      {/* Search Field */}
      <div className="relative flex-1 max-w-lg">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-outline pointer-events-none" />
        <input
          type="text"
          value={filters.search}
          onChange={(e) => onFilterChange({ search: e.target.value })}
          placeholder="Tìm kiếm theo Mã HS, Họ tên, Email..."
          className="w-full pl-10 pr-4 py-2.5 bg-surface-container-low text-on-surface placeholder:text-outline text-xs sm:text-sm rounded-xl outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-secondary/20 transition-all border border-transparent focus:border-secondary"
        />
      </div>

      {/* Dropdowns & Reset Group */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Grade filter */}
        <div className="relative min-w-[130px] flex-1 sm:flex-initial">
          <select
            value={filters.gradeLevel}
            onChange={(e) => onFilterChange({ gradeLevel: e.target.value })}
            className="w-full appearance-none pl-3 pr-8 py-2.5 bg-surface-container-low text-on-surface font-medium text-xs sm:text-sm rounded-xl outline-none cursor-pointer hover:bg-surface-container transition-colors"
          >
            <option value="">Khối lớp: Tất cả</option>
            {GRADE_LEVELS.map((g) => (
              <option key={g.value} value={g.value}>
                {g.label}
              </option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-outline" />
        </div>

        {/* Class filter */}
        <div className="relative min-w-[120px] flex-1 sm:flex-initial">
          <select
            value={filters.className}
            onChange={(e) => onFilterChange({ className: e.target.value })}
            disabled={isLoadingClasses}
            className="w-full appearance-none pl-3 pr-8 py-2.5 bg-surface-container-low text-on-surface font-medium text-xs sm:text-sm rounded-xl outline-none cursor-pointer hover:bg-surface-container transition-colors"
          >
            <option value="">{isLoadingClasses ? 'Đang tải lớp...' : 'Lớp học: Tất cả'}</option>
            {classes.map((item) => (
              <option key={item.id} value={item.name}>
                {item.name}
              </option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-outline" />
        </div>
        {classLoadError && <p role="alert" className="basis-full text-xs text-error">{classLoadError}</p>}

        {/* Status filter */}
        <div className="relative min-w-[140px] flex-1 sm:flex-initial">
          <select
            value={filters.status}
            onChange={(e) => onFilterChange({ status: e.target.value })}
            className="w-full appearance-none pl-3 pr-8 py-2.5 bg-surface-container-low text-on-surface font-medium text-xs sm:text-sm rounded-xl outline-none cursor-pointer hover:bg-surface-container transition-colors"
          >
            <option value="">Trạng thái: Tất cả</option>
            <option value="active">Đang học</option>
            <option value="suspended">Bảo lưu</option>
            <option value="transferred">Chuyển trường</option>
          </select>
          <ChevronDown className="w-4 h-4 pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-outline" />
        </div>

        {/* Reset button */}
        <button
          type="button"
          onClick={onReset}
          className="p-2.5 bg-surface-container-low text-on-surface-variant hover:text-on-surface rounded-xl hover:bg-surface-container transition-colors cursor-pointer"
          title="Đặt lại bộ lọc"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
