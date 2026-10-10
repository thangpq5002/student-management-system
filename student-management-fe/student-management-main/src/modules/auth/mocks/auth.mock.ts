import { UserRole } from '@/lib/auth/AuthContext';

export interface DefaultAccount {
  role: UserRole;
  label: string;
  email: string;
  name: string;
  title: string;
}

export const defaultAccounts: Record<UserRole, DefaultAccount> = {
  admin: {
    role: 'admin',
    label: 'Quản trị viên',
    email: 'admin@edumanage.edu.vn',
    name: 'Nguyễn Văn An',
    title: 'Quản trị viên hệ thống',
  },
  teacher: {
    role: 'teacher',
    label: 'Giáo viên',
    email: 'gv.nguyenvana@edumanage.edu.vn',
    name: 'Nguyễn Văn An',
    title: 'Giáo viên bộ môn / GVCN',
  },
};
