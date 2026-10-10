package com.example.student_management_api.teacher;

import com.example.student_management_api.common.Text;

/** Khớp kiểu Teacher của giao diện, thêm gender và dateOfBirth để dùng cho form sửa. */
public record TeacherResponse(
        String id,
        String teacherCode,
        String fullName,
        String titleRole,
        String department,
        String subjectTaught,
        String email,
        String phone,
        String status,
        String avatarInitials,
        String degree,
        String notes,
        String gender,
        String dateOfBirth) {

    public static TeacherResponse from(Teacher t) {
        return new TeacherResponse(
                String.valueOf(t.getId()),
                t.getTeacherCode(),
                t.getFullName(),
                Text.nullToEmpty(t.getTitleRole()),
                t.getDepartment(),
                Text.nullToEmpty(t.getSubjectTaught()),
                Text.nullToEmpty(t.getEmail()),
                Text.nullToEmpty(t.getPhone()),
                Text.lower(t.getStatus()),
                Text.initials(t.getFullName(), "GV"),
                Text.nullToEmpty(t.getDegree()),
                Text.nullToEmpty(t.getNotes()),
                Text.lower(t.getGender()),
                t.getDateOfBirth() == null ? "" : t.getDateOfBirth().toString());
    }
}
