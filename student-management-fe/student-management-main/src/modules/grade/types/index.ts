export interface AssessmentType {
  id: string;
  code: string;
  name: string;
  weight: number;
}

export interface TeachingAssignment {
  id: string;
  classId: string;
  className: string;
  classSubjectId: string;
  subjectId: string;
  subjectName: string;
  teacherId: string;
  teacherName: string;
  academicYear: string;
  semester: string;
}

export interface GradeEnrollment {
  id: string;
  studentId: string;
  studentCode: string;
  studentName: string;
  classId: string;
  className: string;
  academicYear: string;
  status: string;
}

export interface GradeRecord {
  id: string;
  enrollmentId: string;
  studentId: string;
  studentCode: string;
  studentName: string;
  classId: string;
  className: string;
  classSubjectId: string;
  subjectId: string;
  subjectName: string;
  teacherId: string;
  teacherName: string;
  assessmentTypeId: string;
  assessmentType: string;
  semester: string;
  assessmentNumber: number;
  score: number;
  note: string | null;
}

export interface StudentGradeRecord {
  id: string;
  studentCode: string;
  fullName: string;
  avatarInitials: string;
  tx1: number | null;
  tx2: number | null;
  tx3: number | null;
  gk: number | null;
  ck: number | null;
  avgScore: number | null;
  rank: GradeRank | null;
}

export type GradeRank = 'Giỏi' | 'Khá' | 'Đạt' | 'Chưa đạt';

export interface GradeStudentRow {
  enrollmentId: string;
  studentId: string;
  studentCode: string;
  fullName: string;
  avatarInitials: string;
  grades: GradeRecord[];
  avgScore: number | null;
}

export interface GradeFiltersState {
  assignmentId: string;
  assessmentNumber: string;
}
