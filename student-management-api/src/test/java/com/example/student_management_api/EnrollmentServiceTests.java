package com.example.student_management_api;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

import com.example.student_management_api.academic.ClassStudentEnrollmentRequest;
import com.example.student_management_api.academic.Enrollment;
import com.example.student_management_api.academic.EnrollmentRepository;
import com.example.student_management_api.academic.EnrollmentService;
import com.example.student_management_api.auth.Actor;
import com.example.student_management_api.common.Gender;
import com.example.student_management_api.schoolclass.ClassLeaderRepository;
import com.example.student_management_api.schoolclass.ClassService;
import com.example.student_management_api.schoolclass.SchoolClass;
import com.example.student_management_api.schoolclass.SchoolClassRepository;
import com.example.student_management_api.student.Student;
import com.example.student_management_api.student.StudentRepository;
import com.example.student_management_api.teacher.TeacherRepository;
import com.example.student_management_api.user.Role;
import java.lang.reflect.Method;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

class EnrollmentServiceTests {

    @Test
    void adminSeesEmptyRosterWhenClassHasNoEnrollmentRecords() {
        EnrollmentRepository enrollments = mock(EnrollmentRepository.class);
        StudentRepository students = mock(StudentRepository.class);
        SchoolClassRepository classes = mock(SchoolClassRepository.class);
        ClassLeaderRepository leaders = mock(ClassLeaderRepository.class);
        when(enrollments.findAllWithReferences()).thenReturn(List.of());
        EnrollmentService service = new EnrollmentService(enrollments, students, classes, leaders);

        assertTrue(service.list(new Actor(1L, Role.ADMIN, null)).isEmpty());
    }

    @Test
    void availableStudentsUsesTheRequestedAcademicYear() {
        EnrollmentRepository enrollments = mock(EnrollmentRepository.class);
        StudentRepository students = mock(StudentRepository.class);
        SchoolClassRepository classes = mock(SchoolClassRepository.class);
        ClassLeaderRepository leaders = mock(ClassLeaderRepository.class);
        Student existingStudent = student(13L, schoolClass(8L, 30, "10B1"));
        SchoolClass target = schoolClass(8L, 30, "10B1");
        when(classes.findById(8L)).thenReturn(Optional.of(target));
        when(students.findAvailableForClass(8L, "2026-2027", ""))
                .thenReturn(List.of(existingStudent));
        EnrollmentService service = new EnrollmentService(enrollments, students, classes, leaders);

        var available = service.availableStudents(
                new Actor(1L, Role.ADMIN, null), 8L, "2026-2027", null);
        assertEquals(1, available.size());
        assertEquals("10B1", available.get(0).className());
        verify(students).findAvailableForClass(8L, "2026-2027", "");
    }

    @Test
    void adminCanTransferMultipleStudentsAndPreservesPriorEnrollments() {
        EnrollmentRepository enrollments = mock(EnrollmentRepository.class);
        StudentRepository students = mock(StudentRepository.class);
        SchoolClassRepository classes = mock(SchoolClassRepository.class);
        ClassLeaderRepository leaders = mock(ClassLeaderRepository.class);
        SchoolClass target = schoolClass(8L, 30, "10B1");
        SchoolClass source = schoolClass(7L, 30, "10A1");
        Student firstStudent = student(13L, source);
        Student secondStudent = student(14L, source);
        Enrollment previous = new Enrollment();
        previous.setSchoolClass(source);
        previous.setAcademicYear("2026-2027");
        when(classes.findByIdForUpdate(8L)).thenReturn(Optional.of(target));
        when(students.findWithClassByIdForUpdate(13L)).thenReturn(Optional.of(firstStudent));
        when(students.findWithClassByIdForUpdate(14L)).thenReturn(Optional.of(secondStudent));
        when(students.countBySchoolClassId(8L)).thenReturn(5L);
        when(enrollments.findActiveForUpdate(13L, "2026-2027")).thenReturn(Optional.of(previous));
        when(enrollments.findActiveForUpdate(14L, "2026-2027")).thenReturn(Optional.empty());
        when(enrollments.saveAndFlush(previous)).thenReturn(previous);
        when(enrollments.save(any(Enrollment.class))).thenAnswer(invocation -> invocation.getArgument(0));

        EnrollmentService service = new EnrollmentService(enrollments, students, classes, leaders);
        var result = service.enrollStudents(
                new Actor(1L, Role.ADMIN, null),
                8L,
                new ClassStudentEnrollmentRequest(List.of(14L, 13L), "2026-2027", null));

        assertEquals(2, result.size());
        assertEquals("10B1", result.get(0).className());
        assertEquals("10B1", result.get(1).className());
        assertEquals("TRANSFERRED", previous.getStatus());
        verify(leaders).deleteByStudentId(13L);
        verify(leaders).deleteByStudentId(14L);
    }

    @Test
    void teacherCannotEnrollStudents() {
        EnrollmentRepository enrollments = mock(EnrollmentRepository.class);
        StudentRepository students = mock(StudentRepository.class);
        SchoolClassRepository classes = mock(SchoolClassRepository.class);
        ClassLeaderRepository leaders = mock(ClassLeaderRepository.class);
        EnrollmentService service = new EnrollmentService(enrollments, students, classes, leaders);

        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> service.enrollStudents(
                        new Actor(2L, Role.TEACHER, 4L),
                        8L,
                        new ClassStudentEnrollmentRequest(List.of(13L), "2026-2027", null)));

        assertEquals(403, exception.getStatusCode().value());
        verifyNoInteractions(enrollments, students, classes, leaders);
    }

    @Test
    void duplicateStudentIdsAreRejectedBeforeAnyDatabaseAccess() {
        EnrollmentRepository enrollments = mock(EnrollmentRepository.class);
        StudentRepository students = mock(StudentRepository.class);
        SchoolClassRepository classes = mock(SchoolClassRepository.class);
        ClassLeaderRepository leaders = mock(ClassLeaderRepository.class);
        EnrollmentService service = new EnrollmentService(enrollments, students, classes, leaders);

        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> service.enrollStudents(
                        new Actor(1L, Role.ADMIN, null),
                        8L,
                        new ClassStudentEnrollmentRequest(List.of(13L, 13L), "2026-2027", null)));

        assertEquals(400, exception.getStatusCode().value());
        verifyNoInteractions(enrollments, students, classes, leaders);
    }

    @Test
    void studentAlreadyInTargetClassCannotBeAddedAgain() {
        EnrollmentRepository enrollments = mock(EnrollmentRepository.class);
        StudentRepository students = mock(StudentRepository.class);
        SchoolClassRepository classes = mock(SchoolClassRepository.class);
        ClassLeaderRepository leaders = mock(ClassLeaderRepository.class);
        SchoolClass target = schoolClass(8L, 30, "10B1");
        Student existingStudent = student(13L, target);
        when(classes.findByIdForUpdate(8L)).thenReturn(Optional.of(target));
        when(students.findWithClassByIdForUpdate(13L)).thenReturn(Optional.of(existingStudent));
        Enrollment existingEnrollment = new Enrollment();
        existingEnrollment.setSchoolClass(target);
        when(enrollments.findActiveForUpdate(13L, "2026-2027"))
                .thenReturn(Optional.of(existingEnrollment));
        EnrollmentService service = new EnrollmentService(enrollments, students, classes, leaders);

        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> service.enrollStudents(
                        new Actor(1L, Role.ADMIN, null),
                        8L,
                        new ClassStudentEnrollmentRequest(List.of(13L), "2026-2027", null)));

        assertEquals(409, exception.getStatusCode().value());
        verify(enrollments).findActiveForUpdate(13L, "2026-2027");
        verifyNoInteractions(leaders);
    }

    @Test
    void adminCanCreateCurrentYearEnrollmentForStudentAlreadyAssignedToTargetClass() {
        EnrollmentRepository enrollments = mock(EnrollmentRepository.class);
        StudentRepository students = mock(StudentRepository.class);
        SchoolClassRepository classes = mock(SchoolClassRepository.class);
        ClassLeaderRepository leaders = mock(ClassLeaderRepository.class);
        SchoolClass target = schoolClass(8L, 1, "10B1");
        Student existingStudent = student(13L, target);
        when(classes.findByIdForUpdate(8L)).thenReturn(Optional.of(target));
        when(students.findWithClassByIdForUpdate(13L)).thenReturn(Optional.of(existingStudent));
        when(students.countBySchoolClassId(8L)).thenReturn(1L);
        when(enrollments.findActiveForUpdate(13L, "2026-2027")).thenReturn(Optional.empty());
        when(enrollments.save(any(Enrollment.class))).thenAnswer(invocation -> invocation.getArgument(0));
        EnrollmentService service = new EnrollmentService(enrollments, students, classes, leaders);

        var result = service.enrollStudents(
                new Actor(1L, Role.ADMIN, null),
                8L,
                new ClassStudentEnrollmentRequest(List.of(13L), "2026-2027", null));

        assertEquals(1, result.size());
        assertEquals("2026-2027", result.get(0).academicYear());
        assertEquals("10B1", result.get(0).className());
        verify(students).countBySchoolClassId(8L);
        verifyNoInteractions(leaders);
    }

    @Test
    void missingClassIsReportedBeforeLoadingStudents() {
        EnrollmentRepository enrollments = mock(EnrollmentRepository.class);
        StudentRepository students = mock(StudentRepository.class);
        SchoolClassRepository classes = mock(SchoolClassRepository.class);
        ClassLeaderRepository leaders = mock(ClassLeaderRepository.class);
        when(classes.findByIdForUpdate(8L)).thenReturn(Optional.empty());
        EnrollmentService service = new EnrollmentService(enrollments, students, classes, leaders);

        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> service.enrollStudents(
                        new Actor(1L, Role.ADMIN, null),
                        8L,
                        new ClassStudentEnrollmentRequest(List.of(13L), "2026-2027", null)));

        assertEquals(404, exception.getStatusCode().value());
        verifyNoInteractions(students, leaders);
    }

    @Test
    void missingStudentIsReportedWithoutCreatingAnyEnrollment() {
        EnrollmentRepository enrollments = mock(EnrollmentRepository.class);
        StudentRepository students = mock(StudentRepository.class);
        SchoolClassRepository classes = mock(SchoolClassRepository.class);
        ClassLeaderRepository leaders = mock(ClassLeaderRepository.class);
        SchoolClass target = schoolClass(8L, 30, "10B1");
        when(classes.findByIdForUpdate(8L)).thenReturn(Optional.of(target));
        when(students.findWithClassByIdForUpdate(13L)).thenReturn(Optional.empty());
        EnrollmentService service = new EnrollmentService(enrollments, students, classes, leaders);

        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> service.enrollStudents(
                        new Actor(1L, Role.ADMIN, null),
                        8L,
                        new ClassStudentEnrollmentRequest(List.of(13L), "2026-2027", null)));

        assertEquals(404, exception.getStatusCode().value());
        verifyNoInteractions(enrollments, leaders);
    }

    @Test
    void teacherCannotReadRosterForUnassignedClass() {
        StudentRepository students = mock(StudentRepository.class);
        SchoolClassRepository classes = mock(SchoolClassRepository.class);
        ClassLeaderRepository leaders = mock(ClassLeaderRepository.class);
        TeacherRepository teachers = mock(TeacherRepository.class);
        when(classes.findAccessibleByTeacher(8L, 4L)).thenReturn(Optional.empty());
        ClassService service = new ClassService(classes, leaders, students, teachers);

        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> service.get(new Actor(2L, Role.TEACHER, 4L), 8L));

        assertEquals(404, exception.getStatusCode().value());
        verifyNoInteractions(students, leaders);
    }

    @Test
    void bulkEnrollmentMethodIsTransactional() throws NoSuchMethodException {
        Method method = EnrollmentService.class.getMethod(
                "enrollStudents", Actor.class, Long.class, ClassStudentEnrollmentRequest.class);

        assertTrue(method.isAnnotationPresent(Transactional.class));
    }

    private static SchoolClass schoolClass(Long id, int capacity, String name) {
        SchoolClass schoolClass = mock(SchoolClass.class);
        when(schoolClass.getId()).thenReturn(id);
        when(schoolClass.getMaxStudents()).thenReturn(capacity);
        when(schoolClass.getClassName()).thenReturn(name);
        return schoolClass;
    }

    private static Student student(Long id, SchoolClass schoolClass) {
        Student student = mock(Student.class);
        when(student.getId()).thenReturn(id);
        when(student.getFullName()).thenReturn("Học sinh " + id);
        when(student.getStudentCode()).thenReturn("HS" + id);
        when(student.getDateOfBirth()).thenReturn(LocalDate.of(2010, 1, 1));
        when(student.getGender()).thenReturn(Gender.FEMALE);
        when(student.getStatus()).thenReturn(Student.Status.ACTIVE);
        when(student.getSchoolClass()).thenReturn(schoolClass);
        return student;
    }
}
