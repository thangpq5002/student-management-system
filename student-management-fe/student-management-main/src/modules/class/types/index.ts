export interface ClassStudentItem {
  id: string;
  studentCode: string;
  fullName: string;
  dateOfBirth: string;
  roleInClass?: string; // "Lớp trưởng", "Lớp phó học tập", "Bí thư chi đoàn"
}

export interface ClassLeader {
  title: string;
  fullName: string;
  studentCode: string;
}

export interface SchoolClass {
  id: string;
  classCode: string;
  className: string;
  gradeLevel: number;
  homeroomTeacher: {
    id: string;
    fullName: string;
    department: string;
    email: string;
    experience: string;
    avatarInitials: string;
  };
  room: string;
  stream: string; // "KHTN (Toán-Lý-Hóa)", "KHXH (Văn-Sử-Địa)"
  currentStudents: number;
  maxStudents: number;
  status: 'active' | 'archived';
  leaders: ClassLeader[];
  students: ClassStudentItem[];
}

export interface ClassFiltersState {
  search: string;
  gradeLevel: string;
  stream: string;
  capacity: string;
}
