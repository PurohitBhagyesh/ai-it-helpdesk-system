package com.helpdesk.service;

import com.helpdesk.dto.LoginRequest;
import com.helpdesk.dto.LoginResponse;
import com.helpdesk.model.User;
import com.helpdesk.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public LoginResponse authenticate(LoginRequest request) {
        if (request.getEmail() == null || request.getPassword() == null) {
            return new LoginResponse(false, "Email and password are required.", null, null);
        }

        Optional<User> userOpt = userRepository.findByEmail(request.getEmail().trim());
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (user.getPassword().equals(request.getPassword().trim())) {
                return new LoginResponse(true, "Login successful", user, "jwt-token-" + user.getId());
            }
        }

        return new LoginResponse(false, "Invalid email or password", null, null);
    }

    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }
}
