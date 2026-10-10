export const API_ENDPOINTS = {
  auth: {
    login: "/api/auth/login",
    logout: "/api/auth/logout",
    me: "/api/auth/me",
  },
  students: "/api/students",
  teachers: "/api/teachers",
  users: "/api/users",
  classes: "/api/classes",
  classStudents: (classId: string) =>
    `/api/classes/${encodeURIComponent(classId)}/students`,
  subjects: "/api/subjects",
  account: {
    profile: "/api/account/profile",
    password: "/api/account/password",
  },
  teachingAssignments: "/api/teaching-assignments",
  enrollments: "/api/enrollments",
  grades: {
    records: "/api/grades",
    assessmentTypes: "/api/grades/assessment-types",
  },
  attendance: {
    sessions: "/api/attendance/sessions",
  },
  dashboard: "/api/dashboard/summary",
} as const;
