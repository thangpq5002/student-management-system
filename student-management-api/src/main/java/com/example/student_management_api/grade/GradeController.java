package com.example.student_management_api.grade;

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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/grades")
public class GradeController {

    private final GradeService service;
    private final ActorResolver actors;

    public GradeController(GradeService service, ActorResolver actors) {
        this.service = service;
        this.actors = actors;
    }

    @GetMapping
    public List<GradeResponse> list(
            @AuthenticationPrincipal Jwt jwt,
            @RequestParam(required = false) Long classSubjectId,
            @RequestParam(required = false) String semester) {
        return service.list(actors.from(jwt), classSubjectId, semester);
    }

    @GetMapping("/assessment-types")
    public List<AssessmentType> assessmentTypes() {
        return service.assessmentTypes();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public GradeResponse create(@AuthenticationPrincipal Jwt jwt, @Valid @RequestBody GradeRequest request) {
        return service.create(actors.from(jwt), request);
    }

    @PutMapping("/{id}")
    public GradeResponse update(
            @AuthenticationPrincipal Jwt jwt, @PathVariable Long id, @Valid @RequestBody GradeRequest request) {
        return service.update(actors.from(jwt), id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@AuthenticationPrincipal Jwt jwt, @PathVariable Long id) {
        service.delete(actors.from(jwt), id);
    }
}
