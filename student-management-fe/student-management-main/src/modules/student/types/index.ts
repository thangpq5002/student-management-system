export type StudentStatus = 'active' | 'suspended' | 'transferred';
export type Gender = 'male' | 'female' | 'other';

export interface Student {
  id: string;
  studentCode: string;
  fullName: string;
  dateOfBirth: string;
  gender: Gender;
  gradeLevel: number;
  className: string;
  parentEmail: string;
  phone: string;
  notes?: string;
  status: StudentStatus;
  avatarInitials: string;
}

export interface StudentFiltersState {
  search: string;
  gradeLevel: string;
  className: string;
  status: string;
}

export interface StudentFormData {
  fullName: string;
  dateOfBirth: string;
  gender: Gender;
  gradeLevel: number;
  className: string;
  parentEmail: string;
  phone: string;
  notes?: string;
}