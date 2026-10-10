export type TeacherStatus = 'active' | 'leave' | 'transferred';

export interface Teacher {
  id: string;
  teacherCode: string;
  fullName: string;
  titleRole: string; // e.g. "Tổ trưởng môn Toán", "GVCN Lớp 12A1"
  department: string; // e.g. "Toán - Tin học", "Ngữ Văn"
  subjectTaught: string; // e.g. "Toán khối 10 & 12"
  email: string;
  phone: string;
  status: TeacherStatus;
  avatarInitials: string;
  degree?: string; // "Thạc sĩ", "Tiến sĩ", "Cử nhân"
  notes?: string;
}

export interface TeacherFiltersState {
  search: string;
  department: string;
  status: string;
  degree: string;
}

export interface TeacherFormData {
  fullName: string;
  gender: 'male' | 'female';
  dateOfBirth: string;
  phone: string;
  email: string;
  department: string;
  degree: string;
  titleRole: string;
  subjectTaught: string;
  notes?: string;
}
