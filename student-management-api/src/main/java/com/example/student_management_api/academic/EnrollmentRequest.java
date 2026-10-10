package com.example.student_management_api.academic;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public record EnrollmentRequest(
        @NotNull Long studentId,
        @NotNull Long classId,
        @NotBlank @Size(max = 20) String academicYear,
        LocalDate enrollmentDate) {
}
