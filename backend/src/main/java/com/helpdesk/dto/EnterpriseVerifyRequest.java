package com.helpdesk.dto;

public class EnterpriseVerifyRequest {
    private String adminEmail;
    private String verificationCode;

    public EnterpriseVerifyRequest() {}

    public EnterpriseVerifyRequest(String adminEmail, String verificationCode) {
        this.adminEmail = adminEmail;
        this.verificationCode = verificationCode;
    }

    public String getAdminEmail() { return adminEmail; }
    public void setAdminEmail(String adminEmail) { this.adminEmail = adminEmail; }

    public String getVerificationCode() { return verificationCode; }
    public void setVerificationCode(String verificationCode) { this.verificationCode = verificationCode; }
}
