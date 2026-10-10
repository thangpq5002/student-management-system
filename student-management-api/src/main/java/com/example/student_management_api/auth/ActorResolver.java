package com.example.student_management_api.auth;

import com.example.student_management_api.user.User;
import com.example.student_management_api.user.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

/** Đọc lại người dùng từ database theo JWT để vai trò luôn mới nhất. */
@Component
public class ActorResolver {

    private final UserRepository users;

    public ActorResolver(UserRepository users) {
        this.users = users;
    }

    public Actor from(Jwt jwt) {
        User user = users.findById(Long.parseLong(jwt.getSubject()))
                .filter(User::isEnabled)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED, "Phiên đăng nhập không hợp lệ"));
        return new Actor(user.getId(), user.getRole(), user.getTeacherId());
    }
}
