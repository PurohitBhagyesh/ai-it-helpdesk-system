package com.helpdesk.dto;

public class EnterpriseRegisterRequest {
    private String adminName;
    private String adminEmail;
    private String companyName;
    private String companyDetails;
    private String companyLocation;
    private String companyPhone;
    private String password;
    private String confirmPassword;

    public EnterpriseRegisterRequest() {}

    public String getAdminName() { return adminName; }
    public void setAdminName(String adminName) { this.adminName = adminName; }

    public String getAdminEmail() { return adminEmail; }
    public void setAdminEmail(String adminEmail) { this.adminEmail = adminEmail; }

    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }

    public String getCompanyDetails() { return companyDetails; }
    public void setCompanyDetails(String companyDetails) { this.companyDetails = companyDetails; }

    public String getCompanyLocation() { return companyLocation; }
    public void setCompanyLocation(String companyLocation) { this.companyLocation = companyLocation; }

    public String getCompanyPhone() { return companyPhone; }
    public void setCompanyPhone(String companyPhone) { this.companyPhone = companyPhone; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getConfirmPassword() { return confirmPassword; }
    public void setConfirmPassword(String confirmPassword) { this.confirmPassword = confirmPassword; }
}
