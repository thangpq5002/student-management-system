package com.example.student_management_api.user;

import com.example.student_management_api.auth.Actor;
import com.example.student_management_api.common.Text;
import com.example.student_management_api.teacher.Teacher;
import com.example.student_management_api.teacher.TeacherRepository;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** Quản lý tài khoản: chỉ ADMIN. */
@Service
@Transactional(readOnly = true)
public class UserAdminService {

    private final UserRepository users;
    private final TeacherRepository teachers;
    private final PasswordEncoder passwordEncoder;

    public UserAdminService(UserRepository users, TeacherRepository teachers, PasswordEncoder passwordEncoder) {
        this.users = users;
        this.teachers = teachers;
        this.passwordEncoder = passwordEncoder;
    }

    public List<UserAdminResponse> list(Actor actor) {
        actor.requireAdmin();
        List<User> all = users.findAllByOrderByIdAsc();

        List<Long> teacherIds = all.stream().map(User::getTeacherId).filter(Objects::nonNull).toList();
        Map<Long, String> teacherNames = teachers.findAllById(teacherIds).stream()
                .collect(Collectors.toMap(Teacher::getId, Teacher::getFullName));

        return all.stream()
                .map(u -> UserAdminResponse.of(u, u.getTeacherId() == null ? null : teacherNames.get(u.getTeacherId())))
                .toList();
    }

    @Transactional
    public UserAdminResponse create(Actor actor, UserCreateRequest r) {
        actor.requireAdmin();

        String email = r.email().trim().toLowerCase();
        if (users.findByEmailIgnoreCase(email).isPresent()) {
            throw Text.conflict("Email này đã có tài khoản");
        }

        Role role = Text.parseEnum(Role.class, r.role(), "Vai trò không hợp lệ");
        if (role == null) {
            throw Text.badRequest("Vai trò không hợp lệ");
        }

        String fullName = Text.blankToNull(r.fullName());
        Long teacherId = null;
        String teacherName = null;

        if (role == Role.TEACHER) {
            String rawId = Text.blankToNull(r.teacherId());
            if (rawId == null) {
                throw Text.badRequest("Tài khoản giáo viên phải gắn với một hồ sơ giáo viên");
            }
            long id;
            try {
                id = Long.parseLong(rawId);
            } catch (NumberFormatException ex) {
                throw Text.badRequest("Giáo viên không tồn tại");
            }
            Teacher teacher = teachers.findById(id)
                    .orElseThrow(() -> Text.badRequest("Giáo viên không tồn tại"));
            if (users.findByTeacherId(id).isPresent()) {
                throw Text.conflict("Giáo viên này đã có tài khoản");
            }
            teacherId = id;
            teacherName = teacher.getFullName();
            if (fullName == null) {
                fullName = teacher.getFullName();
            }
        } else if (fullName == null) {
            throw Text.badRequest("Vui lòng nhập họ tên");
        }

        User user = new User();
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(r.password()));
        user.setFullName(fullName);
        user.setTitle(Text.blankToNull(r.title()));
        user.setRole(role);
        user.setTeacherId(teacherId);
        users.saveAndFlush(user);

        return UserAdminResponse.of(user, teacherName);
    }

    @Transactional
    public UserAdminResponse update(Actor actor, Long id, UserUpdateRequest r) {
        actor.requireAdmin();
        User user = find(id);
        if (id.equals(actor.userId()) && !r.enabled()) {
            throw Text.badRequest("Không thể khóa tài khoản đang đăng nhập");
        }
        user.setFullName(r.fullName().trim());
        user.setTitle(Text.blankToNull(r.title()));
        user.setEnabled(r.enabled());

        String teacherName = user.getTeacherId() == null
                ? null
                : teachers.findById(user.getTeacherId()).map(Teacher::getFullName).orElse(null);
        return UserAdminResponse.of(user, teacherName);
    }

    @Transactional
    public void resetPassword(Actor actor, Long id, PasswordRequest r) {
        actor.requireAdmin();
        find(id).setPasswordHash(passwordEncoder.encode(r.password()));
    }

    @Transactional
    public void delete(Actor actor, Long id) {
        actor.requireAdmin();
        if (id.equals(actor.userId())) {
            throw Text.badRequest("Không thể xóa tài khoản đang đăng nhập");
        }
        users.delete(find(id));
    }

    private User find(Long id) {
        return users.findById(id).orElseThrow(() -> Text.notFound("Không tìm thấy tài khoản"));
    }
}
