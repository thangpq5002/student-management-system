package com.example.student_management_api.dashboard;

import com.example.student_management_api.auth.ActorResolver;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService service;
    private final ActorResolver actors;

    public DashboardController(DashboardService service, ActorResolver actors) {
        this.service = service;
        this.actors = actors;
    }

    @GetMapping("/summary")
    public DashboardResponse summary(@AuthenticationPrincipal Jwt jwt) {
        return service.summary(actors.from(jwt));
    }
}
