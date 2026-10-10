package com.example.student_management_api.user;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record UserUpdateRequest(
        @NotBlank(message = "Vui lòng nhập họ tên")
        @Size(max = 100, message = "Họ tên tối đa 100 ký tự") String fullName,
        @Size(max = 100, message = "Chức danh tối đa 100 ký tự") String title,
        @NotNull(message = "Thiếu trạng thái hoạt động") Boolean enabled) {
}
