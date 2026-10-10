package com.example.student_management_api.grade;

import com.example.student_management_api.academic.EnrollmentRepository;
import com.example.student_management_api.auth.Actor;
import com.example.student_management_api.common.Text;
import com.example.student_management_api.teaching.ClassTeacherRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class GradeService {

    private final GradeRepository grades;
    private final EnrollmentRepository enrollments;
    private final ClassTeacherRepository assignments;
    private final AssessmentTypeRepository assessmentTypes;

    public GradeService(
            GradeRepository grades,
            EnrollmentRepository enrollments,
            ClassTeacherRepository assignments,
            AssessmentTypeRepository assessmentTypes) {
        this.grades = grades;
        this.enrollments = enrollments;
        this.assignments = assignments;
        this.assessmentTypes = assessmentTypes;
    }

    public List<GradeResponse> list(Actor actor, Long classSubjectId, String semester) {
        List<Grade> source;
        if (actor.isAdmin()) {
            source = grades.findAllWithReferences();
        } else if (actor.teacherId() == null) {
            source = List.of();
        } else {
            source = grades.findAllByTeacherId(actor.teacherId());
        }
        String normalizedSemester = semester == null ? null : semester.trim().toUpperCase();
        return source.stream()
                .filter(g -> classSubjectId == null || g.getClassSubject().getId().equals(classSubjectId))
                .filter(g -> normalizedSemester == null || g.getSemester().equals(normalizedSemester))
                .map(GradeResponse::from)
                .toList();
    }

    public List<AssessmentType> assessmentTypes() {
        return assessmentTypes.findAllByOrderByIdAsc();
    }

    @Transactional
    public GradeResponse create(Actor actor, GradeRequest request) {
        var enrollment = enrollments.findWithReferencesById(request.enrollmentId())
                .orElseThrow(() -> Text.badRequest("Lượt ghi danh không tồn tại"));
        var assignment = assignments.findWithReferencesById(request.classTeacherId())
                .orElseThrow(() -> Text.badRequest("Phân công giảng dạy không tồn tại"));
        requireAssigned(actor, assignment);
        var classSubject = assignment.getClassSubject();
        if (!enrollment.getSchoolClass().getId().equals(classSubject.getSchoolClass().getId())) {
            throw Text.badRequest("Học sinh không thuộc lớp của phân công giảng dạy");
        }
        if (!enrollment.getAcademicYear().equals(classSubject.getAcademicYear())) {
            throw Text.badRequest("Năm học ghi danh của học sinh không khớp với môn học");
        }
        String semester = requireSemester(request.semester());
        if (!semester.equals(classSubject.getSemester())) {
            throw Text.badRequest("Học kỳ không khớp với phân công giảng dạy");
        }
        var assessmentType = assessmentTypes.findById(request.assessmentTypeId())
                .orElseThrow(() -> Text.badRequest("Loại đánh giá không tồn tại"));

        Grade grade = new Grade();
        grade.setEnrollment(enrollment);
        grade.setSchoolClass(enrollment.getSchoolClass());
        grade.setClassSubject(classSubject);
        grade.setClassTeacher(assignment);
        grade.setAssessmentType(assessmentType);
        apply(grade, request, semester);
        return GradeResponse.from(grades.saveAndFlush(grade));
    }

    @Transactional
    public GradeResponse update(Actor actor, Long id, GradeRequest request) {
        Grade grade = findVisible(actor, id);
        if (!grade.getEnrollment().getId().equals(request.enrollmentId())
                || !grade.getClassTeacher().getId().equals(request.classTeacherId())) {
            throw Text.badRequest("Không thể chuyển điểm sang học sinh hoặc phân công khác");
        }
        requireAssigned(actor, grade.getClassTeacher());
        if (!grade.getEnrollment().getAcademicYear()
                .equals(grade.getClassSubject().getAcademicYear())) {
            throw Text.badRequest("Năm học ghi danh của học sinh không khớp với môn học");
        }
        String semester = requireSemester(request.semester());
        if (!semester.equals(grade.getClassSubject().getSemester())) {
            throw Text.badRequest("Học kỳ không khớp với phân công giảng dạy");
        }
        var assessmentType = assessmentTypes.findById(request.assessmentTypeId())
                .orElseThrow(() -> Text.badRequest("Loại đánh giá không tồn tại"));
        grade.setAssessmentType(assessmentType);
        apply(grade, request, semester);
        return GradeResponse.from(grade);
    }

    @Transactional
    public void delete(Actor actor, Long id) {
        actor.requireAdmin();
        grades.delete(find(id));
    }

    private Grade findVisible(Actor actor, Long id) {
        Grade grade = find(id);
        requireAssigned(actor, grade.getClassTeacher());
        return grade;
    }

    private Grade find(Long id) {
        return grades.findWithReferencesById(id).orElseThrow(() -> Text.notFound("Không tìm thấy điểm"));
    }

    private void requireAssigned(Actor actor, com.example.student_management_api.teaching.ClassTeacher assignment) {
        if (!actor.isAdmin() && (!assignment.isActive() || actor.teacherId() == null
                || !actor.teacherId().equals(assignment.getTeacher().getId()))) {
            throw Text.notFound("Không tìm thấy dữ liệu điểm");
        }
    }

    private String requireSemester(String semester) {
        String normalized = semester.trim().toUpperCase();
        if (!normalized.equals("SEMESTER_1") && !normalized.equals("SEMESTER_2")) {
            throw Text.badRequest("Học kỳ không hợp lệ");
        }
        return normalized;
    }

    private void apply(Grade grade, GradeRequest request, String semester) {
        grade.setSemester(semester);
        grade.setAssessmentNumber(request.assessmentNumber());
        grade.setScore(request.score());
        grade.setNote(Text.blankToNull(request.note()));
    }
}
