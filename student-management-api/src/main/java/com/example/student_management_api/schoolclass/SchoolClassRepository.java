package com.example.student_management_api.schoolclass;

import java.util.List;
import java.util.Optional;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface SchoolClassRepository extends JpaRepository<SchoolClass, Long> {

    @Query("select c from SchoolClass c left join fetch c.homeroomTeacher order by c.gradeLevel, c.className")
    List<SchoolClass> findAllWithTeacher();

    @Query("select c from SchoolClass c join fetch c.homeroomTeacher t where t.id = :teacherId "
            + "order by c.gradeLevel, c.className")
    List<SchoolClass> findAllByTeacherWithTeacher(@Param("teacherId") Long teacherId);

    @Query("select distinct c from SchoolClass c left join fetch c.homeroomTeacher "
            + "where c.homeroomTeacher.id = :teacherId or c.id in "
            + "(select cs.schoolClass.id from ClassSubject cs join ClassTeacher ct on ct.classSubject = cs "
    + "where ct.teacher.id = :teacherId and ct.active = true) order by c.gradeLevel, c.className")
    List<SchoolClass> findAllAccessibleByTeacher(@Param("teacherId") Long teacherId);

    @Query("select distinct c from SchoolClass c left join fetch c.homeroomTeacher "
            + "where c.id = :id and (c.homeroomTeacher.id = :teacherId or c.id in "
            + "(select cs.schoolClass.id from ClassSubject cs join ClassTeacher ct on ct.classSubject = cs "
            + "where ct.teacher.id = :teacherId and ct.active = true))")
    Optional<SchoolClass> findAccessibleByTeacher(
            @Param("id") Long id, @Param("teacherId") Long teacherId);

    @Query("select c from SchoolClass c left join fetch c.homeroomTeacher where c.id = :id")
    Optional<SchoolClass> findWithTeacherById(@Param("id") Long id);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select c from SchoolClass c where c.id = :id")
    Optional<SchoolClass> findByIdForUpdate(@Param("id") Long id);

    Optional<SchoolClass> findByClassNameIgnoreCase(String className);
}
