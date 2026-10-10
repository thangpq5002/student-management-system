package com.example.student_management_api.auth;

import java.time.Duration;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;

@Component
public class AuthCookies {

    public static final String NAME = "session";

    private final boolean secure;

    public AuthCookies(@Value("${app.cookie.secure:false}") boolean secure) {
        this.secure = secure;
    }

    public ResponseCookie issue(String token, Duration lifetime) {
        return base(token).maxAge(lifetime).build();
    }

    public ResponseCookie clear() {
        return base("").maxAge(Duration.ZERO).build();
    }

    private ResponseCookie.ResponseCookieBuilder base(String value) {
        return ResponseCookie.from(NAME, value)
                .httpOnly(true)
                .secure(secure) // bật true khi chạy HTTPS (Railway)
                .sameSite("Lax")
                .path("/");
    }
}
