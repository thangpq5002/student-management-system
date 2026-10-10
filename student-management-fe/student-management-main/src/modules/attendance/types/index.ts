export type AttendanceStatus = 'present' | 'excused' | 'unexcused' | 'late' | 'unmarked';

export interface AttendanceEnrollment {
  id: string;
  studentId: string;
  studentCode: string;
  studentName: string;
  classId: string;
  className: string;
  academicYear: string;
  status: string;
}

export interface AttendanceApiRecord {
  id: string;
  enrollmentId: string;
  studentId: string;
  studentCode: string;
  studentName: string;
  status: string;
  note: string | null;
}

export interface AttendanceApiSession {
  id: string;
  classId: string;
  className: string;
  attendanceType: string;
  classSubjectId: string | null;
  subjectName: string | null;
  classTeacherId: string | null;
  teacherName: string | null;
  attendanceDate: string;
  period: number | null;
  note: string | null;
  records: AttendanceApiRecord[];
}

export interface DailyAttendanceItem {
  id: string;
  enrollmentId?: string;
  studentCode: string;
  fullName: string;
  avatarLetter: string;
  roleSubtitle?: string;
  status: AttendanceStatus;
  checkInTime: string;
  note: string;
  hasAttachment?: boolean;
}

export interface AttendanceHistoryItem {
  id: string;
  dateStr: string;
  session: string;
  classId?: string;
  className: string;
  periodSubject: string;
  studentCode: string;
  fullName: string;
  avatarInitials: string;
  status: AttendanceStatus;
  checkInTime: string;
  teacherName: string;
  note: string;
}

export interface AttendanceEarlyWarning {
  id: string;
  fullName: string;
  studentCode: string;
  className: string;
  totalMissed: number;
  unexcused: number;
  excused: number;
  avatarInitials: string;
}

export interface AttendanceFiltersState {
  classId: string;
  date: string;
}

export interface AttendanceHistoryFiltersState {
  search: string;
  classId: string;
  date: string;
  status: string;
}
