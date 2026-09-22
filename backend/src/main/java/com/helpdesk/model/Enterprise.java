package com.helpdesk.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "enterprises")
public class Enterprise {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String companyName;

    @Column(length = 255)
    private String companyDetails;

    @Column(length = 150)
    private String companyLocation;

    @Column(length = 50)
    private String companyPhone;

    @Column(nullable = false, length = 100)
    private String adminName;

    @Column(nullable = false, unique = true, length = 100)
    private String adminEmail;

    @Column(length = 10)
    private String verificationCode;

    private boolean isVerified;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public Enterprise() {
        this.createdAt = LocalDateTime.now();
        this.isVerified = false;
    }

    public Enterprise(String companyName, String companyDetails, String companyLocation, 
                      String companyPhone, String adminName, String adminEmail, String verificationCode) {
        this.companyName = companyName;
        this.companyDetails = companyDetails;
        this.companyLocation = companyLocation;
        this.companyPhone = companyPhone;
        this.adminName = adminName;
        this.adminEmail = adminEmail;
        this.verificationCode = verificationCode;
        this.isVerified = false;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }

    public String getCompanyDetails() { return companyDetails; }
    public void setCompanyDetails(String companyDetails) { this.companyDetails = companyDetails; }

    public String getCompanyLocation() { return companyLocation; }
    public void setCompanyLocation(String companyLocation) { this.companyLocation = companyLocation; }

    public String getCompanyPhone() { return companyPhone; }
    public void setCompanyPhone(String companyPhone) { this.companyPhone = companyPhone; }

    public String getAdminName() { return adminName; }
    public void setAdminName(String adminName) { this.adminName = adminName; }

    public String getAdminEmail() { return adminEmail; }
    public void setAdminEmail(String adminEmail) { this.adminEmail = adminEmail; }

    public String getVerificationCode() { return verificationCode; }
    public void setVerificationCode(String verificationCode) { this.verificationCode = verificationCode; }

    public boolean isVerified() { return isVerified; }
    public void setVerified(boolean verified) { isVerified = verified; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
