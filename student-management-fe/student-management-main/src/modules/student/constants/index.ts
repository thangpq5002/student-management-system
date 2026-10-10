export const GRADE_LEVELS = [
  { value: '10', label: 'Khối 10' },
  { value: '11', label: 'Khối 11' },
  { value: '12', label: 'Khối 12' },
];

export const CLASS_OPTIONS = [
  { value: '10A1', label: '10A1 (Khối 10)' },
  { value: '10A2', label: '10A2 (Khối 10)' },
  { value: '10A3', label: '10A3 (Khối 10)' },
  { value: '11B1', label: '11B1 (Khối 11)' },
  { value: '11B2', label: '11B2 (Khối 11)' },
  { value: '12A3', label: '12A3 (Khối 12)' },
  { value: '12C1', label: '12C1 (Khối 12)' },
  { value: '12C3', label: '12C3 (Khối 12)' },
];

export const STUDENT_STATUS_MAP = {
  active: {
    label: 'Đang học',
    badgeClass: 'bg-secondary-fixed text-primary',
    dotClass: 'bg-secondary',
  },
  suspended: {
    label: 'Bảo lưu',
    badgeClass: 'bg-surface-container-highest text-tertiary-container',
    dotClass: 'bg-tertiary',
  },
  transferred: {
    label: 'Chuyển trường',
    badgeClass: 'bg-error-container/50 text-error',
    dotClass: 'bg-error',
  },
};