package com.example.student_management_api.attendance;

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
@RequestMapping("/api/attendance")
public class AttendanceController {

    private final AttendanceService service;
    private final ActorResolver actors;

    public AttendanceController(AttendanceService service, ActorResolver actors) {
        this.service = service;
        this.actors = actors;
    }

    @GetMapping("/sessions")
    public List<AttendanceSessionResponse> list(@AuthenticationPrincipal Jwt jwt) {
        return service.list(actors.from(jwt));
    }

    @GetMapping("/sessions/{id}")
    public AttendanceSessionResponse get(@AuthenticationPrincipal Jwt jwt, @PathVariable Long id) {
        return service.get(actors.from(jwt), id);
    }

    @PostMapping("/sessions")
    @ResponseStatus(HttpStatus.CREATED)
    public AttendanceSessionResponse create(
            @AuthenticationPrincipal Jwt jwt, @Valid @RequestBody AttendanceSessionRequest request) {
        return service.create(actors.from(jwt), request);
    }

    @PutMapping("/sessions/{id}/records")
    public List<AttendanceRecordResponse> saveRecords(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable Long id,
            @Valid @RequestBody List<@Valid AttendanceRecordRequest> request) {
        return service.saveRecords(actors.from(jwt), id, request);
    }

    @DeleteMapping("/sessions/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@AuthenticationPrincipal Jwt jwt, @PathVariable Long id) {
        service.delete(actors.from(jwt), id);
    }
}
