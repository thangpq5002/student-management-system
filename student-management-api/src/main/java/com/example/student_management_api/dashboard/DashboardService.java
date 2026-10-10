package com.example.student_management_api.dashboard;

import com.example.student_management_api.auth.Actor;
import com.example.student_management_api.common.Text;
import com.example.student_management_api.schoolclass.SchoolClass;
import com.example.student_management_api.schoolclass.SchoolClassRepository;
import com.example.student_management_api.student.Student;
import com.example.student_management_api.student.StudentRepository;
import com.example.student_management_api.teacher.Teacher;
import com.example.student_management_api.teacher.TeacherRepository;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class DashboardService {

    private static final int MAX_CLASS_ROWS = 10;
    private static final int MAX_RECENT_STUDENTS = 5;

    private final StudentRepository students;
    private final SchoolClassRepository classes;
    private final TeacherRepository teachers;

    public DashboardService(
            StudentRepository students, SchoolClassRepository classes, TeacherRepository teachers) {
        this.students = students;
        this.classes = classes;
        this.teachers = teachers;
    }

    public DashboardResponse summary(Actor actor) {
        List<SchoolClass> scopedClasses;
        List<Student> scopedStudents;
        if (actor.isAdmin()) {
            scopedClasses = classes.findAllWithTeacher();
            scopedStudents = students.findAllWithClass();
        } else if (actor.teacherId() == null) {
            scopedClasses = List.of();
            scopedStudents = List.of();
        } else {
            scopedClasses = classes.findAllAccessibleByTeacher(actor.teacherId());
            scopedStudents = students.findAllAccessibleByTeacher(actor.teacherId());
        }

        Map<Long, Long> countByClass = scopedStudents.stream()
                .collect(Collectors.groupingBy(s -> s.getSchoolClass().getId(), Collectors.counting()));

        DashboardResponse.ClassesByGrade byGrade = new DashboardResponse.ClassesByGrade(
                scopedClasses.stream().filter(c -> c.getGradeLevel() == 10).count(),
                scopedClasses.stream().filter(c -> c.getGradeLevel() == 11).count(),
                scopedClasses.stream().filter(c -> c.getGradeLevel() == 12).count());

        DashboardResponse.StudentsByStatus byStatus = new DashboardResponse.StudentsByStatus(
                scopedStudents.stream().filter(s -> s.getStatus() == Student.Status.ACTIVE).count(),
                scopedStudents.stream().filter(s -> s.getStatus() == Student.Status.SUSPENDED).count(),
                scopedStudents.stream().filter(s -> s.getStatus() == Student.Status.TRANSFERRED).count());

        List<DashboardResponse.ClassRow> classRows = scopedClasses.stream()
                .limit(MAX_CLASS_ROWS)
                .map(c -> new DashboardResponse.ClassRow(
                        String.valueOf(c.getId()),
                        c.getClassName(),
                        c.getGradeLevel(),
                        c.getHomeroomTeacher() == null ? "" : c.getHomeroomTeacher().getFullName(),
                        countByClass.getOrDefault(c.getId(), 0L).intValue(),
                        c.getMaxStudents()))
                .toList();

        List<DashboardResponse.RecentStudent> recent = scopedStudents.stream()
                .sorted(Comparator.comparing(Student::getCreatedAt).reversed())
                .limit(MAX_RECENT_STUDENTS)
                .map(s -> new DashboardResponse.RecentStudent(
                        String.valueOf(s.getId()),
                        s.getStudentCode(),
                        s.getFullName(),
                        s.getSchoolClass().getClassName(),
                        Text.initials(s.getFullName(), "HS"),
                        s.getCreatedAt().toString()))
                .toList();

        Long totalTeachers = null;
        Long totalDepartments = null;
        if (actor.isAdmin()) {
            List<Teacher> allTeachers = teachers.findAll();
            totalTeachers = (long) allTeachers.size();
            totalDepartments = allTeachers.stream().map(Teacher::getDepartment).distinct().count();
        }

        return new DashboardResponse(
                scopedStudents.size(),
                totalTeachers,
                totalDepartments,
                scopedClasses.size(),
                byGrade,
                byStatus,
                classRows,
                recent);
    }
}
