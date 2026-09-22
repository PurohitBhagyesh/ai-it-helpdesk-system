package com.helpdesk.repository;

import com.helpdesk.model.Enterprise;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EnterpriseRepository extends JpaRepository<Enterprise, Long> {
    Optional<Enterprise> findByAdminEmail(String adminEmail);
    Optional<Enterprise> findByAdminEmailAndVerificationCode(String adminEmail, String verificationCode);
    boolean existsByAdminEmail(String adminEmail);
    boolean existsByCompanyName(String companyName);
}
