package com.example.student_management_api.attendance;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface AttendanceRecordRepository extends JpaRepository<AttendanceRecord, Long> {

    @Query("select r from AttendanceRecord r join fetch r.enrollment e join fetch e.student "
            + "where r.session.id = :sessionId order by e.student.fullName")
    List<AttendanceRecord> findAllBySessionIdWithStudent(@Param("sessionId") Long sessionId);

    Optional<AttendanceRecord> findBySessionIdAndEnrollmentId(Long sessionId, Long enrollmentId);
}
