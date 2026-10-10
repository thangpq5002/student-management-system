package com.example.student_management_api.attendance;

import java.time.LocalDate;
import java.util.List;

public record AttendanceSessionResponse(
        String id,
        String classId,
        String className,
        String attendanceType,
        String classSubjectId,
        String subjectName,
        String classTeacherId,
        String teacherName,
        LocalDate attendanceDate,
        Integer period,
        String note,
        List<AttendanceRecordResponse> records) {

    public static AttendanceSessionResponse from(
            AttendanceSession session, List<AttendanceRecordResponse> records) {
        return new AttendanceSessionResponse(
                String.valueOf(session.getId()),
                String.valueOf(session.getSchoolClass().getId()),
                session.getSchoolClass().getClassName(),
                session.getAttendanceType().toLowerCase(),
                session.getClassSubject() == null ? null : String.valueOf(session.getClassSubject().getId()),
                session.getClassSubject() == null ? null : session.getClassSubject().getSubject().getName(),
                session.getClassTeacher() == null ? null : String.valueOf(session.getClassTeacher().getId()),
                session.getClassTeacher() == null ? null : session.getClassTeacher().getTeacher().getFullName(),
                session.getAttendanceDate(),
                session.getPeriod(),
                session.getNote(),
                records);
    }
}
