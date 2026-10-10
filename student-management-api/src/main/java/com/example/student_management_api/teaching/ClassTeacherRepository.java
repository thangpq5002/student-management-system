package com.example.student_management_api.teaching;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ClassTeacherRepository extends JpaRepository<ClassTeacher, Long> {

    @Query("select ct from ClassTeacher ct join fetch ct.classSubject cs join fetch cs.schoolClass "
            + "join fetch cs.subject join fetch ct.teacher order by cs.academicYear desc, cs.semester, "
            + "cs.schoolClass.className, cs.subject.name")
    List<ClassTeacher> findAllWithReferences();

    @Query("select ct from ClassTeacher ct join fetch ct.classSubject cs join fetch cs.schoolClass "
            + "join fetch cs.subject join fetch ct.teacher where ct.active = true "
            + "order by cs.academicYear desc, cs.semester, cs.schoolClass.className, cs.subject.name")
    List<ClassTeacher> findAllActiveWithReferences();

    @Query("select ct from ClassTeacher ct join fetch ct.classSubject cs join fetch cs.schoolClass "
            + "join fetch cs.subject join fetch ct.teacher where ct.teacher.id = :teacherId and ct.active = true "
            + "order by cs.academicYear desc, cs.semester, cs.schoolClass.className, cs.subject.name")
    List<ClassTeacher> findAllByTeacherId(@Param("teacherId") Long teacherId);

    @Query("select ct from ClassTeacher ct join fetch ct.classSubject cs join fetch cs.schoolClass "
            + "join fetch cs.subject join fetch ct.teacher where ct.id = :id")
    Optional<ClassTeacher> findWithReferencesById(@Param("id") Long id);

    boolean existsByClassSubjectSchoolClassIdAndTeacherId(Long classId, Long teacherId);
    boolean existsByClassSubjectIdAndTeacherId(Long classSubjectId, Long teacherId);

    Optional<ClassTeacher> findByClassSubjectIdAndTeacherId(Long classSubjectId, Long teacherId);
}
