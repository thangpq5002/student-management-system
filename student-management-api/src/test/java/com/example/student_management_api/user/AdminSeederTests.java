package com.example.student_management_api.user;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.boot.ApplicationArguments;
import org.springframework.security.crypto.password.PasswordEncoder;

class AdminSeederTests {

    @Test
    void createsConfiguredAdminEvenWhenTeacherAccountsAlreadyExist() {
        UserRepository users = mock(UserRepository.class);
        PasswordEncoder passwordEncoder = mock(PasswordEncoder.class);
        when(users.existsByRole(Role.ADMIN)).thenReturn(false);
        when(passwordEncoder.encode("secure-admin-password")).thenReturn("bcrypt-hash");
        AdminSeeder seeder = new AdminSeeder(
                users, passwordEncoder, " ADMIN@example.com ", "secure-admin-password");

        seeder.run(mock(ApplicationArguments.class));

        ArgumentCaptor<User> user = ArgumentCaptor.forClass(User.class);
        verify(users).save(user.capture());
        assertEquals("admin@example.com", user.getValue().getEmail());
        assertEquals("bcrypt-hash", user.getValue().getPasswordHash());
        assertEquals(Role.ADMIN, user.getValue().getRole());
    }

    @Test
    void doesNotCreateAnotherAdminWhenOneAlreadyExists() {
        UserRepository users = mock(UserRepository.class);
        when(users.existsByRole(Role.ADMIN)).thenReturn(true);
        AdminSeeder seeder = new AdminSeeder(
                users, mock(PasswordEncoder.class), "admin@example.com", "secure-admin-password");

        seeder.run(mock(ApplicationArguments.class));

        verify(users, never()).save(org.mockito.ArgumentMatchers.any(User.class));
    }
}
