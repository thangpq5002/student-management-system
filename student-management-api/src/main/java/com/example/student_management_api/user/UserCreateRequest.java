package com.example.student_management_api.user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Tạo tài khoản. role: "admin" | "teacher". Vai trò teacher bắt buộc có teacherId
 * (hồ sơ giáo viên chưa có tài khoản); fullName có thể bỏ trống để lấy tên giáo viên.
 */
public record UserCreateRequest(
        @NotBlank(message = "Vui lòng nhập email")
        @Email(message = "Email không hợp lệ")
        @Size(max = 255, message = "Email tối đa 255 ký tự") String email,
        @NotBlank(message = "Vui lòng nhập mật khẩu")
        @Size(min = 8, max = 72, message = "Mật khẩu phải từ 8 đến 72 ký tự") String password,
        @Size(max = 100, message = "Họ tên tối đa 100 ký tự") String fullName,
        @Size(max = 100, message = "Chức danh tối đa 100 ký tự") String title,
        @NotBlank(message = "Vui lòng chọn vai trò") String role,
        String teacherId) {
}
