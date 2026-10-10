package com.example.student_management_api;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

import com.example.student_management_api.academic.EnrollmentRepository;
import com.example.student_management_api.auth.Actor;
import com.example.student_management_api.grade.AssessmentTypeRepository;
import com.example.student_management_api.grade.GradeRepository;
import com.example.student_management_api.grade.GradeRequest;
import com.example.student_management_api.grade.GradeService;
import com.example.student_management_api.schoolclass.SchoolClassRepository;
import com.example.student_management_api.student.StudentRepository;
import com.example.student_management_api.student.StudentService;
import com.example.student_management_api.teaching.ClassTeacher;
import com.example.student_management_api.teaching.ClassTeacherRepository;
import com.example.student_management_api.teacher.Teacher;
import com.example.student_management_api.user.Role;
import java.math.BigDecimal;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.springframework.web.server.ResponseStatusException;

class AuthorizationServiceTests {

    @Test
    void teacherCannotCreateStudent() {
        StudentRepository students = mock(StudentRepository.class);
        SchoolClassRepository classes = mock(SchoolClassRepository.class);
        StudentService service = new StudentService(students, classes);
        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> service.create(new Actor(1L, Role.TEACHER, 21L), null));

        assertEquals(403, exception.getStatusCode().value());
        verifyNoInteractions(students, classes);
    }

    @Test
    void teacherCannotEnterGradeForAnotherTeachersAssignment() {
        GradeRepository grades = mock(GradeRepository.class);
        EnrollmentRepository enrollments = mock(EnrollmentRepository.class);
        ClassTeacherRepository assignments = mock(ClassTeacherRepository.class);
        AssessmentTypeRepository assessmentTypes = mock(AssessmentTypeRepository.class);
        ClassTeacher assignment = mock(ClassTeacher.class);
        Teacher assignedTeacher = mock(Teacher.class);
        when(enrollments.findWithReferencesById(4L)).thenReturn(Optional.of(
                mock(com.example.student_management_api.academic.Enrollment.class)));
        when(assignments.findWithReferencesById(9L)).thenReturn(Optional.of(assignment));
        when(assignment.getTeacher()).thenReturn(assignedTeacher);
        when(assignedTeacher.getId()).thenReturn(22L);
        GradeService service = new GradeService(grades, enrollments, assignments, assessmentTypes);
        GradeRequest request = new GradeRequest(
                4L, 9L, 1L, "SEMESTER_1", 1, new BigDecimal("8.50"), null);

        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> service.create(new Actor(1L, Role.TEACHER, 21L), request));

        assertEquals(404, exception.getStatusCode().value());
        verifyNoInteractions(grades, assessmentTypes);
    }
}
