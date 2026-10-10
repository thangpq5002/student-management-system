package com.example.student_management_api.attendance;

import jakarta.validation.constraints.NotNull;

public record AttendanceRecordRequest(
        @NotNull Long enrollmentId,
        @NotNull String status,
        String note) {
}
