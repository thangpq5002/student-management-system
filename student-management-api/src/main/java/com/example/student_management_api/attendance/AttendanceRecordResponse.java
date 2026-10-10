package com.example.student_management_api.attendance;

public record AttendanceRecordResponse(
        String id,
        String enrollmentId,
        String studentId,
        String studentCode,
        String studentName,
        String status,
        String note) {

    public static AttendanceRecordResponse from(AttendanceRecord record) {
        var student = record.getEnrollment().getStudent();
        return new AttendanceRecordResponse(
                String.valueOf(record.getId()),
                String.valueOf(record.getEnrollment().getId()),
                String.valueOf(student.getId()),
                student.getStudentCode(),
                student.getFullName(),
                record.getStatus().toLowerCase(),
                record.getNote());
    }
}
