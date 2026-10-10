import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  isCurrent?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-on-surface-variant font-medium select-none">
      <Link href="/dashboard" className="flex items-center gap-1 hover:text-primary transition-colors">
        <Home className="w-3.5 h-3.5 text-outline" />
        <span className="hidden sm:inline">Trang chủ</span>
      </Link>
      {items.map((item, idx) => (
        <React.Fragment key={idx}>
          <ChevronRight className="w-3 h-3 text-outline shrink-0" />
          {item.href && !item.isCurrent ? (
            <Link href={item.href} className="hover:text-primary transition-colors truncate max-w-[150px]">
              {item.label}
            </Link>
          ) : (
            <span className="text-primary font-semibold truncate max-w-[200px]">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};
