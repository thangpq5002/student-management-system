package com.example.student_management_api;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

import com.example.student_management_api.attendance.AttendanceSessionRepository;
import com.example.student_management_api.auth.Actor;
import com.example.student_management_api.grade.GradeRepository;
import com.example.student_management_api.schoolclass.SchoolClass;
import com.example.student_management_api.schoolclass.SchoolClassRepository;
import com.example.student_management_api.subject.Subject;
import com.example.student_management_api.subject.SubjectRepository;
import com.example.student_management_api.teacher.Teacher;
import com.example.student_management_api.teacher.TeacherRepository;
import com.example.student_management_api.teaching.ClassSubject;
import com.example.student_management_api.teaching.ClassSubjectRepository;
import com.example.student_management_api.teaching.ClassTeacher;
import com.example.student_management_api.teaching.ClassTeacherRepository;
import com.example.student_management_api.teaching.TeachingAssignmentRequest;
import com.example.student_management_api.teaching.TeachingAssignmentService;
import com.example.student_management_api.teaching.TeachingAssignmentUpdateRequest;
import com.example.student_management_api.user.Role;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.springframework.web.server.ResponseStatusException;

class TeachingAssignmentServiceTests {

    private TeachingAssignmentService service(
            ClassSubjectRepository classSubjects,
            ClassTeacherRepository assignments,
            SchoolClassRepository classes,
            SubjectRepository subjects,
            TeacherRepository teachers,
            GradeRepository grades,
            AttendanceSessionRepository sessions) {
        return new TeachingAssignmentService(
                classSubjects, assignments, classes, subjects, teachers, grades, sessions);
    }

    @Test
    void teacherCannotCreateAssignment() {
        ClassSubjectRepository classSubjects = mock(ClassSubjectRepository.class);
        ClassTeacherRepository assignments = mock(ClassTeacherRepository.class);
        SchoolClassRepository classes = mock(SchoolClassRepository.class);
        SubjectRepository subjects = mock(SubjectRepository.class);
        TeacherRepository teachers = mock(TeacherRepository.class);
        GradeRepository grades = mock(GradeRepository.class);
        AttendanceSessionRepository sessions = mock(AttendanceSessionRepository.class);

        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> service(classSubjects, assignments, classes, subjects, teachers, grades, sessions)
                        .create(new Actor(1L, Role.TEACHER, 21L),
                                new TeachingAssignmentRequest(1L, 2L, 3L, "2026-2027", "SEMESTER_1")));

        assertEquals(403, exception.getStatusCode().value());
        verifyNoInteractions(classSubjects, assignments, classes, subjects, teachers, grades, sessions);
    }

    @Test
    void duplicateAssignmentReturnsConflict() {
        ClassSubjectRepository classSubjects = mock(ClassSubjectRepository.class);
        ClassTeacherRepository assignments = mock(ClassTeacherRepository.class);
        SchoolClassRepository classes = mock(SchoolClassRepository.class);
        SubjectRepository subjects = mock(SubjectRepository.class);
        TeacherRepository teachers = mock(TeacherRepository.class);
        GradeRepository grades = mock(GradeRepository.class);
        AttendanceSessionRepository sessions = mock(AttendanceSessionRepository.class);
        SchoolClass schoolClass = mock(SchoolClass.class);
        Subject subject = mock(Subject.class);
        Teacher teacher = mock(Teacher.class);
        ClassSubject classSubject = mock(ClassSubject.class);
        ClassTeacher activeAssignment = mock(ClassTeacher.class);

        when(classes.findById(1L)).thenReturn(Optional.of(schoolClass));
        when(subjects.findById(2L)).thenReturn(Optional.of(subject));
        when(teachers.findById(3L)).thenReturn(Optional.of(teacher));
        when(schoolClass.getId()).thenReturn(1L);
        when(subject.getId()).thenReturn(2L);
        when(classSubjects.findBySchoolClassIdAndSubjectIdAndAcademicYearAndSemester(
                1L, 2L, "2026-2027", "SEMESTER_1")).thenReturn(Optional.of(classSubject));
        when(classSubject.getId()).thenReturn(4L);
        when(teacher.getId()).thenReturn(3L);
        when(assignments.findByClassSubjectIdAndTeacherId(4L, 3L))
                .thenReturn(Optional.of(activeAssignment));
        when(activeAssignment.isActive()).thenReturn(true);

        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> service(classSubjects, assignments, classes, subjects, teachers, grades, sessions)
                        .create(new Actor(9L, Role.ADMIN, null),
                                new TeachingAssignmentRequest(1L, 2L, 3L, "2026-2027", "SEMESTER_1")));

        assertEquals(409, exception.getStatusCode().value());
        verify(assignments, never()).saveAndFlush(any());
    }

    @Test
    void cancellationDeactivatesInsteadOfDeletingAssignment() {
        ClassSubjectRepository classSubjects = mock(ClassSubjectRepository.class);
        ClassTeacherRepository assignments = mock(ClassTeacherRepository.class);
        SchoolClassRepository classes = mock(SchoolClassRepository.class);
        SubjectRepository subjects = mock(SubjectRepository.class);
        TeacherRepository teachers = mock(TeacherRepository.class);
        GradeRepository grades = mock(GradeRepository.class);
        AttendanceSessionRepository sessions = mock(AttendanceSessionRepository.class);
        ClassTeacher assignment = mock(ClassTeacher.class);
        when(assignments.findWithReferencesById(8L)).thenReturn(Optional.of(assignment));
        when(assignment.isActive()).thenReturn(true);

        service(classSubjects, assignments, classes, subjects, teachers, grades, sessions)
                .delete(new Actor(9L, Role.ADMIN, null), 8L);

        verify(assignment).setActive(false);
        verify(assignments).save(assignment);
        verify(assignments, never()).delete(assignment);
    }

    @Test
    void assignmentWithGradesCannotBeReassignedToAvoidChangingGradeOwnership() {
        ClassSubjectRepository classSubjects = mock(ClassSubjectRepository.class);
        ClassTeacherRepository assignments = mock(ClassTeacherRepository.class);
        SchoolClassRepository classes = mock(SchoolClassRepository.class);
        SubjectRepository subjects = mock(SubjectRepository.class);
        TeacherRepository teachers = mock(TeacherRepository.class);
        GradeRepository grades = mock(GradeRepository.class);
        AttendanceSessionRepository sessions = mock(AttendanceSessionRepository.class);
        ClassTeacher assignment = mock(ClassTeacher.class);
        Teacher currentTeacher = mock(Teacher.class);
        when(assignments.findWithReferencesById(8L)).thenReturn(Optional.of(assignment));
        when(assignment.isActive()).thenReturn(true);
        when(assignment.getTeacher()).thenReturn(currentTeacher);
        when(currentTeacher.getId()).thenReturn(3L);
        when(grades.existsByClassTeacher_Id(8L)).thenReturn(true);

        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> service(classSubjects, assignments, classes, subjects, teachers, grades, sessions)
                        .update(new Actor(9L, Role.ADMIN, null), 8L,
                                new TeachingAssignmentUpdateRequest(4L)));

        assertEquals(409, exception.getStatusCode().value());
        verify(assignments, never()).saveAndFlush(any());
    }
}
