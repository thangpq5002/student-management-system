package com.example.student_management_api.user;

import com.example.student_management_api.common.Text;

public record UserAdminResponse(
        String id,
        String name,
        String email,
        String role,
        String title,
        String avatarText,
        String teacherId,
        String teacherName,
        boolean enabled) {

    static UserAdminResponse of(User user, String teacherName) {
        return new UserAdminResponse(
                String.valueOf(user.getId()),
                user.getFullName(),
                user.getEmail(),
                Text.lower(user.getRole()),
                Text.nullToEmpty(user.getTitle()),
                Text.initials(user.getFullName(), "?"),
                user.getTeacherId() == null ? null : String.valueOf(user.getTeacherId()),
                teacherName,
                user.isEnabled());
    }
}
