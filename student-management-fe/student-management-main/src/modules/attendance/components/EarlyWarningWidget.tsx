import React from 'react';
import { AttendanceEarlyWarning } from '../types';
import { MessageSquare, Phone, Send, Info, Check } from 'lucide-react';

interface EarlyWarningWidgetProps {
  warnings: AttendanceEarlyWarning[];
  onSendSMS?: (student: AttendanceEarlyWarning) => void;
  onSendZalo?: (student: AttendanceEarlyWarning) => void;
}

export const EarlyWarningWidget: React.FC<EarlyWarningWidgetProps> = ({
  warnings,
  onSendSMS,
  onSendZalo,
}) => {
  return (
    <div className="flex flex-col gap-4">
      {/* Early Warning Alert Box */}
      <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm border border-outline-variant/20 flex flex-col gap-4" id="early-warning-box">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-error animate-pulse" />
            <span className="font-bold text-sm text-on-surface">Cảnh báo vắng nhiều</span>
          </div>
          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-error-container text-error">
            &gt; 3 buổi
          </span>
        </div>

        <p className="text-xs text-on-surface-variant leading-relaxed">
          Học sinh có nguy cơ bị đình chỉ thi hoặc cần phụ huynh phối hợp làm việc:
        </p>

        <div className="flex flex-col gap-3">
          {warnings.map((w, index) => {
            const isHighest = index === 0;

            return (
              <div
                key={w.id}
                className={`p-3.5 rounded-xl flex flex-col gap-2 border ${
                  isHighest
                    ? 'bg-error-container/20 border-error/30'
                    : 'bg-surface-container-low border-outline-variant/15'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-8 h-8 rounded-full font-bold text-xs flex items-center justify-center shrink-0 ${
                        isHighest ? 'bg-error-container text-error' : 'bg-surface-container text-on-surface'
                      }`}
                    >
                      {w.avatarInitials}
                    </div>
                    <div>
                      <h4 className="font-semibold text-xs text-on-surface">{w.fullName}</h4>
                      <span className="text-[10px] text-outline font-mono">
                        {w.className} · {w.studentCode}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isHighest ? 'bg-error text-on-error' : 'bg-surface-container text-on-surface'
                    }`}
                  >
                    {w.totalMissed} buổi
                  </span>
                </div>

                <div className="flex justify-between text-xs text-on-surface-variant pt-1 border-t border-outline-variant/10">
                  <span>
                    Không phép: <strong className="text-error font-bold">{w.unexcused} buổi</strong>
                  </span>
                  <span>Có phép: {w.excused} buổi</span>
                </div>

                {isHighest ? (
                  <div className="pt-1.5 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        onSendSMS
                          ? onSendSMS(w)
                          : alert(`Đã gửi SMS tới phụ huynh em ${w.fullName}`)
                      }
                      className="flex-1 py-1.5 px-3 rounded-lg bg-error text-on-error text-xs font-semibold flex items-center justify-center gap-1.5 hover:opacity-90 transition-opacity shadow-sm cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Gửi SMS Phụ Huynh</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => alert(`Gọi điện cho gia đình em ${w.fullName}: 0912 345 678`)}
                      className="p-1.5 rounded-lg bg-surface-container-highest text-error hover:bg-error-container transition-colors cursor-pointer"
                      title="Gọi trực tiếp"
                    >
                      <Phone className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() =>
                      onSendZalo
                        ? onSendZalo(w)
                        : alert(`Đã gửi tin nhắn nhắc nhở qua Zalo OA em ${w.fullName}`)
                    }
                    className="mt-1 w-full py-1.5 px-3 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                  >
                    <Send className="w-3 h-3 text-secondary" />
                    <span>Nhắc nhở qua Zalo</span>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Discipline Rule Summary */}
      <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm border border-outline-variant/20 flex flex-col gap-2">
        <div className="flex items-center gap-2 text-secondary font-semibold text-xs sm:text-sm">
          <Info className="w-4 h-4" />
          <span>Quy chế chuyên cần</span>
        </div>
        <ul className="flex flex-col gap-2 text-xs text-on-surface-variant mt-1 leading-relaxed">
          <li className="flex items-start gap-2">
            <Check className="w-3.5 h-3.5 text-error shrink-0 mt-0.5" />
            <span>Vắng &gt; 15% tổng số tiết không được tham gia thi học kỳ.</span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
            <span>Đơn xin phép hợp lệ cần được phụ huynh gửi trước 07:15 sáng.</span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
            <span>Đi muộn quá 15 phút tính bằng 1/2 buổi vắng có phép.</span>
          </li>
        </ul>
      </div>
    </div>
  );
};
