package com.helpdesk.dto;

public class ResetPasswordRequest {
    private String newPassword;

    public ResetPasswordRequest() {}

    public ResetPasswordRequest(String newPassword) {
        this.newPassword = newPassword;
    }

    public String getNewPassword() { return newPassword; }
    public void setNewPassword(String newPassword) { this.newPassword = newPassword; }
}
