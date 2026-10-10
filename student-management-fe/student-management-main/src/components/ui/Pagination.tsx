import React from 'react';
import { cn } from '@/lib/utils';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  className?: string;
  itemLabel?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  className,
  itemLabel = 'mục',
}) => {
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage, '...', totalPages);
      }
    }
    return pages;
  };

  return (
    <div
      className={cn(
        'px-6 py-4 bg-surface-container-lowest flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-outline-variant/15',
        className
      )}
    >
      <div className="text-xs text-on-surface-variant">
        Hiển thị <span className="font-semibold text-on-surface">{startItem} - {endItem}</span> trong số{' '}
        <span className="font-semibold text-on-surface">{totalItems.toLocaleString()}</span> {itemLabel}
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="h-8 w-8 rounded-lg flex items-center justify-center text-outline hover:bg-surface-container hover:text-on-surface transition-colors disabled:opacity-30 disabled:pointer-events-none"
          title="Trang trước"
        >
          <span className="material-symbols-outlined text-[18px]">chevron_left</span>
        </button>

        {getPageNumbers().map((page, idx) =>
          typeof page === 'number' ? (
            <button
              key={idx}
              onClick={() => onPageChange(page)}
              className={cn(
                'h-8 min-w-[32px] px-2 rounded-lg font-semibold text-xs transition-colors flex items-center justify-center',
                currentPage === page
                  ? 'bg-primary-container text-on-primary shadow-sm'
                  : 'text-on-surface hover:bg-surface-container-low'
              )}
            >
              {page}
            </button>
          ) : (
            <span key={idx} className="h-8 w-6 flex items-center justify-center text-outline text-xs">
              ...
            </span>
          )
        )}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="h-8 w-8 rounded-lg flex items-center justify-center text-outline hover:bg-surface-container hover:text-on-surface transition-colors disabled:opacity-30 disabled:pointer-events-none"
          title="Trang sau"
        >
          <span className="material-symbols-outlined text-[18px]">chevron_right</span>
        </button>
      </div>
    </div>
  );
};
