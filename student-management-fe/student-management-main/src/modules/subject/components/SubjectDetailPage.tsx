'use client';

import React, { useEffect, useState } from 'react';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { useRouter } from 'next/navigation';
import { subjectService } from '@/modules/subject/services/subject.service';
import { Subject } from '@/modules/subject/types';
import { ArrowLeft, BookOpen, Clock, Layers, Award } from 'lucide-react';

export default function SubjectDetailPage({ params }: { params?: { id: string } }) {
  const router = useRouter();
  const [subject, setSubject] = useState<Subject | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    if (!params?.id) {
      setSubject(null);
      setIsLoading(false);
      return () => { active = false; };
    }
    setIsLoading(true);
    subjectService.getSubject(params.id)
      .then((item) => { if (active) setSubject(item); })
      .catch(() => { if (active) setSubject(null); })
      .finally(() => { if (active) setIsLoading(false); });
    return () => { active = false; };
  }, [params?.id]);

  if (isLoading) {
    return <div className="p-8 text-center text-on-surface-variant">Đang tải chi tiết môn học...</div>;
  }

  if (!subject) {
    return (
      
        <div className="p-8 text-center text-on-surface-variant">Không tìm thấy thông tin môn học.</div>
      
    );
  }

  return (
    
      <div className="flex flex-col gap-6 max-w-4xl mx-auto">
        <div className="flex flex-col gap-1">
          <Breadcrumb
            items={[
              { label: 'Môn học', href: '/subjects' },
              { label: subject.name, isCurrent: true },
            ]}
          />
          <div className="flex items-center justify-between mt-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-on-surface">
              Chi tiết Môn học: {subject.name}
            </h1>
            <button
              type="button"
              onClick={() => router.push('/subjects')}
              className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-on-surface-variant hover:text-on-surface px-3 py-2 rounded-xl bg-surface-container"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Quay lại</span>
            </button>
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-outline-variant/20 flex flex-col gap-6">
          <div className="flex items-center gap-4 pb-6 border-b border-outline-variant/20">
            <div className="w-16 h-16 rounded-2xl bg-primary-container text-on-primary font-bold text-xl flex items-center justify-center shadow">
              <BookOpen className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-xl sm:text-2xl font-bold text-on-surface">{subject.name}</h2>
                <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-surface-container font-semibold text-secondary">
                  {subject.subjectCode}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-on-surface-variant mt-1">
                Tổ bộ môn: {subject.department} • Trưởng bộ môn: {subject.headTeacher}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-surface-container-low flex flex-col gap-1">
              <span className="text-xs text-on-surface-variant">Số tiết quy định:</span>
              <span className="text-lg font-bold text-on-surface font-mono">
                {subject.weeklyPeriods}
              </span>
            </div>
            <div className="p-4 rounded-xl bg-surface-container-low flex flex-col gap-1">
              <span className="text-xs text-on-surface-variant">Phương thức đánh giá:</span>
              <span className="text-lg font-bold text-primary">
                {subject.evaluationType === 'score' ? 'Điểm số (Thang điểm 10)' : 'Nhận xét (Đạt / Chưa đạt)'}
              </span>
            </div>
            <div className="p-4 rounded-xl bg-surface-container-low flex flex-col gap-1">
              <span className="text-xs text-on-surface-variant">Hệ số &amp; Quy chuẩn:</span>
              <span className="text-lg font-bold text-on-surface">
                {subject.coefficient}
              </span>
            </div>
            <div className="p-4 rounded-xl bg-surface-container-low flex flex-col gap-1">
              <span className="text-xs text-on-surface-variant">Chương trình giáo dục:</span>
              <span className="text-lg font-bold text-secondary">
                GDPT 2018 Tiêu chuẩn
              </span>
            </div>
          </div>
        </div>
      </div>
    
  );
}
