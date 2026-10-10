package com.example.student_management_api.schoolclass;

import com.example.student_management_api.common.Text;
import com.example.student_management_api.teacher.Teacher;
import java.util.List;

/**
 * Khớp kiểu SchoolClass của giao diện. name là tên ngắn ("10A1"), className là tên hiển thị ("Lớp 10A1").
 * Danh sách lớp trả students rỗng; chi tiết lớp mới có đầy đủ students.
 */
public record ClassResponse(
        String id,
        String classCode,
        String name,
        String className,
        int gradeLevel,
        HomeroomTeacher homeroomTeacher,
        String room,
        String stream,
        int currentStudents,
        int maxStudents,
        String status,
        List<Leader> leaders,
        List<StudentItem> students) {

    public record HomeroomTeacher(
            String id,
            String fullName,
            String department,
            String email,
            String experience,
            String avatarInitials) {

        static HomeroomTeacher from(Teacher t) {
            if (t == null) {
                return null;
            }
            return new HomeroomTeacher(
                    String.valueOf(t.getId()),
                    t.getFullName(),
                    t.getDepartment(),
                    Text.nullToEmpty(t.getEmail()),
                    Text.nullToEmpty(t.getTitleRole()),
                    Text.initials(t.getFullName(), "GV"));
        }
    }

    public record Leader(String title, String fullName, String studentCode) {
    }

    public record StudentItem(
            String id,
            String studentCode,
            String fullName,
            String dateOfBirth,
            String roleInClass) {
    }

    static ClassResponse of(
            SchoolClass c, int currentStudents, List<Leader> leaders, List<StudentItem> students) {
        return new ClassResponse(
                String.valueOf(c.getId()),
                c.getClassCode(),
                c.getClassName(),
                "Lớp " + c.getClassName(),
                c.getGradeLevel(),
                HomeroomTeacher.from(c.getHomeroomTeacher()),
                Text.nullToEmpty(c.getRoom()),
                Text.nullToEmpty(c.getStream()),
                currentStudents,
                c.getMaxStudents(),
                Text.lower(c.getStatus()),
                leaders,
                students);
    }
}
