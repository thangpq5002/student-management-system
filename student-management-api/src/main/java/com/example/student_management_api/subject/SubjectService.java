package com.example.student_management_api.subject;

import com.example.student_management_api.auth.Actor;
import com.example.student_management_api.common.Text;
import com.example.student_management_api.teacher.Teacher;
import com.example.student_management_api.teacher.TeacherRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** Mọi người dùng đăng nhập xem được danh sách môn học; chỉ ADMIN thêm, sửa, xóa. */
@Service
@Transactional(readOnly = true)
public class SubjectService {

    private final SubjectRepository subjects;
    private final TeacherRepository teachers;

    public SubjectService(SubjectRepository subjects, TeacherRepository teachers) {
        this.subjects = subjects;
        this.teachers = teachers;
    }

    public List<SubjectResponse> list(
            Actor actor, String search, String department, String evaluationType, String gradeLevel) {
        String q = Text.normalizeQuery(search);
        String dep = Text.normalizeQuery(department);
        String grade = Text.normalizeQuery(gradeLevel);
        Subject.EvaluationType type = Text.parseEnum(
                Subject.EvaluationType.class, evaluationType, "Hình thức đánh giá không hợp lệ");

        List<Subject> source = actor.isAdmin()
                ? subjects.findAllWithHeadTeacher()
                : actor.teacherId() == null ? List.of() : subjects.findAllAssignedToTeacher(actor.teacherId());

        return source.stream()
                .filter(s -> q.isEmpty()
                        || Text.containsIgnoreCase(s.getSubjectCode(), q)
                        || Text.containsIgnoreCase(s.getName(), q)
                        || Text.containsIgnoreCase(s.getDepartment(), q)
                        || (s.getHeadTeacher() != null
                                && Text.containsIgnoreCase(s.getHeadTeacher().getFullName(), q)))
                .filter(s -> dep.isEmpty() || Text.containsIgnoreCase(s.getDepartment(), dep))
                .filter(s -> type == null || s.getEvaluationType() == type)
                .filter(s -> grade.isEmpty() || teachesGrade(s, grade))
                .map(SubjectResponse::from)
                .toList();
    }

    public SubjectResponse get(Actor actor, Long id) {
        Subject subject = actor.isAdmin()
                ? find(id)
                : subjects.findAssignedToTeacher(id, actor.teacherId())
                        .orElseThrow(() -> Text.notFound("Không tìm thấy môn học"));
        return SubjectResponse.from(subject);
    }

    @Transactional
    public SubjectResponse create(Actor actor, SubjectRequest request) {
        actor.requireAdmin();
        Subject subject = new Subject();
        apply(subject, request, null);
        subjects.saveAndFlush(subject);
        return SubjectResponse.from(subject);
    }

    @Transactional
    public SubjectResponse update(Actor actor, Long id, SubjectRequest request) {
        actor.requireAdmin();
        Subject subject = find(id);
        apply(subject, request, id);
        return SubjectResponse.from(subject);
    }

    @Transactional
    public void delete(Actor actor, Long id) {
        actor.requireAdmin();
        subjects.delete(find(id));
    }

    private Subject find(Long id) {
        return subjects.findWithHeadTeacherById(id).orElseThrow(() -> Text.notFound("Không tìm thấy môn học"));
    }

    private boolean teachesGrade(Subject s, String grade) {
        return switch (grade) {
            case "10" -> s.getPeriodsGrade10() > 0;
            case "11" -> s.getPeriodsGrade11() > 0;
            case "12" -> s.getPeriodsGrade12() > 0;
            default -> true;
        };
    }

    private void apply(Subject subject, SubjectRequest r, Long selfId) {
        String code = r.subjectCode().trim().toUpperCase();
        subjects.findBySubjectCodeIgnoreCase(code).ifPresent(existing -> {
            if (!existing.getId().equals(selfId)) {
                throw Text.conflict("Mã môn học " + code + " đã tồn tại");
            }
        });

        Subject.EvaluationType type = Text.parseEnum(
                Subject.EvaluationType.class, r.evaluationType(), "Hình thức đánh giá không hợp lệ");
        if (type == null) {
            throw Text.badRequest("Hình thức đánh giá không hợp lệ");
        }

        Subject.Status status = Text.parseEnum(Subject.Status.class, r.status(), "Trạng thái không hợp lệ");
        if (status != null) {
            subject.setStatus(status);
        }

        Teacher head = null;
        String headId = Text.blankToNull(r.headTeacherId());
        if (headId != null) {
            try {
                head = teachers.findById(Long.parseLong(headId))
                        .orElseThrow(() -> Text.badRequest("Giáo viên không tồn tại"));
            } catch (NumberFormatException ex) {
                throw Text.badRequest("Giáo viên không tồn tại");
            }
        }

        subject.setSubjectCode(code);
        subject.setName(r.name().trim());
        subject.setDepartment(r.department().trim());
        subject.setEvaluationType(type);
        subject.setPeriodsGrade10(r.grade10Periods());
        subject.setPeriodsGrade11(r.grade11Periods());
        subject.setPeriodsGrade12(r.grade12Periods());
        subject.setHeadTeacher(head);
        subject.setDescription(Text.blankToNull(r.description()));
    }
}
