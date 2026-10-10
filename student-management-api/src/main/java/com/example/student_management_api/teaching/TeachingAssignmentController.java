package com.example.student_management_api.teaching;

import com.example.student_management_api.auth.ActorResolver;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/teaching-assignments")
public class TeachingAssignmentController {

    private final TeachingAssignmentService service;
    private final ActorResolver actors;

    public TeachingAssignmentController(TeachingAssignmentService service, ActorResolver actors) {
        this.service = service;
        this.actors = actors;
    }

    @GetMapping
    public List<TeachingAssignmentResponse> list(@AuthenticationPrincipal Jwt jwt) {
        return service.list(actors.from(jwt));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TeachingAssignmentResponse create(
            @AuthenticationPrincipal Jwt jwt, @Valid @RequestBody TeachingAssignmentRequest request) {
        return service.create(actors.from(jwt), request);
    }

    @PutMapping("/{id}")
    public TeachingAssignmentResponse update(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable Long id,
            @Valid @RequestBody TeachingAssignmentUpdateRequest request) {
        return service.update(actors.from(jwt), id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@AuthenticationPrincipal Jwt jwt, @PathVariable Long id) {
        service.delete(actors.from(jwt), id);
    }
}
