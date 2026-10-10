package com.example.student_management_api.schoolclass;

import com.example.student_management_api.auth.Actor;
import com.example.student_management_api.common.Text;
import com.example.student_management_api.student.Student;
import com.example.student_management_api.student.StudentRepository;
import com.example.student_management_api.teacher.Teacher;
import com.example.student_management_api.teacher.TeacherRepository;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * ADMIN manages all classes; teachers may only view classes they are assigned to.
 */
@Service
@Transactional(readOnly = true)
public class ClassService {

    private final SchoolClassRepository classes;
    private final ClassLeaderRepository leaders;
    private final StudentRepository students;
    private final TeacherRepository teachers;

    public ClassService(
            SchoolClassRepository classes,
            ClassLeaderRepository leaders,
            StudentRepository students,
            TeacherRepository teachers) {
        this.classes = classes;
        this.leaders = leaders;
        this.students = students;
        this.teachers = teachers;
    }

    public List<ClassResponse> list(
            Actor actor, String search, String gradeLevel, String stream, String capacity) {
        String q = Text.normalizeQuery(search);
        String grade = Text.normalizeQuery(gradeLevel);
        String streamQ = Text.normalizeQuery(stream);
        String cap = Text.normalizeQuery(capacity);

        List<SchoolClass> source;
        if (actor.isAdmin()) {
            source = classes.findAllWithTeacher();
        } else if (actor.teacherId() == null) {
            source = List.of();
        } else {
            source = classes.findAllAccessibleByTeacher(actor.teacherId());
        }
        if (source.isEmpty()) {
            return List.of();
        }

        Map<Long, Long> counts = new HashMap<>();
        for (Object[] row : students.countGroupedByClass()) {
            counts.put(((Number) row[0]).longValue(), ((Number) row[1]).longValue());
        }

        List<Long> ids = source.stream().map(SchoolClass::getId).toList();
        Map<Long, List<ClassResponse.Leader>> leadersByClass = new HashMap<>();
        for (ClassLeader leader : leaders.findAllByClassIds(ids)) {
            leadersByClass
                    .computeIfAbsent(leader.getSchoolClass().getId(), k -> new ArrayList<>())
                    .add(new ClassResponse.Leader(
                            leader.getTitle(),
                            leader.getStudent().getFullName(),
                            leader.getStudent().getStudentCode()));
        }

        return source.stream()
                .filter(c -> q.isEmpty()
                        || Text.containsIgnoreCase(c.getClassCode(), q)
                        || Text.containsIgnoreCase(c.getClassName(), q)
                        || Text.containsIgnoreCase("lớp " + c.getClassName(), q)
                        || (c.getHomeroomTeacher() != null
                                && Text.containsIgnoreCase(c.getHomeroomTeacher().getFullName(), q))
                        || Text.containsIgnoreCase(c.getRoom(), q)
                        || Text.containsIgnoreCase(c.getStream(), q))
                .filter(c -> grade.isEmpty() || String.valueOf(c.getGradeLevel()).equals(grade))
                .filter(c -> streamQ.isEmpty() || Text.containsIgnoreCase(c.getStream(), streamQ))
                .filter(c -> {
                    long current = counts.getOrDefault(c.getId(), 0L);
                    if (cap.equals("full")) {
                        return current >= c.getMaxStudents();
                    }
                    if (cap.equals("not_full")) {
                        return current < c.getMaxStudents();
                    }
                    return true;
                })
                .map(c -> ClassResponse.of(
                        c,
                        counts.getOrDefault(c.getId(), 0L).intValue(),
                        leadersByClass.getOrDefault(c.getId(), List.of()),
                        List.of()))
                .toList();
    }

    public ClassResponse get(Actor actor, Long id) {
        SchoolClass schoolClass = findVisible(actor, id);
        return detail(schoolClass);
    }

    @Transactional
    public ClassResponse create(Actor actor, ClassRequest request) {
        actor.requireAdmin();
        SchoolClass schoolClass = new SchoolClass();
        apply(schoolClass, request, null);
        classes.saveAndFlush(schoolClass);
        return detail(schoolClass);
    }

    @Transactional
    public ClassResponse update(Actor actor, Long id, ClassRequest request) {
        actor.requireAdmin();
        SchoolClass schoolClass = find(id);
        long current = students.countBySchoolClassId(id);
        if (request.maxStudents() != null && request.maxStudents() < current) {
            throw Text.conflict("Sĩ số tối đa không được nhỏ hơn số học sinh hiện có (" + current + ")");
        }
        apply(schoolClass, request, id);
        return detail(schoolClass);
    }

    @Transactional
    public void delete(Actor actor, Long id) {
        actor.requireAdmin();
        SchoolClass schoolClass = find(id);
        if (students.countBySchoolClassId(id) > 0) {
            throw Text.conflict("Không thể xóa lớp đang có học sinh");
        }
        classes.delete(schoolClass); // class_leaders.class_id: ON DELETE CASCADE
    }

    @Transactional
    public ClassResponse assignHomeroomTeacher(Actor actor, Long id, Long teacherId) {
        actor.requireAdmin();
        SchoolClass schoolClass = find(id);
        schoolClass.setHomeroomTeacher(teacherId == null ? null : findTeacher(teacherId));
        return detail(schoolClass);
    }

    @Transactional
    public ClassResponse updateLeaders(Actor actor, Long id, List<LeaderRequest> requests) {
        actor.requireAdmin();
        SchoolClass schoolClass = findVisible(actor, id);

        Set<String> titles = new HashSet<>();
        Set<Long> studentIds = new HashSet<>();
        List<ClassLeader> result = new ArrayList<>();
        for (LeaderRequest r : requests) {
            String title = r.title().trim();
            if (!titles.add(title.toLowerCase())) {
                throw Text.badRequest("Chức danh bị lặp: " + title);
            }
            Student student = students.findByStudentCodeIgnoreCase(r.studentCode().trim())
                    .orElseThrow(() -> Text.badRequest("Không tìm thấy học sinh có mã " + r.studentCode()));
            if (!student.getSchoolClass().getId().equals(id)) {
                throw Text.badRequest("Học sinh " + student.getFullName() + " không thuộc lớp này");
            }
            if (!studentIds.add(student.getId())) {
                throw Text.badRequest("Một học sinh chỉ giữ một chức danh: " + student.getFullName());
            }
            ClassLeader leader = new ClassLeader();
            leader.setSchoolClass(schoolClass);
            leader.setStudent(student);
            leader.setTitle(title);
            result.add(leader);
        }

        leaders.deleteByClassId(id);
        leaders.saveAll(result);
        return detail(schoolClass);
    }

    // ---------- nội bộ ----------

    private SchoolClass find(Long id) {
        return classes.findWithTeacherById(id).orElseThrow(() -> Text.notFound("Không tìm thấy lớp học"));
    }

    /** Lớp ngoài phạm vi của giáo viên được coi như không tồn tại (404). */
    private SchoolClass findVisible(Actor actor, Long id) {
        if (actor.isAdmin()) {
            return find(id);
        }
        return classes.findAccessibleByTeacher(id, actor.teacherId())
                .orElseThrow(() -> Text.notFound("Không tìm thấy lớp học"));
    }

    private Teacher findTeacher(Long teacherId) {
        return teachers.findById(teacherId).orElseThrow(() -> Text.badRequest("Giáo viên không tồn tại"));
    }

    private void apply(SchoolClass schoolClass, ClassRequest r, Long selfId) {
        String name = r.name().trim().toUpperCase();

        classes.findByClassNameIgnoreCase(name).ifPresent(existing -> {
            if (!existing.getId().equals(selfId)) {
                throw Text.conflict("Lớp " + name + " đã tồn tại");
            }
        });

        SchoolClass.Status status = Text.parseEnum(SchoolClass.Status.class, r.status(), "Trạng thái không hợp lệ");
        if (status != null) {
            schoolClass.setStatus(status);
        }

        Teacher teacher = null;
        String teacherId = Text.blankToNull(r.homeroomTeacherId());
        if (teacherId != null) {
            try {
                teacher = findTeacher(Long.parseLong(teacherId));
            } catch (NumberFormatException ex) {
                throw Text.badRequest("Giáo viên không tồn tại");
            }
        }

        schoolClass.setClassName(name);
        schoolClass.setClassCode("LH-" + name);
        schoolClass.setGradeLevel(r.gradeLevel());
        schoolClass.setRoom(Text.blankToNull(r.room()));
        schoolClass.setStream(Text.blankToNull(r.stream()));
        schoolClass.setMaxStudents(r.maxStudents());
        schoolClass.setHomeroomTeacher(teacher);
    }

    /** Chi tiết một lớp: danh sách học sinh kèm chức danh và ban cán sự. */
    private ClassResponse detail(SchoolClass schoolClass) {
        Long id = schoolClass.getId();
        List<Student> members = students.findBySchoolClassIdOrderByFullName(id);

        Map<Long, String> roleByStudent = new HashMap<>();
        List<ClassResponse.Leader> leaderList = new ArrayList<>();
        for (ClassLeader leader : leaders.findAllByClassIds(List.of(id))) {
            roleByStudent.put(leader.getStudent().getId(), leader.getTitle());
            leaderList.add(new ClassResponse.Leader(
                    leader.getTitle(),
                    leader.getStudent().getFullName(),
                    leader.getStudent().getStudentCode()));
        }

        List<ClassResponse.StudentItem> items = members.stream()
                .map(s -> new ClassResponse.StudentItem(
                        String.valueOf(s.getId()),
                        s.getStudentCode(),
                        s.getFullName(),
                        s.getDateOfBirth().toString(),
                        roleByStudent.get(s.getId())))
                .toList();

        return ClassResponse.of(schoolClass, members.size(), leaderList, items);
    }
}
