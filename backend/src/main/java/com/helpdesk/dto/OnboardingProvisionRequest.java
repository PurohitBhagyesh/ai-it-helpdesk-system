package com.helpdesk.dto;

public class OnboardingProvisionRequest {
    private String adminEmail;

    // Initial Employee
    private String employeeName;
    private String employeeEmail;
    private String employeePassword;
    private String employeeDepartment;

    // Initial IT Technician
    private String technicianName;
    private String technicianEmail;
    private String technicianPassword;
    private String technicianDepartment;

    public OnboardingProvisionRequest() {}

    public String getAdminEmail() { return adminEmail; }
    public void setAdminEmail(String adminEmail) { this.adminEmail = adminEmail; }

    public String getEmployeeName() { return employeeName; }
    public void setEmployeeName(String employeeName) { this.employeeName = employeeName; }

    public String getEmployeeEmail() { return employeeEmail; }
    public void setEmployeeEmail(String employeeEmail) { this.employeeEmail = employeeEmail; }

    public String getEmployeePassword() { return employeePassword; }
    public void setEmployeePassword(String employeePassword) { this.employeePassword = employeePassword; }

    public String getEmployeeDepartment() { return employeeDepartment; }
    public void setEmployeeDepartment(String employeeDepartment) { this.employeeDepartment = employeeDepartment; }

    public String getTechnicianName() { return technicianName; }
    public void setTechnicianName(String technicianName) { this.technicianName = technicianName; }

    public String getTechnicianEmail() { return technicianEmail; }
    public void setTechnicianEmail(String technicianEmail) { this.technicianEmail = technicianEmail; }

    public String getTechnicianPassword() { return technicianPassword; }
    public void setTechnicianPassword(String technicianPassword) { this.technicianPassword = technicianPassword; }

    public String getTechnicianDepartment() { return technicianDepartment; }
    public void setTechnicianDepartment(String technicianDepartment) { this.technicianDepartment = technicianDepartment; }
}
