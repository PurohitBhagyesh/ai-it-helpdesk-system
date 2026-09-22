package com.helpdesk.service;

import com.helpdesk.dto.LoginRequest;
import com.helpdesk.dto.LoginResponse;
import com.helpdesk.model.User;
import com.helpdesk.repository.UserRepository;
import com.helpdesk.security.InputSanitizer;
import com.helpdesk.security.PasswordEncoder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

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

        String sanitizedEmail = inputSanitizer.sanitizeText(request.getEmail());

        Optional<User> userOpt = userRepository.findByEmail(sanitizedEmail);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (passwordEncoder.matches(request.getPassword(), user.getPassword())) {
                return new LoginResponse(true, "Login successful", user, "jwt-token-" + user.getId());
            }
        }

        return new LoginResponse(false, "Invalid email or password", null, null);
    }

    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }
}
