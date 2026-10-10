package com.example.student_management_api.subject;

import com.example.student_management_api.common.Text;

/** Khớp kiểu Subject của giao diện. weeklyPeriods và coefficient được suy ra từ dữ liệu. */
public record SubjectResponse(
        String id,
        String subjectCode,
        String name,
        String department,
        String weeklyPeriods,
        PeriodsByGrade periodsByGrade,
        String coefficient,
        String evaluationType,
        String headTeacher,
        String headTeacherId,
        String status,
        String description) {

    public record PeriodsByGrade(int grade10, int grade11, int grade12) {
    }

    public static SubjectResponse from(Subject s) {
        int g10 = s.getPeriodsGrade10();
        int g11 = s.getPeriodsGrade11();
        int g12 = s.getPeriodsGrade12();
        boolean scored = s.getEvaluationType() == Subject.EvaluationType.SCORE;
        return new SubjectResponse(
                String.valueOf(s.getId()),
                s.getSubjectCode(),
                s.getName(),
                s.getDepartment(),
                g10 + " / " + g11 + " / " + g12 + " tiết",
                new PeriodsByGrade(g10, g11, g12),
                scored ? "Hệ số 1 (Chính khóa)" : "Đánh giá Đ / CĐ",
                Text.lower(s.getEvaluationType()),
                s.getHeadTeacher() == null ? "" : s.getHeadTeacher().getFullName(),
                s.getHeadTeacher() == null ? null : String.valueOf(s.getHeadTeacher().getId()),
                Text.lower(s.getStatus()),
                Text.nullToEmpty(s.getDescription()));
    }
}
