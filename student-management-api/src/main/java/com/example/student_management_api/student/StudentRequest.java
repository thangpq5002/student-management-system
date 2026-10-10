package com.example.student_management_api.student;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

/**
 * Dữ liệu form học sinh (khớp StudentFormData). Lớp xác định bằng tên lớp ngắn (vd "10A1").
 * gradeLevel chỉ để đối chiếu, khối thật lấy từ lớp. gender: male | female | other.
 */
public record StudentRequest(
        @NotBlank(message = "Vui lòng nhập họ tên")
        @Size(max = 100, message = "Họ tên tối đa 100 ký tự") String fullName,
        @NotNull(message = "Vui lòng chọn ngày sinh")
        @Past(message = "Ngày sinh phải ở trong quá khứ") LocalDate dateOfBirth,
        @NotBlank(message = "Vui lòng chọn giới tính") String gender,
        Integer gradeLevel,
        @NotBlank(message = "Vui lòng chọn lớp") String className,
        @Email(message = "Email phụ huynh không hợp lệ")
        @Size(max = 255, message = "Email phụ huynh tối đa 255 ký tự") String parentEmail,
        @Size(max = 20, message = "Số điện thoại tối đa 20 ký tự") String phone,
        String notes,
        String status) {
}
