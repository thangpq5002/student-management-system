package com.example.student_management_api.academic;

import com.example.student_management_api.auth.Actor;
import com.example.student_management_api.common.Text;
import com.example.student_management_api.schoolclass.ClassLeaderRepository;
import com.example.student_management_api.schoolclass.SchoolClassRepository;
import com.example.student_management_api.student.Student;
import com.example.student_management_api.student.StudentRepository;
import com.example.student_management_api.student.StudentResponse;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class EnrollmentService {

    private final EnrollmentRepository enrollments;
    private final StudentRepository students;
    private final SchoolClassRepository classes;
    private final ClassLeaderRepository leaders;

    public EnrollmentService(
            EnrollmentRepository enrollments,
            StudentRepository students,
            SchoolClassRepository classes,
            ClassLeaderRepository leaders) {
        this.enrollments = enrollments;
        this.students = students;
        this.classes = classes;
        this.leaders = leaders;
    }

    public List<EnrollmentResponse> list(Actor actor) {
        List<Enrollment> source;
        if (actor.isAdmin()) {
            source = enrollments.findAllWithReferences();
        } else if (actor.teacherId() == null) {
            source = List.of();
        } else {
            List<Long> classIds = classes.findAllAccessibleByTeacher(actor.teacherId()).stream()
                    .map(c -> c.getId()).toList();
            source = classIds.isEmpty() ? List.of() : enrollments.findAllByClassIdsWithReferences(classIds);
        }
        return source.stream().map(EnrollmentResponse::from).toList();
    }

    @Transactional
    public EnrollmentResponse create(Actor actor, EnrollmentRequest request) {
        actor.requireAdmin();
        var student = students.findById(request.studentId())
                .orElseThrow(() -> Text.badRequest("Học sinh không tồn tại"));
        var schoolClass = classes.findById(request.classId())
                .orElseThrow(() -> Text.badRequest("Lớp học không tồn tại"));
        if (!student.getSchoolClass().getId().equals(schoolClass.getId())) {
            throw Text.badRequest("Học sinh không thuộc lớp đã chọn");
        }

        Enrollment enrollment = new Enrollment();
        enrollment.setStudent(student);
        enrollment.setSchoolClass(schoolClass);
        enrollment.setAcademicYear(request.academicYear().trim());
        enrollment.setEnrollmentDate(request.enrollmentDate() == null ? LocalDate.now() : request.enrollmentDate());
        return EnrollmentResponse.from(enrollments.saveAndFlush(enrollment));
    }

    public List<StudentResponse> availableStudents(
            Actor actor, Long classId, String academicYear, String search) {
        actor.requireAdmin();
        String year = normalizeAcademicYear(academicYear);
        if (classes.findById(classId).isEmpty()) {
            throw Text.notFound("Không tìm thấy lớp học");
        }
        return students.findAvailableForClass(classId, year, Text.normalizeQuery(search)).stream()
                .map(StudentResponse::from)
                .toList();
    }

    @Transactional
    public List<EnrollmentResponse> enrollStudents(
            Actor actor, Long classId, ClassStudentEnrollmentRequest request) {
        actor.requireAdmin();
        String year = normalizeAcademicYear(request.academicYear());
        Set<Long> uniqueStudentIds = new HashSet<>(request.studentIds());
        if (uniqueStudentIds.size() != request.studentIds().size()) {
            throw Text.badRequest("Danh sách học sinh có mã bị lặp");
        }

        var schoolClass = classes.findByIdForUpdate(classId)
                .orElseThrow(() -> Text.notFound("Không tìm thấy lớp học"));
        List<Student> selectedStudents = new ArrayList<>();
        for (Long studentId : uniqueStudentIds.stream().sorted().toList()) {
            selectedStudents.add(students.findWithClassByIdForUpdate(studentId)
                    .orElseThrow(() -> Text.notFound("Không tìm thấy học sinh có mã " + studentId)));
        }

        List<Enrollment> activeEnrollments = new ArrayList<>();
        long studentsMovingIntoClass = 0;
        for (Student student : selectedStudents) {
            Enrollment previous = enrollments.findActiveForUpdate(student.getId(), year).orElse(null);
            if (previous != null && previous.getSchoolClass().getId().equals(classId)) {
                throw Text.conflict("Học sinh " + student.getFullName()
                        + " đã được ghi danh vào lớp này trong năm học " + year);
            }
            if (previous != null
                    && !previous.getSchoolClass().getId().equals(student.getSchoolClass().getId())) {
                throw Text.conflict("Dữ liệu phân lớp hiện tại của học sinh "
                        + student.getFullName() + " không nhất quán");
            }
            activeEnrollments.add(previous);
            if (!student.getSchoolClass().getId().equals(classId)) {
                studentsMovingIntoClass++;
            }
        }
        long currentSize = students.countBySchoolClassId(classId);
        if (currentSize + studentsMovingIntoClass > schoolClass.getMaxStudents()) {
            throw Text.conflict("Lớp " + schoolClass.getClassName() + " không đủ chỗ cho số học sinh đã chọn");
        }

        LocalDate enrollmentDate = request.enrollmentDate() == null ? LocalDate.now() : request.enrollmentDate();
        List<EnrollmentResponse> results = new ArrayList<>();
        for (int index = 0; index < selectedStudents.size(); index++) {
            Student student = selectedStudents.get(index);
            Enrollment previous = activeEnrollments.get(index);
            if (previous != null) {
                previous.setStatus("TRANSFERRED");
                enrollments.saveAndFlush(previous);
            }

            Enrollment enrollment = new Enrollment();
            enrollment.setStudent(student);
            enrollment.setSchoolClass(schoolClass);
            enrollment.setAcademicYear(year);
            enrollment.setEnrollmentDate(enrollmentDate);
            if (!student.getSchoolClass().getId().equals(classId)) {
                student.setSchoolClass(schoolClass);
                students.save(student);
                leaders.deleteByStudentId(student.getId());
            }
            results.add(EnrollmentResponse.from(enrollments.save(enrollment)));
        }
        enrollments.flush();
        return List.copyOf(results);
    }

    private String normalizeAcademicYear(String academicYear) {
        if (academicYear == null || !academicYear.trim().matches("\\d{4}-\\d{4}")) {
            throw Text.badRequest("Năm học phải có dạng YYYY-YYYY");
        }
        String normalized = academicYear.trim();
        int startYear = Integer.parseInt(normalized.substring(0, 4));
        int endYear = Integer.parseInt(normalized.substring(5, 9));
        if (endYear != startYear + 1) {
            throw Text.badRequest("Năm học kết thúc phải sau năm bắt đầu một năm");
        }
        return normalized;
    }
}
