package com.example.student_management_api.schoolclass;

import com.example.student_management_api.teacher.Teacher;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.Instant;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

@Entity
@Table(name = "classes")
public class SchoolClass {

    public enum Status { ACTIVE, ARCHIVED }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "class_code", nullable = false, unique = true, length = 20)
    private String classCode;

    /** Tên ngắn của lớp, vd "10A1" (duy nhất). */
    @Column(name = "class_name", nullable = false, unique = true, length = 50)
    private String className;

    @Column(name = "grade_level", nullable = false)
    private Integer gradeLevel;

    @Column(length = 50)
    private String room;

    @Column(length = 100)
    private String stream;

    @Column(name = "max_students", nullable = false)
    private Integer maxStudents = 40;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Status status = Status.ACTIVE;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "homeroom_teacher_id")
    private Teacher homeroomTeacher;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    public Long getId() { return id; }

    public String getClassCode() { return classCode; }
    public void setClassCode(String classCode) { this.classCode = classCode; }

    public String getClassName() { return className; }
    public void setClassName(String className) { this.className = className; }

    public Integer getGradeLevel() { return gradeLevel; }
    public void setGradeLevel(Integer gradeLevel) { this.gradeLevel = gradeLevel; }

    public String getRoom() { return room; }
    public void setRoom(String room) { this.room = room; }

    public String getStream() { return stream; }
    public void setStream(String stream) { this.stream = stream; }

    public Integer getMaxStudents() { return maxStudents; }
    public void setMaxStudents(Integer maxStudents) { this.maxStudents = maxStudents; }

    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }

    public Teacher getHomeroomTeacher() { return homeroomTeacher; }
    public void setHomeroomTeacher(Teacher homeroomTeacher) { this.homeroomTeacher = homeroomTeacher; }
}
