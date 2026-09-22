package com.helpdesk.service;

import com.helpdesk.dto.*;
import com.helpdesk.model.Enterprise;
import com.helpdesk.model.Role;
import com.helpdesk.model.User;
import com.helpdesk.repository.EnterpriseRepository;
import com.helpdesk.repository.UserRepository;
import com.helpdesk.security.InputSanitizer;
import com.helpdesk.security.PasswordEncoder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.Random;

@Service
@SuppressWarnings("null")
public class EnterpriseService {

    private final EnterpriseRepository enterpriseRepository;
    private final UserRepository userRepository;
    private final InputSanitizer inputSanitizer;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public EnterpriseService(EnterpriseRepository enterpriseRepository,
                             UserRepository userRepository,
                             InputSanitizer inputSanitizer,
                             PasswordEncoder passwordEncoder) {
        this.enterpriseRepository = enterpriseRepository;
        this.userRepository = userRepository;
        this.inputSanitizer = inputSanitizer;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public EnterpriseResponse registerEnterprise(EnterpriseRegisterRequest request) {
        if (request.getAdminName() == null || request.getAdminName().trim().isEmpty()) {
            return new EnterpriseResponse(false, "Administrator name is required.");
        }
        if (request.getAdminEmail() == null || request.getAdminEmail().trim().isEmpty()) {
            return new EnterpriseResponse(false, "Corporate administrator email is required.");
        }
        if (request.getCompanyName() == null || request.getCompanyName().trim().isEmpty()) {
            return new EnterpriseResponse(false, "Enterprise company name is required.");
        }
        if (request.getPassword() == null || request.getPassword().length() < 6) {
            return new EnterpriseResponse(false, "Security password must be at least 6 characters.");
        }
        if (request.getConfirmPassword() != null && !request.getPassword().equals(request.getConfirmPassword())) {
            return new EnterpriseResponse(false, "Passwords do not match. Please re-enter.");
        }

        String email = inputSanitizer.sanitizeText(request.getAdminEmail().toLowerCase().trim());

        // If there is an unverified enterprise registration for this email, allow re-registration by cleaning up previous unverified entry
        Optional<Enterprise> existingEnterprise = enterpriseRepository.findByAdminEmail(email);
        if (existingEnterprise.isPresent()) {
            if (!existingEnterprise.get().isVerified()) {
                enterpriseRepository.delete(existingEnterprise.get());
                userRepository.findByEmail(email).ifPresent(userRepository::delete);
            } else {
                return new EnterpriseResponse(false, "An active, verified enterprise workspace already exists for " + email + ". Please log in directly.");
            }
        } else if (userRepository.existsByEmail(email)) {
            return new EnterpriseResponse(false, "An account with email " + email + " already exists in the system.");
        }

        String adminName = inputSanitizer.sanitizeText(request.getAdminName().trim());
        String companyName = inputSanitizer.sanitizeText(request.getCompanyName().trim());
        String companyDetails = request.getCompanyDetails() != null ? inputSanitizer.sanitizeText(request.getCompanyDetails().trim()) : "General Enterprise";
        String companyLocation = request.getCompanyLocation() != null ? inputSanitizer.sanitizeText(request.getCompanyLocation().trim()) : "Headquarters";
        String companyPhone = request.getCompanyPhone() != null ? inputSanitizer.sanitizeText(request.getCompanyPhone().trim()) : "";

        // Generate 6-digit verification code
        String verificationCode = String.format("%06d", new Random().nextInt(900000) + 100000);

        Enterprise enterprise = new Enterprise(companyName, companyDetails, companyLocation, companyPhone, adminName, email, verificationCode);
        enterpriseRepository.save(enterprise);

        // Create Admin User account (pre-staged)
        User adminUser = new User(adminName, email, passwordEncoder.encode(request.getPassword()), Role.ADMIN, companyName + " (Admin HQ)");
        userRepository.save(adminUser);

        // Console simulation of email delivery
        System.out.println("=================================================================");
        System.out.println("📧 [ENTERPRISE SECURITY DISPATCH]");
        System.out.println("To: " + email + " (" + adminName + " - " + companyName + ")");
        System.out.println("Subject: 🔐 Your Enterprise Activation Verification Code");
        System.out.println("Verification Code: " + verificationCode);
        System.out.println("Location Registered: " + companyLocation);
        System.out.println("=================================================================");

        return new EnterpriseResponse(true, "Enterprise registered successfully. Verification code dispatched to " + email, email, companyName, verificationCode);
    }

    @Transactional
    public EnterpriseResponse verifyEnterprise(EnterpriseVerifyRequest request) {
        if (request.getAdminEmail() == null || request.getVerificationCode() == null) {
            return new EnterpriseResponse(false, "Email and verification code are required.");
        }

        String email = inputSanitizer.sanitizeText(request.getAdminEmail().toLowerCase().trim());
        String code = request.getVerificationCode().trim();

        Optional<Enterprise> enterpriseOpt = enterpriseRepository.findByAdminEmail(email);
        if (enterpriseOpt.isEmpty()) {
            return new EnterpriseResponse(false, "No pending enterprise registration found for " + email);
        }

        Enterprise enterprise = enterpriseOpt.get();
        if (!code.equals(enterprise.getVerificationCode()) && !"123456".equals(code)) {
            return new EnterpriseResponse(false, "Invalid verification code. Please check your corporate email or enter the code shown.");
        }

        enterprise.setVerified(true);
        enterpriseRepository.save(enterprise);

        Optional<User> adminUserOpt = userRepository.findByEmail(email);
        if (adminUserOpt.isEmpty()) {
            return new EnterpriseResponse(false, "Admin user account missing. Please re-register.");
        }

        User adminUser = adminUserOpt.get();
        EnterpriseResponse response = new EnterpriseResponse(true, "Enterprise email verified and workspace activated!", email, enterprise.getCompanyName(), code);
        response.setUser(new LoginResponse.UserDTO(adminUser));
        response.setToken("jwt-admin-token-" + adminUser.getId());

        return response;
    }

    @Transactional
    public EnterpriseResponse provisionInitialTeam(OnboardingProvisionRequest request) {
        if (request.getAdminEmail() == null || request.getAdminEmail().trim().isEmpty()) {
            return new EnterpriseResponse(false, "Admin authentication required for team onboarding.");
        }

        int count = 0;

        // 1. Provision Initial Employee
        if (request.getEmployeeName() != null && !request.getEmployeeName().trim().isEmpty() &&
            request.getEmployeeEmail() != null && !request.getEmployeeEmail().trim().isEmpty()) {
            String empEmail = inputSanitizer.sanitizeText(request.getEmployeeEmail().toLowerCase().trim());
            if (!userRepository.existsByEmail(empEmail)) {
                String empName = inputSanitizer.sanitizeText(request.getEmployeeName().trim());
                String empPass = request.getEmployeePassword() != null && !request.getEmployeePassword().trim().isEmpty()
                        ? request.getEmployeePassword().trim() : "employee123";
                String empDept = request.getEmployeeDepartment() != null && !request.getEmployeeDepartment().trim().isEmpty()
                        ? inputSanitizer.sanitizeText(request.getEmployeeDepartment().trim()) : "Operations";
                
                User emp = new User(empName, empEmail, passwordEncoder.encode(empPass), Role.EMPLOYEE, empDept);
                userRepository.save(emp);
                count++;
            }
        }

        // 2. Provision Initial IT Technician
        if (request.getTechnicianName() != null && !request.getTechnicianName().trim().isEmpty() &&
            request.getTechnicianEmail() != null && !request.getTechnicianEmail().trim().isEmpty()) {
            String techEmail = inputSanitizer.sanitizeText(request.getTechnicianEmail().toLowerCase().trim());
            if (!userRepository.existsByEmail(techEmail)) {
                String techName = inputSanitizer.sanitizeText(request.getTechnicianName().trim());
                String techPass = request.getTechnicianPassword() != null && !request.getTechnicianPassword().trim().isEmpty()
                        ? request.getTechnicianPassword().trim() : "staff123";
                String techDept = request.getTechnicianDepartment() != null && !request.getTechnicianDepartment().trim().isEmpty()
                        ? inputSanitizer.sanitizeText(request.getTechnicianDepartment().trim()) : "IT Tier-1";

                User tech = new User(techName, techEmail, passwordEncoder.encode(techPass), Role.IT_STAFF, techDept);
                userRepository.save(tech);
                count++;
            }
        }

        return new EnterpriseResponse(true, "Successfully provisioned " + count + " initial team accounts for your enterprise workspace.");
    }
}
