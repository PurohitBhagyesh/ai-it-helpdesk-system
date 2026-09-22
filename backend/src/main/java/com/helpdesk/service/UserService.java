package com.helpdesk.service;

import com.helpdesk.dto.LoginRequest;
import com.helpdesk.dto.LoginResponse;
import com.helpdesk.dto.RegisterRequest;
import com.helpdesk.dto.UserDTO;
import com.helpdesk.model.Role;
import com.helpdesk.model.User;
import com.helpdesk.repository.UserRepository;
import com.helpdesk.security.InputSanitizer;
import com.helpdesk.security.PasswordEncoder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final InputSanitizer inputSanitizer;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserService(UserRepository userRepository, InputSanitizer inputSanitizer, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.inputSanitizer = inputSanitizer;
        this.passwordEncoder = passwordEncoder;
    }

    public LoginResponse authenticate(LoginRequest request) {
        if (request.getEmail() == null || request.getPassword() == null) {
            return new LoginResponse(false, "Email and password are required.", null, null);
        }

        String sanitizedEmail = inputSanitizer.sanitizeText(request.getEmail().toLowerCase().trim());

        Optional<User> userOpt = userRepository.findByEmail(sanitizedEmail);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (passwordEncoder.matches(request.getPassword(), user.getPassword())) {
                return new LoginResponse(true, "Login successful", user, "jwt-token-" + user.getId());
            }
        }

        return new LoginResponse(false, "Invalid email or password", null, null);
    }

    @Transactional(readOnly = true)
    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(UserDTO::new)
                .collect(Collectors.toList());
    }

    @Transactional
    public LoginResponse register(RegisterRequest request) {
        return provisionUser(request);
    }

    @Transactional
    public LoginResponse provisionUser(RegisterRequest request) {
        if (request.getName() == null || request.getName().trim().isEmpty()) {
            return new LoginResponse(false, "Full name is required.", null, null);
        }
        if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
            return new LoginResponse(false, "Corporate email address is required.", null, null);
        }
        if (request.getPassword() == null || request.getPassword().length() < 6) {
            return new LoginResponse(false, "Assigned password must be at least 6 characters.", null, null);
        }

        String sanitizedEmail = inputSanitizer.sanitizeText(request.getEmail().toLowerCase().trim());
        if (userRepository.existsByEmail(sanitizedEmail)) {
            return new LoginResponse(false, "An account with email " + sanitizedEmail + " already exists.", null, null);
        }

        String sanitizedName = inputSanitizer.sanitizeText(request.getName().trim());
        String sanitizedDept = request.getDepartment() != null ? inputSanitizer.sanitizeText(request.getDepartment().trim()) : "General";
        Role role = request.getRole() != null ? request.getRole() : Role.EMPLOYEE;

        String encodedPassword = passwordEncoder.encode(request.getPassword());

        User newUser = new User(sanitizedName, sanitizedEmail, encodedPassword, role, sanitizedDept);
        User saved = userRepository.save(newUser);

        return new LoginResponse(true, "Corporate user account provisioned successfully", saved, "jwt-token-" + saved.getId());
    }

    @Transactional
    public boolean resetPassword(Long userId, String newPassword) {
        if (newPassword == null || newPassword.trim().length() < 6) {
            return false;
        }
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setPassword(passwordEncoder.encode(newPassword.trim()));
            userRepository.save(user);
            return true;
        }
        return false;
    }

    @Transactional
    public boolean deleteUser(Long userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isPresent()) {
            userRepository.deleteById(userId);
            return true;
        }
        return false;
    }

    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }
}
