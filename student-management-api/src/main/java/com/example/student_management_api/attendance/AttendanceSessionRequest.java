package com.example.student_management_api.attendance;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.time.LocalDate;

public record AttendanceSessionRequest(
        @NotNull Long classId,
        @NotNull LocalDate attendanceDate,
        @NotNull String attendanceType,
        Long classSubjectId,
        Long classTeacherId,
        @Positive Integer period,
        String note) {
}
