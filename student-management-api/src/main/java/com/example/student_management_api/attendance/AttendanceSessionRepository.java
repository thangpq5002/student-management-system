package com.example.student_management_api.attendance;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface AttendanceSessionRepository extends JpaRepository<AttendanceSession, Long> {

    @Query("select a from AttendanceSession a join fetch a.schoolClass left join fetch a.classSubject cs "
            + "left join fetch cs.subject left join fetch a.classTeacher ct left join fetch ct.teacher "
            + "order by a.attendanceDate desc, a.period")
    List<AttendanceSession> findAllWithReferences();

    @Query("select a from AttendanceSession a join fetch a.schoolClass left join fetch a.classSubject cs "
            + "left join fetch cs.subject left join fetch a.classTeacher ct left join fetch ct.teacher "
            + "where a.id = :id")
    Optional<AttendanceSession> findWithReferencesById(@Param("id") Long id);

    boolean existsByClassTeacher_Id(Long classTeacherId);
}
