package com.example.student_management_api.grade;

public record GradeResponse(
        String id,
        String enrollmentId,
        String studentId,
        String studentCode,
        String studentName,
        String classId,
        String className,
        String classSubjectId,
        String subjectId,
        String subjectName,
        String teacherId,
        String teacherName,
        String assessmentTypeId,
        String assessmentType,
        String semester,
        Integer assessmentNumber,
        java.math.BigDecimal score,
        String note) {

    public static GradeResponse from(Grade grade) {
        var student = grade.getEnrollment().getStudent();
        var classSubject = grade.getClassSubject();
        return new GradeResponse(
                String.valueOf(grade.getId()),
                String.valueOf(grade.getEnrollment().getId()),
                String.valueOf(student.getId()),
                student.getStudentCode(),
                student.getFullName(),
                String.valueOf(grade.getSchoolClass().getId()),
                grade.getSchoolClass().getClassName(),
                String.valueOf(classSubject.getId()),
                String.valueOf(classSubject.getSubject().getId()),
                classSubject.getSubject().getName(),
                String.valueOf(grade.getClassTeacher().getTeacher().getId()),
                grade.getClassTeacher().getTeacher().getFullName(),
                String.valueOf(grade.getAssessmentType().getId()),
                grade.getAssessmentType().getCode(),
                grade.getSemester().toLowerCase(),
                grade.getAssessmentNumber(),
                grade.getScore(),
                grade.getNote());
    }
}
