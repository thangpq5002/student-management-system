import React from 'react';
import { Award, CheckCircle, Shield } from 'lucide-react';

export const ValedictorianCard: React.FC = () => {
  return (
    <>
      {/* Student Highlight Card */}
      <div className="p-6 bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 flex flex-col justify-between gap-3 relative overflow-hidden">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary-container text-on-primary flex items-center justify-center font-bold shadow-sm shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] font-bold uppercase text-outline tracking-wider">
              Thủ khoa môn học
            </span>
            <span className="font-bold text-sm text-on-surface">Lê Quốc Cường (10A1)</span>
            <span className="font-mono text-xs text-secondary font-bold">
              ĐTB: 9.6 • Xuất sắc
            </span>
          </div>
        </div>

        <div className="p-3 bg-surface-container-low rounded-xl text-xs text-on-surface-variant">
          Đã hoàn thành 100% các cột điểm kiểm tra bắt buộc và bài tập tự học mở rộng.
        </div>

        <div className="flex items-center justify-between text-xs text-outline">
          <span>Xác nhận bởi Giáo viên phụ trách</span>
          <CheckCircle className="w-4 h-4 text-secondary" />
        </div>
      </div>

      {/* Protocol / Security Notice */}
      <div className="p-6 bg-surface-container rounded-2xl flex flex-col justify-between gap-4 text-on-surface border border-outline-variant/20">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5 text-primary font-semibold text-sm">
            <Shield className="w-4 h-4" />
            <span>Bảo mật Sổ điểm kỳ II</span>
          </div>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            Hạn chót khóa điểm số học kỳ: <strong>17:00 ngày 25/05/2024</strong>. Sau thời hạn này,
            mọi điều chỉnh điểm cần có phê duyệt của Ban giám hiệu.
          </p>
        </div>

        <button
          type="button"
          onClick={() => alert('Lịch công tác khóa sổ điểm: 25/05/2024 - 17:00.')}
          className="w-full py-2 px-3 bg-surface-container-lowest hover:bg-surface-bright text-primary font-semibold text-xs rounded-xl shadow-sm transition-all text-center cursor-pointer"
        >
          Xem lịch công tác điểm
        </button>
      </div>
    </>
  );
};
