package com.example.student_management_api.teaching;

import jakarta.validation.constraints.NotNull;

public record TeachingAssignmentUpdateRequest(@NotNull Long teacherId) {
}
