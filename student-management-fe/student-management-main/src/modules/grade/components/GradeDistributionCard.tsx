import React from 'react';
import { BarChart3 } from 'lucide-react';

interface GradeDistributionCardProps {
  records: Array<{ avgScore: number | null }>;
}

export const GradeDistributionCard: React.FC<GradeDistributionCardProps> = ({ records }) => {
  const under5 = records.filter((r) => r.avgScore !== null && r.avgScore < 5.0).length;
  const from5to65 = records.filter(
    (r) => r.avgScore !== null && r.avgScore >= 5.0 && r.avgScore < 6.5
  ).length;
  const from65to8 = records.filter(
    (r) => r.avgScore !== null && r.avgScore >= 6.5 && r.avgScore < 8.0
  ).length;
  const from8to10 = records.filter((r) => r.avgScore !== null && r.avgScore >= 8.0).length;

  return (
    <div className="p-6 bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 flex flex-col justify-between gap-4">
      <div className="flex items-center justify-between">
        <span className="font-semibold text-sm text-on-surface">Phổ điểm học kỳ</span>
        <BarChart3 className="w-5 h-5 text-outline" />
      </div>

      <div className="flex items-end justify-between gap-2 h-28 pt-4 px-2">
        {/* < 5.0 */}
        <div className="flex flex-col items-center gap-1 flex-1 h-full justify-end">
          <span className="font-mono text-xs font-semibold text-on-surface">{under5}</span>
          <div
            className="w-full bg-error-container rounded-t transition-all"
            style={{ height: `${Math.max(15, (under5 / (records.length || 1)) * 100)}%` }}
          />
          <span className="text-[10px] text-outline font-mono">&lt;5.0</span>
        </div>

        {/* 5 - 6.5 */}
        <div className="flex flex-col items-center gap-1 flex-1 h-full justify-end">
          <span className="font-mono text-xs font-semibold text-on-surface">{from5to65}</span>
          <div
            className="w-full bg-surface-container-highest rounded-t transition-all"
            style={{ height: `${Math.max(20, (from5to65 / (records.length || 1)) * 100)}%` }}
          />
          <span className="text-[10px] text-outline font-mono">5-6.5</span>
        </div>

        {/* 6.5 - 8 */}
        <div className="flex flex-col items-center gap-1 flex-1 h-full justify-end">
          <span className="font-mono text-xs font-semibold text-on-surface">{from65to8}</span>
          <div
            className="w-full bg-primary-fixed rounded-t transition-all"
            style={{ height: `${Math.max(35, (from65to8 / (records.length || 1)) * 100)}%` }}
          />
          <span className="text-[10px] text-outline font-mono">6.5-8</span>
        </div>

        {/* 8 - 10 */}
        <div className="flex flex-col items-center gap-1 flex-1 h-full justify-end">
          <span className="font-mono text-xs font-semibold text-on-surface">{from8to10}</span>
          <div
            className="w-full bg-secondary-container rounded-t transition-all"
            style={{ height: `${Math.max(45, (from8to10 / (records.length || 1)) * 100)}%` }}
          />
          <span className="text-[10px] text-outline font-mono">8-10</span>
        </div>
      </div>

      <p className="text-xs text-on-surface-variant">
        Phần lớn học sinh đạt từ mức Khá trở lên ({Math.round(((from65to8 + from8to10) / (records.length || 1)) * 100)}%).
      </p>
    </div>
  );
};
