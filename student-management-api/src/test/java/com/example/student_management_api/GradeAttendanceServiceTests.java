package com.example.student_management_api;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

import com.example.student_management_api.academic.Enrollment;
import com.example.student_management_api.academic.EnrollmentRepository;
import com.example.student_management_api.attendance.AttendanceRecordRepository;
import com.example.student_management_api.attendance.AttendanceService;
import com.example.student_management_api.attendance.AttendanceSessionRepository;
import com.example.student_management_api.attendance.AttendanceSessionRequest;
import com.example.student_management_api.auth.Actor;
import com.example.student_management_api.grade.AssessmentTypeRepository;
import com.example.student_management_api.grade.GradeRepository;
import com.example.student_management_api.grade.GradeRequest;
import com.example.student_management_api.grade.GradeService;
import com.example.student_management_api.schoolclass.SchoolClass;
import com.example.student_management_api.schoolclass.SchoolClassRepository;
import com.example.student_management_api.student.Student;
import com.example.student_management_api.teaching.ClassSubject;
import com.example.student_management_api.teaching.ClassTeacher;
import com.example.student_management_api.teaching.ClassTeacherRepository;
import com.example.student_management_api.teaching.ClassSubjectRepository;
import com.example.student_management_api.teacher.Teacher;
import com.example.student_management_api.user.Role;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.springframework.web.server.ResponseStatusException;

class GradeAttendanceServiceTests {

    @Test
    void gradeCannotBeCreatedForEnrollmentFromAnotherAcademicYear() {
        GradeRepository grades = mock(GradeRepository.class);
        EnrollmentRepository enrollments = mock(EnrollmentRepository.class);
        ClassTeacherRepository assignments = mock(ClassTeacherRepository.class);
        AssessmentTypeRepository assessmentTypes = mock(AssessmentTypeRepository.class);
        Enrollment enrollment = mock(Enrollment.class);
        SchoolClass schoolClass = mock(SchoolClass.class);
        ClassTeacher assignment = mock(ClassTeacher.class);
        ClassSubject classSubject = mock(ClassSubject.class);

        when(enrollments.findWithReferencesById(4L)).thenReturn(Optional.of(enrollment));
        when(enrollment.getSchoolClass()).thenReturn(schoolClass);
        when(enrollment.getAcademicYear()).thenReturn("2025-2026");
        when(schoolClass.getId()).thenReturn(7L);
        when(assignments.findWithReferencesById(9L)).thenReturn(Optional.of(assignment));
        when(assignment.getClassSubject()).thenReturn(classSubject);
        when(classSubject.getSchoolClass()).thenReturn(schoolClass);
        when(classSubject.getAcademicYear()).thenReturn("2026-2027");

        GradeService service = new GradeService(grades, enrollments, assignments, assessmentTypes);
        GradeRequest request = new GradeRequest(
                4L, 9L, 1L, "SEMESTER_1", 1, new BigDecimal("8.50"), null);

        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> service.create(new Actor(1L, Role.ADMIN, null), request));

        assertEquals(400, exception.getStatusCode().value());
        verifyNoInteractions(grades, assessmentTypes);
    }

    @Test
    void teacherCannotCreateGradeForAnotherTeachersAssignment() {
        GradeRepository grades = mock(GradeRepository.class);
        EnrollmentRepository enrollments = mock(EnrollmentRepository.class);
        ClassTeacherRepository assignments = mock(ClassTeacherRepository.class);
        AssessmentTypeRepository assessmentTypes = mock(AssessmentTypeRepository.class);
        Enrollment enrollment = mock(Enrollment.class);
        ClassTeacher assignment = mock(ClassTeacher.class);
        Teacher assignedTeacher = mock(Teacher.class);

        when(enrollments.findWithReferencesById(4L)).thenReturn(Optional.of(enrollment));
        when(assignments.findWithReferencesById(9L)).thenReturn(Optional.of(assignment));
        when(assignment.isActive()).thenReturn(true);
        when(assignment.getTeacher()).thenReturn(assignedTeacher);
        when(assignedTeacher.getId()).thenReturn(31L);

        GradeService service = new GradeService(grades, enrollments, assignments, assessmentTypes);
        GradeRequest request = new GradeRequest(
                4L, 9L, 1L, "SEMESTER_1", 1, new BigDecimal("8.50"), null);

        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> service.create(new Actor(1L, Role.TEACHER, 21L), request));

        assertEquals(404, exception.getStatusCode().value());
        verifyNoInteractions(grades, assessmentTypes);
    }

    @Test
    void gradeCannotBeCreatedWithUnknownAssessmentTypeId() {
        GradeRepository grades = mock(GradeRepository.class);
        EnrollmentRepository enrollments = mock(EnrollmentRepository.class);
        ClassTeacherRepository assignments = mock(ClassTeacherRepository.class);
        AssessmentTypeRepository assessmentTypes = mock(AssessmentTypeRepository.class);
        Enrollment enrollment = mock(Enrollment.class);
        SchoolClass schoolClass = mock(SchoolClass.class);
        ClassTeacher assignment = mock(ClassTeacher.class);
        ClassSubject classSubject = mock(ClassSubject.class);

        when(enrollments.findWithReferencesById(4L)).thenReturn(Optional.of(enrollment));
        when(enrollment.getSchoolClass()).thenReturn(schoolClass);
        when(enrollment.getAcademicYear()).thenReturn("2026-2027");
        when(schoolClass.getId()).thenReturn(7L);
        when(assignments.findWithReferencesById(9L)).thenReturn(Optional.of(assignment));
        when(assignment.getClassSubject()).thenReturn(classSubject);
        when(classSubject.getSchoolClass()).thenReturn(schoolClass);
        when(classSubject.getAcademicYear()).thenReturn("2026-2027");
        when(classSubject.getSemester()).thenReturn("SEMESTER_1");

        GradeService service = new GradeService(grades, enrollments, assignments, assessmentTypes);
        GradeRequest request = new GradeRequest(
                4L, 9L, 999L, "SEMESTER_1", 1, new BigDecimal("8.50"), null);

        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> service.create(new Actor(1L, Role.ADMIN, null), request));

        assertEquals(400, exception.getStatusCode().value());
        verify(assessmentTypes).findById(999L);
        verify(grades, never()).saveAndFlush(org.mockito.ArgumentMatchers.any());
    }

    @Test
    void teacherCannotCreateClassAttendanceOutsideAssignedClasses() {
        AttendanceSessionRepository sessions = mock(AttendanceSessionRepository.class);
        AttendanceRecordRepository records = mock(AttendanceRecordRepository.class);
        EnrollmentRepository enrollments = mock(EnrollmentRepository.class);
        SchoolClassRepository classes = mock(SchoolClassRepository.class);
        ClassSubjectRepository classSubjects = mock(ClassSubjectRepository.class);
        ClassTeacherRepository assignments = mock(ClassTeacherRepository.class);
        SchoolClass schoolClass = mock(SchoolClass.class);
        when(classes.findById(7L)).thenReturn(Optional.of(schoolClass));
        when(classes.findAccessibleByTeacher(7L, 21L)).thenReturn(Optional.empty());

        AttendanceService service = new AttendanceService(
                sessions, records, enrollments, classes, classSubjects, assignments);
        AttendanceSessionRequest request = new AttendanceSessionRequest(
                7L, LocalDate.of(2026, 10, 10), "CLASS", null, null, null, null);

        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> service.create(new Actor(1L, Role.TEACHER, 21L), request));

        assertEquals(403, exception.getStatusCode().value());
        verifyNoInteractions(sessions);
    }

    @Test
    void attendanceRecordCannotBeSavedForEnrollmentFromAnotherClass() {
        AttendanceSessionRepository sessions = mock(AttendanceSessionRepository.class);
        AttendanceRecordRepository records = mock(AttendanceRecordRepository.class);
        EnrollmentRepository enrollments = mock(EnrollmentRepository.class);
        SchoolClassRepository classes = mock(SchoolClassRepository.class);
        ClassSubjectRepository classSubjects = mock(ClassSubjectRepository.class);
        ClassTeacherRepository assignments = mock(ClassTeacherRepository.class);
        var session = mock(com.example.student_management_api.attendance.AttendanceSession.class);
        var assignedClass = mock(SchoolClass.class);
        var otherClass = mock(SchoolClass.class);
        var enrollment = mock(Enrollment.class);
        Student student = mock(Student.class);

        when(sessions.findWithReferencesById(3L)).thenReturn(Optional.of(session));
        when(session.getSchoolClass()).thenReturn(assignedClass);
        when(session.getClassTeacher()).thenReturn(null);
        when(session.getId()).thenReturn(3L);
        when(assignedClass.getId()).thenReturn(7L);
        when(classes.findAccessibleByTeacher(7L, 21L)).thenReturn(Optional.of(assignedClass));
        when(enrollments.findWithReferencesById(4L)).thenReturn(Optional.of(enrollment));
        when(enrollment.getSchoolClass()).thenReturn(otherClass);
        when(otherClass.getId()).thenReturn(8L);

        AttendanceService service = new AttendanceService(
                sessions, records, enrollments, classes, classSubjects, assignments);
        var request = java.util.List.of(
                new com.example.student_management_api.attendance.AttendanceRecordRequest(4L, "PRESENT", null));

        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> service.saveRecords(new Actor(1L, Role.TEACHER, 21L), 3L, request));

        assertEquals(400, exception.getStatusCode().value());
        verifyNoInteractions(records);
    }
}
