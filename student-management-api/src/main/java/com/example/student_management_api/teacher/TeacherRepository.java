package com.example.student_management_api.teacher;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TeacherRepository extends JpaRepository<Teacher, Long> {

    List<Teacher> findAllByOrderByTeacherCode();

    Optional<Teacher> findByEmailIgnoreCase(String email);
}
