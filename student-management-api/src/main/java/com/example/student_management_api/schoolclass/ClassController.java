package com.example.student_management_api.schoolclass;

import com.example.student_management_api.auth.ActorResolver;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;
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
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/classes")
public class ClassController {

    private final ClassService service;
    private final ActorResolver actors;

    public ClassController(ClassService service, ActorResolver actors) {
        this.service = service;
        this.actors = actors;
    }

    @GetMapping
    public List<ClassResponse> list(
            @AuthenticationPrincipal Jwt jwt,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String gradeLevel,
            @RequestParam(required = false) String stream,
            @RequestParam(required = false) String capacity) {
        return service.list(actors.from(jwt), search, gradeLevel, stream, capacity);
    }

    @GetMapping("/{id}")
    public ClassResponse get(@AuthenticationPrincipal Jwt jwt, @PathVariable Long id) {
        return service.get(actors.from(jwt), id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ClassResponse create(@AuthenticationPrincipal Jwt jwt, @Valid @RequestBody ClassRequest request) {
        return service.create(actors.from(jwt), request);
    }

    @PutMapping("/{id}")
    public ClassResponse update(
            @AuthenticationPrincipal Jwt jwt, @PathVariable Long id, @Valid @RequestBody ClassRequest request) {
        return service.update(actors.from(jwt), id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@AuthenticationPrincipal Jwt jwt, @PathVariable Long id) {
        service.delete(actors.from(jwt), id);
    }

    /** Body: {"teacherId": "5"} hoặc {"teacherId": null} để bỏ giáo viên chủ nhiệm. */
    @PutMapping("/{id}/homeroom-teacher")
    public ClassResponse assignHomeroomTeacher(
            @AuthenticationPrincipal Jwt jwt, @PathVariable Long id, @RequestBody Map<String, String> body) {
        String raw = body.get("teacherId");
        Long teacherId = null;
        if (raw != null && !raw.isBlank()) {
            try {
                teacherId = Long.parseLong(raw.trim());
            } catch (NumberFormatException ex) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Giáo viên không hợp lệ");
            }
        }
        return service.assignHomeroomTeacher(actors.from(jwt), id, teacherId);
    }

    /** Thay toàn bộ ban cán sự: body là mảng [{"title": "...", "studentCode": "..."}]. */
    @PutMapping("/{id}/leaders")
    public ClassResponse updateLeaders(
            @AuthenticationPrincipal Jwt jwt, @PathVariable Long id, @Valid @RequestBody List<@Valid LeaderRequest> body) {
        return service.updateLeaders(actors.from(jwt), id, body);
    }
}
