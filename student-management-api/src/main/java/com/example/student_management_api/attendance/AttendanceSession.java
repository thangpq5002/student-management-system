package com.example.student_management_api.attendance;

import com.example.student_management_api.schoolclass.SchoolClass;
import com.example.student_management_api.teaching.ClassSubject;
import com.example.student_management_api.teaching.ClassTeacher;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.LocalDate;

@Entity
@Table(name = "attendance_sessions")
public class AttendanceSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "class_id", nullable = false)
    private SchoolClass schoolClass;

    @Column(name = "attendance_type", nullable = false, length = 20)
    private String attendanceType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "class_subject_id")
    private ClassSubject classSubject;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "class_teacher_id")
    private ClassTeacher classTeacher;

    @Column(name = "attendance_date", nullable = false)
    private LocalDate attendanceDate;

    private Integer period;

    @Column(columnDefinition = "TEXT")
    private String note;

    public Long getId() { return id; }
    public SchoolClass getSchoolClass() { return schoolClass; }
    public void setSchoolClass(SchoolClass schoolClass) { this.schoolClass = schoolClass; }
    public String getAttendanceType() { return attendanceType; }
    public void setAttendanceType(String attendanceType) { this.attendanceType = attendanceType; }
    public ClassSubject getClassSubject() { return classSubject; }
    public void setClassSubject(ClassSubject classSubject) { this.classSubject = classSubject; }
    public ClassTeacher getClassTeacher() { return classTeacher; }
    public void setClassTeacher(ClassTeacher classTeacher) { this.classTeacher = classTeacher; }
    public LocalDate getAttendanceDate() { return attendanceDate; }
    public void setAttendanceDate(LocalDate attendanceDate) { this.attendanceDate = attendanceDate; }
    public Integer getPeriod() { return period; }
    public void setPeriod(Integer period) { this.period = period; }
    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }
}
