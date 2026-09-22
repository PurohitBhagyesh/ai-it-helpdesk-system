package com.helpdesk.dto;

import com.helpdesk.model.Role;

public class UserUpdateRequest {
    private String name;
    private String email;
    private Role role;
    private String department;
    private String companyName;
    private String employeeIdCode;
    private String joinDate;
    private String designation;
    private String experience;
    private String specialization;
    private String phone;
    private String password;

    public UserUpdateRequest() {}

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }

    public String getEmployeeIdCode() { return employeeIdCode; }
    public void setEmployeeIdCode(String employeeIdCode) { this.employeeIdCode = employeeIdCode; }

    public String getJoinDate() { return joinDate; }
    public void setJoinDate(String joinDate) { this.joinDate = joinDate; }

    public String getDesignation() { return designation; }
    public void setDesignation(String designation) { this.designation = designation; }

    public String getExperience() { return experience; }
    public void setExperience(String experience) { this.experience = experience; }

    public String getSpecialization() { return specialization; }
    public void setSpecialization(String specialization) { this.specialization = specialization; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}
