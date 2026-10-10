package com.example.student_management_api.academic;

public record EnrollmentResponse(
        String id,
        String studentId,
        String studentCode,
        String studentName,
        String classId,
        String className,
        String academicYear,
        String status) {

    public static EnrollmentResponse from(Enrollment enrollment) {
        return new EnrollmentResponse(
                String.valueOf(enrollment.getId()),
                String.valueOf(enrollment.getStudent().getId()),
                enrollment.getStudent().getStudentCode(),
                enrollment.getStudent().getFullName(),
                String.valueOf(enrollment.getSchoolClass().getId()),
                enrollment.getSchoolClass().getClassName(),
                enrollment.getAcademicYear(),
                enrollment.getStatus().toLowerCase());
    }
}
