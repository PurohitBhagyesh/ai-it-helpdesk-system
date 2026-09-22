package com.helpdesk.dto;

import com.helpdesk.model.Role;
import com.helpdesk.model.User;

public class LoginResponse {
    private boolean success;
    private String message;
    private UserDTO user;
    private String token;

    public static class UserDTO {
        private Long id;
        private String name;
        private String email;
        private Role role;
        private String department;

        public UserDTO() {}

        public UserDTO(User user) {
            this.id = user.getId();
            this.name = user.getName();
            this.email = user.getEmail();
            this.role = user.getRole();
            this.department = user.getDepartment();
        }

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public Role getRole() { return role; }
        public void setRole(Role role) { this.role = role; }

        public String getDepartment() { return department; }
        public void setDepartment(String department) { this.department = department; }
    }

    public LoginResponse() {}

    public LoginResponse(boolean success, String message, User user, String token) {
        this.success = success;
        this.message = message;
        this.user = user != null ? new UserDTO(user) : null;
        this.token = token;
    }

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public UserDTO getUser() { return user; }
    public void setUser(UserDTO user) { this.user = user; }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
}
