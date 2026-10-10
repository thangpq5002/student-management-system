package com.example.student_management_api.schoolclass;

import jakarta.validation.constraints.NotBlank;

/** Một chức danh ban cán sự: học sinh được xác định bằng mã học sinh. */
public record LeaderRequest(
        @NotBlank(message = "Vui lòng nhập chức danh") String title,
        @NotBlank(message = "Vui lòng nhập mã học sinh") String studentCode) {
}
