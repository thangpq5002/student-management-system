package com.example.student_management_api.grade;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AssessmentTypeRepository extends JpaRepository<AssessmentType, Long> {
    List<AssessmentType> findAllByOrderByIdAsc();
}
