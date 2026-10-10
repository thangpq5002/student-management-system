package com.example.student_management_api.academic;

import java.util.List;
import java.util.Optional;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {

    @Query("select e from Enrollment e join fetch e.student join fetch e.schoolClass "
            + "order by e.academicYear desc, e.schoolClass.className, e.student.fullName")
    List<Enrollment> findAllWithReferences();

    @Query("select e from Enrollment e join fetch e.student join fetch e.schoolClass "
            + "where e.schoolClass.id in :classIds order by e.academicYear desc, "
            + "e.schoolClass.className, e.student.fullName")
    List<Enrollment> findAllByClassIdsWithReferences(@Param("classIds") List<Long> classIds);

    @Query("select e from Enrollment e join fetch e.student join fetch e.schoolClass where e.id = :id")
    Optional<Enrollment> findWithReferencesById(@Param("id") Long id);

    List<Enrollment> findBySchoolClassIdAndAcademicYear(Long classId, String academicYear);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select e from Enrollment e where e.student.id = :studentId "
            + "and e.academicYear = :academicYear and e.status = 'ACTIVE'")
    Optional<Enrollment> findActiveForUpdate(
            @Param("studentId") Long studentId, @Param("academicYear") String academicYear);
}
