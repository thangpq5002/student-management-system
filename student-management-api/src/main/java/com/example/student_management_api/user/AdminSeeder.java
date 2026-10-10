package com.example.student_management_api.user;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Tạo tài khoản ADMIN đầu tiên khi chưa có ADMIN, đọc từ biến môi trường
 * ADMIN_EMAIL và ADMIN_PASSWORD. Không ghi đè tài khoản ADMIN đã có.
 */
@Component
public class AdminSeeder implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(AdminSeeder.class);

    private final UserRepository users;
    private final PasswordEncoder passwordEncoder;
    private final String adminEmail;
    private final String adminPassword;

    public AdminSeeder(
            UserRepository users,
            PasswordEncoder passwordEncoder,
            @Value("${app.admin.email:}") String adminEmail,
            @Value("${app.admin.password:}") String adminPassword) {
        this.users = users;
        this.passwordEncoder = passwordEncoder;
        this.adminEmail = adminEmail;
        this.adminPassword = adminPassword;
    }

    @Override
    public void run(ApplicationArguments args) {
        if (users.existsByRole(Role.ADMIN)) {
            return;
        }

        String email = adminEmail == null ? "" : adminEmail.trim().toLowerCase();
        if (email.isEmpty() || adminPassword == null
                || adminPassword.length() < 8 || adminPassword.length() > 72) {
            log.warn("Chưa có tài khoản ADMIN nào, nhưng ADMIN_EMAIL / ADMIN_PASSWORD chưa hợp lệ "
                    + "(mật khẩu 8-72 ký tự) nên không tạo admin.");
            return;
        }

        User admin = new User();
        admin.setEmail(email);
        admin.setPasswordHash(passwordEncoder.encode(adminPassword));
        admin.setFullName("Quản trị viên");
        admin.setTitle("Quản trị viên hệ thống");
        admin.setRole(Role.ADMIN);
        users.save(admin);

        log.info("Đã tạo tài khoản ADMIN đầu tiên: {}", email);
    }
}
