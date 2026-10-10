import React from 'react';
import { SubjectFiltersState } from '../types';
import { Search, RotateCcw } from 'lucide-react';

interface SubjectFiltersProps {
  filters: SubjectFiltersState;
  onFilterChange: (filters: Partial<SubjectFiltersState>) => void;
  onReset: () => void;
}

export const SubjectFilters: React.FC<SubjectFiltersProps> = ({
  filters,
  onFilterChange,
  onReset,
}) => {
  return (
    <div className="bg-surface-container-lowest rounded-2xl p-4 sm:p-5 mb-5 shadow-sm border border-outline-variant/20">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-3 items-center">
        {/* Search input */}
        <div className="sm:col-span-2 md:col-span-4 relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none" />
          <input
            type="search"
            value={filters.search}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            placeholder="Tìm theo tên môn, mã môn, tổ trưởng..."
            className="w-full h-11 pl-9 pr-4 rounded-xl bg-surface-container-low text-on-surface placeholder:text-outline text-xs sm:text-sm focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-secondary/20 transition-all border border-transparent focus:border-secondary"
          />
        </div>

        {/* Dropdown Tổ Chuyên môn */}
        <div className="md:col-span-3">
          <select
            value={filters.department}
            onChange={(e) => onFilterChange({ department: e.target.value })}
            className="w-full h-11 px-3.5 rounded-xl bg-surface-container-low text-on-surface text-xs sm:text-sm focus:outline-none focus:bg-surface-container-lowest cursor-pointer border border-transparent focus:border-secondary"
          >
            <option value="">Tất cả tổ chuyên môn</option>
            <option value="Toán">Tổ Toán - Tin học</option>
            <option value="Ngữ Văn">Tổ Ngữ Văn</option>
            <option value="Ngoại ngữ">Tổ Ngoại ngữ</option>
            <option value="KHTN">Tổ KHTN (Lý, Hóa, Sinh)</option>
            <option value="KHXH">Tổ KHXH (Sử, Địa, GDCD)</option>
            <option value="GDTC">Tổ GDTC - Nghệ thuật</option>
          </select>
        </div>

        {/* Dropdown Hình thức đánh giá */}
        <div className="md:col-span-2">
          <select
            value={filters.evaluationType}
            onChange={(e) => onFilterChange({ evaluationType: e.target.value })}
            className="w-full h-11 px-3 rounded-xl bg-surface-container-low text-on-surface text-xs sm:text-sm focus:outline-none focus:bg-surface-container-lowest cursor-pointer border border-transparent focus:border-secondary"
          >
            <option value="">Hình thức đánh giá</option>
            <option value="score">Tính điểm số (1 - 10)</option>
            <option value="evaluation">Đánh giá nhận xét (Đ/CĐ)</option>
          </select>
        </div>

        {/* Dropdown Khối áp dụng */}
        <div className="md:col-span-2">
          <select
            value={filters.gradeLevel}
            onChange={(e) => onFilterChange({ gradeLevel: e.target.value })}
            className="w-full h-11 px-3 rounded-xl bg-surface-container-low text-on-surface text-xs sm:text-sm focus:outline-none focus:bg-surface-container-lowest cursor-pointer border border-transparent focus:border-secondary"
          >
            <option value="">Tất cả các khối</option>
            <option value="10">Khối 10</option>
            <option value="11">Khối 11</option>
            <option value="12">Khối 12</option>
          </select>
        </div>

        {/* Reset Filter Button */}
        <div className="md:col-span-1 flex justify-end">
          <button
            type="button"
            onClick={onReset}
            className="w-11 h-11 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface-variant hover:text-on-surface flex items-center justify-center transition-colors cursor-pointer"
            title="Làm mới bộ lọc"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
