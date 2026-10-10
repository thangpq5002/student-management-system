package com.example.student_management_api.auth;

import com.example.student_management_api.user.User;
import com.example.student_management_api.user.UserRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/account")
public class AccountController {

    public record ProfileUpdateRequest(
            @NotBlank(message = "Vui lòng nhập họ tên")
            @Size(max = 100, message = "Họ tên tối đa 100 ký tự") String fullName,
            @Size(max = 100, message = "Chức danh tối đa 100 ký tự") String title) {
    }

    public record ChangePasswordRequest(
            @NotBlank(message = "Vui lòng nhập mật khẩu hiện tại")
            @Size(max = 72, message = "Mật khẩu hiện tại không đúng") String currentPassword,
            @NotBlank(message = "Vui lòng nhập mật khẩu mới")
            @Size(min = 8, max = 72, message = "Mật khẩu mới phải từ 8 đến 72 ký tự") String newPassword) {
    }

    private final ActorResolver actors;
    private final UserRepository users;
    private final PasswordEncoder passwordEncoder;

    public AccountController(ActorResolver actors, UserRepository users, PasswordEncoder passwordEncoder) {
        this.actors = actors;
        this.users = users;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/password")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void changePassword(@AuthenticationPrincipal Jwt jwt, @Valid @RequestBody ChangePasswordRequest request) {
        Actor actor = actors.from(jwt);
        User user = users.findById(actor.userId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Phiên đăng nhập không hợp lệ"));

        if (!passwordEncoder.matches(request.currentPassword(), user.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Mật khẩu hiện tại không đúng");
        }
        user.setPasswordHash(passwordEncoder.encode(request.newPassword()));
        users.save(user);
    }

    @GetMapping("/profile")
    public UserResponse profile(@AuthenticationPrincipal Jwt jwt) {
        Actor actor = actors.from(jwt);
        User user = users.findById(actor.userId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Phiên đăng nhập không hợp lệ"));
        return UserResponse.from(user);
    }

    @PutMapping("/profile")
    public UserResponse updateProfile(
            @AuthenticationPrincipal Jwt jwt, @Valid @RequestBody ProfileUpdateRequest request) {
        Actor actor = actors.from(jwt);
        User user = users.findById(actor.userId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Phiên đăng nhập không hợp lệ"));
        user.setFullName(request.fullName().trim());
        user.setTitle(request.title() == null || request.title().isBlank() ? null : request.title().trim());
        return UserResponse.from(users.save(user));
    }
}
