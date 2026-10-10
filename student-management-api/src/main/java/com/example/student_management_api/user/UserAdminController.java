package com.example.student_management_api.user;

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
@RequestMapping("/api/users")
public class UserAdminController {

    private final UserAdminService service;
    private final ActorResolver actors;

    public UserAdminController(UserAdminService service, ActorResolver actors) {
        this.service = service;
        this.actors = actors;
    }

    @GetMapping
    public List<UserAdminResponse> list(@AuthenticationPrincipal Jwt jwt) {
        return service.list(actors.from(jwt));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public UserAdminResponse create(@AuthenticationPrincipal Jwt jwt, @Valid @RequestBody UserCreateRequest request) {
        return service.create(actors.from(jwt), request);
    }

    @PutMapping("/{id}")
    public UserAdminResponse update(
            @AuthenticationPrincipal Jwt jwt, @PathVariable Long id, @Valid @RequestBody UserUpdateRequest request) {
        return service.update(actors.from(jwt), id, request);
    }

    @PutMapping("/{id}/password")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void resetPassword(
            @AuthenticationPrincipal Jwt jwt, @PathVariable Long id, @Valid @RequestBody PasswordRequest request) {
        service.resetPassword(actors.from(jwt), id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@AuthenticationPrincipal Jwt jwt, @PathVariable Long id) {
        service.delete(actors.from(jwt), id);
    }
}
