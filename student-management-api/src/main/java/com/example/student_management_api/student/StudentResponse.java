package com.example.student_management_api.student;

import com.example.student_management_api.common.Text;

/** Khớp kiểu Student của giao diện. */
public record StudentResponse(
        String id,
        String studentCode,
        String fullName,
        String dateOfBirth,
        String gender,
        int gradeLevel,
        String className,
        String parentEmail,
        String phone,
        String notes,
        String status,
        String avatarInitials) {

    public static StudentResponse from(Student s) {
        return new StudentResponse(
                String.valueOf(s.getId()),
                s.getStudentCode(),
                s.getFullName(),
                s.getDateOfBirth().toString(),
                Text.lower(s.getGender()),
                s.getSchoolClass().getGradeLevel(),
                s.getSchoolClass().getClassName(),
                Text.nullToEmpty(s.getParentEmail()),
                Text.nullToEmpty(s.getPhone()),
                Text.nullToEmpty(s.getNotes()),
                Text.lower(s.getStatus()),
                Text.initials(s.getFullName(), "HS"));
    }
}
