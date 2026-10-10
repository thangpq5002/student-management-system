package com.example.student_management_api.auth;

import com.example.student_management_api.common.Text;
import com.example.student_management_api.user.Role;

/** Người đang gọi API: vai trò và (nếu là giáo viên) hồ sơ giáo viên gắn với tài khoản. */
public record Actor(Long userId, Role role, Long teacherId) {

    public boolean isAdmin() {
        return role == Role.ADMIN;
    }

    /** True nếu actor là giáo viên có id bằng homeroomTeacherId. */
    public boolean isTeacherWithId(Long homeroomTeacherId) {
        return teacherId != null && teacherId.equals(homeroomTeacherId);
    }

    public void requireAdmin() {
        if (!isAdmin()) {
            throw Text.forbidden("Bạn không có quyền thực hiện thao tác này");
        }
    }
}
