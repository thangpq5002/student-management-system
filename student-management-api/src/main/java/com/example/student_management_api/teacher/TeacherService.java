package com.example.student_management_api.teacher;

import com.example.student_management_api.auth.Actor;
import com.example.student_management_api.auth.ActorResolver;
import com.example.student_management_api.common.Gender;
import com.example.student_management_api.common.Text;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class TeacherService {

    private final TeacherRepository teachers;
    private final ActorResolver actors;

    public TeacherService(TeacherRepository teachers, ActorResolver actors) {
        this.teachers = teachers;
        this.actors = actors;
    }

    public List<TeacherResponse> list(Actor actor, String search, String department, String status, String degree) {
        actor.requireAdmin();
        String q = Text.normalizeQuery(search);
        String dep = Text.normalizeQuery(department);
        String deg = Text.normalizeQuery(degree);
        Teacher.Status st = Text.parseEnum(Teacher.Status.class, status, "Trạng thái không hợp lệ");

        return teachers.findAllByOrderByTeacherCode().stream()
                .filter(t -> q.isEmpty()
                        || Text.containsIgnoreCase(t.getTeacherCode(), q)
                        || Text.containsIgnoreCase(t.getFullName(), q)
                        || Text.containsIgnoreCase(t.getEmail(), q)
                        || Text.containsIgnoreCase(t.getPhone(), q)
                        || Text.containsIgnoreCase(t.getTitleRole(), q))
                .filter(t -> dep.isEmpty() || Text.containsIgnoreCase(t.getDepartment(), dep))
                .filter(t -> deg.isEmpty() || Text.containsIgnoreCase(t.getDegree(), deg))
                .filter(t -> st == null || t.getStatus() == st)
                .map(TeacherResponse::from)
                .toList();
    }

    public TeacherResponse get(Actor actor, Long id) {
        actor.requireAdmin();
        return TeacherResponse.from(find(id));
    }

    @Transactional
    public TeacherResponse create(Actor actor, TeacherRequest request) {
        actor.requireAdmin();
        Teacher teacher = new Teacher();
        apply(teacher, request, null);
        // Mã tạm để thỏa NOT NULL / UNIQUE, rồi đặt mã thật theo id vừa sinh
        teacher.setTeacherCode("TMP-" + UUID.randomUUID().toString().replace("-", "").substring(0, 12));
        teachers.saveAndFlush(teacher);
        teacher.setTeacherCode("GV-" + (1000 + teacher.getId()));
        return TeacherResponse.from(teacher);
    }

    @Transactional
    public TeacherResponse update(Actor actor, Long id, TeacherRequest request) {
        actor.requireAdmin();
        Teacher teacher = find(id);
        apply(teacher, request, id);
        return TeacherResponse.from(teacher);
    }

    @Transactional
    public void delete(Actor actor, Long id) {
        actor.requireAdmin();
        // classes.homeroom_teacher_id, subjects.head_teacher_id, users.teacher_id: ON DELETE SET NULL
        teachers.delete(find(id));
    }

    private Teacher find(Long id) {
        return teachers.findById(id).orElseThrow(() -> Text.notFound("Không tìm thấy giáo viên"));
    }

    private void apply(Teacher teacher, TeacherRequest r, Long selfId) {
        Gender gender = Text.parseEnum(Gender.class, r.gender(), "Giới tính không hợp lệ");
        if (gender != Gender.MALE && gender != Gender.FEMALE) {
            throw Text.badRequest("Giới tính không hợp lệ");
        }

        String email = Text.blankToNull(r.email());
        if (email != null) {
            email = email.toLowerCase();
            Optional<Teacher> existing = teachers.findByEmailIgnoreCase(email);
            if (existing.isPresent() && !existing.get().getId().equals(selfId)) {
                throw Text.conflict("Email đã được dùng bởi giáo viên khác");
            }
        }

        Teacher.Status status = Text.parseEnum(Teacher.Status.class, r.status(), "Trạng thái không hợp lệ");
        if (status != null) {
            teacher.setStatus(status);
        }

        teacher.setFullName(r.fullName().trim());
        teacher.setGender(gender);
        teacher.setDateOfBirth(r.dateOfBirth());
        teacher.setEmail(email);
        teacher.setPhone(Text.blankToNull(r.phone()));
        teacher.setDepartment(r.department().trim());
        teacher.setDegree(Text.blankToNull(r.degree()));
        teacher.setTitleRole(Text.blankToNull(r.titleRole()));
        teacher.setSubjectTaught(Text.blankToNull(r.subjectTaught()));
        teacher.setNotes(Text.blankToNull(r.notes()));
    }
}
