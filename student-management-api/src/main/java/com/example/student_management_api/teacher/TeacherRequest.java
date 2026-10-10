package com.example.student_management_api.teacher;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

/** Dữ liệu form giáo viên (khớp TeacherFormData của giao diện). gender: "male" | "female". */
public record TeacherRequest(
        @NotBlank(message = "Vui lòng nhập họ tên")
        @Size(max = 100, message = "Họ tên tối đa 100 ký tự") String fullName,
        @NotBlank(message = "Vui lòng chọn giới tính") String gender,
        LocalDate dateOfBirth,
        @Size(max = 20, message = "Số điện thoại tối đa 20 ký tự") String phone,
        @Email(message = "Email không hợp lệ")
        @Size(max = 255, message = "Email tối đa 255 ký tự") String email,
        @NotBlank(message = "Vui lòng nhập tổ bộ môn")
        @Size(max = 100, message = "Tổ bộ môn tối đa 100 ký tự") String department,
        @Size(max = 50, message = "Học vị tối đa 50 ký tự") String degree,
        @Size(max = 100, message = "Chức danh tối đa 100 ký tự") String titleRole,
        @Size(max = 200, message = "Môn giảng dạy tối đa 200 ký tự") String subjectTaught,
        String notes,
        String status) {
}
