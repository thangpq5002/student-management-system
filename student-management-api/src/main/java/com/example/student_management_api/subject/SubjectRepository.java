package com.example.student_management_api.subject;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface SubjectRepository extends JpaRepository<Subject, Long> {

    @Query("select s from Subject s left join fetch s.headTeacher order by s.subjectCode")
    List<Subject> findAllWithHeadTeacher();

    @Query("select s from Subject s left join fetch s.headTeacher where s.id = :id")
    Optional<Subject> findWithHeadTeacherById(@Param("id") Long id);

    @Query("select distinct s from Subject s left join fetch s.headTeacher "
            + "where s.id in (select cs.subject.id from ClassSubject cs join ClassTeacher ct on ct.classSubject = cs "
            + "where ct.teacher.id = :teacherId and ct.active = true) order by s.subjectCode")
    List<Subject> findAllAssignedToTeacher(@Param("teacherId") Long teacherId);

    @Query("select distinct s from Subject s left join fetch s.headTeacher where s.id = :id and "
            + "s.id in (select cs.subject.id from ClassSubject cs join ClassTeacher ct on ct.classSubject = cs "
            + "where ct.teacher.id = :teacherId and ct.active = true)")
    Optional<Subject> findAssignedToTeacher(@Param("id") Long id, @Param("teacherId") Long teacherId);

    Optional<Subject> findBySubjectCodeIgnoreCase(String subjectCode);
}
