package com.example.student_management_api.grade;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;

public record GradeRequest(
        @NotNull Long enrollmentId,
        @NotNull Long classTeacherId,
        @NotNull Long assessmentTypeId,
        @NotNull String semester,
        @NotNull @Positive Integer assessmentNumber,
        @NotNull @DecimalMin("0.00") @DecimalMax("10.00") BigDecimal score,
        String note) {
}
