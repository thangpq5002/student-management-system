package com.example.student_management_api.student;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface StudentRepository extends JpaRepository<Student, Long> {

    @Query("select s from Student s join fetch s.schoolClass order by s.studentCode")
    List<Student> findAllWithClass();

    @Query("select s from Student s join fetch s.schoolClass c where c.homeroomTeacher.id = :teacherId "
            + "order by s.studentCode")
    List<Student> findAllByHomeroomTeacher(@Param("teacherId") Long teacherId);

    @Query("select distinct s from Student s join fetch s.schoolClass c where "
            + "c.homeroomTeacher.id = :teacherId or c.id in "
            + "(select cs.schoolClass.id from ClassSubject cs join ClassTeacher ct on ct.classSubject = cs "
            + "where ct.teacher.id = :teacherId and ct.active = true) order by s.studentCode")
    List<Student> findAllAccessibleByTeacher(@Param("teacherId") Long teacherId);

    @Query("select s from Student s join fetch s.schoolClass c where s.id = :id and "
            + "(c.homeroomTeacher.id = :teacherId or c.id in "
            + "(select cs.schoolClass.id from ClassSubject cs join ClassTeacher ct on ct.classSubject = cs "
            + "where ct.teacher.id = :teacherId and ct.active = true))")
    Optional<Student> findAccessibleByTeacher(@Param("id") Long id, @Param("teacherId") Long teacherId);

    @Query("select s from Student s join fetch s.schoolClass where s.id = :id")
    Optional<Student> findWithClassById(@Param("id") Long id);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select s from Student s join fetch s.schoolClass where s.id = :id")
    Optional<Student> findWithClassByIdForUpdate(@Param("id") Long id);

    Optional<Student> findByStudentCodeIgnoreCase(String studentCode);

    long countBySchoolClassId(Long classId);

    List<Student> findBySchoolClassIdOrderByFullName(Long classId);

    @Query("select s from Student s join fetch s.schoolClass c where "
            + "not exists (select e.id from Enrollment e where e.student = s "
            + "and e.schoolClass.id = :classId and e.academicYear = :academicYear and e.status = 'ACTIVE') "
            + "and (:search = '' or lower(s.fullName) like concat('%', :search, '%') "
            + "or lower(s.studentCode) like concat('%', :search, '%')) order by s.fullName, s.studentCode")
    List<Student> findAvailableForClass(
            @Param("classId") Long classId,
            @Param("academicYear") String academicYear,
            @Param("search") String search);

    /** Mỗi dòng: [classId, số học sinh]. */
    @Query("select s.schoolClass.id, count(s) from Student s group by s.schoolClass.id")
    List<Object[]> countGroupedByClass();
}
