package com.example.student_management_api.teaching;

import com.example.student_management_api.auth.Actor;
import com.example.student_management_api.attendance.AttendanceSessionRepository;
import com.example.student_management_api.common.Text;
import com.example.student_management_api.grade.GradeRepository;
import com.example.student_management_api.schoolclass.SchoolClassRepository;
import com.example.student_management_api.subject.SubjectRepository;
import com.example.student_management_api.teacher.TeacherRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class TeachingAssignmentService {

    private final ClassSubjectRepository classSubjects;
    private final ClassTeacherRepository assignments;
    private final SchoolClassRepository classes;
    private final SubjectRepository subjects;
    private final TeacherRepository teachers;
    private final GradeRepository grades;
    private final AttendanceSessionRepository attendanceSessions;

    public TeachingAssignmentService(
            ClassSubjectRepository classSubjects,
            ClassTeacherRepository assignments,
            SchoolClassRepository classes,
            SubjectRepository subjects,
            TeacherRepository teachers,
            GradeRepository grades,
            AttendanceSessionRepository attendanceSessions) {
        this.classSubjects = classSubjects;
        this.assignments = assignments;
        this.classes = classes;
        this.subjects = subjects;
        this.teachers = teachers;
        this.grades = grades;
        this.attendanceSessions = attendanceSessions;
    }

    public List<TeachingAssignmentResponse> list(Actor actor) {
        List<ClassTeacher> source;
        if (actor.isAdmin()) {
            source = assignments.findAllActiveWithReferences();
        } else if (actor.teacherId() == null) {
            source = List.of();
        } else {
            source = assignments.findAllByTeacherId(actor.teacherId());
        }
        return source.stream().map(TeachingAssignmentResponse::from).toList();
    }

    @Transactional
    public TeachingAssignmentResponse create(Actor actor, TeachingAssignmentRequest request) {
        actor.requireAdmin();
        var schoolClass = classes.findById(request.classId())
                .orElseThrow(() -> Text.badRequest("Lớp học không tồn tại"));
        var subject = subjects.findById(request.subjectId())
                .orElseThrow(() -> Text.badRequest("Môn học không tồn tại"));
        var teacher = teachers.findById(request.teacherId())
                .orElseThrow(() -> Text.badRequest("Giáo viên không tồn tại"));

        String semester = request.semester().trim().toUpperCase();
        if (!semester.equals("SEMESTER_1") && !semester.equals("SEMESTER_2")) {
            throw Text.badRequest("Học kỳ không hợp lệ");
        }
        String year = requireAcademicYear(request.academicYear());
        ClassSubject classSubject = classSubjects.findBySchoolClassIdAndSubjectIdAndAcademicYearAndSemester(
                        schoolClass.getId(), subject.getId(), year, semester)
                .orElseGet(() -> {
                    ClassSubject created = new ClassSubject();
                    created.setSchoolClass(schoolClass);
                    created.setSubject(subject);
                    created.setAcademicYear(year);
                    created.setSemester(semester);
                    return classSubjects.save(created);
                });

        ClassTeacher existing = assignments.findByClassSubjectIdAndTeacherId(classSubject.getId(), teacher.getId())
                .orElse(null);
        if (existing != null) {
            if (existing.isActive()) {
                throw Text.conflict("Giáo viên đã được phân công vào lớp-môn này");
            }
            existing.setActive(true);
            return TeachingAssignmentResponse.from(assignments.saveAndFlush(existing));
        }

        ClassTeacher assignment = new ClassTeacher();
        assignment.setClassSubject(classSubject);
        assignment.setTeacher(teacher);
        return TeachingAssignmentResponse.from(assignments.saveAndFlush(assignment));
    }

    @Transactional
    public TeachingAssignmentResponse update(
            Actor actor, Long id, TeachingAssignmentUpdateRequest request) {
        actor.requireAdmin();
        ClassTeacher assignment = assignments.findWithReferencesById(id)
                .filter(ClassTeacher::isActive)
                .orElseThrow(() -> Text.notFound("Không tìm thấy phân công đang hoạt động"));
        if (assignment.getTeacher().getId().equals(request.teacherId())) {
            return TeachingAssignmentResponse.from(assignment);
        }
        if (grades.existsByClassTeacher_Id(id) || attendanceSessions.existsByClassTeacher_Id(id)) {
            throw Text.conflict("Không thể đổi giáo viên vì phân công đã có điểm hoặc lịch sử điểm danh");
        }
        var newTeacher = teachers.findById(request.teacherId())
                .orElseThrow(() -> Text.badRequest("Giáo viên không tồn tại"));
        ClassTeacher existing = assignments
                .findByClassSubjectIdAndTeacherId(assignment.getClassSubject().getId(), newTeacher.getId())
                .orElse(null);
        if (existing != null) {
            if (existing.isActive()) {
                throw Text.conflict("Giáo viên đã được phân công vào lớp-môn này");
            }
            existing.setActive(true);
            assignment.setActive(false);
            assignments.save(assignment);
            return TeachingAssignmentResponse.from(assignments.saveAndFlush(existing));
        }
        assignment.setTeacher(newTeacher);
        return TeachingAssignmentResponse.from(assignments.saveAndFlush(assignment));
    }

    @Transactional
    public void delete(Actor actor, Long id) {
        actor.requireAdmin();
        ClassTeacher assignment = assignments.findWithReferencesById(id)
                .filter(ClassTeacher::isActive)
                .orElseThrow(() -> Text.notFound("Không tìm thấy phân công đang hoạt động"));
        assignment.setActive(false);
        assignments.save(assignment);
    }

    private String requireAcademicYear(String academicYear) {
        String normalized = academicYear.trim();
        if (!normalized.matches("\\d{4}-\\d{4}")) {
            throw Text.badRequest("Năm học phải có dạng YYYY-YYYY");
        }
        int startYear = Integer.parseInt(normalized.substring(0, 4));
        int endYear = Integer.parseInt(normalized.substring(5, 9));
        if (endYear != startYear + 1) {
            throw Text.badRequest("Năm học kết thúc phải sau năm bắt đầu một năm");
        }
        return normalized;
    }
}
