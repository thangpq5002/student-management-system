package com.example.student_management_api.academic;

import com.example.student_management_api.auth.ActorResolver;
import com.example.student_management_api.student.StudentResponse;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/classes/{classId}/students")
public class ClassStudentEnrollmentController {

    private final EnrollmentService service;
    private final ActorResolver actors;

    public ClassStudentEnrollmentController(EnrollmentService service, ActorResolver actors) {
        this.service = service;
        this.actors = actors;
    }

    @GetMapping("/available")
    public List<StudentResponse> available(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable Long classId,
            @RequestParam String academicYear,
            @RequestParam(required = false) String search) {
        return service.availableStudents(actors.from(jwt), classId, academicYear, search);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public List<EnrollmentResponse> enroll(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable Long classId,
            @Valid @RequestBody ClassStudentEnrollmentRequest request) {
        return service.enrollStudents(actors.from(jwt), classId, request);
    }
}
