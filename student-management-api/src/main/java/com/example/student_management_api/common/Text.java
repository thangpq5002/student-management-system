package com.example.student_management_api.common;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

/** Các hàm tiện ích nhỏ cho chuỗi, enum và thông báo lỗi. */
public final class Text {

    private Text() {
    }

    public static String blankToNull(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }

    public static String nullToEmpty(String value) {
        return value == null ? "" : value;
    }

    /** Chuẩn hóa chuỗi tìm kiếm: bỏ khoảng trắng đầu cuối và đổi sang chữ thường. */
    public static String normalizeQuery(String value) {
        return value == null ? "" : value.trim().toLowerCase();
    }

    /** needle phải đã được chuẩn hóa bằng normalizeQuery. */
    public static boolean containsIgnoreCase(String haystack, String needle) {
        return haystack != null && haystack.toLowerCase().contains(needle);
    }

    /** Enum trả về giao diện dạng chữ thường: ACTIVE -> "active". */
    public static String lower(Enum<?> value) {
        return value == null ? null : value.name().toLowerCase();
    }

    /** Chuỗi rỗng hoặc null trả về null; giá trị sai trả lỗi 400 với thông báo errorMessage. */
    public static <E extends Enum<E>> E parseEnum(Class<E> type, String value, String errorMessage) {
        if (value == null || value.isBlank()) {
            return null;
        }
        try {
            return Enum.valueOf(type, value.trim().toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw badRequest(errorMessage);
        }
    }

    /** Chữ cái đầu của hai từ cuối trong tên, vd "Nguyễn Văn An" -> "VA". */
    public static String initials(String name, String fallback) {
        if (name == null) {
            return fallback;
        }
        String[] parts = name.trim().split("\\s+");
        StringBuilder sb = new StringBuilder();
        for (int i = Math.max(0, parts.length - 2); i < parts.length; i++) {
            if (!parts[i].isEmpty()) {
                sb.append(Character.toUpperCase(parts[i].charAt(0)));
            }
        }
        return sb.length() == 0 ? fallback : sb.toString();
    }

    public static ResponseStatusException badRequest(String message) {
        return new ResponseStatusException(HttpStatus.BAD_REQUEST, message);
    }

    public static ResponseStatusException notFound(String message) {
        return new ResponseStatusException(HttpStatus.NOT_FOUND, message);
    }

    public static ResponseStatusException conflict(String message) {
        return new ResponseStatusException(HttpStatus.CONFLICT, message);
    }

    public static ResponseStatusException forbidden(String message) {
        return new ResponseStatusException(HttpStatus.FORBIDDEN, message);
    }
}
