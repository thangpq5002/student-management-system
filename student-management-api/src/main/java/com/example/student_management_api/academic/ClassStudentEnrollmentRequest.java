package com.example.student_management_api.academic;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import java.util.List;

public record ClassStudentEnrollmentRequest(
        @NotEmpty(message = "Hãy chọn ít nhất một học sinh")
        @Size(max = 100, message = "Mỗi lần chỉ được thêm tối đa 100 học sinh")
        List<@NotNull @Positive Long> studentIds,
        @NotNull(message = "Vui lòng chọn năm học")
        @Pattern(regexp = "\\d{4}-\\d{4}", message = "Năm học phải có dạng YYYY-YYYY")
        String academicYear,
        LocalDate enrollmentDate) {
}
