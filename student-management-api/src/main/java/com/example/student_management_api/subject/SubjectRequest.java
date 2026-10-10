package com.example.student_management_api.subject;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/** Dữ liệu form môn học (khớp SubjectFormData). evaluationType: score | evaluation. */
public record SubjectRequest(
        @NotBlank(message = "Vui lòng nhập mã môn học")
        @Size(max = 20, message = "Mã môn học tối đa 20 ký tự") String subjectCode,
        @NotBlank(message = "Vui lòng nhập tên môn học")
        @Size(max = 100, message = "Tên môn học tối đa 100 ký tự") String name,
        @NotBlank(message = "Vui lòng nhập tổ bộ môn")
        @Size(max = 100, message = "Tổ bộ môn tối đa 100 ký tự") String department,
        @NotBlank(message = "Vui lòng chọn hình thức đánh giá") String evaluationType,
        @NotNull(message = "Vui lòng nhập số tiết khối 10")
        @Min(value = 0, message = "Số tiết phải từ 0 đến 20")
        @Max(value = 20, message = "Số tiết phải từ 0 đến 20") Integer grade10Periods,
        @NotNull(message = "Vui lòng nhập số tiết khối 11")
        @Min(value = 0, message = "Số tiết phải từ 0 đến 20")
        @Max(value = 20, message = "Số tiết phải từ 0 đến 20") Integer grade11Periods,
        @NotNull(message = "Vui lòng nhập số tiết khối 12")
        @Min(value = 0, message = "Số tiết phải từ 0 đến 20")
        @Max(value = 20, message = "Số tiết phải từ 0 đến 20") Integer grade12Periods,
        String description,
        String headTeacherId,
        String status) {
}
