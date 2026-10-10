package com.example.student_management_api.auth;

import com.example.student_management_api.user.User;

/** Dữ liệu người dùng trả về cho giao diện (khớp kiểu User của frontend: role là "admin" | "teacher"). */
public record UserResponse(
        String id,
        String name,
        String email,
        String role,
        String title,
        String avatarText) {

    public static UserResponse from(User user) {
        return new UserResponse(
                String.valueOf(user.getId()),
                user.getFullName(),
                user.getEmail(),
                user.getRole().name().toLowerCase(),
                user.getTitle(),
                initials(user.getFullName()));
    }

    private static String initials(String name) {
        String[] parts = name.trim().split("\\s+");
        StringBuilder sb = new StringBuilder();
        for (int i = Math.max(0, parts.length - 2); i < parts.length; i++) {
            if (!parts[i].isEmpty()) {
                sb.append(Character.toUpperCase(parts[i].charAt(0)));
            }
        }
        return sb.length() == 0 ? "?" : sb.toString();
    }
}
