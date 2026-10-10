package com.example.student_management_api.schoolclass;

import java.util.Collection;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ClassLeaderRepository extends JpaRepository<ClassLeader, Long> {

    @Query("select l from ClassLeader l join fetch l.student where l.schoolClass.id in :classIds")
    List<ClassLeader> findAllByClassIds(@Param("classIds") Collection<Long> classIds);

    @Modifying(flushAutomatically = true)
    @Query("delete from ClassLeader l where l.schoolClass.id = :classId")
    void deleteByClassId(@Param("classId") Long classId);

    @Modifying(flushAutomatically = true)
    @Query("delete from ClassLeader l where l.student.id = :studentId")
    void deleteByStudentId(@Param("studentId") Long studentId);
}
