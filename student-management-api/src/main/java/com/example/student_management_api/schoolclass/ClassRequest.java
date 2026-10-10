package com.example.student_management_api.schoolclass;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/** Tạo / sửa lớp. name là tên ngắn, vd "10A1". homeroomTeacherId có thể để trống. */
public record ClassRequest(
        @NotBlank(message = "Vui lòng nhập tên lớp")
        @Size(max = 16, message = "Tên lớp tối đa 16 ký tự") String name,
        @NotNull(message = "Vui lòng chọn khối")
        @Min(value = 10, message = "Khối phải là 10, 11 hoặc 12")
        @Max(value = 12, message = "Khối phải là 10, 11 hoặc 12") Integer gradeLevel,
        @Size(max = 50, message = "Phòng học tối đa 50 ký tự") String room,
        @Size(max = 100, message = "Ban tối đa 100 ký tự") String stream,
        @NotNull(message = "Vui lòng nhập sĩ số tối đa")
        @Min(value = 1, message = "Sĩ số tối đa phải từ 1 đến 100")
        @Max(value = 100, message = "Sĩ số tối đa phải từ 1 đến 100") Integer maxStudents,
        String status,
        String homeroomTeacherId) {
}
