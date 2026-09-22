package com.helpdesk.service;

import com.helpdesk.dto.LoginRequest;
import com.helpdesk.dto.LoginResponse;
import com.helpdesk.dto.RegisterRequest;
import com.helpdesk.dto.UserDTO;
import com.helpdesk.dto.UserUpdateRequest;
import com.helpdesk.model.Role;
import com.helpdesk.model.User;
import com.helpdesk.repository.UserRepository;
import com.helpdesk.security.InputSanitizer;
import com.helpdesk.security.PasswordEncoder;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

public class UserServiceTest {

    private UserRepository userRepository;
    private InputSanitizer inputSanitizer;
    private PasswordEncoder passwordEncoder;
    private UserService userService;

    @BeforeEach
    public void setUp() {
        userRepository = mock(UserRepository.class);
        inputSanitizer = new InputSanitizer();
        passwordEncoder = new PasswordEncoder();
        userService = new UserService(userRepository, inputSanitizer, passwordEncoder);
    }

    @Test
    public void testAuthenticateSuccess() {
        String rawPassword = "password123";
        String encoded = passwordEncoder.encode(rawPassword);

        User user = new User("John Doe", "john@company.com", encoded, Role.EMPLOYEE, "Engineering");
        user.setCompanyName("Acme Corp");

        when(userRepository.findByEmail("john@company.com")).thenReturn(Optional.of(user));

        LoginRequest req = new LoginRequest();
        req.setEmail("john@company.com");
        req.setPassword(rawPassword);

        LoginResponse res = userService.authenticate(req);
        assertTrue(res.isSuccess());
        assertNotNull(res.getUser());
        assertEquals("John Doe", res.getUser().getName());
        assertEquals("Acme Corp", res.getUser().getCompanyName());
    }

    @Test
    public void testAuthenticateFailureWrongPassword() {
        String encoded = passwordEncoder.encode("correctPassword");

        User user = new User("John Doe", "john@company.com", encoded, Role.EMPLOYEE, "Engineering");

        when(userRepository.findByEmail("john@company.com")).thenReturn(Optional.of(user));

        LoginRequest req = new LoginRequest();
        req.setEmail("john@company.com");
        req.setPassword("wrongPassword");

        LoginResponse res = userService.authenticate(req);
        assertFalse(res.isSuccess());
        assertNull(res.getUser());
    }

    @Test
    public void testProvisionUserWithExtendedFields() {
        when(userRepository.existsByEmail("tech@company.com")).thenReturn(false);
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User u = invocation.getArgument(0);
            u.setId(99L);
            return u;
        });

        RegisterRequest req = new RegisterRequest();
        req.setName("Tech Engineer");
        req.setEmail("tech@company.com");
        req.setPassword("techPass123");
        req.setRole(Role.IT_STAFF);
        req.setDepartment("IT Support");
        req.setCompanyName("Acme Global");
        req.setEmployeeIdCode("TECH-500");
        req.setExperience("4 Years");
        req.setSpecialization("Cisco, Linux");
        req.setPhone("+1-555-0199");

        LoginResponse res = userService.provisionUser(req);
        assertNotNull(res);
        assertTrue(res.isSuccess());
        assertNotNull(res.getUser());
        assertEquals("TECH-500", res.getUser().getEmployeeIdCode());
        assertEquals("4 Years", res.getUser().getExperience());
        assertEquals("Cisco, Linux", res.getUser().getSpecialization());
    }

    @Test
    public void testUpdateUser() {
        User user = new User("Old Name", "user@company.com", "hash", Role.EMPLOYEE, "Old Dept");
        user.setId(10L);
        when(userRepository.findById(10L)).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenAnswer(i -> i.getArgument(0));

        UserUpdateRequest updateReq = new UserUpdateRequest();
        updateReq.setName("New Name");
        updateReq.setDepartment("New Dept");
        updateReq.setDesignation("Lead Architect");
        updateReq.setPhone("+1-555-9988");

        UserDTO updated = userService.updateUser(10L, updateReq);
        assertNotNull(updated);
        assertEquals("New Name", updated.getName());
        assertEquals("New Dept", updated.getDepartment());
        assertEquals("Lead Architect", updated.getDesignation());
        assertEquals("+1-555-9988", updated.getPhone());
    }
}
