package com.helpdesk.dto;

public class EnterpriseResponse {
    private boolean success;
    private String message;
    private String adminEmail;
    private String companyName;
    private String verificationCode;
    private LoginResponse.UserDTO user;
    private String token;

    public EnterpriseResponse() {}

    public EnterpriseResponse(boolean success, String message) {
        this.success = success;
        this.message = message;
    }

    public EnterpriseResponse(boolean success, String message, String adminEmail, String companyName, String verificationCode) {
        this.success = success;
        this.message = message;
        this.adminEmail = adminEmail;
        this.companyName = companyName;
        this.verificationCode = verificationCode;
    }

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getAdminEmail() { return adminEmail; }
    public void setAdminEmail(String adminEmail) { this.adminEmail = adminEmail; }

    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }

    public String getVerificationCode() { return verificationCode; }
    public void setVerificationCode(String verificationCode) { this.verificationCode = verificationCode; }

    public LoginResponse.UserDTO getUser() { return user; }
    public void setUser(LoginResponse.UserDTO user) { this.user = user; }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
}
