package com.example.student_management_api.config;

import com.example.student_management_api.auth.AuthCookies;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.oauth2.server.resource.web.DefaultBearerTokenResolver;
import org.springframework.security.oauth2.server.resource.web.BearerTokenResolver;
import org.springframework.stereotype.Component;

/** Lấy JWT từ cookie "session" thay vì header Authorization. */
@Component
public class CookieBearerTokenResolver implements BearerTokenResolver {

    private final BearerTokenResolver authorizationHeaderResolver = new DefaultBearerTokenResolver();

    @Override
    public String resolve(HttpServletRequest request) {
        // Các đường dẫn công khai bỏ qua token: nếu không, cookie cũ/hết hạn sẽ chặn cả việc đăng nhập lại
        String path = request.getRequestURI();
        if (path.equals("/api/auth/login") || path.equals("/api/auth/logout")
                || path.startsWith("/actuator/health")) {
            return null;
        }

        String authorizationToken = authorizationHeaderResolver.resolve(request);
        if (authorizationToken != null) {
            return authorizationToken;
        }

        Cookie[] cookies = request.getCookies();
        if (cookies == null) {
            return null;
        }
        for (Cookie cookie : cookies) {
            if (AuthCookies.NAME.equals(cookie.getName())) {
                return cookie.getValue();
            }
        }
        return null;
    }
}
