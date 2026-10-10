package com.example.student_management_api.auth;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record LoginRequest(
        @NotBlank(message = "Vui lòng nhập email") String email,
        @NotBlank(message = "Vui lòng nhập mật khẩu")
        @Size(max = 72, message = "Email hoặc mật khẩu không đúng") String password) {
}
