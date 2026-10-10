package com.example.student_management_api.dashboard;

import java.util.List;

/**
 * Số liệu tổng quan. totalTeachers và totalDepartments chỉ có với ADMIN (giáo viên nhận null).
 * Giáo viên chỉ thấy số liệu của các lớp mình chủ nhiệm.
 */
public record DashboardResponse(
        long totalStudents,
        Long totalTeachers,
        Long totalDepartments,
        long totalClasses,
        ClassesByGrade classesByGrade,
        StudentsByStatus studentsByStatus,
        List<ClassRow> classes,
        List<RecentStudent> recentStudents) {

    public record ClassesByGrade(long grade10, long grade11, long grade12) {
    }

    public record StudentsByStatus(long active, long suspended, long transferred) {
    }

    public record ClassRow(
            String id,
            String name,
            int gradeLevel,
            String homeroomTeacher,
            int currentStudents,
            int maxStudents) {
    }

    public record RecentStudent(
            String id,
            String studentCode,
            String fullName,
            String className,
            String avatarInitials,
            String createdAt) {
    }
}
