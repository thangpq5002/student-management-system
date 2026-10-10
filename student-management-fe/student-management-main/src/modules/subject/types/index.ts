export type EvaluationType = 'score' | 'evaluation';

export interface Subject {
  id: string;
  subjectCode: string;
  name: string;
  department: string;
  weeklyPeriods: string; // e.g. "4 / 4 / 4 tiết"
  periodsByGrade: {
    grade10: number;
    grade11: number;
    grade12: number;
  };
  coefficient: string; // e.g. "Hệ số 1 (Chính khóa)" or "Đánh giá Đ / CĐ"
  evaluationType: EvaluationType; // 'score' or 'evaluation'
  headTeacher: string;
  status: 'active' | 'inactive';
  description?: string;
}

export interface SubjectFiltersState {
  search: string;
  department: string;
  evaluationType: string;
  gradeLevel: string;
}

export interface SubjectFormData {
  subjectCode: string;
  name: string;
  department: string;
  evaluationType: EvaluationType;
  grade10Periods: number;
  grade11Periods: number;
  grade12Periods: number;
  description?: string;
}
