package com.example.student_management_api.grade;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface GradeRepository extends JpaRepository<Grade, Long> {

    @Query("select g from Grade g join fetch g.enrollment e join fetch e.student "
            + "join fetch g.schoolClass join fetch g.classSubject cs join fetch cs.subject "
            + "join fetch g.classTeacher ct join fetch ct.teacher join fetch g.assessmentType "
            + "order by g.id")
    List<Grade> findAllWithReferences();

    @Query("select g from Grade g join fetch g.enrollment e join fetch e.student "
            + "join fetch g.schoolClass join fetch g.classSubject cs join fetch cs.subject "
            + "join fetch g.classTeacher ct join fetch ct.teacher join fetch g.assessmentType "
            + "where ct.teacher.id = :teacherId order by g.id")
    List<Grade> findAllByTeacherId(@Param("teacherId") Long teacherId);

    @Query("select g from Grade g join fetch g.enrollment e join fetch e.student "
            + "join fetch g.schoolClass join fetch g.classSubject cs join fetch cs.subject "
            + "join fetch g.classTeacher ct join fetch ct.teacher join fetch g.assessmentType where g.id = :id")
    Optional<Grade> findWithReferencesById(@Param("id") Long id);

    boolean existsByClassTeacher_Id(Long classTeacherId);
}
