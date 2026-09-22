package com.helpdesk.controller;

import com.helpdesk.dto.LoginResponse;
import com.helpdesk.dto.RegisterRequest;
import com.helpdesk.dto.ResetPasswordRequest;
import com.helpdesk.dto.UserDTO;
import com.helpdesk.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @PostMapping
    public ResponseEntity<LoginResponse> provisionUser(@RequestBody RegisterRequest request) {
        LoginResponse response = userService.provisionUser(request);
        if (response.isSuccess()) {
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserDTO> updateUser(
            @PathVariable Long id,
            @RequestBody com.helpdesk.dto.UserUpdateRequest request) {
        try {
            UserDTO updated = userService.updateUser(id, request);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}/password")
    public ResponseEntity<Map<String, Object>> resetPassword(
            @PathVariable Long id,
            @RequestBody ResetPasswordRequest request) {
        boolean updated = userService.resetPassword(id, request.getNewPassword());
        if (updated) {
            return ResponseEntity.ok(Map.of("success", true, "message", "User password updated successfully"));
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
                "success", false,
                "message", "Failed to update password. Ensure user exists and password is at least 6 characters."
        ));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteUser(@PathVariable Long id) {
        boolean deleted = userService.deleteUser(id);
        if (deleted) {
            return ResponseEntity.ok(Map.of("success", true, "message", "User removed successfully"));
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("success", false, "message", "User not found"));
    }
}
