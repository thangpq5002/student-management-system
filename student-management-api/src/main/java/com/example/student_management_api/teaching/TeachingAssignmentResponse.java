package com.example.student_management_api.teaching;

public record TeachingAssignmentResponse(
        String id,
        String classId,
        String className,
        String classSubjectId,
        String subjectId,
        String subjectName,
        String teacherId,
        String teacherName,
        String academicYear,
        String semester) {

    public static TeachingAssignmentResponse from(ClassTeacher assignment) {
        ClassSubject classSubject = assignment.getClassSubject();
        return new TeachingAssignmentResponse(
                String.valueOf(assignment.getId()),
                String.valueOf(classSubject.getSchoolClass().getId()),
                classSubject.getSchoolClass().getClassName(),
                String.valueOf(classSubject.getId()),
                String.valueOf(classSubject.getSubject().getId()),
                classSubject.getSubject().getName(),
                String.valueOf(assignment.getTeacher().getId()),
                assignment.getTeacher().getFullName(),
                classSubject.getAcademicYear(),
                classSubject.getSemester());
    }
}
