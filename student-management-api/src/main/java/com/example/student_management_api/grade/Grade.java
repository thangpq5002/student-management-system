package com.example.student_management_api.grade;

import com.example.student_management_api.academic.Enrollment;
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
import java.math.BigDecimal;

@Entity
@Table(name = "grades")
public class Grade {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "enrollment_id", nullable = false)
    private Enrollment enrollment;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "class_id", nullable = false)
    private SchoolClass schoolClass;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "class_subject_id", nullable = false)
    private ClassSubject classSubject;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "class_teacher_id", nullable = false)
    private ClassTeacher classTeacher;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "assessment_type_id", nullable = false)
    private AssessmentType assessmentType;

    @Column(nullable = false, length = 20)
    private String semester;

    @Column(name = "assessment_number", nullable = false)
    private Integer assessmentNumber = 1;

    @Column(nullable = false, precision = 4, scale = 2)
    private BigDecimal score;

    @Column(columnDefinition = "TEXT")
    private String note;

    public Long getId() { return id; }
    public Enrollment getEnrollment() { return enrollment; }
    public void setEnrollment(Enrollment enrollment) { this.enrollment = enrollment; }
    public SchoolClass getSchoolClass() { return schoolClass; }
    public void setSchoolClass(SchoolClass schoolClass) { this.schoolClass = schoolClass; }
    public ClassSubject getClassSubject() { return classSubject; }
    public void setClassSubject(ClassSubject classSubject) { this.classSubject = classSubject; }
    public ClassTeacher getClassTeacher() { return classTeacher; }
    public void setClassTeacher(ClassTeacher classTeacher) { this.classTeacher = classTeacher; }
    public AssessmentType getAssessmentType() { return assessmentType; }
    public void setAssessmentType(AssessmentType assessmentType) { this.assessmentType = assessmentType; }
    public String getSemester() { return semester; }
    public void setSemester(String semester) { this.semester = semester; }
    public Integer getAssessmentNumber() { return assessmentNumber; }
    public void setAssessmentNumber(Integer assessmentNumber) { this.assessmentNumber = assessmentNumber; }
    public BigDecimal getScore() { return score; }
    public void setScore(BigDecimal score) { this.score = score; }
    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }
}
