package com.example.student_management_api.teaching;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record TeachingAssignmentRequest(
        @NotNull Long classId,
        @NotNull Long subjectId,
        @NotNull Long teacherId,
        @NotBlank @Size(max = 20) String academicYear,
        @NotBlank String semester) {
}
