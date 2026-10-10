package com.example.student_management_api.attendance;

import com.example.student_management_api.academic.EnrollmentRepository;
import com.example.student_management_api.auth.Actor;
import com.example.student_management_api.common.Text;
import com.example.student_management_api.schoolclass.SchoolClassRepository;
import com.example.student_management_api.teaching.ClassSubjectRepository;
import com.example.student_management_api.teaching.ClassTeacherRepository;
import java.util.List;
import java.util.HashSet;
import java.util.Set;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class AttendanceService {

    private final AttendanceSessionRepository sessions;
    private final AttendanceRecordRepository records;
    private final EnrollmentRepository enrollments;
    private final SchoolClassRepository classes;
    private final ClassSubjectRepository classSubjects;
    private final ClassTeacherRepository assignments;

    public AttendanceService(
            AttendanceSessionRepository sessions,
            AttendanceRecordRepository records,
            EnrollmentRepository enrollments,
            SchoolClassRepository classes,
            ClassSubjectRepository classSubjects,
            ClassTeacherRepository assignments) {
        this.sessions = sessions;
        this.records = records;
        this.enrollments = enrollments;
        this.classes = classes;
        this.classSubjects = classSubjects;
        this.assignments = assignments;
    }

    public List<AttendanceSessionResponse> list(Actor actor) {
        return sessions.findAllWithReferences().stream()
                .filter(session -> isAccessible(actor, session))
                .map(this::toResponse)
                .toList();
    }

    public AttendanceSessionResponse get(Actor actor, Long id) {
        AttendanceSession session = find(id);
        requireAccessible(actor, session);
        return toResponse(session);
    }

    @Transactional
    public AttendanceSessionResponse create(Actor actor, AttendanceSessionRequest request) {
        var schoolClass = classes.findById(request.classId())
                .orElseThrow(() -> Text.badRequest("Lớp học không tồn tại"));
        AttendanceSession session = new AttendanceSession();
        session.setSchoolClass(schoolClass);
        session.setAttendanceDate(request.attendanceDate());
        session.setAttendanceType(request.attendanceType().trim().toUpperCase());
        session.setPeriod(request.period());
        session.setNote(Text.blankToNull(request.note()));

        if ("CLASS".equals(session.getAttendanceType())) {
            if (request.classSubjectId() != null || request.classTeacherId() != null) {
                throw Text.badRequest("Điểm danh lớp không nhận phân công môn học");
            }
        } else if ("SUBJECT".equals(session.getAttendanceType())) {
            if (request.classSubjectId() == null || request.classTeacherId() == null) {
                throw Text.badRequest("Điểm danh theo môn cần phân công lớp-môn và giáo viên");
            }
            var classSubject = classSubjects.findWithReferencesById(request.classSubjectId())
                    .orElseThrow(() -> Text.badRequest("Phân công lớp-môn không tồn tại"));
            var assignment = assignments.findWithReferencesById(request.classTeacherId())
                    .orElseThrow(() -> Text.badRequest("Phân công giáo viên không tồn tại"));
            if (!assignment.getClassSubject().getId().equals(classSubject.getId())
                    || !classSubject.getSchoolClass().getId().equals(schoolClass.getId())) {
                throw Text.badRequest("Phân công không thuộc lớp đã chọn");
            }
            requireAssignment(actor, assignment);
            session.setClassSubject(classSubject);
            session.setClassTeacher(assignment);
        } else {
            throw Text.badRequest("Loại điểm danh không hợp lệ");
        }
        if ("CLASS".equals(session.getAttendanceType())) {
            requireClassAccess(actor, schoolClass.getId());
        }
        return toResponse(sessions.saveAndFlush(session));
    }

    @Transactional
    public List<AttendanceRecordResponse> saveRecords(
            Actor actor, Long sessionId, List<AttendanceRecordRequest> request) {
        AttendanceSession session = find(sessionId);
        requireAccessible(actor, session);
        if (!actor.isAdmin() && session.getClassTeacher() != null
                && !session.getClassTeacher().isActive()) {
            throw Text.forbidden("Phân công đã bị hủy; chỉ được xem lịch sử điểm danh");
        }
        Set<Long> enrollmentIds = new HashSet<>();
        List<AttendanceRecord> updated = request.stream().map(item -> {
            if (!enrollmentIds.add(item.enrollmentId())) {
                throw Text.badRequest("Một học sinh chỉ được điểm danh một lần trong mỗi phiên");
            }
            var enrollment = enrollments.findWithReferencesById(item.enrollmentId())
                    .orElseThrow(() -> Text.badRequest("Lượt ghi danh không tồn tại"));
            if (!enrollment.getSchoolClass().getId().equals(session.getSchoolClass().getId())) {
                throw Text.badRequest("Học sinh không thuộc lớp điểm danh");
            }
            String status = item.status().trim().toUpperCase();
            if (!List.of("PRESENT", "ABSENT", "LATE", "EXCUSED").contains(status)) {
                throw Text.badRequest("Trạng thái điểm danh không hợp lệ");
            }
            AttendanceRecord record = records.findBySessionIdAndEnrollmentId(
                            session.getId(), enrollment.getId())
                    .orElseGet(AttendanceRecord::new);
            record.setSession(session);
            record.setEnrollment(enrollment);
            record.setSchoolClass(session.getSchoolClass());
            record.setStatus(status);
            record.setNote(Text.blankToNull(item.note()));
            return record;
        }).toList();
        return records.saveAll(updated).stream().map(AttendanceRecordResponse::from).toList();
    }

    @Transactional
    public void delete(Actor actor, Long id) {
        actor.requireAdmin();
        sessions.delete(find(id));
    }

    private AttendanceSession find(Long id) {
        return sessions.findWithReferencesById(id)
                .orElseThrow(() -> Text.notFound("Không tìm thấy phiên điểm danh"));
    }

    private AttendanceSessionResponse toResponse(AttendanceSession session) {
        List<AttendanceRecordResponse> sessionRecords = records
                .findAllBySessionIdWithStudent(session.getId()).stream()
                .map(AttendanceRecordResponse::from)
                .toList();
        return AttendanceSessionResponse.from(session, sessionRecords);
    }

    private boolean isAccessible(Actor actor, AttendanceSession session) {
        if (actor.isAdmin()) {
            return true;
        }
        if (session.getClassTeacher() != null) {
            return actor.teacherId() != null
                    && actor.teacherId().equals(session.getClassTeacher().getTeacher().getId());
        }
        return actor.teacherId() != null
                && classes.findAccessibleByTeacher(session.getSchoolClass().getId(), actor.teacherId()).isPresent();
    }

    private void requireAccessible(Actor actor, AttendanceSession session) {
        if (!isAccessible(actor, session)) {
            throw Text.notFound("Không tìm thấy phiên điểm danh");
        }
    }

    private void requireClassAccess(Actor actor, Long classId) {
        if (!actor.isAdmin() && (actor.teacherId() == null
                || classes.findAccessibleByTeacher(classId, actor.teacherId()).isEmpty())) {
            throw Text.forbidden("Bạn không được phân công vào lớp này");
        }
    }

    private void requireAssignment(Actor actor, com.example.student_management_api.teaching.ClassTeacher assignment) {
        if (!actor.isAdmin() && (!assignment.isActive() || actor.teacherId() == null
                || !actor.teacherId().equals(assignment.getTeacher().getId()))) {
            throw Text.forbidden("Bạn không được phân công giảng dạy môn này");
        }
    }
}
