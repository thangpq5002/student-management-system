package com.example.student_management_api.teaching;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ClassSubjectRepository extends JpaRepository<ClassSubject, Long> {

    @Query("select cs from ClassSubject cs join fetch cs.schoolClass join fetch cs.subject "
            + "order by cs.academicYear desc, cs.semester, cs.schoolClass.className, cs.subject.name")
    List<ClassSubject> findAllWithReferences();

    @Query("select distinct cs from ClassSubject cs join fetch cs.schoolClass join fetch cs.subject "
            + "join ClassTeacher ct on ct.classSubject = cs where ct.teacher.id = :teacherId and ct.active = true "
            + "order by cs.academicYear desc, cs.semester, cs.schoolClass.className, cs.subject.name")
    List<ClassSubject> findAllByTeacherId(@Param("teacherId") Long teacherId);

    @Query("select cs from ClassSubject cs join fetch cs.schoolClass join fetch cs.subject where cs.id = :id")
    Optional<ClassSubject> findWithReferencesById(@Param("id") Long id);

    Optional<ClassSubject> findBySchoolClassIdAndSubjectIdAndAcademicYearAndSemester(
            Long classId, Long subjectId, String academicYear, String semester);
}
